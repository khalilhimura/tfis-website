import { LEVEL_NAMES, TOTAL_ITEMS, QUESTION_IDS, createSession, nextItem, submitAnswer,
  reviseAnswer, summarize, buildAssessmentState, evaluateGate, normalizeAnswers, validateBank } from './core.js?v=6';

// Leave transport time after the proxy's 45-second provider deadline.
const EVALUATION_TIMEOUT_MS = 55000;

/** Module scope keeps this instrument independent of the shared homepage quiz. */
export function initAssessment({ document, window, fetch }) {
  const $ = id => document.getElementById(id);
  let bank = null, session = createSession(), currentItem = null, selection = null, plain = true;
  let results = null, validation = null, metadata = null, generation = 0, controller = null, loading = false, pending = false;
  const text = (id, value) => { $(id).textContent = value; };
  const json = value => JSON.stringify(value, null, 2);
  const node = (tag, content, className) => {
    const el = document.createElement(tag); if (content !== undefined) el.textContent = content;
    if (className) el.className = className; return el;
  };
  function button(label, id, handler) {
    const el = node('button', label, 'btn btn--ghost'); el.type = 'button'; el.id = id;
    el.addEventListener('click', handler); return el;
  }
  function showScreen(id) {
    document.querySelectorAll('.assessment-screen').forEach(el => { el.classList.toggle('hidden', el.id !== id); });
  }
  function invalidate() {
    generation++; controller?.abort(); controller = null; pending = false;
    results = null; validation = null; metadata = null;
    text('jev-outcome', ''); $('jev-answers').replaceChildren(); $('jev-actions').replaceChildren();
    text('save-status', ''); renderMetadata();
  }
  async function start() {
    if (loading) return;
    loading = true; const run = ++generation; $('start-btn').disabled = true; text('bank-status', 'Loading question bank…');
    try {
      if (!bank) {
        const response = await fetch('bank.json', { signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error('Question bank could not be loaded. Please retry.');
        bank = validateBank(await response.json());
      }
      if (run !== generation) return;
      invalidate(); session = createSession(); plain = true; selection = null;
      text('language-mode', 'Plain Language'); text('bank-status', '');
      present();
    } catch (error) { if (run === generation) text('bank-status', error.message || 'Question bank could not be loaded. Please retry.'); }
    finally { loading = false; $('start-btn').disabled = false; }
  }
  function present(item = null, selected = null) {
    currentItem = item ?? nextItem(bank, session); selection = selected;
    if (session.answered === TOTAL_ITEMS) { void finish(); return; }
    showScreen('question-screen');
    text('progress-current', session.answered + 1); text('progress-total', TOTAL_ITEMS);
    $('progress-fill').style.width = `${session.answered / TOTAL_ITEMS * 100}%`;
    $('back-btn').disabled = session.answered === 0;
    $('next-btn').disabled = selection === null || !currentItem;
    $('skip-btn').disabled = !currentItem;
    text('question-status', currentItem ? '' : 'No unused questions remain at this difficulty. Go back, or finish with an incomplete reading.');
    $('options-container').replaceChildren();
    if (!currentItem) { text('question-text', 'No more questions at this band'); return; }
    text('current-pillar', currentItem.pillar); renderLanguage();
    text('question-context', currentItem.context || '');
    currentItem.opts.forEach((opt, index) => {
      const el = node('button', opt.t, 'assessment-option'); el.type = 'button';
      el.setAttribute('aria-pressed', String(index === selection));
      el.classList.toggle('selected', index === selection);
      el.addEventListener('click', () => {
        selection = index;
        Array.from($('options-container').children).forEach((child, i) => {
          child.classList.toggle('selected', i === index); child.setAttribute('aria-pressed', String(i === index));
        });
        $('next-btn').disabled = false;
      });
      $('options-container').append(el);
    });
    $('question-text').focus();
  }
  function renderLanguage() {
    text('language-mode', plain ? 'Plain Language' : 'Technical');
    if (currentItem) text('question-text', plain ? currentItem.layman : currentItem.q);
  }
  function advance(skipped) {
    if (results || !currentItem || (!skipped && selection === null)) return;
    if (!submitAnswer(session, currentItem, skipped ? null : selection)) return;
    currentItem = null; selection = null; present();
  }
  function revise(slot) {
    const response = session.responses.find(r => r.slot === slot && !r.skipped);
    if (!response) return;
    const item = bank.items.find(i => i.id === response.itemId);
    invalidate(); reviseAnswer(session, slot); present(item, response.optionIndex);
    try { window.localStorage.removeItem('ssa-cmm-assessment'); }
    catch { text('question-status', 'The prior saved snapshot could not be cleared. It no longer represents this revised reading; export the new result when finished.'); }
  }
  function exportData() {
    return { version: '2.0', assessment: 'SSA-CMM Field Manual Nº 01', timestamp: new Date().toISOString(),
      results, session, validation, metadata, storage: 'local-only' };
  }
  function save() {
    if (!results) return;
    try { window.localStorage.setItem('ssa-cmm-assessment', json(exportData())); text('save-status', 'Saved on this device only. No remote write-back.'); }
    catch { text('save-status', 'This browser could not save the result. Use Export Results to keep a copy.'); }
  }
  function renderMetadata() {
    text('jev-request', metadata?.request ? json(metadata.request) : 'No request sent.');
    text('jev-response', metadata?.response ? json(metadata.response) : (metadata?.error ? json({ error: metadata.error }) : 'No response yet.'));
    text('jev-transport', metadata ? json({ endpoint: '/api/jev', method: 'POST', started_at: metadata.startedAt,
      duration_ms: metadata.durationMs ?? null, http_status: metadata.httpStatus ?? null,
      response_content_type: metadata.responseContentType ?? null, cf_ray: metadata.cfRay ?? null,
      retry_after: metadata.retryAfter ?? null,
      error: metadata.error ?? null, provider: metadata.response?.metadata ?? null }) : 'No request yet.');
    text('jev-gate', validation?.gate ? json(validation.gate) : 'Not evaluated.');
  }
  function renderResults() {
    if (!results) return;
    showScreen('results-screen');
    text('result-status', results.locked ? `Accepted ${results.adjusted ? 'with your level adjustment' : 'by you'} after Jev review.` :
      !results.complete ? 'Incomplete reading · unvalidated and unlocked.' : pending ? 'Provisional reading · Jev evaluation in progress…' :
      validation?.gate.passed ? 'Jev review passed · awaiting your acceptance.' : 'Provisional reading · unvalidated and unlocked.');
    const summary = $('results-summary'); summary.replaceChildren();
    const overall = node('div', undefined, 'assessment-result-overall');
    overall.append(node('h3', results.overallLevel === null ? 'No reading yet' : `Overall Level: L${results.overallLevel}`));
    if (results.overallLevel !== null) overall.append(node('p', LEVEL_NAMES[results.overallLevel], 'assessment-result-level-name'));
    overall.append(node('p', `${results.answered} of 15 answered · ${results.skipped} skipped. A self-report reading, not a certification.`));
    summary.append(overall);
    const focus = validation?.gate.pillarFocus || results.weakestPillar;
    if (focus) summary.append(node('p', `Next practice focus: ${focus}.`, 'assessment-result-focus'));
    for (const p of results.pillars) {
      const item = node('div', undefined, 'assessment-result-item');
      item.append(node('h4', p.pillar), node('p', p.level === null ? 'Not measured' : `L${p.level}: ${LEVEL_NAMES[p.level]}`),
        node('p', `Coverage: ${p.answered} of 3 readings`, 'assessment-result-confidence'));
      summary.append(item);
    }
    const list = $('response-list'); list.replaceChildren();
    for (const r of session.responses.filter(r => !r.skipped)) {
      const item = bank.items.find(i => i.id === r.itemId);
      const li = node('li'); li.append(node('h4', `${r.slot + 1}. ${r.pillar} · band ${r.band}`), node('p', item.layman), node('p', item.opts[r.optionIndex].t));
      const reviseButton = button(`Revise answer ${r.slot + 1}`, `revise-${r.slot}`, () => revise(r.slot));
      reviseButton.dataset.revise = r.slot; li.append(reviseButton); list.append(li);
    }
    renderMetadata();
  }
  function renderEvaluation() {
    $('jev-answers').replaceChildren(); $('jev-actions').replaceChildren();
    if (pending) { text('jev-outcome', 'Evaluating the structured assessment summary…'); return; }
    if (!results.complete) { text('jev-outcome', 'Jev was not called. Complete all 15 readings for an evaluation.'); return; }
    if (!validation) text('jev-outcome', metadata?.error || 'Jev could not evaluate this reading. You can review your answers or retry.');
    else {
      const { answers, gate } = validation;
      text('jev-outcome', gate.passed ? (gate.judgmentReady ? 'Review passed. You can accept this reading. Saving remains local to this device.' :
        'Review passed; judgment is not ready for write-back. You can accept a local result only.') : `Review required. ${gate.reasons.join(' ')}`);
      const labels = { level_read: 'Claimed level', level_confidence_band: 'Evidence confidence band', pillar_focus: 'Practice focus', review_status: 'Review status', judgment_ready: 'Judgment readiness' };
      for (const id of QUESTION_IDS) {
        const a = answers[id], card = node('div', undefined, 'jev-answer-card');
        let value = a.choice;
        if (id === 'level_confidence_band') value = `${a.score.toFixed(2)} / 2 · 0 weak, 1 moderate, 2 strong`;
        if (id === 'judgment_ready') value = `${Math.round(a.noul * 100)}% probability of readiness · threshold 75%`;
        card.append(node('h4', labels[id]), node('p', value));
        if (typeof a.confidence === 'number') card.append(node('p', `${Math.round(a.confidence * 100)}% model confidence`));
        $('jev-answers').append(card);
      }
      if (gate.passed && !results.locked) {
        $('jev-actions').append(button('Accept current level', 'accept-result', () => accept()));
        if (gate.suggestedLevel !== null && gate.suggestedLevel !== results.overallLevel) {
          $('jev-actions').append(button(`Accept suggested L${gate.suggestedLevel}`, 'accept-adjustment', () => accept(gate.suggestedLevel)));
        }
      }
    }
    if (!results.locked) $('jev-actions').append(button('Retry Jev evaluation', 'retry-jev', () => void evaluate()));
    $('jev-actions').append(button('Review responses', 'review-responses', () => {
      $('response-review').open = true; $('response-review').querySelector('summary').focus();
    }));
  }
  function accept(adjustedLevel) {
    if (pending || !results || !validation) return;
    // Recheck the gate at the mutation boundary, not only when rendering buttons.
    const gate = evaluateGate(validation.answers, results.claimedLevel, results.complete);
    if (!gate.passed || (adjustedLevel !== undefined && adjustedLevel !== gate.suggestedLevel)) return;
    results.overallLevel = adjustedLevel ?? results.claimedLevel; results.adjusted = adjustedLevel !== undefined;
    results.locked = true; results.lockedAt = Date.now(); renderResults(); renderEvaluation(); save();
  }
  async function evaluate() {
    if (pending || !results?.complete || results.locked) return;
    const run = generation; const target = results;
    pending = true; validation = null; controller = new AbortController();
    const request = { state: buildAssessmentState(session, bank.schema), battery: 'ssa-cmm-v1', questions: QUESTION_IDS };
    const attempt = { request, startedAt: new Date().toISOString() }; metadata = attempt;
    renderResults(); renderEvaluation();
    const started = Date.now(); const activeController = controller;
    const timeout = window.setTimeout(() => activeController.abort(), EVALUATION_TIMEOUT_MS);
    try {
      const response = await fetch('/api/jev', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: json(request), signal: activeController.signal });
      attempt.httpStatus = response.status;
      attempt.responseContentType = response.headers.get('Content-Type');
      attempt.cfRay = response.headers.get('CF-Ray');
      attempt.retryAfter = response.headers.get('Retry-After');
      let body;
      try { body = await response.json(); attempt.response = body; }
      catch (error) {
        if (['AbortError', 'TimeoutError'].includes(error.name)) throw error;
        // An edge error can be HTML even when the API normally returns JSON.
        if (response.ok) throw new Error('Jev returned an unreadable response. Your reading remains unlocked; you can retry.');
      }
      if (!response.ok) {
        if ([408, 504, 524].includes(response.status)) throw new Error(`Jev evaluation timed out (HTTP ${response.status}). Your reading remains unlocked; you can retry without answering again.`);
        throw new Error(`Jev is unavailable (HTTP ${response.status}). Your reading remains unlocked; you can retry without answering again.`);
      }
      const answers = normalizeAnswers(body);
      if (generation !== run || results !== target) return;
      validation = { answers, gate: evaluateGate(answers, results.claimedLevel, results.complete) };
    } catch (error) {
      attempt.error = ['AbortError', 'TimeoutError'].includes(error.name) ? 'Jev evaluation timed out. Your reading remains unlocked; you can retry.' :
        error.message || 'Jev could not be reached. Your reading remains unlocked.';
    } finally {
      window.clearTimeout(timeout); attempt.durationMs = Date.now() - started;
      if (generation === run && results === target) { pending = false; controller = null; renderResults(); renderEvaluation(); save(); }
    }
  }
  async function finish() {
    if (results) return;
    results = { ...summarize(session), timestamp: Date.now() }; results.claimedLevel = results.overallLevel;
    currentItem = null; selection = null; $('next-btn').disabled = true; $('skip-btn').disabled = true;
    renderResults(); renderEvaluation(); save(); $('results-heading').focus();
    if (results.complete) await evaluate();
  }
  $('start-btn').addEventListener('click', () => void start());
  $('next-btn').addEventListener('click', () => advance(false));
  $('skip-btn').addEventListener('click', () => advance(true));
  $('back-btn').addEventListener('click', () => revise(session.answered - 1));
  $('language-toggle').addEventListener('click', () => { plain = !plain; renderLanguage(); });
  $('finish-early-btn').addEventListener('click', () => void finish());
  $('restart-btn').addEventListener('click', () => { invalidate(); session = createSession(); currentItem = null; selection = null; showScreen('intro-screen'); $('start-btn').focus(); });
  $('export-btn').addEventListener('click', () => {
    if (!results) return;
    const blob = new Blob([json(exportData())], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob); const a = node('a'); a.href = url;
    a.download = `ssa-cmm-assessment-${Date.now()}.json`; document.body.append(a); a.click(); a.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  });
}

if (typeof document !== 'undefined') initAssessment({ document, window, fetch: window.fetch.bind(window) });
