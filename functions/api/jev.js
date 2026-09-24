/**
 * Cloudflare Pages Function: /api/jev
 * Proxies TypeSafe System One API calls with server-side authentication
 * 
 * Request body (from client):
 * {
 *   state: AssessmentState object or serialized string,
 *   battery: 'ssa-cmm-v1',
 *   questions: string[] (e.g. ['level_read', 'level_confidence_band', ...])
 * }
 * 
 * Response: TypeSafe System One response (proxied)
 * {
 *   answers: Record<id, { type, choice?, score?, noul?, confidence?, reasoning? }>,
 *   latency_ms: number
 * }
 */

const ALLOWED_ORIGINS = [
  'https://thefutureissolo.com',
  'http://localhost:4321',
  'http://localhost:8788',
  'http://127.0.0.1:4321',
  'http://127.0.0.1:8788'
];

const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitMap = new Map();

function getCorsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function checkRateLimit(clientId) {
  const now = Date.now();
  const key = clientId;
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return true;
  }
  
  const record = rateLimitMap.get(key);
  
  if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

function buildSystemOnePayload(clientPayload) {
  // Transform client payload to TypeSafe System One format
  const { state, battery, questions } = clientPayload;
  
  // Serialize state to string if it's an object
  const stateString = typeof state === 'string' 
    ? state 
    : JSON.stringify(state);
  
  // Build question definitions for SSA-CMM battery
  const questionDefs = {};
  
  questions.forEach(qId => {
    switch (qId) {
      case 'level_read':
        questionDefs[qId] = {
          type: 'choice',
          instructions: 'Based on the assessment state, is the claimed level under, on, or over the operator\'s demonstrated capability?',
          criteria: ['under', 'on', 'over']
        };
        break;
      
      case 'level_confidence_band':
        questionDefs[qId] = {
          type: 'score',
          instructions: 'Rate the confidence in this level assessment',
          criteria: 'weak | moderate | strong'
        };
        break;
      
      case 'pillar_focus':
        questionDefs[qId] = {
          type: 'choice',
          instructions: 'Which pillar should be the operator\'s next practice focus (weakest pillar)?',
          criteria: ['agency', 'clarity', 'competence', 'accountability', 'security']
        };
        break;
      
      case 'review_status':
        questionDefs[qId] = {
          type: 'choice',
          instructions: 'Should this assessment be reviewed before finalizing?',
          criteria: ['ok', 'needs_revision', 'escalate']
        };
        break;
      
      case 'judgment_ready':
        questionDefs[qId] = {
          type: 'noul',
          instructions: 'Is this judgment ready for write-back (1) or local-save-only (0)?',
          criteria: '0 | 1'
        };
        break;
    }
  });
  
  return {
    state: stateString,
    model: 'jev-latest',
    questions: questionDefs
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get('Origin') || '';
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    // Check for API key
    const apiKey = env.TYPESAFE_API_KEY || env.JEV_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: missing API key' 
      }), {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      });
    }
    
    // Rate limiting
    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded' 
      }), {
        status: 429,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Retry-After': '60'
        }
      });
    }
    
    // Parse client payload
    const clientPayload = await request.json();
    
    // Build TypeSafe payload
    const typesafePayload = buildSystemOnePayload(clientPayload);
    
    // Call TypeSafe System One
    const response = await fetch('https://api.typesafe.ai/v1/systemone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(typesafePayload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('TypeSafe API error:', response.status, errorText);
      
      return new Response(JSON.stringify({ 
        error: 'TypeSafe API error',
        status: response.status,
        details: errorText
      }), {
        status: response.status,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      });
    }
    
    // Return TypeSafe response
    const result = await response.json();
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
    });
    
  } catch (error) {
    console.error('Jev proxy error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
    });
  }
}

export async function onRequestOptions(context) {
  const { request } = context;
  const origin = request.headers.get('Origin') || '';
  const corsHeaders = getCorsHeaders(origin);
  
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}
