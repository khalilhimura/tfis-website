/* ═══════════════════════════════════════════════════════════════════
   TFIS · Shared JavaScript
   Reusable across all pages — nav, scroll effects, assessment, toggles
   ═══════════════════════════════════════════════════════════════════ */

// ─── Theme (dark/light mode) ───
function initTheme() {
  const stored = localStorage.getItem('tfis-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeToggle(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('tfis-theme', next);
  updateThemeToggle(next);
  // Notify ocean iframe of theme change
  const ocean = document.querySelector('.hero-ocean');
  if (ocean && ocean.contentWindow) {
    ocean.contentWindow.postMessage({ type: 'tfis-theme', theme: next }, '*');
  }
}

function updateThemeToggle(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const sun = btn.querySelector('.theme-icon--sun');
  const moon = btn.querySelector('.theme-icon--moon');
  if (sun) sun.style.display = theme === 'dark' ? 'none' : '';
  if (moon) moon.style.display = theme === 'dark' ? '' : 'none';
}

function updateThemeToggle(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const sun = btn.querySelector('.theme-icon--sun');
  const moon = btn.querySelector('.theme-icon--moon');
  if (sun) sun.style.display = theme === 'dark' ? 'none' : '';
  if (moon) moon.style.display = theme === 'dark' ? '' : 'none';
}

// ─── Nav scroll effect (IntersectionObserver based) ───
function initNavScroll() {
  const nav = document.getElementById('topNav');
  if (!nav) return;

  // Use a sentinel at the top of the page to detect scroll past threshold
  const sentinel = document.createElement('div');
  sentinel.style.position = 'absolute';
  sentinel.style.top = '0';
  sentinel.style.left = '0';
  sentinel.style.width = '1px';
  sentinel.style.height = '1px';
  sentinel.style.pointerEvents = 'none';
  sentinel.style.opacity = '0';
  document.body.prepend(sentinel);

  // Second sentinel 60px down to detect when we've scrolled past threshold
  const threshold = document.createElement('div');
  threshold.style.position = 'absolute';
  threshold.style.top = '60px';
  threshold.style.left = '0';
  threshold.style.width = '1px';
  threshold.style.height = '1px';
  threshold.style.pointerEvents = 'none';
  threshold.style.opacity = '0';
  document.body.prepend(threshold);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.target === sentinel && !e.isIntersecting) {
        nav.classList.add('scrolled');
      }
      if (e.target === threshold && e.isIntersecting) {
        nav.classList.remove('scrolled');
      }
    });
  }, { threshold: 0 });

  observer.observe(sentinel);
  observer.observe(threshold);

  // Set active nav link
  const page = document.body?.dataset?.page;
  if (page) {
    const navLinks = document.querySelectorAll('.nav-right a');
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      if (href === '/' && page === 'home') a.setAttribute('aria-current', 'page');
      else if (href === 'functional-life.html' && page === 'functional-life') a.setAttribute('aria-current', 'page');
      else if (href === 'meaning-of-life.html' && page === 'meaning-of-life') a.setAttribute('aria-current', 'page');
    });
  }
}

// ─── Mobile nav ───
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const overlay = document.getElementById('navOverlay');
  if (!toggle || !overlay) return;
  toggle.addEventListener('click', () => overlay.classList.toggle('open'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
  window.closeNav = () => overlay.classList.remove('open');
}

// ─── Scroll to section ───
function initScrollTo() {
  window.scrollToSection = function(id) {
    const el = document.getElementById(id);
    if (el) {
      const navH = window.innerWidth >= 1024 ? 100 : 64;
      const top = el.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    if (window.closeNav) window.closeNav();
  };
}

// ─── Fade-in observer ───
function initFadeIn() {
  const faders = document.querySelectorAll('.fade-in');
  if (!faders.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold:0.1 });
  faders.forEach(f => observer.observe(f));
}

// ─── Architecture reveal toggle ───
function initArchToggle() {
  window.toggleArch = function() {
    const el = document.getElementById('archReveal');
    const btn = document.getElementById('archToggle');
    if (!el || !btn) return;
    const open = el.classList.toggle('open');
    btn.textContent = open ? '− How It Works (Architecture)' : '+ How It Works (Architecture)';
  };
}

// ─── Philosopher filter (search) ───
function initPhilFilter() {
  const input = document.getElementById('philFilter');
  const list = document.getElementById('philList');
  if (!input || !list) return;
  const items = list.querySelectorAll('.phil-item');
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    items.forEach(el => {
      const name = el.querySelector('.name')?.textContent?.toLowerCase() || '';
      const summary = el.querySelector('.summary')?.textContent?.toLowerCase() || '';
      el.style.display = (name.includes(q) || summary.includes(q)) ? '' : 'none';
    });
  });
}

// ─── SSA Ladder + Self-Assessment ───
function initAssessment() {
  const LEVEL_NAMES = [
    'Task Operator','AI-Assisted Operator','Workflow Orchestrator',
    'Agent Supervisor','Multi-Agent Architect','Sovereign Architect'
  ];
  const LEVEL_DESCS = [
    'Manual performance. Output tied strictly to hours.',
    'Uses AI tools. Still the primary worker, just faster.',
    'Builds semi-automated, repeatable workflows.',
    'Supervises multiple agents with memory. Judgment is exercised daily, and spent, not stored.',
    'Designs autonomous multi-agent systems. Closed feedback loops with verified write-back.',
    'Owns fully autonomous cognitive infrastructure. The system compounds without you.'
  ];
  const ASSESS_KEY = 'tfis-assessment-level';
  const ASSESS_NAME_KEY = 'tfis-assessment-name';
  const ASSESS_TS_KEY = 'tfis-assessment-timestamp';
  const ASSESS_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
  const TFIS_LINKS = {
    whitepaper: 'https://mesolitica.thinkific.com/products/digital_downloads/tfis-whitepaper?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=whitepaper',
    course: 'https://mesolitica.thinkific.com?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=course',
  };
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
        {t:'Every verdict is captured: accept / reject / rewrite, with reason. Written back to durable memory.', s:5}
      ]}
  ];

  let qIdx = 0, answers = [], assessStarted = false;

  window.selectLevel = function(level) {
    const items = document.querySelectorAll('#ssaLadder li');
    items.forEach(li => li.classList.remove('active'));
    const el = document.querySelector(`#ssaLadder li[data-level="${level}"]`);
    if (el) { el.classList.add('active'); showResultForLevel(level); }
  };

  window.startQuickAssessment = function() {
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
      `<button class="assess-opt" data-idx="${i}" onclick="quickAssessSelectOpt(this,${i})">
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
          <button ${qIdx===0?'style=visibility:hidden':''} onclick="quickAssessPrev()">← Back</button>
          <button onclick="quickAssessNext()" style="color:var(--g400);border-color:var(--g200)">Skip</button>
        </div>
      </div>`;
  }

  window.quickAssessSelectOpt = function(el, idx) {
    const parent = el.closest('.assess-q-inner');
    if (parent) parent.querySelectorAll('.assess-opt').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    answers[qIdx] = QUESTIONS[qIdx].opts[idx].s;
    setTimeout(() => quickAssessNext(), 300);
  };

  window.quickAssessNext = function() {
    if (qIdx < QUESTIONS.length - 1) { qIdx++; renderQuestion(); }
    else finishAssessment();
  };

  window.quickAssessPrev = function() {
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
      // Update CTA links with UTM tracking
      document.querySelectorAll('.cta-card .btn').forEach(btn => {
        if (btn.getAttribute('href')?.includes('whitepaper')) btn.href = TFIS_LINKS.whitepaper;
        else if (btn.textContent?.includes('Course')) btn.href = TFIS_LINKS.course;
      });
    }
    result.scrollIntoView({ behavior:'smooth', block:'center' });
    try {
      localStorage.setItem(ASSESS_KEY, String(level));
      localStorage.setItem(ASSESS_NAME_KEY, LEVEL_NAMES[level]);
      localStorage.setItem(ASSESS_TS_KEY, String(Date.now()));
    } catch(e) { /* localStorage may be blocked */ }
  }

  function showGenericCTA() {
    const result = document.getElementById('assessResult');
    if (!result) return;
    result.classList.add('show');
    const lvl = document.getElementById('resultLevel');
    const name = document.getElementById('resultName');
    const desc = document.getElementById('resultDesc');
    if (lvl) lvl.textContent = '-';
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
    try {
      localStorage.removeItem(ASSESS_KEY);
      localStorage.removeItem(ASSESS_NAME_KEY);
      localStorage.removeItem(ASSESS_TS_KEY);
    } catch(e) { /* noop */ }
  };

  function restoreSavedAssessment() {
    try {
      const level = localStorage.getItem(ASSESS_KEY);
      const name = localStorage.getItem(ASSESS_NAME_KEY);
      const ts = localStorage.getItem(ASSESS_TS_KEY);
      if (level !== null && name !== null && ts !== null && (Date.now() - Number(ts)) < ASSESS_TTL) {
        const intro = document.querySelector('.assess-intro');
        const retake = document.getElementById('retakeAssess');
        if (intro) intro.style.display = 'none';
        if (retake) retake.style.display = 'inline';
        showResultForLevel(Number(level));
        const result = document.getElementById('assessResult');
        if (result) {
          const greeting = document.createElement('p');
          greeting.className = 'assess-greeting';
          greeting.textContent = 'You last scored L' + level + ' · ' + name;
          result.parentNode.insertBefore(greeting, result);
        }
        const el = document.querySelector('#ssaLadder li[data-level="' + level + '"]');
        if (el) el.classList.add('active');
      }
    } catch(e) { /* noop */ }
  }

  restoreSavedAssessment();
}

// ─── Section tracker (home page only) ───
function initSectionTracker() {
  const tracker = document.getElementById('sectionTracker');
  if (!tracker) return;
  const links = tracker.querySelectorAll('a');
  const sections = Array.from(links).map(a => document.getElementById(a.dataset.section)).filter(Boolean);
  if (!sections.length) return;

  let trackerVisible = false;
  const showTracker = () => {
    if (!trackerVisible && window.scrollY > window.innerHeight * 0.5) {
      tracker.classList.add('visible');
      trackerVisible = true;
    } else if (trackerVisible && window.scrollY <= window.innerHeight * 0.5) {
      tracker.classList.remove('visible');
      trackerVisible = false;
    }
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const match = links.find(l => l.dataset.section === e.target.id);
        if (match) match.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
  window.addEventListener('scroll', showTracker, { passive: true });
  showTracker();
}

// ─── Init all on DOM ready ───
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavScroll();
  initMobileNav();
  initScrollTo();
  initFadeIn();
  initArchToggle();
  initPhilFilter();
  initAssessment();
  initSectionTracker();
  // Theme toggle click handler
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
});
