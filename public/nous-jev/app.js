/**
 * Nous-Jev · Judgment Under Load
 * Demo: One state evaluated two ways (LLM prose vs Jev structured)
 */

// Worker API base URL
const API_BASE_URL = 'https://nous-jev.khalil-himura.workers.dev';
const CONFIDENCE_THRESHOLD = 0.75;

// Presets for TFIS judgment-under-load testing
const PRESETS = {
  claim: {
    title: "API rate limits should be 1000 req/min",
    body: "Based on current traffic patterns and growth projections, we need to increase our API rate limits from 500 to 1000 requests per minute. The current limit is causing throttling during peak hours.",
    declared_type: "claim",
    provenance: "Tuesday standup with engineering team",
    stop_rule: "Revisit if we see consistent throttling at new limit"
  },
  decision: {
    title: "Chose PostgreSQL over MongoDB for main datastore",
    body: "After evaluating both options, we decided on PostgreSQL because of ACID compliance requirements and team familiarity. MongoDB was considered but ruled out due to the need for complex transactions.",
    declared_type: "decision",
    provenance: "Architecture review meeting, 2026-09-15",
    stop_rule: "Revisit if we exceed 10M records or need horizontal scaling"
  },
  correction: {
    title: "Updated assumption about user session duration",
    body: "Initial assumption was 5-10 minutes average session. Real data shows 15-20 minutes. This affects caching strategy and memory allocation.",
    declared_type: "correction",
    provenance: "Analytics review",
    stop_rule: "Monitor monthly; flag if sessions exceed 30min average"
  },
  messy: {
    title: "something about the auth flow",
    body: "we talked about changing how login works maybe oauth or just keeping the current thing but faster. need to check with backend team. also users complained about password reset being confusing",
    declared_type: "unknown",
    provenance: null,
    stop_rule: null
  }
};

// ═══════════════════════════════════════════════════════════════════
// API CLIENT
// ═══════════════════════════════════════════════════════════════════

async function evaluate(data) {
  const response = await fetch(`${API_BASE_URL}/api/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: data.title,
      body: data.body,
      declared_type: data.declared_type,
      stop_rule: data.stop_rule || null,
      provenance: data.provenance || null,
      context: data.context || undefined
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'API request failed' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

// ═══════════════════════════════════════════════════════════════════
// UI STATE
// ═══════════════════════════════════════════════════════════════════

let state = {
  loading: false,
  lastResults: null
};

// ═══════════════════════════════════════════════════════════════════
// FORM HANDLING
// ═══════════════════════════════════════════════════════════════════

function getFormData() {
  return {
    title: document.getElementById('title').value.trim(),
    body: document.getElementById('body').value.trim(),
    declared_type: document.getElementById('declared-type').value,
    provenance: document.getElementById('provenance').value.trim() || null,
    stop_rule: document.getElementById('stop-rule').value.trim() || null
  };
}

function setFormData(data) {
  document.getElementById('title').value = data.title || '';
  document.getElementById('body').value = data.body || '';
  document.getElementById('declared-type').value = data.declared_type || 'unknown';
  document.getElementById('provenance').value = data.provenance || '';
  document.getElementById('stop-rule').value = data.stop_rule || '';
}

function resetForm() {
  document.getElementById('input-form').reset();
  hideResults();
  hideError();
}

function loadPreset(presetName) {
  const preset = PRESETS[presetName];
  if (preset) {
    setFormData(preset);
  }
}

// ═══════════════════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════════════════

function showLoading() {
  state.loading = true;
  const btn = document.getElementById('evaluate-btn');
  const text = document.getElementById('evaluate-btn-text');
  const spinner = document.getElementById('evaluate-spinner');
  
  btn.disabled = true;
  text.textContent = 'Evaluating...';
  spinner.classList.remove('hidden');
}

function hideLoading() {
  state.loading = false;
  const btn = document.getElementById('evaluate-btn');
  const text = document.getElementById('evaluate-btn-text');
  const spinner = document.getElementById('evaluate-spinner');
  
  btn.disabled = false;
  text.textContent = 'Evaluate';
  spinner.classList.add('hidden');
}

function showResults(results) {
  hideError();
  
  // LLM prose
  const llmResult = document.getElementById('llm-result');
  const llmLatency = document.getElementById('llm-latency');
  
  if (results.llm) {
    llmResult.innerHTML = `<p class="jev-prose">${escapeHtml(results.llm.text)}</p>`;
    llmLatency.textContent = `${results.llm.latency_ms}ms`;
  } else {
    llmResult.innerHTML = '<p class="jev-error-text">LLM evaluation unavailable</p>';
    llmLatency.textContent = '—';
  }
  
  // Jev structured
  const jevResult = document.getElementById('jev-result');
  const jevLatency = document.getElementById('jev-latency');
  
  if (results.jev && results.jev.answers) {
    const answers = results.jev.answers;
    let html = '<div class="jev-answers">';
    
    // Record Type
    if (answers.record_type) {
      html += renderAnswer('Record Type', answers.record_type, 'choice');
    }
    
    // Has Stop Rule
    if (answers.has_stop_rule) {
      html += renderAnswer('Has Stop Rule', answers.has_stop_rule, 'noul');
    }
    
    // Provenance Strength
    if (answers.provenance_strength) {
      html += renderAnswer('Provenance Strength', answers.provenance_strength, 'choice');
    }
    
    // Review Status
    if (answers.review_status) {
      html += renderAnswer('Review Status', answers.review_status, 'choice');
    }
    
    // Load Risk
    if (answers.load_risk) {
      html += renderAnswer('Load Risk', answers.load_risk, 'score');
    }
    
    html += '</div>';
    jevResult.innerHTML = html;
    jevLatency.textContent = `${results.jev.latency_ms}ms`;
  } else {
    jevResult.innerHTML = '<p class="jev-error-text">Jev evaluation unavailable</p>';
    jevLatency.textContent = '—';
  }
  
  // Raw JSON
  document.getElementById('raw-json').textContent = JSON.stringify(results, null, 2);
  
  // Show results
  const container = document.getElementById('results');
  container.classList.remove('hidden');
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  state.lastResults = results;
}

function renderAnswer(label, answer, type) {
  let html = '<div class="jev-answer">';
  html += `<div class="jev-answer-label">${label}</div>`;
  
  const confidence = answer.confidence || 0;
  const confidenceClass = confidence >= CONFIDENCE_THRESHOLD ? 'high' : 'low';
  
  html += `<div class="jev-answer-confidence jev-confidence-${confidenceClass}">
    Confidence: ${(confidence * 100).toFixed(0)}%
  </div>`;
  
  if (type === 'choice' && answer.choice !== undefined) {
    html += `<div class="jev-answer-value">
      <strong>Choice:</strong> ${escapeHtml(String(answer.choice))}
    </div>`;
    
    if (answer.probabilities) {
      html += '<div class="jev-answer-probs">';
      html += '<strong>Probabilities:</strong>';
      html += '<ul>';
      for (const [key, value] of Object.entries(answer.probabilities)) {
        html += `<li><code>${escapeHtml(key)}</code>: ${(value * 100).toFixed(1)}%</li>`;
      }
      html += '</ul></div>';
    }
  } else if (type === 'score' && answer.score !== undefined) {
    html += `<div class="jev-answer-value">
      <strong>Score:</strong> ${answer.score.toFixed(2)}
    </div>`;
  } else if (type === 'noul' && answer.noul !== undefined) {
    html += `<div class="jev-answer-value">
      <strong>Noul:</strong> ${answer.noul.toFixed(3)}
    </div>`;
    
    const hasStopRule = answer.noul >= 0.5;
    html += `<div class="jev-answer-interpretation ${hasStopRule ? 'jev-yes' : 'jev-no'}">
      ${hasStopRule ? '✓ Has stop rule' : '⚠ Missing stop rule'}
    </div>`;
  }
  
  if (answer.reasoning) {
    html += `<div class="jev-answer-reasoning">${escapeHtml(answer.reasoning)}</div>`;
  }
  
  html += '</div>';
  return html;
}

function hideResults() {
  document.getElementById('results').classList.add('hidden');
}

function showError(message) {
  const container = document.getElementById('error');
  const messageEl = document.getElementById('error-message');
  
  hideResults();
  
  messageEl.textContent = message;
  container.classList.remove('hidden');
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
  document.getElementById('error').classList.add('hidden');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ═══════════════════════════════════════════════════════════════════
// EVENT HANDLERS
// ═══════════════════════════════════════════════════════════════════

async function handleSubmit(e) {
  e.preventDefault();
  
  if (state.loading) return;
  
  const data = getFormData();
  
  showLoading();
  
  try {
    const results = await evaluate(data);
    showResults(results);
  } catch (error) {
    console.error('Evaluation failed:', error);
    showError(error.message || 'Failed to evaluate. Please check your connection and try again.');
  } finally {
    hideLoading();
  }
}

function handleReset() {
  if (state.loading) return;
  resetForm();
}

function handlePreset(e) {
  if (e.target.dataset.preset) {
    loadPreset(e.target.dataset.preset);
  }
}

// ═══════════════════════════════════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════════════════════════════════

function initTheme() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

function init() {
  // Form events
  document.getElementById('input-form').addEventListener('submit', handleSubmit);
  document.getElementById('reset-btn').addEventListener('click', handleReset);
  
  // Preset buttons
  document.querySelector('.jev-preset-buttons').addEventListener('click', handlePreset);
  
  // Theme
  initTheme();
}

// Export for SovMemGrok integration
window.NousJev = {
  evaluate,
  CONFIDENCE_THRESHOLD,
  API_BASE_URL
};

// Start app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
