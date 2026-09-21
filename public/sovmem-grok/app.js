/**
 * SovMemGrok · Sovereign Memory Filter
 * Browser-local record management: claims, decisions, corrections
 */

const STORAGE_KEY = 'sovmem-grok-records';
const STORAGE_VERSION = 1;

// Nous-Jev Worker API integration
const JEV_API_BASE = 'https://nous-jev.khalil-himura.workers.dev';
const JEV_CONFIDENCE_THRESHOLD = 0.75;
let jevApiAvailable = true; // Assume available, disable on error

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
  if (!jevApiAvailable) {
    console.log('Jev API unavailable, skipping validation');
    return null;
  }

  try {
    const payload = {
      title: record.title,
      body: record.body,
      declared_type: record.type,
      stop_rule: (record.stop_rule && record.stop_rule.trim() && record.stop_rule.toLowerCase() !== 'none') ? record.stop_rule : null,
      provenance: record.provenance || null
    };

    const response = await fetch(`${JEV_API_BASE}/api/jev`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Jev validation failed:', error);
    jevApiAvailable = false;
    return null;
  }
}

async function batchValidateWithJev(records) {
  if (!jevApiAvailable) {
    console.log('Jev API unavailable, skipping batch validation');
    return null;
  }

  try {
    const validations = await Promise.all(
      records.map(record => validateWithJev(record))
    );
    return validations;
  } catch (error) {
    console.error('Batch validation failed:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════════

function loadRecords() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const data = JSON.parse(stored);
    return Array.isArray(data.records) ? data.records : [];
  } catch (e) {
    console.error('Failed to load records:', e);
    return [];
  }
}

function saveRecords(records) {
  try {
    const data = {
      version: STORAGE_VERSION,
      records: records,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save records:', e);
    alert('Failed to save records. Storage might be full.');
  }
}

// ═══════════════════════════════════════════════════════════════════
// RECORD OPERATIONS
// ═══════════════════════════════════════════════════════════════════

function createRecord(data) {
  const now = new Date().toISOString();
  const record = {
    id: generateId(),
    type: data.type,
    title: data.title,
    body: data.body,
    provenance: data.provenance,
    stop_rule: data.stop_rule,
    review_status: data.review_status,
    created_at: now,
    updated_at: now,
    revisions: []
  };
  state.records.unshift(record);
  saveRecords(state.records);
  return record;
}

function updateRecord(id, data, revisionReason) {
  const record = state.records.find(r => r.id === id);
  if (!record) return null;

  const changes = [];
  const fields = ['type', 'title', 'body', 'provenance', 'stop_rule', 'review_status'];
  
  fields.forEach(field => {
    if (data[field] !== undefined && data[field] !== record[field]) {
      changes.push(field);
    }
  });

  if (changes.length > 0) {
    const revision = {
      timestamp: new Date().toISOString(),
      reason: revisionReason || 'Updated',
      fields: changes
    };
    record.revisions.push(revision);
  }

  Object.assign(record, {
    type: data.type,
    title: data.title,
    body: data.body,
    provenance: data.provenance,
    stop_rule: data.stop_rule,
    review_status: data.review_status,
    updated_at: new Date().toISOString()
  });

  saveRecords(state.records);
  return record;
}

function deleteRecord(id) {
  state.records = state.records.filter(r => r.id !== id);
  saveRecords(state.records);
}

function getRecord(id) {
  return state.records.find(r => r.id === id);
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
  const record = state.currentRecord;

  // For new records, show type picker first
  const typePicker = document.getElementById('type-picker');
  const form = document.getElementById('record-form');
  
  if (!isEdit && !state.selectedType) {
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
      document.getElementById('revision-reason').value = '';
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
  state.editMode = 'create';
  state.currentRecord = null;
  state.selectedType = null; // Reset type selection
  state.currentView = 'edit';
  render();
}

function viewRecord(id) {
  const record = getRecord(id);
  if (!record) return;
  state.currentRecord = record;
  state.currentView = 'detail';
  render();
}

function editCurrentRecord() {
  if (!state.currentRecord) return;
  state.editMode = 'update';
  state.selectedType = state.currentRecord.type; // Set type for editing
  state.currentView = 'edit';
  render();
}

function deleteCurrentRecord() {
  if (!state.currentRecord) return;
  if (!confirm(`Delete "${state.currentRecord.title}"?\n\nThis cannot be undone.`)) return;
  deleteRecord(state.currentRecord.id);
  state.currentRecord = null;
  state.currentView = 'list';
  render();
}

function backToList() {
  state.currentView = 'list';
  state.currentRecord = null;
  render();
}

function cancelEdit() {
  closeJevModal(); // Close any open validation modal
  state.selectedType = null; // Reset type selection
  if (state.editMode === 'update' && state.currentRecord) {
    state.currentView = 'detail';
  } else {
    state.currentView = 'list';
  }
  render();
}

async function saveRecord() {
  const form = document.getElementById('record-form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = {
    type: state.selectedType || document.getElementById('record-type').value,
    title: document.getElementById('record-title').value.trim(),
    body: document.getElementById('record-body').value.trim(),
    provenance: document.getElementById('record-provenance').value.trim(),
    stop_rule: document.getElementById('record-stop-rule').value.trim(),
    review_status: document.getElementById('record-review-status').value
  };

  // Capture gate: validate with Jev before saving
  const validation = await validateWithJev(data);
  
  if (validation && shouldShowValidationGate(validation)) {
    showJevValidationModal(validation, data);
    return; // Wait for user decision
  }

  // Proceed with save
  performSave(data);
}

function shouldShowValidationGate(validation) {
  if (!validation || !validation.answers) return false;
  
  const answers = validation.answers;
  
  // Show gate if any confidence is below threshold
  const hasLowConfidence = 
    (answers.record_type?.confidence < JEV_CONFIDENCE_THRESHOLD) ||
    (answers.has_stop_rule?.confidence < JEV_CONFIDENCE_THRESHOLD) ||
    (answers.provenance_strength?.confidence < JEV_CONFIDENCE_THRESHOLD) ||
    (answers.review_status?.confidence < JEV_CONFIDENCE_THRESHOLD) ||
    (answers.load_risk?.confidence < JEV_CONFIDENCE_THRESHOLD);
  
  // Also show if stop rule is missing (noul < 0.5)
  const missingStopRule = answers.has_stop_rule?.noul < 0.5;
  
  return hasLowConfidence || missingStopRule;
}

function performSave(data, forceNeedsRevision = false) {
  // Apply needs-revision if forced by low confidence
  if (forceNeedsRevision && data.review_status !== 'needs-revision') {
    data.review_status = 'needs-revision';
  }

  if (state.editMode === 'create') {
    const record = createRecord(data);
    state.currentRecord = record;
    state.selectedType = null;
    state.currentView = 'list';
  } else {
    const revisionReason = document.getElementById('revision-reason').value.trim();
    updateRecord(state.currentRecord.id, data, revisionReason);
    state.currentRecord = getRecord(state.currentRecord.id);
    state.selectedType = null;
    state.currentView = 'list';
  }

  closeJevModal();
  render();
}

function showJevValidationModal(validation, recordData) {
  if (!validation || !validation.answers) {
    console.error('Invalid validation response');
    return;
  }
  
  const modal = document.getElementById('jev-modal');
  const content = document.getElementById('jev-modal-content');
  const answers = validation.answers;
  
  let html = '<h3>Jev Validation Results</h3>';
  html += '<div class="jev-modal-results">';
  
  const hasLowConfidence = 
    (answers.record_type?.confidence < JEV_CONFIDENCE_THRESHOLD) ||
    (answers.has_stop_rule?.confidence < JEV_CONFIDENCE_THRESHOLD) ||
    (answers.provenance_strength?.confidence < JEV_CONFIDENCE_THRESHOLD) ||
    (answers.review_status?.confidence < JEV_CONFIDENCE_THRESHOLD) ||
    (answers.load_risk?.confidence < JEV_CONFIDENCE_THRESHOLD);
  
  if (hasLowConfidence) {
    html += '<div class="jev-modal-warning">⚠ Low confidence detected in one or more areas</div>';
  }
  
  // Record Type
  if (answers.record_type) {
    const conf = answers.record_type.confidence;
    const suggestedType = answers.record_type.choice;
    html += `
      <div class="jev-modal-item">
        <div class="jev-modal-label">Record Type</div>
        <div class="jev-confidence ${conf >= JEV_CONFIDENCE_THRESHOLD ? 'jev-confidence--high' : 'jev-confidence--low'}">
          ${(conf * 100).toFixed(0)}% confidence
        </div>
        ${suggestedType !== recordData.type ? 
          `<p>Suggested: <strong>${suggestedType}</strong> (current: ${recordData.type})</p>` : 
          `<p>Type looks good: <strong>${recordData.type}</strong></p>`}
        ${answers.record_type.reasoning ? `<p class="jev-reasoning">${escapeHtml(answers.record_type.reasoning)}</p>` : ''}
      </div>
    `;
  }
  
  // Stop Rule
  if (answers.has_stop_rule) {
    const conf = answers.has_stop_rule.confidence;
    const noul = answers.has_stop_rule.noul;
    const hasStopRule = noul >= 0.5;
    html += `
      <div class="jev-modal-item">
        <div class="jev-modal-label">Stop Rule</div>
        <div class="jev-confidence ${conf >= JEV_CONFIDENCE_THRESHOLD ? 'jev-confidence--high' : 'jev-confidence--low'}">
          ${(conf * 100).toFixed(0)}% confidence
        </div>
        <p>${hasStopRule ? '✓ Has stop rule' : '⚠ Consider adding a stop rule'} (noul: ${noul.toFixed(3)})</p>
        ${answers.has_stop_rule.reasoning ? `<p class="jev-reasoning">${escapeHtml(answers.has_stop_rule.reasoning)}</p>` : ''}
      </div>
    `;
  }
  
  // Provenance Strength
  if (answers.provenance_strength) {
    const conf = answers.provenance_strength.confidence;
    const strength = answers.provenance_strength.choice;
    html += `
      <div class="jev-modal-item">
        <div class="jev-modal-label">Provenance Strength</div>
        <div class="jev-confidence ${conf >= JEV_CONFIDENCE_THRESHOLD ? 'jev-confidence--high' : 'jev-confidence--low'}">
          ${(conf * 100).toFixed(0)}% confidence
        </div>
        <p>Assessed as: <strong>${strength}</strong></p>
        ${answers.provenance_strength.reasoning ? `<p class="jev-reasoning">${escapeHtml(answers.provenance_strength.reasoning)}</p>` : ''}
      </div>
    `;
  }
  
  // Review Status
  if (answers.review_status) {
    const conf = answers.review_status.confidence;
    const suggestedStatus = answers.review_status.choice;
    html += `
      <div class="jev-modal-item">
        <div class="jev-modal-label">Review Status</div>
        <div class="jev-confidence ${conf >= JEV_CONFIDENCE_THRESHOLD ? 'jev-confidence--high' : 'jev-confidence--low'}">
          ${(conf * 100).toFixed(0)}% confidence
        </div>
        ${suggestedStatus !== recordData.review_status ? 
          `<p>Suggested: <strong>${suggestedStatus}</strong> (current: ${recordData.review_status})</p>` : 
          `<p>Status looks good: <strong>${recordData.review_status}</strong></p>`}
        ${answers.review_status.reasoning ? `<p class="jev-reasoning">${escapeHtml(answers.review_status.reasoning)}</p>` : ''}
      </div>
    `;
  }
  
  // Load Risk
  if (answers.load_risk) {
    const conf = answers.load_risk.confidence;
    const score = answers.load_risk.score;
    let level = 'low';
    if (score >= 0.7) level = 'high';
    else if (score >= 0.4) level = 'medium';
    
    html += `
      <div class="jev-modal-item">
        <div class="jev-modal-label">Load Risk</div>
        <div class="jev-confidence ${conf >= JEV_CONFIDENCE_THRESHOLD ? 'jev-confidence--high' : 'jev-confidence--low'}">
          ${(conf * 100).toFixed(0)}% confidence
        </div>
        <p>Score: <strong class="jev-risk-${level}">${score.toFixed(2)}</strong> (${level})</p>
        ${answers.load_risk.reasoning ? `<p class="jev-reasoning">${escapeHtml(answers.load_risk.reasoning)}</p>` : ''}
      </div>
    `;
  }
  
  html += '</div>';
  
  html += '<div class="jev-modal-actions">';
  if (hasLowConfidence) {
    html += '<button class="btn btn--accent" onclick="window.sovmem.confirmSaveNeedsRevision()">Save as Needs Revision</button>';
  } else {
    html += '<button class="btn btn--accent" onclick="window.sovmem.confirmSave()">Confirm & Save</button>';
  }
  html += '<button class="btn btn--ghost" onclick="window.sovmem.cancelSave()">Cancel & Revise</button>';
  html += '</div>';
  
  content.innerHTML = html;
  modal.classList.remove('hidden');
  
  // Store data for save callbacks
  window._pendingSaveData = recordData;
  window._pendingSaveNeedsRevision = hasLowConfidence;
}

function closeJevModal() {
  const modal = document.getElementById('jev-modal');
  modal.classList.add('hidden');
  window._pendingSaveData = null;
  window._pendingSaveNeedsRevision = false;
}

function confirmSave() {
  if (window._pendingSaveData) {
    performSave(window._pendingSaveData, false);
  }
}

function confirmSaveNeedsRevision() {
  if (window._pendingSaveData) {
    performSave(window._pendingSaveData, true);
  }
}

function cancelSave() {
  closeJevModal();
}

function showExportValidationModal(issues) {
  return new Promise((resolve) => {
    const modal = document.getElementById('jev-export-modal');
    const content = document.getElementById('jev-export-modal-content');
    
    let html = '<h3>Export Validation Issues</h3>';
    html += `<p class="jev-export-warning">⚠ Found ${issues.length} record${issues.length > 1 ? 's' : ''} with validation concerns:</p>`;
    html += '<div class="jev-export-issues">';
    
    issues.forEach(({ record, validation }) => {
      const answers = validation.answers || {};
      html += `<div class="jev-export-issue">`;
      html += `<div class="jev-export-issue-title">${escapeHtml(record.title)}</div>`;
      html += `<ul class="jev-export-issue-list">`;
      
      if (answers.record_type?.confidence < JEV_CONFIDENCE_THRESHOLD) {
        html += `<li>Type confidence: ${(answers.record_type.confidence * 100).toFixed(0)}%</li>`;
      }
      if (answers.has_stop_rule?.confidence < JEV_CONFIDENCE_THRESHOLD) {
        html += `<li>Stop rule confidence: ${(answers.has_stop_rule.confidence * 100).toFixed(0)}%</li>`;
      }
      if (answers.provenance_strength?.confidence < JEV_CONFIDENCE_THRESHOLD) {
        html += `<li>Provenance confidence: ${(answers.provenance_strength.confidence * 100).toFixed(0)}%</li>`;
      }
      if (answers.review_status?.confidence < JEV_CONFIDENCE_THRESHOLD) {
        html += `<li>Review confidence: ${(answers.review_status.confidence * 100).toFixed(0)}%</li>`;
      }
      if (answers.load_risk?.confidence < JEV_CONFIDENCE_THRESHOLD) {
        html += `<li>Load risk confidence: ${(answers.load_risk.confidence * 100).toFixed(0)}%</li>`;
      }
      
      html += `</ul></div>`;
    });
    
    html += '</div>';
    html += '<div class="jev-modal-actions">';
    html += '<button class="btn btn--ghost" id="export-fix-btn">Fix Issues</button>';
    html += '<button class="btn btn--accent" id="export-anyway-btn">Export Anyway</button>';
    html += '<button class="btn btn--ghost" id="export-cancel-btn">Cancel</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hidden');
    
    document.getElementById('export-fix-btn').onclick = () => {
      modal.classList.add('hidden');
      resolve(false); // Don't export, let user fix
    };
    
    document.getElementById('export-anyway-btn').onclick = () => {
      modal.classList.add('hidden');
      resolve(true); // Export anyway
    };
    
    document.getElementById('export-cancel-btn').onclick = () => {
      modal.classList.add('hidden');
      resolve(false); // Cancel export
    };
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

  render();
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
  // Hard check for JSZip - fail loudly if missing
  if (typeof JSZip === 'undefined' || !window.JSZip) {
    alert('ERROR: JSZip library failed to load.\n\nOKF export requires JSZip. Please refresh the page and try again.\n\nIf the problem persists, try clearing your browser cache (Ctrl+Shift+R or Cmd+Shift+R).');
    console.error('JSZip not loaded - OKF export cannot proceed');
    return;
  }

  // Export gate: batch validate records with Jev
  if (jevApiAvailable && state.records.length > 0) {
    const validations = await batchValidateWithJev(state.records);
    
    if (validations) {
      const issues = [];
      validations.forEach((validation, index) => {
        if (!validation || !validation.answers) return;
        
        const record = state.records[index];
        const answers = validation.answers;
        
        const hasLowConfidence = 
          (answers.record_type?.confidence < JEV_CONFIDENCE_THRESHOLD) ||
          (answers.has_stop_rule?.confidence < JEV_CONFIDENCE_THRESHOLD) ||
          (answers.provenance_strength?.confidence < JEV_CONFIDENCE_THRESHOLD) ||
          (answers.review_status?.confidence < JEV_CONFIDENCE_THRESHOLD) ||
          (answers.load_risk?.confidence < JEV_CONFIDENCE_THRESHOLD);
        
        if (hasLowConfidence) {
          issues.push({
            record: record,
            validation: validation
          });
        }
      });
      
      if (issues.length > 0) {
        const proceed = await showExportValidationModal(issues);
        if (!proceed) {
          return; // User cancelled export
        }
      }
    }
  }

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

  const claimRecords = state.records.filter(r => r.type === 'claim');
  const decisionRecords = state.records.filter(r => r.type === 'decision');
  const correctionRecords = state.records.filter(r => r.type === 'correction');

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

  // Generate optional log.md with revision history
  if (state.records.some(r => r.revisions && r.revisions.length > 0)) {
    const logContent = generateLogMd();
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
}

function generateSlug(title, id) {
  // Generate URL-safe slug from title, fallback to id-based slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
  
  return slug || `record-${id.split('-')[0]}`;
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
  yaml += `title: "${frontmatter.title.replace(/"/g, '\\"')}"\n`;
  yaml += `tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]\n`;
  yaml += `generated:\n  by: ${frontmatter.generated.by}\n  at: ${frontmatter.generated.at}\n`;
  yaml += `status: ${frontmatter.status}\n`;
  
  if (frontmatter.verified) {
    yaml += `verified:\n  by: ${frontmatter.verified.by}\n  at: ${frontmatter.verified.at}\n`;
  }
  
  yaml += `sources:\n`;
  yaml += `  - id: ${frontmatter.sources[0].id}\n`;
  yaml += `    resource: "${frontmatter.sources[0].resource.replace(/"/g, '\\"')}"\n`;
  yaml += `    title: "${frontmatter.sources[0].title.replace(/"/g, '\\"')}"\n`;
  yaml += `sovmem_id: "${frontmatter.sovmem_id}"\n`;
  yaml += `sovmem_stop_rule: "${frontmatter.sovmem_stop_rule.replace(/"/g, '\\"')}"\n`;
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

function generateLogMd() {
  // Generate chronological log from revision history
  let log = '# Update Log\n\n';
  
  // Collect all events (creation + revisions)
  const events = [];
  
  state.records.forEach(record => {
    // Creation event
    events.push({
      date: record.created_at,
      type: 'Creation',
      title: record.title,
      recordType: record.type
    });
    
    // Revision events
    if (record.revisions) {
      record.revisions.forEach(rev => {
        events.push({
          date: rev.timestamp,
          type: 'Update',
          title: record.title,
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
      const slug = generateSlug(event.title, '');
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

      const importCount = data.records.length;
      if (!confirm(`Import ${importCount} record${importCount !== 1 ? 's' : ''}?\n\nThis will add to your existing records.`)) {
        return;
      }

      // Merge records (avoiding duplicates by ID)
      const existingIds = new Set(state.records.map(r => r.id));
      const newRecords = data.records.filter(r => !existingIds.has(r.id));
      
      state.records = [...newRecords, ...state.records];
      saveRecords(state.records);
      render();

      alert(`Successfully imported ${newRecords.length} record${newRecords.length !== 1 ? 's' : ''}.`);
    } catch (e) {
      console.error('Import failed:', e);
      alert('Import failed. Please check the file format.');
    }
  };
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

  // Type picker cards
  document.querySelectorAll('.sovmem-type-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const type = e.currentTarget.dataset.type;
      selectType(type);
    });
  });

  // Change type button
  document.getElementById('change-type-btn').addEventListener('click', () => {
    state.selectedType = null;
    render();
  });

  // Search
  document.getElementById('search').addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    render();
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
  state.selectedType = type;
  render();
  // Focus first field after type selection
  setTimeout(() => {
    document.getElementById('record-title')?.focus();
  }, 100);
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
  refresh: render // For WebMCP bridge to trigger UI updates
};

// Start app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
