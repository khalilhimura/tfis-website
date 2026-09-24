/** Pure SSA-CMM staircase and Jev gate. Shared by the browser and proxy. */
export const PILLARS = ['Agency', 'Clarity', 'Competence', 'Accountability', 'Security'];
export const PILLAR_IDS = PILLARS.map(p => p.toLowerCase());
export const LEVEL_NAMES = ['Manual Operator', 'Tool User', 'Workflow Builder', 'Agent Supervisor', 'Loop Engineer', 'Sovereign Architect'];
export const TOTAL_ITEMS = 15;
export const ITEMS_PER_PILLAR = 3;
export const CONFIDENCE_THRESHOLD = 0.75;
export const QUESTION_IDS = ['level_read', 'level_confidence_band', 'pillar_focus', 'review_status', 'judgment_ready'];
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const finiteRange = (n, min, max) => typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;

export function validateBank(bank) {
  if (!bank || !Array.isArray(bank.items)) throw new Error('Question bank is unavailable. Please retry.');
  const ids = new Set(), cells = new Map();
  for (const item of bank.items) {
    if (!item || typeof item.id !== 'string' || !item.id || ids.has(item.id) || !PILLARS.includes(item.pillar) ||
        !Number.isInteger(item.band) || !finiteRange(item.band, 1, 5) || typeof item.q !== 'string' || !item.q.trim() ||
        typeof item.layman !== 'string' || !item.layman.trim() || !Array.isArray(item.opts) || item.opts.length < 2 ||
        item.opts.some(o => !o || typeof o.t !== 'string' || !o.t.trim() || ![0, 1, 3, 5].includes(o.s))) {
      throw new Error('Question bank is invalid. Please retry later.');
    }
    ids.add(item.id);
    const cell = `${item.pillar}:${item.band}`;
    cells.set(cell, (cells.get(cell) || 0) + 1);
  }
  for (const pillar of PILLARS) for (let band = 1; band <= 5; band++) {
    if ((cells.get(`${pillar}:${band}`) || 0) < ITEMS_PER_PILLAR) throw new Error('Question bank has incomplete coverage.');
  }
  return bank;
}

export function createSession() {
  return { answered: 0, responses: [], bands: Object.fromEntries(PILLARS.map(p => [p, 3])), startedAt: Date.now() };
}

export function nextItem(bank, session, random = Math.random) {
  if (session.answered >= TOTAL_ITEMS) return null;
  const pillar = PILLARS[session.answered % PILLARS.length];
  const seen = new Set(session.responses.map(r => r.itemId));
  const candidates = bank.items.filter(i => i.pillar === pillar && i.band === session.bands[pillar] && !seen.has(i.id));
  return candidates.length ? candidates[Math.floor(random() * candidates.length)] : null;
}

export function submitAnswer(session, item, optionIndex) {
  if (session.answered >= TOTAL_ITEMS || !item || item.pillar !== PILLARS[session.answered % PILLARS.length] ||
      item.band !== session.bands[item.pillar] || session.responses.some(r => r.itemId === item.id)) return false;
  const skipped = optionIndex === null;
  if (!skipped && (!Number.isInteger(optionIndex) || !item.opts[optionIndex])) return false;
  const score = skipped ? null : item.opts[optionIndex].s;
  session.responses.push({ slot: session.answered, itemId: item.id, pillar: item.pillar, band: item.band,
    optionIndex, score, skipped, timestamp: Date.now() });
  if (!skipped) {
    session.bands[item.pillar] = clamp(item.band + (score >= 3 ? 1 : -1), 1, 5);
    session.answered++;
  }
  return true;
}

export function reviseAnswer(session, slot) {
  if (!Number.isInteger(slot) || slot < 0 || slot >= session.answered) return false;
  session.responses = session.responses.filter(r => r.slot < slot);
  session.answered = 0;
  session.bands = Object.fromEntries(PILLARS.map(p => [p, 3]));
  for (const r of session.responses) if (!r.skipped) {
    session.answered++;
    session.bands[r.pillar] = clamp(r.band + (r.score >= 3 ? 1 : -1), 1, 5);
  }
  return true;
}

export function summarize(session) {
  const pillars = PILLARS.map(pillar => {
    const answers = session.responses.filter(r => r.pillar === pillar && !r.skipped);
    const last = answers.at(-1);
    let level = null;
    if (last) {
      const { band: b, score: s } = last;
      level = s >= 3 ? (b === 5 && s === 3 ? 4 : b) : (b === 1 && s === 1 ? 1 : b - 1);
    }
    return { pillar, level, answered: answers.length };
  });
  const measured = pillars.filter(p => p.level !== null);
  const overallLevel = measured.length ? Math.round(measured.reduce((s, p) => s + p.level, 0) / measured.length) : null;
  const sorted = [...measured].sort((a, b) => a.level - b.level);
  return { overallLevel, pillars, answered: session.answered, skipped: session.responses.filter(r => r.skipped).length,
    complete: session.answered === TOTAL_ITEMS && pillars.every(p => p.answered === ITEMS_PER_PILLAR),
    weakestPillar: sorted[0]?.pillar.toLowerCase() ?? null,
    strongestPillar: sorted.at(-1)?.pillar.toLowerCase() ?? null, locked: false };
}

export function buildAssessmentState(session, schema) {
  const result = summarize(session);
  return {
    claimed_level: result.overallLevel,
    pillar_scores: Object.fromEntries(result.pillars.map(p => [p.pillar.toLowerCase(), p.level])),
    pillar_answer_counts: Object.fromEntries(result.pillars.map(p => [p.pillar.toLowerCase(), p.answered])),
    weakest_pillar: result.weakestPillar, strongest_pillar: result.strongestPillar,
    items_answered: result.answered, items_skipped: result.skipped,
    band_trajectory: session.responses.map(r => `${r.pillar.toLowerCase()}:b${r.band}${r.skipped ? '(skip)' : ''}`).join(' → '),
    response_evidence: session.responses.map(r => ({ slot: r.slot, item_id: r.itemId, pillar: r.pillar.toLowerCase(), band: r.band, score: r.score, skipped: r.skipped })),
    bank_schema: typeof schema === 'string' || Number.isSafeInteger(schema) ? schema : 'unknown',
    evidence_basis: 'Self-reported practice; 3 adaptive readings per pillar. No external verification or open probes.',
    scoring_method: 'staircase-v1'
  };
}

export function normalizeAnswers(response) {
  const answers = response?.answers ?? response;
  if (!answers || typeof answers !== 'object') throw new Error('Jev returned no evaluation answers.');
  const choices = { level_read: ['under', 'on', 'over'], pillar_focus: PILLAR_IDS, review_status: ['ok', 'needs_revision', 'escalate'] };
  const normalized = {};
  for (const id of QUESTION_IDS) {
    const a = answers[id];
    if (!a || typeof a !== 'object') throw new Error(`Jev response is missing ${id}.`);
    if (id === 'judgment_ready') {
      if (a.type !== 'noul' || !finiteRange(a.noul, 0, 1)) throw new Error('Invalid judgment readiness probability.');
    } else {
      if (!finiteRange(a.confidence, 0, 1)) throw new Error(`Invalid or missing confidence for ${id}.`);
      if (id === 'level_confidence_band') {
        if (a.type !== 'score' || !finiteRange(a.score, 0, 2)) throw new Error('Invalid confidence band score.');
      } else if (a.type !== 'choice' || !choices[id].includes(a.choice)) throw new Error(`Invalid choice for ${id}.`);
    }
    // Keep the public provider contract, never arbitrary upstream fields.
    normalized[id] = Object.fromEntries(['type', 'choice', 'score', 'noul', 'confidence', 'probabilities', 'legend'].filter(k => a[k] !== undefined).map(k => [k, a[k]]));
  }
  return normalized;
}

export function evaluateGate(rawAnswers, claimedLevel, complete) {
  const reasons = [];
  let answers;
  try { answers = normalizeAnswers(rawAnswers); } catch (e) { reasons.push(e.message); }
  if (!complete || !Number.isInteger(claimedLevel) || !finiteRange(claimedLevel, 0, 5)) reasons.push('Complete all 15 readings before accepting a result.');
  if (answers) {
    if (answers.review_status.choice !== 'ok') reasons.push(`Review status: ${answers.review_status.choice.replaceAll('_', ' ')}.`);
    for (const id of ['review_status', 'level_read', 'level_confidence_band']) {
      if (answers[id].confidence < CONFIDENCE_THRESHOLD) reasons.push(`${id.replaceAll('_', ' ')} confidence is below 75%.`);
    }
    if (answers.level_confidence_band.score < 1) reasons.push('Assessment evidence is below the moderate confidence band.');
  }
  const passed = reasons.length === 0;
  const direction = answers?.level_read.choice;
  return { passed, reasons, threshold: CONFIDENCE_THRESHOLD,
    judgmentReady: passed && answers.judgment_ready.noul >= CONFIDENCE_THRESHOLD,
    suggestedLevel: passed && direction !== 'on' ? clamp(claimedLevel + (direction === 'under' ? 1 : -1), 0, 5) : null,
    pillarFocus: answers?.pillar_focus.confidence >= CONFIDENCE_THRESHOLD ? answers.pillar_focus.choice : null };
}
