/* ═══════════════════════════════════════════════════════════════════
   TFIS · Shared JavaScript
   Reusable across all pages — nav, scroll effects, assessment, toggles
   ═══════════════════════════════════════════════════════════════════ */

// ─── Nav scroll effect ───
export function initNavScroll() {
  const nav = document.getElementById('topNav');
  if (!nav) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ─── Mobile nav ───
export function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const overlay = document.getElementById('navOverlay');
  if (!toggle || !overlay) return;
  toggle.addEventListener('click', () => overlay.classList.toggle('open'));
  window.closeNav = () => overlay.classList.remove('open');
}

// ─── Scroll to section ───
export function initScrollTo() {
  window.scrollToSection = function(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
    if (window.closeNav) window.closeNav();
  };
}

// ─── Fade-in observer ───
export function initFadeIn() {
  const faders = document.querySelectorAll('.fade-in');
  if (!faders.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold:0.1 });
  faders.forEach(f => observer.observe(f));
}

// ─── Architecture reveal toggle ───
export function initArchToggle() {
  window.toggleArch = function() {
    const el = document.getElementById('archReveal');
    const btn = document.getElementById('archToggle');
    if (!el || !btn) return;
    const open = el.classList.toggle('open');
    btn.textContent = open ? '− How It Works (Architecture)' : '+ How It Works (Architecture)';
  };
}

// ─── Philosopher toggle ───
export function initPhilToggle() {
  window.togglePhilosophers = function() {
    const el = document.getElementById('philAll');
    const btn = document.getElementById('philToggle');
    if (!el || !btn) return;
    const open = el.classList.toggle('show');
    btn.textContent = open ? 'Show fewer philosophers −' : 'Show all 50 philosophers →';
  };
}

// ─── SSA Ladder + Self-Assessment ───
export function initAssessment() {
  const LEVEL_NAMES = [
    'Task Operator','AI-Assisted Operator','Workflow Orchestrator',
    'Agent Supervisor','Multi-Agent Architect','Sovereign Architect'
  ];
  const LEVEL_DESCS = [
    'Manual performance. Output tied strictly to hours.',
    'Uses AI tools. Still the primary worker, just faster.',
    'Builds semi-automated, repeatable workflows.',
    'Supervises multiple agents with memory. Judgment is exercised daily — and spent, not stored.',
    'Designs autonomous multi-agent systems. Closed feedback loops with verified write-back.',
    'Owns fully autonomous cognitive infrastructure. The system compounds without you.'
  ];
  const QUESTIONS = [
    { q:'How do you handle a task that repeats for the third time this month?',
      opts:[
        {t:'I do it by hand again.', s:0},
        {t:'I have a saved template or prompt that speeds it up.', s:1},
        {t:'An agent does it; I review each run.', s:3},
        {t:'A loop runs it, verifies its own output, and only escalates exceptions.', s:5}
      ]},
    { q:'If you disappeared for two weeks, how much of your output would continue?',
      opts:[
        {t:'None. Everything routes through me, live.', s:0},
        {t:'Scheduled posts and canned automations only.', s:1},
        {t:'Agents continue routine production; queues wait for my review.', s:3},
        {t:'Production, verification, and memory updates continue without me.', s:5}
      ]},
    { q:'Your primary AI provider triples prices or shuts down. What breaks?',
      opts:[
        {t:'Essentially everything.', s:0},
        {t:'I would lose history but could restart.', s:1},
        {t:'I could switch within days with some data loss.', s:3},
        {t:'Memory and workflows are portable; migration is execution.', s:5}
      ]},
    { q:'How do you define success before handing work to an AI?',
      opts:[
        {t:'I describe the task and hope.', s:0},
        {t:'I give examples of what good looks like.', s:1},
        {t:'I give explicit acceptance criteria.', s:3},
        {t:'Criteria live as versioned specs or evals the output is tested against.', s:5}
      ]},
    { q:'An agent hands you work. You judge it. Then what happens to that judgment?',
      opts:[
        {t:'I fix the output and move on.', s:0},
        {t:'I keep loose notes on recurring fixes.', s:1},
        {t:'Corrections get folded into prompts manually.', s:3},
        {t:'Every verdict is captured — accept / reject / rewrite, with reason — written back to durable memory.', s:5}
      ]}
  ];

  let qIdx = 0, answers = [], assessStarted = false;

  window.selectLevel = function(level) {
    const items = document.querySelectorAll('#ssaLadder li');
    items.forEach(li => li.classList.remove('active'));
    const el = document.querySelector(`#ssaLadder li[data-level="${level}"]`);
    if (el) { el.classList.add('active'); showResultForLevel(level); }
  };

  window.startAssessment = function() {
    if (assessStarted) return;
    assessStarted = true; answers = []; qIdx = 0;
    const intro = document.querySelector('.assess-intro');
    const retake = document.getElementById('retakeAssess');
    const result = document.getElementById('assessResult');
    if (intro) intro.style.display = 'none';
    if (retake) retake.style.display = 'none';
    if (result) result.classList.remove('show');
    renderQuestion();
  };

  function renderQuestion() {
    const container = document.getElementById('assessQuestions');
    if (!container) return;
    container.classList.add('active');
    const q = QUESTIONS[qIdx];
    const optsHTML = q.opts.map((o,i) =>
      `<button class="assess-opt" data-idx="${i}" onclick="selectOpt(this,${i})">
        <span class="ring"></span><span>${o.t}</span>
      </button>`
    ).join('');
    container.innerHTML = `
      <div class="assess-q-inner">
        <p style="font-family:var(--mono);font-weight:var(--w-label);font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--g400);margin-bottom:14px">
          Question ${qIdx+1} of ${QUESTIONS.length}
        </p>
        <p class="assess-q-text">${q.q}</p>
        <div class="assess-opts">${optsHTML}</div>
        <div class="assess-nav">
          <button ${qIdx===0?'style=visibility:hidden':''} onclick="prevQuestion()">← Back</button>
          <button onclick="nextQuestion()" style="color:var(--g400);border-color:var(--g200)">Skip</button>
        </div>
      </div>`;
  }

  window.selectOpt = function(el, idx) {
    const parent = el.closest('.assess-q-inner');
    if (parent) parent.querySelectorAll('.assess-opt').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    answers[qIdx] = QUESTIONS[qIdx].opts[idx].s;
    setTimeout(() => nextQuestion(), 300);
  };

  window.nextQuestion = function() {
    if (qIdx < QUESTIONS.length - 1) { qIdx++; renderQuestion(); }
    else finishAssessment();
  };

  window.prevQuestion = function() {
    if (qIdx > 0) { qIdx--; renderQuestion(); }
  };

  function finishAssessment() {
    const container = document.getElementById('assessQuestions');
    if (container) container.classList.remove('active');
    const scored = answers.filter(a => typeof a === 'number');
    if (scored.length === 0) { showGenericCTA(); return; }
    const avg = scored.reduce((s,x) => s+x, 0) / scored.length;
    let level;
    if (avg < 0.5) level = 0;
    else if (avg < 1.5) level = 1;
    else if (avg < 2.5) level = 2;
    else if (avg < 3.5) level = 3;
    else if (avg < 4.5) level = 4;
    else level = 5;
    showResultForLevel(level);
    const retake = document.getElementById('retakeAssess');
    if (retake) retake.style.display = 'inline';
  }

  function showResultForLevel(level) {
    const result = document.getElementById('assessResult');
    if (!result) return;
    result.classList.add('show');
    const lvl = document.getElementById('resultLevel');
    const name = document.getElementById('resultName');
    const desc = document.getElementById('resultDesc');
    const cards = document.getElementById('ctaCards');
    if (lvl) lvl.textContent = 'L' + level;
    if (name) name.textContent = LEVEL_NAMES[level];
    if (desc) desc.textContent = LEVEL_DESCS[level];
    if (cards) {
      cards.classList.add('show');
      const foundation = document.getElementById('ctaFoundation');
      const architect = document.getElementById('ctaArchitect');
      if (level <= 1) {
        if (foundation) foundation.style.display = 'flex';
        if (architect) architect.style.display = 'none';
        cards.style.gridTemplateColumns = '1fr';
      } else {
        if (foundation) foundation.style.display = 'none';
        if (architect) architect.style.display = 'flex';
        cards.style.gridTemplateColumns = '1fr';
      }
    }
    result.scrollIntoView({ behavior:'smooth', block:'center' });
  }

  function showGenericCTA() {
    const result = document.getElementById('assessResult');
    if (!result) return;
    result.classList.add('show');
    const lvl = document.getElementById('resultLevel');
    const name = document.getElementById('resultName');
    const desc = document.getElementById('resultDesc');
    if (lvl) lvl.textContent = '—';
    if (name) name.textContent = 'Not sure?';
    if (desc) desc.textContent = 'Every journey starts somewhere. Whether you\'re new to AI or already orchestrating agents, TFIS has a path for you.';
    const cards = document.getElementById('ctaCards');
    if (cards) {
      cards.classList.add('show');
      const foundation = document.getElementById('ctaFoundation');
      const architect = document.getElementById('ctaArchitect');
      if (foundation) foundation.style.display = 'flex';
      if (architect) architect.style.display = 'flex';
      cards.style.gridTemplateColumns = '1fr 1fr';
    }
    const retake = document.getElementById('retakeAssess');
    if (retake) retake.style.display = 'inline';
  }

  window.resetAssessment = function() {
    assessStarted = false; answers = []; qIdx = 0;
    const result = document.getElementById('assessResult');
    const cards = document.getElementById('ctaCards');
    const intro = document.querySelector('.assess-intro');
    const retake = document.getElementById('retakeAssess');
    const container = document.getElementById('assessQuestions');
    if (result) result.classList.remove('show');
    if (cards) cards.classList.remove('show');
    if (intro) intro.style.display = 'block';
    if (retake) retake.style.display = 'none';
    if (container) container.classList.remove('active');
    document.querySelectorAll('#ssaLadder li').forEach(li => li.classList.remove('active'));
  };
}

// ─── Init all on DOM ready ───
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileNav();
  initScrollTo();
  initFadeIn();
  initArchToggle();
  initPhilToggle();
  initAssessment();
});
