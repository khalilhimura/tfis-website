/**
 * SovMemGrok · Sovereign Memory Filter
 * Browser-local record management: claims, decisions, corrections
 */

const STORAGE_KEY = 'sovmem-grok-records';
const STORAGE_VERSION = 1;

// Nous-Jev Worker API integration
const JEV_API_BASE = 'https://nous-jev.khalil-himura.workers.dev';
const Core = window.SovmemCore;
let storageReadable = true;
let storageSnapshot = null;
let editToken = 0;
let savePending = false;
let exportPending = false;
let draft = null;
let pendingSave = null;

// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════

let state = {
  records: [],
  currentView: 'list', // 'list', 'detail', 'edit'
  currentRecord: null,
  editMode: 'create', // 'create', 'update'
  selectedType: null, // For type-first flow in create mode
  filters: {
    type: 'all',
    review: 'all',
    search: ''
  }
};

// ═══════════════════════════════════════════════════════════════════
// JEV API CLIENT
// ═══════════════════════════════════════════════════════════════════

async function validateWithJev(record) {
  const started = Date.now();
  const evaluation = {
    endpoint: `${JEV_API_BASE}/api/jev`, method: 'POST',
    started_at: new Date(started).toISOString(), duration_ms: null,
    payload: Core.payload(record), status: null, response: null, error: null
  };
  try {
    const response = await fetch(evaluation.endpoint, {
      method: evaluation.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evaluation.payload),
      signal: AbortSignal.timeout(10000)
    });
    evaluation.status = response.status;
    const text = await response.text();
    try { evaluation.response = JSON.parse(text); }
    catch { evaluation.response = text; throw new Error('Jev returned invalid JSON.'); }
    if (!response.ok) throw new Error(`Jev request failed (HTTP ${response.status}).`);
  } catch (error) {
    evaluation.error = error.message || 'Jev request failed.';
  }
  evaluation.duration_ms = Date.now() - started;
  return evaluation;
}

async function batchValidateWithJev(records) {
  // Keep request order stable and avoid a request storm for a large vault.
  const results = [];
  for (const record of records) results.push(await validateWithJev(record));
  return results;
}

// ═══════════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════════

function loadRecords() {
  try {
    storageSnapshot = localStorage.getItem(STORAGE_KEY);
    storageReadable = true;
    if (!storageSnapshot) return [];
    const data = JSON.parse(storageSnapshot);
    if (data.version !== STORAGE_VERSION || !Array.isArray(data.records)) throw new Error('Unsupported record file.');
    const records = data.records.map(Core.storedRecord);
    if (new Set(records.map(r => r.id)).size !== records.length) throw new Error('Duplicate record IDs.');
    return records;
  } catch (error) {
    storageReadable = false;
    alert('Stored records could not be read. They have been preserved; export or recover the original storage before making changes.');
    return [];
  }
}

function saveRecords(records) {
  try {
    if (!storageReadable) throw new Error('Stored records need recovery before changes can be saved.');
    if (localStorage.getItem(STORAGE_KEY) !== storageSnapshot) throw new Error('Records changed in another tab. Reload before saving.');
    const encoded = JSON.stringify({ version: STORAGE_VERSION, records, savedAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, encoded);
    storageSnapshot = encoded;
    state.records = records;
    return true;
  } catch (error) {
    alert(`Failed to save records. ${error.message}`);
    return false;
  }
}

function createRecord(data) {
  const clean = Core.recordData(data);
  const now = new Date().toISOString();
  const record = { ...clean, id: generateId(), created_at: now, updated_at: now, revisions: [], jev_evaluation: data.jev_evaluation || null };
  return saveRecords([record, ...state.records]) ? record : null;
}

function updateRecord(id, data, revisionReason) {
  if (revisionReason !== undefined && typeof revisionReason !== 'string') throw new Error('Revision reason must be text.');
  const original = getRecord(id);
  if (!original) return null;
  const clean = Core.recordData({ ...original, ...data });
  const changes = Core.fields.filter(field => clean[field] !== original[field]);
  const now = new Date().toISOString();
  const record = { ...original, ...clean, updated_at: now, revisions: [...original.revisions] };
  if (changes.length) record.revisions.push({ timestamp: now, reason: revisionReason || 'Updated', fields: changes });
  // An evaluation is evidence for one payload only. Never reuse it after content changes.
  record.jev_evaluation = data.jev_evaluation || (JSON.stringify(Core.payload(original)) === JSON.stringify(Core.payload(record)) ? original.jev_evaluation : null);
  return saveRecords(state.records.map(r => r.id === id ? record : r)) ? record : null;
}

function deleteRecord(id) {
  return saveRecords(state.records.filter(r => r.id !== id));
}

function getRecord(id) {
  return state.records.find(r => r.id === id);
}

function generateId() {
  return crypto.randomUUID();
}

// ═══════════════════════════════════════════════════════════════════
// FILTERING
// ═══════════════════════════════════════════════════════════════════

function getFilteredRecords() {
  let filtered = [...state.records];

  // Type filter
  if (state.filters.type !== 'all') {
    filtered = filtered.filter(r => r.type === state.filters.type);
  }

  // Review filter
  if (state.filters.review !== 'all') {
    filtered = filtered.filter(r => r.review_status === state.filters.review);
  }

  // Search filter
  if (state.filters.search) {
    const query = state.filters.search.toLowerCase();
    filtered = filtered.filter(r => {
      return (
        r.title.toLowerCase().includes(query) ||
        r.body.toLowerCase().includes(query) ||
        r.provenance.toLowerCase().includes(query) ||
        r.stop_rule.toLowerCase().includes(query)
      );
    });
  }

  return filtered;
}

// ═══════════════════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════════════════

function render() {
  switch (state.currentView) {
    case 'list':
      renderListView();
      break;
    case 'detail':
      renderDetailView();
      break;
    case 'edit':
      renderEditView();
      break;
  }
}

function renderListView() {
  showView('list-view');
  const filtered = getFilteredRecords();
  const listEl = document.getElementById('records-list');
  const emptyEl = document.getElementById('empty-state');

  if (filtered.length === 0) {
    emptyEl.style.display = state.records.length === 0 ? 'block' : 'block';
    if (state.records.length > 0 && (state.filters.type !== 'all' || state.filters.review !== 'all' || state.filters.search)) {
      emptyEl.innerHTML = `
        <div class="sovmem-empty-icon">∅</div>
        <p>No records match the current filters.</p>
      `;
    } else {
      emptyEl.innerHTML = `
        <div class="sovmem-empty-icon">∅</div>
        <p>No records yet. Start by capturing a claim, decision, or correction.</p>
        <button class="btn btn--accent" onclick="window.sovmem.newRecord()">+ Capture First Record</button>
      `;
    }
    listEl.innerHTML = '';
    return;
  }

  emptyEl.style.display = 'none';
  listEl.innerHTML = filtered.map(record => `
    <li class="sovmem-item" data-id="${record.id}" onclick="window.sovmem.viewRecord('${record.id}')">
      <div class="sovmem-item-header">
        <h3 class="sovmem-item-title">${escapeHtml(record.title)}</h3>
        <div class="sovmem-item-flags">
          <span class="sovmem-flag type-${record.type}">${record.type}</span>
          <span class="sovmem-flag review-${record.review_status}">${record.review_status.replace('-', ' ')}</span>
        </div>
      </div>
      <p class="sovmem-item-body">${escapeHtml(record.body)}</p>
      <div class="sovmem-item-meta">
        <span>${formatDate(record.created_at)}</span>
        ${record.revisions.length > 0 ? `<span> · ${record.revisions.length} revision${record.revisions.length > 1 ? 's' : ''}</span>` : ''}
      </div>
    </li>
  `).join('');
}

function renderDetailView() {
  showView('detail-view');
  const record = state.currentRecord;
  if (!record) {
    state.currentView = 'list';
    render();
    return;
  }

  const contentEl = document.getElementById('detail-content');
  contentEl.innerHTML = `
    <h2 class="sovmem-detail-title">${escapeHtml(record.title)}</h2>
    <div class="sovmem-detail-flags">
      <span class="sovmem-flag type-${record.type}">${record.type}</span>
      <span class="sovmem-flag review-${record.review_status}">${record.review_status.replace('-', ' ')}</span>
    </div>

    <div class="sovmem-detail-section">
      <span class="sovmem-detail-label">Body</span>
      <div class="sovmem-detail-value">${escapeHtml(record.body)}</div>
    </div>

    <div class="sovmem-detail-section">
      <span class="sovmem-detail-label">Provenance</span>
      <div class="sovmem-detail-value">${escapeHtml(record.provenance)}</div>
    </div>

    <div class="sovmem-detail-section">
      <span class="sovmem-detail-label">Stop Rule</span>
      <div class="sovmem-detail-stop-rule">
        <div class="sovmem-detail-value">${escapeHtml(record.stop_rule)}</div>
      </div>
    </div>

    <div class="sovmem-detail-section">
      <span class="sovmem-detail-label">Metadata</span>
      <div class="sovmem-detail-value" style="font-family: var(--mono); font-size: .75rem; color: var(--g500);">
        Created: ${formatDateLong(record.created_at)}<br>
        Updated: ${formatDateLong(record.updated_at)}
      </div>
    </div>

    ${renderJevMetadata(record.jev_evaluation, record)}

    ${record.revisions.length > 0 ? `
      <div class="sovmem-detail-section">
        <span class="sovmem-detail-label">Revision History</span>
        <div class="sovmem-detail-revision">
          ${record.revisions.map(rev => `
            <div class="sovmem-detail-revision-item">
              <div><strong>${escapeHtml(rev.reason)}</strong></div>
              <div class="sovmem-detail-revision-time">${formatDateLong(rev.timestamp)} · Changed: ${rev.fields.join(', ')}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

function renderEditView() {
  showView('edit-view');
  const isEdit = state.editMode === 'update';
  const record = draft || state.currentRecord;

  // For new records, show type picker first
  const typePicker = document.getElementById('type-picker');
  const form = document.getElementById('record-form');
  
  if (!state.selectedType) {
    // Show type picker, hide form
    typePicker.classList.remove('hidden');
    form.classList.add('hidden');
  } else {
    // Show form, hide type picker
    typePicker.classList.add('hidden');
    form.classList.remove('hidden');
    
    // Populate form
    const selectedType = state.selectedType || record?.type || '';
    document.getElementById('record-type').value = selectedType;
    document.getElementById('record-title').value = record?.title || '';
    document.getElementById('record-body').value = record?.body || '';
    document.getElementById('record-provenance').value = record?.provenance || '';
    document.getElementById('record-stop-rule').value = record?.stop_rule || '';
    document.getElementById('record-review-status').value = record?.review_status || 'unreviewed';

    // Update type badge display
    const typeBadge = document.getElementById('selected-type-badge');
    if (selectedType) {
      typeBadge.setAttribute('data-type', selectedType);
      typeBadge.textContent = selectedType;
    }

    // IA fix: Show revision reason for any edit (not just when status requires it)
    const revisionGroup = document.getElementById('revision-reason-group');
    if (isEdit) {
      revisionGroup.style.display = 'block';
      document.getElementById('revision-reason').value = record?.revision_reason || '';
    } else {
      revisionGroup.style.display = 'none';
    }
  }
}

function showView(viewId) {
  ['list-view', 'detail-view', 'edit-view'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(viewId).classList.remove('hidden');
}

// ═══════════════════════════════════════════════════════════════════
// EVENT HANDLERS
// ═══════════════════════════════════════════════════════════════════

function newRecord() {
  invalidateSave();
  draft = null;
  state.editMode = 'create';
  state.currentRecord = null;
  state.selectedType = null; // Reset type selection
  state.currentView = 'edit';
  render();
}

function viewRecord(id) {
  invalidateSave();
  draft = null;
  const record = getRecord(id);
  if (!record) return;
  state.currentRecord = record;
  state.currentView = 'detail';
  render();
}

function editCurrentRecord() {
  invalidateSave();
  draft = null;
  if (!state.currentRecord) return;
  state.editMode = 'update';
  state.selectedType = state.currentRecord.type; // Set type for editing
  state.currentView = 'edit';
  render();
}

function deleteCurrentRecord() {
  if (!state.currentRecord) return;
  if (!confirm(`Delete "${state.currentRecord.title}"?\n\nThis cannot be undone.`)) return;
  if (!deleteRecord(state.currentRecord.id)) return;
  invalidateSave();
  state.currentRecord = null;
  state.currentView = 'list';
  render();
}

function backToList() {
  invalidateSave();
  draft = null;
  state.currentView = 'list';
  state.currentRecord = null;
  render();
}

function cancelEdit() {
  invalidateSave();
  draft = null;
  closeJevModal(); // Close any open validation modal
  state.selectedType = null; // Reset type selection
  if (state.editMode === 'update' && state.currentRecord) {
    state.currentView = 'detail';
  } else {
    state.currentView = 'list';
  }
  render();
}

function readForm() {
  const data = { type: state.selectedType, revision_reason: document.getElementById('revision-reason').value.trim() };
  for (const field of Core.fields.filter(f => f !== 'type')) data[field] = document.getElementById(`record-${field.replaceAll('_', '-')}`).value.trim();
  return data;
}

function setSaveBusy(busy) {
  savePending = busy;
  document.getElementById('save-btn').disabled = busy;
  document.getElementById('save-btn').textContent = busy ? 'Evaluating…' : 'Save';
}

function invalidateSave() {
  editToken++;
  setSaveBusy(false);
  closeJevModal();
}

async function saveRecord() {
  if (savePending || pendingSave || state.currentView !== 'edit' || !state.selectedType) return;
  const form = document.getElementById('record-form');
  if (!form.checkValidity()) { form.reportValidity(); return; }
  let data;
  try { data = { ...Core.recordData(readForm()), revision_reason: readForm().revision_reason }; }
  catch (error) { alert(error.message); return; }
  const token = ++editToken;
  const context = { token, mode: state.editMode, id: state.currentRecord?.id, original: state.currentRecord ? JSON.stringify(state.currentRecord) : null };
  setSaveBusy(true);
  try {
    data.jev_evaluation = await validateWithJev(data);
    if (token !== editToken || state.currentView !== 'edit') return;
    if (JSON.stringify(Core.recordData(readForm())) !== JSON.stringify(Core.recordData(data)) || readForm().revision_reason !== data.revision_reason) {
      alert('The draft changed during evaluation. Save again to evaluate the current text.');
      return;
    }
    if (shouldShowValidationGate(data.jev_evaluation, data)) showJevValidationModal(data.jev_evaluation, data, context);
    else performSave(data, false, context);
  } catch (error) { alert(error.message); }
  finally { if (token === editToken) setSaveBusy(false); }
}

function shouldShowValidationGate(evaluation, record) {
  return Core.issues(evaluation, record).length > 0;
}

function performSave(data, forceNeedsRevision = false, context = pendingSave?.context) {
  if (!context || context.token !== editToken || state.currentView !== 'edit') return;
  if (JSON.stringify(Core.recordData(readForm())) !== JSON.stringify(Core.recordData(data)) || readForm().revision_reason !== data.revision_reason) {
    closeJevModal();
    alert('The draft changed. Save again to evaluate it.');
    return;
  }
  if (context.mode === 'update' && JSON.stringify(getRecord(context.id)) !== context.original) {
    closeJevModal(); alert('This record changed during evaluation. Reopen it before saving.'); return;
  }
  const needsRevision = forceNeedsRevision || shouldShowValidationGate(data.jev_evaluation, data);
  const finalData = { ...data, review_status: needsRevision ? 'needs-revision' : data.review_status };
  const record = context.mode === 'create' ? createRecord(finalData) : updateRecord(context.id, finalData, data.revision_reason);
  if (!record) return;
  state.currentRecord = record;
  state.selectedType = null;
  draft = null;
  state.currentView = 'list';
  closeJevModal();
  render();
}

function renderJevMetadata(evaluation, record) {
  if (!evaluation) return '<details class="jev-metadata"><summary>Jev API metadata</summary><p>No evaluation recorded for this version.</p></details>';
  const stale = record && JSON.stringify(evaluation.payload) !== JSON.stringify(Core.payload(record));
  return `<details class="jev-metadata">
    <summary>Jev API payload &amp; response</summary>
    <p>${stale ? 'Historical evaluation — the record has changed.' : 'Evaluation of this record’s content. Jev advice does not establish human review.'}</p>
    <dl><dt>Endpoint</dt><dd>${escapeHtml(evaluation.method || 'POST')} ${escapeHtml(evaluation.endpoint || '')}</dd>
    <dt>Evaluated</dt><dd>${escapeHtml(evaluation.started_at || 'Unknown')}</dd>
    <dt>HTTP status</dt><dd>${escapeHtml(evaluation.status ?? 'No response')}</dd>
    <dt>Round trip</dt><dd>${escapeHtml(evaluation.duration_ms ?? 'Unknown')} ms</dd></dl>
    ${evaluation.error ? `<p class="jev-modal-warning">${escapeHtml(evaluation.error)}</p>` : ''}
    <h4>Request payload</h4><pre>${escapeHtml(JSON.stringify(evaluation.payload, null, 2))}</pre>
    <h4>Response body</h4><pre>${escapeHtml(JSON.stringify(evaluation.response, null, 2))}</pre>
  </details>`;
}

function renderEvaluation(evaluation, record) {
  const concerns = Core.issues(evaluation, record);
  let html = concerns.length ? `<ul class="jev-export-issue-list">${concerns.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>` : '<p>No evaluation concerns found.</p>';
  const answers = evaluation.response?.answers;
  if (answers && !evaluation.error) {
    const labels = { record_type: 'Record type', has_stop_rule: 'Stop rule probability', provenance_strength: 'Provenance (0 weak · 1 moderate · 2 strong)', review_status: 'Jev recommendation', load_risk: 'Load risk (0 calm · 1 stressed · 2 overloaded)' };
    for (const [id, label] of Object.entries(labels)) {
      const answer = answers[id];
      if (!answer || typeof answer !== 'object') continue;
      const value = answer.type === 'noul' ? answer.noul : answer.type === 'score' ? answer.score : answer.choice;
      html += `<div class="jev-modal-item"><div class="jev-modal-label">${label}</div><p>${escapeHtml(value ?? 'Unavailable')}</p>`;
      if (answer.type !== 'noul' && Core.bounded(answer.confidence)) html += `<p class="jev-confidence">${Math.round(answer.confidence * 100)}% confidence</p>`;
      html += '</div>';
    }
  }
  return html + renderJevMetadata(evaluation, record);
}

function showJevValidationModal(evaluation, recordData, context) {
  const content = document.getElementById('jev-modal-content');
  content.innerHTML = '<h3 id="jev-save-heading">Jev evaluation needs attention</h3>' + renderEvaluation(evaluation, recordData) +
    '<div class="jev-modal-actions"><button class="btn btn--accent" id="jev-save-revision">Save as Needs Revision</button><button class="btn btn--ghost" id="jev-retry">Retry evaluation</button><button class="btn btn--ghost" id="jev-cancel">Cancel &amp; Revise</button></div>';
  pendingSave = { data: recordData, context };
  document.getElementById('jev-save-revision').onclick = confirmSaveNeedsRevision;
  document.getElementById('jev-retry').onclick = () => { closeJevModal(); saveRecord(); };
  document.getElementById('jev-cancel').onclick = cancelSave;
  document.getElementById('jev-modal').classList.remove('hidden');
  document.getElementById('jev-cancel').focus();
}

function closeJevModal() {
  const modal = document.getElementById('jev-modal');
  const wasOpen = !modal.classList.contains('hidden');
  modal.classList.add('hidden');
  pendingSave = null;
  if (wasOpen) document.getElementById('save-btn').focus();
}
function confirmSave() { if (pendingSave) performSave(pendingSave.data); }
function confirmSaveNeedsRevision() { if (pendingSave) performSave(pendingSave.data, true); }
function cancelSave() { closeJevModal(); }

function showExportValidationModal(issues) {
  return new Promise(resolve => {
    const modal = document.getElementById('jev-export-modal');
    const content = document.getElementById('jev-export-modal-content');
    content.innerHTML = '<h3 id="jev-export-heading">Export evaluation needs attention</h3>' +
      issues.map(({ record, validation }) => `<div class="jev-export-issue"><h4>${escapeHtml(record.title)}</h4>${renderEvaluation(validation, record)}</div>`).join('') +
      '<div class="jev-modal-actions"><button class="btn btn--ghost" id="export-fix-btn">Fix Issues</button><button class="btn btn--accent" id="export-anyway-btn">Export Anyway</button><button class="btn btn--ghost" id="export-cancel-btn">Cancel</button></div>';
    const finish = proceed => { modal.classList.add('hidden'); modal.onkeydown = null; document.getElementById('export-btn').focus(); resolve(proceed); };
    document.getElementById('export-fix-btn').onclick = () => { finish(false); viewRecord(issues[0].record.id); editCurrentRecord(); };
    document.getElementById('export-anyway-btn').onclick = () => finish(true);
    document.getElementById('export-cancel-btn').onclick = () => finish(false);
    modal.onkeydown = event => { if (event.key === 'Escape') finish(false); };
    modal.classList.remove('hidden');
    document.getElementById('export-cancel-btn').focus();
  });
}

function updateFilters() {
  // Type filters
  document.querySelectorAll('[data-filter="type"]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === state.filters.type);
  });

  // Review filters
  document.querySelectorAll('[data-filter="review"]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === state.filters.review);
  });

  if (state.currentView === 'list') render();
}

function exportRecordsJSON() {
  const data = {
    version: STORAGE_VERSION,
    exported_at: new Date().toISOString(),
    records: state.records
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sovmem-grok-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportOKF() {
  if (exportPending) return;
  exportPending = true;
  document.getElementById('export-btn').disabled = true;
  try {
  // Hard check for JSZip - fail loudly if missing
  if (typeof JSZip === 'undefined' || !window.JSZip) {
    alert('ERROR: JSZip library failed to load.\n\nOKF export requires JSZip. Please refresh the page and try again.\n\nIf the problem persists, try clearing your browser cache (Ctrl+Shift+R or Cmd+Shift+R).');
    console.error('JSZip not loaded - OKF export cannot proceed');
    return;
  }

  const records = JSON.parse(JSON.stringify(state.records));
  const validations = await batchValidateWithJev(records);
  const issues = [];
  validations.forEach((validation, index) => {
    records[index].jev_evaluation = validation;
    if (shouldShowValidationGate(validation, records[index])) issues.push({ record: records[index], validation });
  });
  if (issues.length && !await showExportValidationModal(issues)) return;

  const zip = new JSZip();
  const date = new Date().toISOString().split('T')[0];
  
  // Root index.md with okf_version
  let indexContent = `---
okf_version: "0.2"
---

# SovMemGrok Knowledge Bundle

Exported from SovMemGrok on ${date}.

## Claims

`;

  const claimRecords = records.filter(r => r.type === 'claim');
  const decisionRecords = records.filter(r => r.type === 'decision');
  const correctionRecords = records.filter(r => r.type === 'correction');

  // Add claims to index
  claimRecords.forEach(record => {
    const slug = generateSlug(record.title, record.id);
    const reviewLabel = record.review_status.replace(/-/g, ' ');
    indexContent += `* [${record.title}](claims/${slug}.md) - ${reviewLabel}\n`;
    zip.file(`claims/${slug}.md`, generateOKFConcept(record));
  });

  indexContent += `\n## Decisions\n\n`;
  
  // Add decisions to index
  decisionRecords.forEach(record => {
    const slug = generateSlug(record.title, record.id);
    const reviewLabel = record.review_status.replace(/-/g, ' ');
    indexContent += `* [${record.title}](decisions/${slug}.md) - ${reviewLabel}\n`;
    zip.file(`decisions/${slug}.md`, generateOKFConcept(record));
  });

  indexContent += `\n## Corrections\n\n`;
  
  // Add corrections to index
  correctionRecords.forEach(record => {
    const slug = generateSlug(record.title, record.id);
    const reviewLabel = record.review_status.replace(/-/g, ' ');
    indexContent += `* [${record.title}](corrections/${slug}.md) - ${reviewLabel}\n`;
    zip.file(`corrections/${slug}.md`, generateOKFConcept(record));
  });

  zip.file('index.md', indexContent);
  zip.file('jev-evaluations.json', JSON.stringify(records.map(r => ({ id: r.id, evaluation: r.jev_evaluation })), null, 2));

  // Generate optional log.md with revision history
  if (records.some(r => r.revisions && r.revisions.length > 0)) {
    const logContent = generateLogMd(records);
    zip.file('log.md', logContent);
  }

  // Generate and download zip
  try {
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = `sovmem-grok-okf-${date}.zip`;
    
    // Assert filename correctness
    if (!filename.startsWith('sovmem-grok-okf-') || !filename.endsWith('.zip')) {
      console.error('Generated invalid OKF filename:', filename);
      alert('ERROR: Failed to generate valid OKF filename. Please report this issue.');
      URL.revokeObjectURL(url);
      return;
    }
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('OKF export successful:', filename);
  } catch (e) {
    console.error('OKF export failed:', e);
    alert('ERROR: OKF export failed.\n\n' + e.message + '\n\nPlease try again or export as JSON instead.');
  }
  } finally { exportPending = false; document.getElementById('export-btn').disabled = false; }
}

function generateSlug(title, id) {
  // Generate URL-safe slug from title, fallback to id-based slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
  
  // Title slugs cannot contain underscores, so the first __ separates the ID unambiguously.
  return `${slug || 'record'}__${id}`;
}

function generateOKFConcept(record) {
  // Map SovMemGrok to OKF v0.2 per the brief
  const typeCapitalized = record.type.charAt(0).toUpperCase() + record.type.slice(1);
  
  // Map review_status to OKF status and verified
  let status = 'draft';
  let verified = null;
  
  if (record.review_status === 'reviewed') {
    status = 'stable';
    verified = { by: 'human:local', at: record.updated_at };
  } else if (record.review_status === 'unreviewed') {
    status = 'draft';
  } else if (record.review_status === 'needs-revision') {
    status = 'draft';
  }

  // Build frontmatter
  const frontmatter = {
    type: typeCapitalized,
    title: record.title,
    tags: ['sovmem-grok', record.type],
    generated: {
      by: 'human:local',
      at: record.created_at
    },
    status: status
  };

  // Add verified if reviewed
  if (verified) {
    frontmatter.verified = verified;
  }

  // Map provenance to sources
  frontmatter.sources = [{
    id: 'provenance',
    resource: record.provenance,
    title: record.provenance
  }];

  // Add sovmem extension fields
  frontmatter.sovmem_id = record.id;
  frontmatter.sovmem_stop_rule = record.stop_rule;
  frontmatter.sovmem_review_status = record.review_status;

  // Convert frontmatter to YAML
  let yaml = '---\n';
  yaml += `type: ${frontmatter.type}\n`;
  yaml += `title: ${JSON.stringify(frontmatter.title)}\n`;
  yaml += `tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]\n`;
  yaml += `generated:\n  by: ${frontmatter.generated.by}\n  at: ${frontmatter.generated.at}\n`;
  yaml += `status: ${frontmatter.status}\n`;
  
  if (frontmatter.verified) {
    yaml += `verified:\n  by: ${frontmatter.verified.by}\n  at: ${frontmatter.verified.at}\n`;
  }
  
  yaml += `sources:\n`;
  yaml += `  - id: ${frontmatter.sources[0].id}\n`;
  yaml += `    resource: ${JSON.stringify(frontmatter.sources[0].resource)}\n`;
  yaml += `    title: ${JSON.stringify(frontmatter.sources[0].title)}\n`;
  yaml += `sovmem_id: "${frontmatter.sovmem_id}"\n`;
  yaml += `sovmem_stop_rule: ${JSON.stringify(frontmatter.sovmem_stop_rule)}\n`;
  yaml += `sovmem_review_status: ${frontmatter.sovmem_review_status}\n`;
  yaml += '---\n\n';

  // Body
  let body = record.body + '\n\n';

  // Revision history if present
  if (record.revisions && record.revisions.length > 0) {
    body += `## Revision History\n\n`;
    record.revisions.forEach(rev => {
      const revDate = new Date(rev.timestamp).toISOString();
      body += `- **${revDate}** — ${rev.reason} (fields: ${rev.fields.join(', ')})\n`;
    });
    body += '\n';
  }

  // Metadata footer
  body += `## Metadata\n\n`;
  body += `- Created: ${record.created_at}\n`;
  body += `- Updated: ${record.updated_at}\n`;

  return yaml + body;
}

function generateLogMd(records = state.records) {
  // Generate chronological log from revision history
  let log = '# Update Log\n\n';
  
  // Collect all events (creation + revisions)
  const events = [];
  
  records.forEach(record => {
    // Creation event
    events.push({
      date: record.created_at,
      type: 'Creation',
      title: record.title,
      id: record.id,
      recordType: record.type
    });
    
    // Revision events
    if (record.revisions) {
      record.revisions.forEach(rev => {
        events.push({
          date: rev.timestamp,
          type: 'Update',
          title: record.title,
          id: record.id,
          recordType: record.type,
          reason: rev.reason
        });
      });
    }
  });

  // Sort newest first
  events.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Group by date
  const groupedByDate = {};
  events.forEach(event => {
    const dateKey = event.date.split('T')[0];
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(event);
  });

  // Generate log entries
  Object.keys(groupedByDate).sort().reverse().forEach(date => {
    log += `## ${date}\n\n`;
    groupedByDate[date].forEach(event => {
      const slug = generateSlug(event.title, event.id);
      const path = `${event.recordType}s/${slug}.md`;
      if (event.type === 'Creation') {
        log += `* **Creation**: [${event.title}](${path})\n`;
      } else {
        log += `* **Update**: [${event.title}](${path}) — ${event.reason}\n`;
      }
    });
    log += '\n';
  });

  return log;
}

function importRecords() {
  document.getElementById('import-file').click();
}

function handleImportFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data.records)) {
        throw new Error('Invalid format: records array not found');
      }

      if (data.version !== STORAGE_VERSION) throw new Error('Unsupported version');
      const imported = data.records.map(Core.storedRecord);
      const importCount = imported.length;
      if (!confirm(`Import ${importCount} record${importCount !== 1 ? 's' : ''}?\n\nThis will add to your existing records.`)) {
        return;
      }

      // Merge records (avoiding duplicates by ID)
      const existingIds = new Set(state.records.map(r => r.id));
      const newRecords = imported.filter(r => {
        if (existingIds.has(r.id)) return false;
        existingIds.add(r.id); return true;
      });
      
      if (!saveRecords([...newRecords, ...state.records])) return;
      if (state.currentView !== 'edit') render();

      alert(`Successfully imported ${newRecords.length} record${newRecords.length !== 1 ? 's' : ''}.`);
    } catch (e) {
      console.error('Import failed:', e);
      alert('Import failed. Please check the file format.');
    }
  };
  reader.onerror = () => alert('Import failed. The file could not be read.');
  reader.readAsText(file);
  event.target.value = '';
}

// ═══════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;

  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatDateLong(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ═══════════════════════════════════════════════════════════════════
// THEME TOGGLE (use existing shared.js logic)
// ═══════════════════════════════════════════════════════════════════

function initTheme() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  let savedTheme;
  try { savedTheme = localStorage.getItem('theme'); } catch { /* Storage can be disabled. */ }
  const preferred = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', ['light', 'dark'].includes(savedTheme) ? savedTheme : preferred);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch { /* Theme still works without persistence. */ }
  });
}

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

function init() {
  // Load records
  state.records = loadRecords();

  // Set up event listeners
  document.getElementById('new-record-btn').addEventListener('click', newRecord);
  document.getElementById('back-btn').addEventListener('click', backToList);
  document.getElementById('edit-btn').addEventListener('click', editCurrentRecord);
  document.getElementById('delete-btn').addEventListener('click', deleteCurrentRecord);
  document.getElementById('cancel-edit-btn').addEventListener('click', cancelEdit);
  document.getElementById('save-btn').addEventListener('click', saveRecord);
  document.getElementById('export-btn').addEventListener('click', exportOKF);
  document.getElementById('export-json-btn').addEventListener('click', exportRecordsJSON);
  document.getElementById('import-btn').addEventListener('click', importRecords);
  document.getElementById('import-file').addEventListener('change', handleImportFile);

  document.getElementById('record-form').addEventListener('submit', event => { event.preventDefault(); saveRecord(); });
  document.getElementById('jev-modal').addEventListener('keydown', event => { if (event.key === 'Escape') cancelSave(); });

  // Type picker cards
  document.querySelectorAll('.sovmem-type-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const type = e.currentTarget.dataset.type;
      selectType(type);
    });
  });

  // Change type button
  document.getElementById('change-type-btn').addEventListener('click', () => {
    draft = readForm();
    state.selectedType = null;
    render();
  });

  // Search
  document.getElementById('search').addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    if (state.currentView === 'list') render();
  });

  // Filter chips
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const filter = e.target.dataset.filter;
      const value = e.target.dataset.value;
      state.filters[filter] = value;
      updateFilters();
    });
  });

  // Theme
  initTheme();

  // Initial render
  render();
}

function selectType(type) {
  if (!Core.types.includes(type)) return;
  state.selectedType = type;
  render();
  // Focus first field after type selection
  setTimeout(() => {
    document.getElementById('record-title')?.focus();
  }, 100);
}

function refreshRecords() {
  state.records = loadRecords();
  if (state.currentRecord && state.currentView !== 'edit') state.currentRecord = getRecord(state.currentRecord.id) || null;
  if (state.currentView !== 'edit') render();
}

async function captureFromMcp(args) {
  refreshRecords();
  const data = Core.recordData({ ...args, review_status: args.review_status || 'unreviewed' });
  const evaluation = await validateWithJev(data);
  const concerns = Core.issues(evaluation, data);
  const record = createRecord({ ...data, jev_evaluation: evaluation, review_status: concerns.length ? 'needs-revision' : data.review_status });
  if (!record) throw new Error('Record was not saved.');
  if (state.currentView !== 'edit') render();
  return { record, concerns };
}

async function reviseFromMcp(args) {
  if (args.revision_reason !== undefined && typeof args.revision_reason !== 'string') throw new Error('Revision reason must be text.');
  refreshRecords();
  const original = getRecord(args.id);
  if (!original) throw new Error('Record not found.');
  const originalJSON = JSON.stringify(original);
  const updates = Object.fromEntries(Core.fields.filter(f => args[f] !== undefined).map(f => [f, args[f]]));
  const data = Core.recordData({ ...original, ...updates });
  const evaluation = await validateWithJev(data);
  if (JSON.stringify(getRecord(args.id)) !== originalJSON) throw new Error('Record changed during evaluation. Retry the revision.');
  const concerns = Core.issues(evaluation, data);
  const record = updateRecord(args.id, { ...data, jev_evaluation: evaluation, review_status: concerns.length ? 'needs-revision' : data.review_status }, args.revision_reason || 'Updated via MCP');
  if (!record) throw new Error('Revision was not saved.');
  if (state.currentView !== 'edit') { state.currentRecord = state.currentRecord?.id === record.id ? record : state.currentRecord; render(); }
  return { record, concerns };
}

function removeFromMcp(args) {
  if (args.confirm !== true) throw new Error('Deletion requires confirm: true.');
  refreshRecords();
  const record = getRecord(args.id);
  if (!record) throw new Error('Record not found.');
  if (!deleteRecord(args.id)) throw new Error('Record was not deleted.');
  if (state.currentRecord?.id === args.id) backToList();
  else if (state.currentView !== 'edit') render();
  return record;
}

// Export public API
window.sovmem = {
  newRecord,
  viewRecord,
  editCurrentRecord,
  deleteCurrentRecord,
  backToList,
  confirmSave,
  confirmSaveNeedsRevision,
  cancelSave,
  refresh: refreshRecords,
  capture: captureFromMcp,
  revise: reviseFromMcp,
  remove: removeFromMcp,
  records: () => JSON.parse(JSON.stringify(state.records))
};

// Start app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
