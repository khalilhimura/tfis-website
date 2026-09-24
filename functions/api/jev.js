/** Same-origin, bounded Jev assessment proxy. Never returns authentication headers. */
import bank from '../../public/assessment/bank.json';
import { PILLARS, QUESTION_IDS, createSession, submitAnswer, summarize, buildAssessmentState, normalizeAnswers } from '../../public/assessment/core.js';

const PROVIDER_URL = 'https://api.typesafe.ai/v1/systemone';
const PROVIDER_TIMEOUT_MS = 45000;
const LOCAL_ORIGINS = ['http://localhost:4321', 'http://localhost:8788', 'http://127.0.0.1:4321', 'http://127.0.0.1:8788'];
const itemById = new Map(bank.items.map(item => [item.id, item]));
// Best effort per-isolate guard. Distributed abuse prevention belongs in Cloudflare WAF.
const rateLimits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  for (const [key, entry] of rateLimits) if (entry.until <= now) rateLimits.delete(key);
  const entry = rateLimits.get(ip) || { count: 0, until: now + 60000 };
  if (!rateLimits.has(ip) && rateLimits.size >= 10000) return true;
  rateLimits.set(ip, entry);
  return ++entry.count > 10;
}
function originAllowed(request) {
  const origin = request.headers.get('Origin');
  return !origin || origin === new URL(request.url).origin || origin === 'https://thefutureissolo.com' || LOCAL_ORIGINS.includes(origin);
}
function headers(request) {
  const origin = request.headers.get('Origin');
  return { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Origin',
    ...(origin && originAllowed(request) ? { 'Access-Control-Allow-Origin': origin } : {}) };
}
class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
async function boundedJson(stream, limit) {
  if (!stream) throw new HttpError(400, 'Request body is required.');
  const reader = stream.getReader(); const chunks = []; let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new HttpError(413, 'JSON body is too large.'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new HttpError(400, 'Invalid JSON body.'); }
}
function validatePayload(payload) {
  if (!payload || payload.battery !== 'ssa-cmm-v1' || !Array.isArray(payload.questions) ||
      payload.questions.length !== QUESTION_IDS.length || new Set(payload.questions).size !== QUESTION_IDS.length ||
      payload.questions.some(id => !QUESTION_IDS.includes(id))) throw new HttpError(400, 'Invalid assessment battery or questions.');
  const input = payload.state;
  if (!input || typeof input !== 'object' || !Array.isArray(input.response_evidence) || input.response_evidence.length > 500) {
    throw new HttpError(400, 'Structured assessment evidence is required. Reload the assessment if this persists.');
  }
  // Recompute scores and trajectory from the versioned instrument; ignore free-form fields.
  const session = createSession();
  for (const r of input.response_evidence) {
    const item = itemById.get(r?.item_id);
    if (!item || r.slot !== session.answered || r.pillar !== item.pillar.toLowerCase() || r.band !== item.band ||
        typeof r.skipped !== 'boolean' || (r.skipped && r.score !== null)) throw new HttpError(400, 'Invalid response evidence.');
    const option = r.skipped ? null : item.opts.findIndex(o => o.s === r.score);
    if (!submitAnswer(session, item, option)) throw new HttpError(400, 'Inconsistent response sequence.');
  }
  const result = summarize(session), state = buildAssessmentState(session, bank.schema);
  if (!result.complete || input.claimed_level !== state.claimed_level || input.items_answered !== state.items_answered ||
      input.items_skipped !== state.items_skipped || PILLARS.some(p => input.pillar_scores?.[p.toLowerCase()] !== state.pillar_scores[p.toLowerCase()])) {
    throw new HttpError(400, 'Assessment scores do not match the completed response evidence.');
  }
  return state;
}
function providerPayload(state) {
  const scoring = 'Self-report instrument, not independently verified competence. Bands 1–5 discriminate L(band-1)/L(band). Start band 3; score >=3 steps up, <3 down. Final reading is last band for score >=3, otherwise band-1; exceptions: band 5 score 3 gives L4, band 1 score 1 gives L1. Overall is rounded pillar mean. Skips do not count. Three answers per pillar give coverage, not statistical certainty. Use response_evidence to judge consistency. Missing external evidence alone is not an arithmetic mismatch.';
  return { state, model: 'jev-latest', questions: {
    level_read: { type: 'choice', instructions: `${scoring} Is claimed_level under, on, or over the practice supported by the structured evidence?`, criteria: {
      under: 'Claimed level is lower than supported practice.', on: 'Claimed level is consistent with the staircase and reported practice.', over: 'Claimed level overstates the practice shown.' } },
    level_confidence_band: { type: 'score', instructions: `${scoring} Rate strength of this self-report reading, not confidence that the operator is objectively certified.`, criteria: [
      'weak: Missing readings or inconsistent evidence make this reading unreliable.',
      'moderate: Complete readings with coherent adaptation; limited to self-report and three items per pillar.',
      'strong: Complete, consistent readings with additional corroborating practice evidence.' ] },
    pillar_focus: { type: 'choice', instructions: 'Which pillar is the best next practice focus? Prefer the lowest pillar_scores value; use weakest_pillar to break ties.', criteria: {
      agency: 'Agency: decision authority and autonomy.', clarity: 'Clarity: intent and constraints.', competence: 'Competence: execution and supervision.',
      accountability: 'Accountability: ownership, correction and traceability.', security: 'Security: boundaries, provenance and verification.' } },
    review_status: { type: 'choice', instructions: `${scoring} Is this self-report coherent enough for the operator to accept a provisional result, or does it need revision?`, criteria: {
      ok: 'Complete and internally coherent as a provisional self-report.', needs_revision: 'Missing or contradictory evidence needs operator revision.', escalate: 'Critical inconsistencies require a separate expert review.' } },
    judgment_ready: { type: 'noul', instructions: 'Is this judgment sufficiently evidenced for possible future permanent write-back? Self-report coverage alone is not verification. This answer never authorizes a write.', criteria: {
      true: 'Coherent assessment with corroborating evidence and accountable human review.', false: 'Self-report only or uncertain evidence; retain locally as provisional.' } }
  } };
}
export async function onRequestPost({ request, env }) {
  const started = Date.now();
  const metadata = { request_id: crypto.randomUUID(), battery: 'ssa-cmm-v1', provider: 'TypeSafe System One', upstream_status: null, timeout_ms: PROVIDER_TIMEOUT_MS };
  const reply = (body, status, extraHeaders = {}) => Response.json({ ...body, latency_ms: Date.now() - started, metadata }, { status, headers: { ...headers(request), ...extraHeaders } });
  if (!originAllowed(request)) return reply({ error: 'Origin not allowed.' }, 403);
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return reply({ error: 'Use application/json.' }, 415);
  try {
    const payload = await boundedJson(request.body, 65536);
    const state = validatePayload(payload);
    if (rateLimited(request.headers.get('CF-Connecting-IP') || 'unknown')) return reply({ error: 'Too many evaluation requests. Please wait a minute.' }, 429, { 'Retry-After': '60' });
    const apiKey = env.TYPESAFE_API_KEY || env.JEV_API_KEY;
    if (!apiKey) return reply({ error: 'Jev is not configured on this deployment.' }, 503);
    metadata.upstream_payload = providerPayload(state);
    let response;
    try {
      response = await fetch(PROVIDER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(metadata.upstream_payload), redirect: 'manual', signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS) });
      metadata.upstream_status = response.status;
    } catch (error) {
      return reply({ error: ['TimeoutError', 'AbortError'].includes(error.name) ? 'Jev evaluation timed out.' : 'Jev could not be reached.' }, ['TimeoutError', 'AbortError'].includes(error.name) ? 504 : 502);
    }
    if (!response.ok) {
      await response.body?.cancel();
      return reply({ error: 'Jev provider could not complete the evaluation.' }, response.status === 429 ? 429 : 502,
        response.status === 429 ? { 'Retry-After': '60' } : {});
    }
    try {
      const raw = await boundedJson(response.body, 131072);
      const answers = normalizeAnswers(raw);
      const usage = raw.usage && ['input_tokens', 'output_tokens'].every(k => Number.isSafeInteger(raw.usage[k]) && raw.usage[k] >= 0)
        ? { input_tokens: raw.usage.input_tokens, output_tokens: raw.usage.output_tokens } : undefined;
      return reply({ answers, ...(typeof raw.model === 'string' ? { model: raw.model.slice(0, 100) } : {}), ...(usage ? { usage } : {}) }, 200);
    } catch (error) {
      return reply({ error: ['TimeoutError', 'AbortError'].includes(error.name) ? 'Jev evaluation timed out.' : 'Jev returned an invalid evaluation response.' }, ['TimeoutError', 'AbortError'].includes(error.name) ? 504 : 502);
    }
  } catch (error) { return reply({ error: error instanceof HttpError ? error.message : 'Evaluation request failed.' }, error instanceof HttpError ? error.status : 500); }
}
export function onRequestOptions({ request }) {
  if (!originAllowed(request)) return new Response(null, { status: 403, headers: headers(request) });
  return new Response(null, { status: 204, headers: { ...headers(request), 'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' } });
}
