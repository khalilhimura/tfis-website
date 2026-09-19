/**
 * SovMemGrok · Sovereign Memory Filter
 * Browser-local record management: claims, decisions, corrections
 */

const STORAGE_KEY = 'sovmem-grok-records';
const STORAGE_VERSION = 1;

// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════

let state = {
  records: [],
  currentView: 'list', // 'list', 'detail', 'edit'
  currentRecord: null,
  editMode: 'create', // 'create', 'update'
  filters: {
    type: 'all',
    review: 'all',
    search: ''
  }
};

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

  // Populate form
  document.getElementById('record-type').value = record?.type || '';
  document.getElementById('record-title').value = record?.title || '';
  document.getElementById('record-body').value = record?.body || '';
  document.getElementById('record-provenance').value = record?.provenance || '';
  document.getElementById('record-stop-rule').value = record?.stop_rule || '';
  document.getElementById('record-review-status').value = record?.review_status || 'unreviewed';

  // Show/hide revision reason for edits
  const revisionGroup = document.getElementById('revision-reason-group');
  if (isEdit) {
    revisionGroup.style.display = 'block';
    document.getElementById('revision-reason').value = '';
  } else {
    revisionGroup.style.display = 'none';
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
  if (state.editMode === 'update' && state.currentRecord) {
    state.currentView = 'detail';
  } else {
    state.currentView = 'list';
  }
  render();
}

function saveRecord() {
  const form = document.getElementById('record-form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = {
    type: document.getElementById('record-type').value,
    title: document.getElementById('record-title').value.trim(),
    body: document.getElementById('record-body').value.trim(),
    provenance: document.getElementById('record-provenance').value.trim(),
    stop_rule: document.getElementById('record-stop-rule').value.trim(),
    review_status: document.getElementById('record-review-status').value
  };

  if (state.editMode === 'create') {
    const record = createRecord(data);
    state.currentRecord = record;
    state.currentView = 'detail';
  } else {
    const revisionReason = document.getElementById('revision-reason').value.trim();
    updateRecord(state.currentRecord.id, data, revisionReason);
    state.currentRecord = getRecord(state.currentRecord.id);
    state.currentView = 'detail';
  }

  render();
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

function exportRecords() {
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
  document.getElementById('export-btn').addEventListener('click', exportRecords);
  document.getElementById('import-btn').addEventListener('click', importRecords);
  document.getElementById('import-file').addEventListener('change', handleImportFile);

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

// Export public API
window.sovmem = {
  newRecord,
  viewRecord,
  editCurrentRecord,
  deleteCurrentRecord,
  backToList
};

// Start app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
