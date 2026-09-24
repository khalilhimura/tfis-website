/**
 * SSA-CMM Field Manual Nº 01 · Self-Assessment
 * Adaptive staircase delivery across 5 pillars
 */

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════

const PILLARS = ['Agency', 'Clarity', 'Competence', 'Accountability', 'Security'];
const LEVELS = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'];
const LEVEL_NAMES = {
  'L0': 'Task Operator',
  'L1': 'AI-Assisted Operator',
  'L2': 'Workflow Orchestrator',
  'L3': 'Agent Supervisor',
  'L4': 'Multi-Agent Architect',
  'L5': 'Sovereign Architect'
};
const ITEMS_PER_PILLAR = 3;
const TOTAL_ITEMS = PILLARS.length * ITEMS_PER_PILLAR;
const JEV_API_BASE = 'https://nous-jev.khalil-himura.workers.dev';
const JEV_CONFIDENCE_THRESHOLD = 0.75;

// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════

let state = {
  bank: null,
  session: {
    started: false,
    itemIndex: 0,
    currentPillar: 0,
    pillarCounts: [0, 0, 0, 0, 0],
    responses: [],
    plainLanguage: true,
    pillarLevels: [2.5, 2.5, 2.5, 2.5, 2.5], // Start at L2.5 for each pillar
  },
  results: null
};

// ═══════════════════════════════════════════════════════════════════
// BANK LOADING
// ═══════════════════════════════════════════════════════════════════

async function loadBank() {
  try {
    const response = await fetch('bank.json');
    if (!response.ok) {
      console.warn('bank.json not found, using stub bank');
      return createStubBank();
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Failed to load bank.json, using stub bank:', error);
    return createStubBank();
  }
}

function createStubBank() {
  // Stub bank with minimal items for demonstration
  // Each pillar needs items at each level (L0-L5)
  const items = [];
  let id = 1;
  
  PILLARS.forEach((pillar, pillarIdx) => {
    LEVELS.forEach((level, levelIdx) => {
      // Create 2 variants per pillar-level combination for demonstration
      for (let variant = 0; variant < 2; variant++) {
        items.push({
          id: `${pillar.toLowerCase()}-${level.toLowerCase()}-${variant + 1}`,
          pillar: pillar,
          level: level,
          band: levelIdx,
          technical: `${pillar} ${level} technical question ${variant + 1}: [Technical phrasing would describe capability at this level]`,
          plain: `${pillar} ${level} plain language question ${variant + 1}: [Plain phrasing would describe practice at this level]`,
          context: `Context for ${pillar} at ${level}: Evaluates ${pillar.toLowerCase()} capability`,
          scoring: {
            'L0': variant === 0 ? 1 : 0,
            'L1': variant === 0 ? 2 : 1,
            'L2': variant === 0 ? 3 : 2,
            'L3': variant === 0 ? 4 : 3,
            'L4': variant === 0 ? 5 : 4,
            'L5': variant === 0 ? 6 : 5
          }
        });
      }
    });
  });
  
  return {
    version: '0.1-stub',
    note: 'This is a stub bank for demonstration. The full 500-item bank is needed for production.',
    items: items
  };
}

// ═══════════════════════════════════════════════════════════════════
// STAIRCASE ENGINE
// ═══════════════════════════════════════════════════════════════════

function getNextItem() {
  const pillarIdx = state.session.currentPillar;
  const pillarName = PILLARS[pillarIdx];
  const currentLevel = state.session.pillarLevels[pillarIdx];
  
  // Find the closest band to current level estimate
  const targetBand = Math.round(Math.max(0, Math.min(5, currentLevel)));
  
  // Get available items for this pillar and band
  const availableItems = state.bank.items.filter(item => 
    item.pillar === pillarName && 
    item.band === targetBand &&
    !state.session.responses.some(r => r.itemId === item.id)
  );
  
  // If no items at exact band, try adjacent bands
  if (availableItems.length === 0) {
    const adjacentBands = [targetBand - 1, targetBand + 1]
      .filter(b => b >= 0 && b <= 5);
    
    for (const band of adjacentBands) {
      const items = state.bank.items.filter(item => 
        item.pillar === pillarName && 
        item.band === band &&
        !state.session.responses.some(r => r.itemId === item.id)
      );
      if (items.length > 0) {
        return items[Math.floor(Math.random() * items.length)];
      }
    }
  }
  
  // Return random item from available
  if (availableItems.length > 0) {
    return availableItems[Math.floor(Math.random() * availableItems.length)];
  }
  
  // Fallback: any unused item from this pillar
  const fallback = state.bank.items.filter(item => 
    item.pillar === pillarName &&
    !state.session.responses.some(r => r.itemId === item.id)
  );
  
  return fallback.length > 0 ? fallback[0] : null;
}

function updateLevelEstimate(pillarIdx, selectedLevel) {
  // Simple Bayesian update: move estimate toward observed response
  const current = state.session.pillarLevels[pillarIdx];
  const target = LEVELS.indexOf(selectedLevel);
  const stepSize = 0.5; // Adjust estimate by half the difference
  
  state.session.pillarLevels[pillarIdx] = current + (target - current) * stepSize;
}

function scoreResponse(item, selectedLevel) {
  // Get the score for the selected level from the item's scoring table
  return item.scoring[selectedLevel] || 0;
}

// ═══════════════════════════════════════════════════════════════════
// UI RENDERING
// ═══════════════════════════════════════════════════════════════════

function showScreen(screenId) {
  document.querySelectorAll('.assessment-screen').forEach(screen => {
    screen.classList.add('hidden');
  });
  document.getElementById(screenId).classList.remove('hidden');
}

function renderQuestion(item) {
  const questionText = state.session.plainLanguage ? item.plain : item.technical;
  
  document.getElementById('current-pillar').textContent = item.pillar;
  document.getElementById('question-text').textContent = questionText;
  document.getElementById('question-context').textContent = item.context || '';
  
  // Render options (L0-L5)
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';
  
  LEVELS.forEach(level => {
    const button = document.createElement('button');
    button.className = 'assessment-option';
    button.textContent = `${level}: ${LEVEL_NAMES[level]}`;
    button.dataset.level = level;
    button.addEventListener('click', () => selectOption(level));
    optionsContainer.appendChild(button);
  });
  
  // Update progress
  const progress = ((state.session.itemIndex + 1) / TOTAL_ITEMS) * 100;
  document.getElementById('progress-fill').style.width = `${progress}%`;
  document.getElementById('progress-current').textContent = state.session.itemIndex + 1;
  document.getElementById('progress-total').textContent = TOTAL_ITEMS;
  
  // Reset next button
  document.getElementById('next-btn').disabled = true;
}

function selectOption(level) {
  // Remove previous selection
  document.querySelectorAll('.assessment-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // Mark selected
  const selected = document.querySelector(`[data-level="${level}"]`);
  if (selected) {
    selected.classList.add('selected');
    state.session.currentResponse = level;
    document.getElementById('next-btn').disabled = false;
  }
}

function renderResults() {
  const summary = document.getElementById('results-summary');
  summary.innerHTML = '';
  
  PILLARS.forEach((pillar, idx) => {
    const level = Math.round(state.session.pillarLevels[idx]);
    const levelName = LEVELS[level] || 'L0';
    const confidence = calculateConfidence(idx);
    
    const item = document.createElement('div');
    item.className = 'assessment-result-item';
    item.innerHTML = `
      <div class="assessment-result-header">
        <span class="assessment-result-pillar">${pillar}</span>
        <span class="assessment-result-level">${levelName}: ${LEVEL_NAMES[levelName]}</span>
      </div>
      <p class="assessment-result-desc">
        Your ${pillar.toLowerCase()} capability aligns with ${LEVEL_NAMES[levelName]} practices.
      </p>
      <div class="assessment-result-confidence">
        Confidence: ${(confidence * 100).toFixed(0)}%
      </div>
    `;
    summary.appendChild(item);
  });
  
  // Store results
  state.results = {
    pillars: PILLARS.map((pillar, idx) => ({
      pillar: pillar,
      level: Math.round(state.session.pillarLevels[idx]),
      levelName: LEVELS[Math.round(state.session.pillarLevels[idx])],
      confidence: calculateConfidence(idx)
    })),
    overallLevel: Math.round(state.session.pillarLevels.reduce((a, b) => a + b, 0) / PILLARS.length),
    timestamp: Date.now()
  };
}

function calculateConfidence(pillarIdx) {
  // Simple confidence based on number of responses
  const responses = state.session.pillarCounts[pillarIdx];
  return Math.min(1.0, responses / ITEMS_PER_PILLAR);
}

// ═══════════════════════════════════════════════════════════════════
// JEV VALIDATION
// ═══════════════════════════════════════════════════════════════════

async function validateWithJev(results) {
  try {
    const payload = {
      title: 'SSA-CMM Assessment Results',
      body: `Completed SSA-CMM self-assessment with results across 5 pillars:\n${
        results.pillars.map(p => `- ${p.pillar}: ${p.levelName} (confidence: ${(p.confidence * 100).toFixed(0)}%)`).join('\n')
      }\nOverall level: ${LEVELS[results.overallLevel]}`,
      declared_type: 'assessment_result',
      stop_rule: null,
      provenance: 'SSA-CMM Field Manual Nº 01 Self-Assessment'
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
    return null;
  }
}

function showJevValidationModal(validation) {
  if (!validation || !validation.answers) {
    console.error('Invalid validation response');
    return;
  }
  
  const modal = document.getElementById('jev-modal');
  const content = document.getElementById('jev-modal-content');
  const answers = validation.answers;
  
  let html = '<h3>Assessment Validation</h3>';
  html += '<div class="jev-modal-results">';
  
  // Check for low confidence
  const hasLowConfidence = state.results.pillars.some(p => p.confidence < JEV_CONFIDENCE_THRESHOLD);
  
  if (hasLowConfidence) {
    html += '<div class="jev-modal-warning">⚠ Some pillar assessments have lower confidence. Consider reviewing responses in those areas.</div>';
  }
  
  // Show validation feedback
  if (answers.review_status) {
    const conf = answers.review_status.confidence;
    const status = answers.review_status.choice;
    html += `
      <div class="jev-modal-item">
        <div class="jev-modal-label">Assessment Quality</div>
        <div class="jev-confidence ${conf >= JEV_CONFIDENCE_THRESHOLD ? 'jev-confidence--high' : 'jev-confidence--low'}">
          ${(conf * 100).toFixed(0)}% confidence
        </div>
        <p>Status: <strong>${status}</strong></p>
        ${answers.review_status.reasoning ? `<p class="jev-reasoning">${escapeHtml(answers.review_status.reasoning)}</p>` : ''}
      </div>
    `;
  }
  
  html += '</div>';
  html += '<div class="jev-modal-actions">';
  html += '<button class="btn btn--accent" onclick="window.assessment.closeJevModal()">Continue</button>';
  html += '</div>';
  
  content.innerHTML = html;
  modal.classList.remove('hidden');
}

function closeJevModal() {
  const modal = document.getElementById('jev-modal');
  modal.classList.add('hidden');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ═══════════════════════════════════════════════════════════════════
// SESSION CONTROL
// ═══════════════════════════════════════════════════════════════════

async function startAssessment() {
  if (!state.bank) {
    state.bank = await loadBank();
  }
  
  state.session = {
    started: true,
    itemIndex: 0,
    currentPillar: 0,
    pillarCounts: [0, 0, 0, 0, 0],
    responses: [],
    plainLanguage: true,
    pillarLevels: [2.5, 2.5, 2.5, 2.5, 2.5],
    currentResponse: null
  };
  
  showScreen('question-screen');
  showNextQuestion();
}

function showNextQuestion() {
  if (state.session.itemIndex >= TOTAL_ITEMS) {
    finishAssessment();
    return;
  }
  
  // Determine next pillar (round-robin with 3 items per pillar)
  state.session.currentPillar = Math.floor(state.session.itemIndex / ITEMS_PER_PILLAR) % PILLARS.length;
  
  // Get next item using staircase
  const item = getNextItem();
  
  if (!item) {
    console.error('No item available');
    finishAssessment();
    return;
  }
  
  state.session.currentItem = item;
  renderQuestion(item);
}

function skipQuestion() {
  // Record skip
  state.session.responses.push({
    itemId: state.session.currentItem.id,
    pillar: state.session.currentItem.pillar,
    skipped: true,
    timestamp: Date.now()
  });
  
  state.session.itemIndex++;
  state.session.pillarCounts[state.session.currentPillar]++;
  state.session.currentResponse = null;
  
  showNextQuestion();
}

function nextQuestion() {
  const selectedLevel = state.session.currentResponse;
  
  if (!selectedLevel) {
    return;
  }
  
  const item = state.session.currentItem;
  const pillarIdx = state.session.currentPillar;
  const score = scoreResponse(item, selectedLevel);
  
  // Record response
  state.session.responses.push({
    itemId: item.id,
    pillar: item.pillar,
    level: item.level,
    selectedLevel: selectedLevel,
    score: score,
    skipped: false,
    timestamp: Date.now()
  });
  
  // Update level estimate
  updateLevelEstimate(pillarIdx, selectedLevel);
  
  state.session.itemIndex++;
  state.session.pillarCounts[pillarIdx]++;
  state.session.currentResponse = null;
  
  showNextQuestion();
}

async function finishAssessment() {
  renderResults();
  showScreen('results-screen');
  
  // Validate with Jev
  const validation = await validateWithJev(state.results);
  if (validation) {
    showJevValidationModal(validation);
  }
}

function restartAssessment() {
  state.session = {
    started: false,
    itemIndex: 0,
    currentPillar: 0,
    pillarCounts: [0, 0, 0, 0, 0],
    responses: [],
    plainLanguage: true,
    pillarLevels: [2.5, 2.5, 2.5, 2.5, 2.5],
  };
  state.results = null;
  showScreen('intro-screen');
}

function toggleLanguage() {
  state.session.plainLanguage = !state.session.plainLanguage;
  const modeLabel = document.getElementById('language-mode');
  modeLabel.textContent = state.session.plainLanguage ? 'Plain Language' : 'Technical';
  
  // Re-render current question with new language mode
  if (state.session.currentItem) {
    const questionText = state.session.plainLanguage 
      ? state.session.currentItem.plain 
      : state.session.currentItem.technical;
    document.getElementById('question-text').textContent = questionText;
  }
}

function exportResults() {
  if (!state.results) return;
  
  const data = {
    version: '1.0',
    assessment: 'SSA-CMM Field Manual Nº 01',
    timestamp: new Date(state.results.timestamp).toISOString(),
    results: state.results,
    session: {
      totalItems: TOTAL_ITEMS,
      completed: state.session.responses.length,
      skipped: state.session.responses.filter(r => r.skipped).length
    }
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ssa-cmm-assessment-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
  // Load bank
  state.bank = await loadBank();
  
  // Event listeners
  document.getElementById('start-btn').addEventListener('click', startAssessment);
  document.getElementById('skip-btn').addEventListener('click', skipQuestion);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('language-toggle').addEventListener('click', toggleLanguage);
  document.getElementById('restart-btn').addEventListener('click', restartAssessment);
  document.getElementById('export-btn').addEventListener('click', exportResults);
  
  // Expose functions for modal
  window.assessment = {
    closeJevModal: closeJevModal
  };
});
