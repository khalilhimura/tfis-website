/**
 * Nous-Jev · Judgment Under Load
 * Demo interface for Jev Worker API
 */

// Worker API base URL (update if deployed elsewhere)
const API_BASE_URL = 'https://nous-jev.khalil-himura.workers.dev';
const CONFIDENCE_THRESHOLD = 0.75;

// ═══════════════════════════════════════════════════════════════════
// API CLIENT
// ═══════════════════════════════════════════════════════════════════

async function compareRecords(recordA, recordB) {
  const response = await fetch(`${API_BASE_URL}/api/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      record_a: recordA,
      record_b: recordB
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'API request failed' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

async function validateRecord(record) {
  const response = await fetch(`${API_BASE_URL}/api/jev`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ record })
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
    recordA: {
      record_type: document.getElementById('a-type').value,
      has_stop_rule: document.getElementById('a-has-stop-rule').checked,
      provenance_strength: document.getElementById('a-provenance').value,
      content: document.getElementById('record-a').value.trim()
    },
    recordB: {
      record_type: document.getElementById('b-type').value,
      has_stop_rule: document.getElementById('b-has-stop-rule').checked,
      provenance_strength: document.getElementById('b-provenance').value,
      content: document.getElementById('record-b').value.trim()
    }
  };
}

function resetForm() {
  document.getElementById('compare-form').reset();
  hideResults();
  hideError();
}

// ═══════════════════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════════════════

function showLoading() {
  state.loading = true;
  const btn = document.getElementById('compare-btn');
  const text = document.getElementById('compare-btn-text');
  const spinner = document.getElementById('compare-spinner');
  
  btn.disabled = true;
  text.textContent = 'Analyzing...';
  spinner.classList.remove('hidden');
}

function hideLoading() {
  state.loading = false;
  const btn = document.getElementById('compare-btn');
  const text = document.getElementById('compare-btn-text');
  const spinner = document.getElementById('compare-spinner');
  
  btn.disabled = false;
  text.textContent = 'Compare';
  spinner.classList.add('hidden');
}

function showResults(results) {
  const container = document.getElementById('results');
  const content = document.getElementById('results-content');
  
  hideError();
  
  let html = '<div class="jev-results-grid">';
  
  // Consistency Analysis
  if (results.consistency) {
    const cons = results.consistency;
    html += `
      <div class="jev-result-card">
        <h3 class="jev-result-title">Consistency</h3>
        <div class="jev-confidence ${getConfidenceClass(cons.confidence)}">
          Confidence: ${(cons.confidence * 100).toFixed(0)}%
        </div>
        <div class="jev-result-body">
          <p><strong>Aligned:</strong> ${cons.aligned ? 'Yes' : 'No'}</p>
          ${cons.conflicts && cons.conflicts.length > 0 ? `
            <div class="jev-conflicts">
              <strong>Conflicts:</strong>
              <ul>
                ${cons.conflicts.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${cons.reasoning ? `<p class="jev-reasoning">${escapeHtml(cons.reasoning)}</p>` : ''}
        </div>
      </div>
    `;
  }
  
  // Provenance Analysis
  if (results.provenance) {
    const prov = results.provenance;
    html += `
      <div class="jev-result-card">
        <h3 class="jev-result-title">Provenance</h3>
        <div class="jev-confidence ${getConfidenceClass(prov.confidence)}">
          Confidence: ${(prov.confidence * 100).toFixed(0)}%
        </div>
        <div class="jev-result-body">
          <p><strong>Strength:</strong> ${prov.strength || 'Unknown'}</p>
          ${prov.issues && prov.issues.length > 0 ? `
            <div class="jev-issues">
              <strong>Issues:</strong>
              <ul>
                ${prov.issues.map(i => `<li>${escapeHtml(i)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${prov.reasoning ? `<p class="jev-reasoning">${escapeHtml(prov.reasoning)}</p>` : ''}
        </div>
      </div>
    `;
  }
  
  // Load Risk Analysis
  if (results.load_risk) {
    const risk = results.load_risk;
    html += `
      <div class="jev-result-card">
        <h3 class="jev-result-title">Load Risk</h3>
        <div class="jev-confidence ${getConfidenceClass(risk.confidence)}">
          Confidence: ${(risk.confidence * 100).toFixed(0)}%
        </div>
        <div class="jev-result-body">
          <p><strong>Level:</strong> <span class="jev-risk-${risk.level}">${risk.level}</span></p>
          ${risk.factors && risk.factors.length > 0 ? `
            <div class="jev-factors">
              <strong>Factors:</strong>
              <ul>
                ${risk.factors.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${risk.reasoning ? `<p class="jev-reasoning">${escapeHtml(risk.reasoning)}</p>` : ''}
        </div>
      </div>
    `;
  }
  
  // Suggestions
  if (results.suggestions && results.suggestions.length > 0) {
    html += `
      <div class="jev-result-card jev-suggestions">
        <h3 class="jev-result-title">Suggestions</h3>
        <ul>
          ${results.suggestions.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  html += '</div>';
  
  content.innerHTML = html;
  container.classList.remove('hidden');
  
  // Scroll to results
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
  
  // Scroll to error
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
  document.getElementById('error').classList.add('hidden');
}

function getConfidenceClass(confidence) {
  if (confidence >= CONFIDENCE_THRESHOLD) return 'jev-confidence--high';
  if (confidence >= 0.5) return 'jev-confidence--medium';
  return 'jev-confidence--low';
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
  
  const { recordA, recordB } = getFormData();
  
  showLoading();
  
  try {
    const results = await compareRecords(recordA, recordB);
    state.lastResults = results;
    showResults(results);
  } catch (error) {
    console.error('Comparison failed:', error);
    showError(error.message || 'Failed to analyze records. Please check your connection and try again.');
  } finally {
    hideLoading();
  }
}

function handleReset() {
  if (state.loading) return;
  resetForm();
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
  // Set up event listeners
  document.getElementById('compare-form').addEventListener('submit', handleSubmit);
  document.getElementById('reset-btn').addEventListener('click', handleReset);
  
  // Theme
  initTheme();
}

// Export API for use in SovMemGrok
window.NousJev = {
  validateRecord,
  compareRecords,
  CONFIDENCE_THRESHOLD,
  API_BASE_URL
};

// Start app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
