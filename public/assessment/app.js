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
  const questionText = state.session.plainLanguage 
    ? (item.layman || item.q) 
    : item.q;
  
  document.getElementById('current-pillar').textContent = item.pillar;
  document.getElementById('question-text').textContent = questionText;
  document.getElementById('question-context').textContent = item.context || '';
  
  // Render options from bank (opts array with t/s structure)
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';
  
  if (item.opts && Array.isArray(item.opts)) {
    // Real bank format: opts array with {t, s}
    item.opts.forEach(opt => {
      const button = document.createElement('button');
      button.className = 'assessment-option';
      button.textContent = opt.t;
      button.dataset.score = opt.s;
      button.addEventListener('click', () => selectOptionByScore(opt.s));
      optionsContainer.appendChild(button);
    });
  } else {
    // Fallback: L0-L5 options (stub bank format)
    LEVELS.forEach(level => {
      const button = document.createElement('button');
      button.className = 'assessment-option';
      button.textContent = `${level}: ${LEVEL_NAMES[level]}`;
      button.dataset.level = level;
      button.addEventListener('click', () => selectOption(level));
      optionsContainer.appendChild(button);
    });
  }
  
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

function selectOptionByScore(score) {
  // Remove previous selection
  document.querySelectorAll('.assessment-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // Mark selected
  const selected = document.querySelector(`[data-score="${score}"]`);
  if (selected) {
    selected.classList.add('selected');
    state.session.currentResponse = score;
    document.getElementById('next-btn').disabled = false;
  }
}

function renderResults() {
  const summary = document.getElementById('results-summary');
  summary.innerHTML = '';
  
  // Show locked/unvalidated status
  if (state.results?.locked) {
    const lockedNotice = document.createElement('div');
    lockedNotice.className = 'assessment-result-locked';
    lockedNotice.innerHTML = `
      <p>✓ Result validated and locked</p>
      ${state.results.adjustedLevel ? '<p class="assessment-result-adjusted">Level adjusted based on validation</p>' : ''}
      ${state.validation?.localSaveOnly ? '<p class="assessment-result-local">Saved locally only</p>' : ''}
    `;
    summary.appendChild(lockedNotice);
  } else if (state.results?.unvalidated) {
    const unvalidatedNotice = document.createElement('div');
    unvalidatedNotice.className = 'assessment-result-unvalidated';
    unvalidatedNotice.innerHTML = `
      <p>⚠ Result unvalidated</p>
      <p class="assessment-result-local">Validation service unavailable. Results saved locally only.</p>
    `;
    summary.appendChild(unvalidatedNotice);
  }
  
  // Show overall level
  const overallLevel = Math.round(state.session.pillarLevels.reduce((a, b) => a + b, 0) / PILLARS.length);
  const overallItem = document.createElement('div');
  overallItem.className = 'assessment-result-overall';
  overallItem.innerHTML = `
    <h3>Overall Level: ${LEVELS[state.results?.overallLevel ?? overallLevel]}</h3>
    <p class="assessment-result-level-name">${LEVEL_NAMES[LEVELS[state.results?.overallLevel ?? overallLevel]]}</p>
  `;
  summary.appendChild(overallItem);
  
  // Find weakest pillar
  let weakestPillarIdx = 0;
  let weakestLevel = state.session.pillarLevels[0];
  PILLARS.forEach((pillar, idx) => {
    if (state.session.pillarLevels[idx] < weakestLevel) {
      weakestLevel = state.session.pillarLevels[idx];
      weakestPillarIdx = idx;
    }
  });
  
  const weakestPillar = PILLARS[weakestPillarIdx];
  const focusPillar = state.validation?.pillarFocus?.toLowerCase() || weakestPillar.toLowerCase();
  
  // Show recommended focus
  const focusItem = document.createElement('div');
  focusItem.className = 'assessment-result-focus';
  focusItem.innerHTML = `
    <h4>Recommended Next Practice Focus</h4>
    <p class="assessment-result-focus-pillar">⭐ ${focusPillar.charAt(0).toUpperCase() + focusPillar.slice(1)}</p>
    <p class="assessment-result-desc">Focus on strengthening this pillar to advance your overall capability.</p>
  `;
  summary.appendChild(focusItem);
  
  // Show pillar results
  PILLARS.forEach((pillar, idx) => {
    const level = Math.round(state.session.pillarLevels[idx]);
    const levelName = LEVELS[level] || 'L0';
    const confidence = calculateConfidence(idx);
    
    const isFocusPillar = focusPillar === pillar.toLowerCase();
    
    const item = document.createElement('div');
    item.className = `assessment-result-item ${isFocusPillar ? 'assessment-result-item--focus' : ''}`;
    item.innerHTML = `
      <div class="assessment-result-header">
        <span class="assessment-result-pillar">${pillar}${isFocusPillar ? ' ⭐' : ''}</span>
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
  if (!state.results || !state.results.locked) {
    state.results = {
      ...state.results,
      pillars: PILLARS.map((pillar, idx) => ({
        pillar: pillar,
        level: Math.round(state.session.pillarLevels[idx]),
        levelName: LEVELS[Math.round(state.session.pillarLevels[idx])],
        confidence: calculateConfidence(idx)
      })),
      overallLevel: overallLevel,
      timestamp: Date.now()
    };
  }
}

function calculateConfidence(pillarIdx) {
  // Simple confidence based on number of responses
  const responses = state.session.pillarCounts[pillarIdx];
  return Math.min(1.0, responses / ITEMS_PER_PILLAR);
}

function showUnvalidatedResults() {
  // Mark results as unvalidated
  state.results.unvalidated = true;
  state.results.locked = false;
  
  // Update display
  renderResults();
  
  // Auto-save locally
  const saveData = {
    results: state.results,
    validation: null,
    timestamp: Date.now(),
    unvalidated: true
  };
  
  localStorage.setItem('ssa-cmm-assessment', JSON.stringify(saveData));
  console.log('Results saved locally (unvalidated)');
}

// ═══════════════════════════════════════════════════════════════════
// JEV VALIDATION (SSA-CMM Battery)
// ═══════════════════════════════════════════════════════════════════

async function validateWithJev(results, sessionState) {
  try {
    // Build AssessmentState for Jev battery
    const pillarScores = {};
    let weakestScore = Infinity;
    let strongestScore = -Infinity;
    let weakestPillar = 'agency';
    let strongestPillar = 'agency';
    
    results.pillars.forEach(p => {
      const pillarKey = p.pillar.toLowerCase();
      const score = p.level + (p.confidence - 0.5); // Adjust score by confidence
      pillarScores[pillarKey] = score;
      
      if (score < weakestScore) {
        weakestScore = score;
        weakestPillar = pillarKey;
      }
      if (score > strongestScore) {
        strongestScore = score;
        strongestPillar = pillarKey;
      }
    });
    
    // Build band trajectory (simplified: show level range)
    const levels = results.pillars.map(p => p.level);
    const minLevel = Math.min(...levels);
    const maxLevel = Math.max(...levels);
    const bandTrajectory = minLevel === maxLevel 
      ? `L${minLevel}` 
      : `L${minLevel}-L${maxLevel}`;
    
    const assessmentState = {
      claimed_level: results.overallLevel,
      pillar_scores: pillarScores,
      weakest_pillar: weakestPillar,
      strongest_pillar: strongestPillar,
      items_answered: sessionState.responses.filter(r => !r.skipped).length,
      items_skipped: sessionState.responses.filter(r => r.skipped).length,
      band_trajectory: bandTrajectory,
      session_notes: `Session completed at ${new Date().toISOString()}`
    };
    
    // Use same-origin /api/jev proxy only (never call TypeSafe directly from browser)
    const payload = {
      state: assessmentState,
      battery: 'ssa-cmm-v1',
      questions: [
        'level_read',
        'level_confidence_band',
        'pillar_focus',
        'review_status',
        'judgment_ready'
      ]
    };
    
    const response = await fetch('/api/jev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    result._assessmentState = assessmentState; // Attach for gate logic
    return result;
  } catch (error) {
    console.error('Jev validation failed:', error);
    return null;
  }
}

function showJevValidationModal(validation, results) {
  if (!validation || !validation.answers) {
    console.error('Invalid validation response');
    // Soft-fail: show unvalidated results
    showUnvalidatedResults();
    return;
  }
  
  const modal = document.getElementById('jev-modal');
  const content = document.getElementById('jev-modal-content');
  const answers = validation.answers;
  const assessmentState = validation._assessmentState;
  
  // Gate logic: check ALL relevant confidence thresholds and review_status
  const reviewStatus = answers.review_status;
  const levelRead = answers.level_read;
  const confidenceBand = answers.level_confidence_band;
  const pillarFocus = answers.pillar_focus;
  const judgmentReady = answers.judgment_ready;
  
  // Check gate conditions per spec
  const needsRevision = 
    reviewStatus?.choice === 'needs_revision' || 
    reviewStatus?.choice === 'escalate' ||
    (reviewStatus?.confidence !== undefined && reviewStatus.confidence < JEV_CONFIDENCE_THRESHOLD) ||
    (levelRead?.confidence !== undefined && levelRead.confidence < JEV_CONFIDENCE_THRESHOLD) ||
    (confidenceBand?.confidence !== undefined && confidenceBand.confidence < JEV_CONFIDENCE_THRESHOLD);
  
  const levelAdjustmentNeeded = levelRead?.choice === 'over' || levelRead?.choice === 'under';
  const localSaveOnly = judgmentReady?.noul === 0;
  
  let html = '<h3>Assessment Validation</h3>';
  html += '<div class="jev-modal-results">';
  
  if (needsRevision) {
    html += '<div class="jev-modal-warning">⚠ Validation suggests review before finalizing</div>';
  }
  
  // Review Status
  if (reviewStatus) {
    const conf = reviewStatus.confidence ?? 0;
    html += `
      <div class="jev-modal-item">
        <div class="jev-modal-label">Review Status</div>
        <div class="jev-confidence ${conf >= JEV_CONFIDENCE_THRESHOLD ? 'jev-confidence--high' : 'jev-confidence--low'}">
          ${(conf * 100).toFixed(0)}% confidence
        </div>
        <p>Status: <strong>${reviewStatus.choice}</strong></p>
        ${reviewStatus.reasoning ? `<p class="jev-reasoning">${escapeHtml(reviewStatus.reasoning)}</p>` : ''}
      </div>
    `;
  }
  
  // Level Read
  if (levelRead) {
    const conf = levelRead.confidence ?? 0;
    let suggestion = '';
    if (levelRead.choice === 'over' && conf >= JEV_CONFIDENCE_THRESHOLD) {
      const newLevel = Math.max(0, results.overallLevel - 1);
      suggestion = `<p><strong>Suggestion:</strong> Consider ${LEVELS[newLevel]} (${LEVEL_NAMES[LEVELS[newLevel]]})</p>`;
    } else if (levelRead.choice === 'under' && conf >= JEV_CONFIDENCE_THRESHOLD) {
      const newLevel = Math.min(5, results.overallLevel + 1);
      suggestion = `<p><strong>Suggestion:</strong> Consider ${LEVELS[newLevel]} (${LEVEL_NAMES[LEVELS[newLevel]]})</p>`;
    }
    
    html += `
      <div class="jev-modal-item">
        <div class="jev-modal-label">Level Assessment</div>
        <div class="jev-confidence ${conf >= JEV_CONFIDENCE_THRESHOLD ? 'jev-confidence--high' : 'jev-confidence--low'}">
          ${(conf * 100).toFixed(0)}% confidence
        </div>
        <p>Your claimed level appears: <strong>${levelRead.choice}</strong></p>
        ${suggestion}
        ${levelRead.reasoning ? `<p class="jev-reasoning">${escapeHtml(levelRead.reasoning)}</p>` : ''}
      </div>
    `;
  }
  
  // Confidence Band
  if (confidenceBand) {
    const conf = confidenceBand.confidence ?? 0;
    html += `
      <div class="jev-modal-item">
        <div class="jev-modal-label">Confidence Band</div>
        <div class="jev-confidence ${conf >= JEV_CONFIDENCE_THRESHOLD ? 'jev-confidence--high' : 'jev-confidence--low'}">
          ${(conf * 100).toFixed(0)}% confidence
        </div>
        <p>Assessment confidence: <strong>${confidenceBand.score ?? confidenceBand.choice}</strong></p>
        ${confidenceBand.reasoning ? `<p class="jev-reasoning">${escapeHtml(confidenceBand.reasoning)}</p>` : ''}
      </div>
    `;
  }
  
  // Pillar Focus
  if (pillarFocus) {
    const conf = pillarFocus.confidence ?? 0;
    const focusPillar = pillarFocus.choice;
    html += `
      <div class="jev-modal-item">
        <div class="jev-modal-label">Recommended Focus</div>
        <div class="jev-confidence ${conf >= JEV_CONFIDENCE_THRESHOLD ? 'jev-confidence--high' : 'jev-confidence--low'}">
          ${(conf * 100).toFixed(0)}% confidence
        </div>
        <p>Priority pillar: <strong>${focusPillar.charAt(0).toUpperCase() + focusPillar.slice(1)}</strong></p>
        ${pillarFocus.reasoning ? `<p class="jev-reasoning">${escapeHtml(pillarFocus.reasoning)}</p>` : ''}
      </div>
    `;
  }
  
  // Judgment Ready (local save notice)
  if (localSaveOnly) {
    html += `
      <div class="jev-modal-item">
        <div class="jev-modal-label">Save Mode</div>
        <p>⚠ Results will be saved <strong>locally only</strong> (no remote write-back)</p>
      </div>
    `;
  }
  
  html += '</div>';
  html += '<div class="jev-modal-actions">';
  
  if (needsRevision) {
    html += '<button class="btn btn--ghost" onclick="window.assessment.closeJevModal()">Review Responses</button>';
    html += '<button class="btn btn--accent" onclick="window.assessment.lockResult()">Accept Result</button>';
  } else if (levelAdjustmentNeeded && (levelRead?.confidence ?? 0) >= JEV_CONFIDENCE_THRESHOLD) {
    const newLevel = levelRead.choice === 'over' 
      ? Math.max(0, results.overallLevel - 1)
      : Math.min(5, results.overallLevel + 1);
    html += '<button class="btn btn--ghost" onclick="window.assessment.lockResult()">Keep Current Level</button>';
    html += `<button class="btn btn--accent" onclick="window.assessment.lockResult(${newLevel})">Adjust to ${LEVELS[newLevel]}</button>`;
  } else {
    html += '<button class="btn btn--accent" onclick="window.assessment.lockResult()">Continue</button>';
  }
  
  html += '</div>';
  
  content.innerHTML = html;
  modal.classList.remove('hidden');
  
  // Store validation result for lockResult
  state.validation = {
    answers: answers,
    localSaveOnly: localSaveOnly,
    suggestedLevel: levelAdjustmentNeeded && (levelRead?.confidence ?? 0) >= JEV_CONFIDENCE_THRESHOLD
      ? (levelRead.choice === 'over' ? results.overallLevel - 1 : results.overallLevel + 1)
      : null,
    pillarFocus: pillarFocus?.choice
  };
}

function closeJevModal() {
  const modal = document.getElementById('jev-modal');
  modal.classList.add('hidden');
}

function lockResult(adjustedLevel) {
  // Close modal
  closeJevModal();
  
  // Apply level adjustment if provided
  if (typeof adjustedLevel === 'number') {
    state.results.overallLevel = adjustedLevel;
    state.results.adjustedLevel = true;
  }
  
  // Mark as locked
  state.results.locked = true;
  state.results.lockedAt = Date.now();
  
  // Save to localStorage
  const saveData = {
    results: state.results,
    validation: state.validation,
    timestamp: Date.now()
  };
  
  // Check if local-save-only mode
  if (state.validation?.localSaveOnly) {
    console.log('Local save only (judgment not ready)');
    localStorage.setItem('ssa-cmm-assessment', JSON.stringify(saveData));
  } else {
    // Full save (could add SovMem write-back here if integrated)
    localStorage.setItem('ssa-cmm-assessment', JSON.stringify(saveData));
    console.log('Result locked and saved');
  }
  
  // Update results display
  renderResults();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ═══════════════════════════════════════════════════════════════════
// SESSION CONTROL
// ═══════════════════════════════════════════════════════════════════

// Capture the assessment start function in a const at module top level
// This prevents race conditions with shared.js's startQuickAssessment
const startAssessmentHandler = async function() {
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
};

// Export for compatibility
async function startAssessment() {
  return startAssessmentHandler();
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
  const selectedResponse = state.session.currentResponse;
  
  if (selectedResponse === null || selectedResponse === undefined) {
    return;
  }
  
  const item = state.session.currentItem;
  const pillarIdx = state.session.currentPillar;
  
  // Determine score and level from response
  let score, selectedLevel;
  if (typeof selectedResponse === 'number') {
    // Real bank: numeric score (0-5+)
    score = selectedResponse;
    // Map score to level (0→L0, 1→L1, 2-3→L2, 4→L3, 5→L4, 6+→L5)
    selectedLevel = LEVELS[Math.min(5, Math.floor(score))];
  } else {
    // Stub bank: level string (L0-L5)
    selectedLevel = selectedResponse;
    score = scoreResponse(item, selectedLevel);
  }
  
  // Record response
  state.session.responses.push({
    itemId: item.id,
    pillar: item.pillar,
    level: item.level || LEVELS[item.band],
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
  
  // Validate with Jev (pass sessionState for battery)
  const validation = await validateWithJev(state.results, state.session);
  if (validation) {
    showJevValidationModal(validation, state.results);
  } else {
    // Soft-fail path: show unvalidated results, allow local save
    showUnvalidatedResults();
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
      ? (state.session.currentItem.layman || state.session.currentItem.q)
      : state.session.currentItem.q;
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

document.addEventListener('DOMContentLoaded', () => {
  // Bind click listeners FIRST before any async operations
  // This prevents race conditions with shared.js
  document.getElementById('start-btn').addEventListener('click', startAssessmentHandler);
  document.getElementById('skip-btn').addEventListener('click', skipQuestion);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('language-toggle').addEventListener('click', toggleLanguage);
  document.getElementById('restart-btn').addEventListener('click', restartAssessment);
  document.getElementById('export-btn').addEventListener('click', exportResults);
  
  // Expose functions for modal
  window.assessment = {
    closeJevModal: closeJevModal,
    lockResult: lockResult
  };
  
  // Export global for potential external calls
  window.startAssessment = startAssessmentHandler;
  
  // Load bank asynchronously (doesn't block listener registration)
  loadBank().then(bank => {
    state.bank = bank;
  }).catch(err => {
    console.error('Failed to preload bank:', err);
  });
});
