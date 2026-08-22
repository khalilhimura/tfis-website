# Task 5: Clean up shared.js — exports, persistence, nav state, backdrop close, section tracker, phil filter

**Goal:** Refactor shared.js: remove exports, add assessment localStorage persistence, nav active state, mobile nav backdrop close, section tracker IntersectionObserver, philosopher filter, and remove old philToggle.

**File to modify:** `shared.js` (repo root)

## Changes (in order)

### 1. Remove all `export` keywords
Replace all `export function` with `function`. There are 7 occurrences:
- initNavScroll, initMobileNav, initScrollTo, initFadeIn, initArchToggle, initPhilToggle, initAssessment

### 2. Remove initPhilToggle and togglePhilosophers
Remove the entire `initPhilToggle` function (lines 62-70 in current file). Remove its call from the DOMContentLoaded init block.

Add a new function `initPhilFilter`:
```js
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
```

### 3. Add assessment persistence to initAssessment

Inside the initAssessment function, after the `LEVEL_DESCS` array, add:
```js
const ASSESS_KEY = 'tfis-assessment-level';
const ASSESS_NAME_KEY = 'tfis-assessment-name';
const ASSESS_TS_KEY = 'tfis-assessment-timestamp';
const ASSESS_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
```

In `showResultForLevel`, at the end (before the closing `}`), add:
```js
try {
  localStorage.setItem(ASSESS_KEY, String(level));
  localStorage.setItem(ASSESS_NAME_KEY, LEVEL_NAMES[level]);
  localStorage.setItem(ASSESS_TS_KEY, String(Date.now()));
} catch(e) { /* localStorage may be blocked */ }
```

In `resetAssessment`, add:
```js
try {
  localStorage.removeItem(ASSESS_KEY);
  localStorage.removeItem(ASSESS_NAME_KEY);
  localStorage.removeItem(ASSESS_TS_KEY);
} catch(e) { /* noop */ }
```

Add a restore function and call it at the end of `initAssessment`:
```js
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
        greeting.textContent = `You last scored L${level} · ${name}`;
        result.parentNode.insertBefore(greeting, result);
      }
      const el = document.querySelector(`#ssaLadder li[data-level="${level}"]`);
      if (el) el.classList.add('active');
    }
  } catch(e) { /* noop */ }
}
```

Call `restoreSavedAssessment()` at the end of `initAssessment`.

### 4. Add nav active state

In `initNavScroll`, after the scroll handler block, add:
```js
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
```

### 5. Add mobile nav backdrop close

In `initMobileNav`, add after the existing `toggle.addEventListener`:
```js
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.remove('open');
});
```

### 6. Add section tracker

Add a new function `initSectionTracker`:
```js
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
```

### 7. Update DOMContentLoaded handler

Replace the current init block with:
```js
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileNav();
  initScrollTo();
  initFadeIn();
  initArchToggle();
  initAssessment();
  initPhilFilter();
  initSectionTracker();
});
```

Note: `initPhilToggle` is removed; `initPhilFilter` replaces it.

### 8. Add UTM link map for dynamic CTAs

Inside `initAssessment`, after the `ASSESS_TTL` constant lines, add:
```js
const TFIS_LINKS = {
  whitepaper: 'https://mesolitica.thinkific.com/products/digital_downloads/tfis-whitepaper?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=whitepaper',
  course: 'https://mesolitica.thinkific.com?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=course',
};
```

### 9. Update dynamic CTA links in showResultForLevel

In `showResultForLevel`, after the CTA card visibility logic (where `cards.style.gridTemplateColumns` is set), add:
```js
// Update CTA links with UTM tracking
document.querySelectorAll('.cta-card .btn').forEach(btn => {
  if (btn.getAttribute('href')?.includes('whitepaper')) btn.href = TFIS_LINKS.whitepaper;
  else if (btn.textContent?.includes('Course')) btn.href = TFIS_LINKS.course;
});
```

## Verification
1. Read the final file — confirm no `export` keywords remain
2. All `window.*` globals intact (selectLevel, startAssessment, nextQuestion, prevQuestion, selectOpt, resetAssessment, scrollToSection, toggleArch, closeNav)
3. No undefined references
4. The file parses as valid JS (no syntax errors)

## Report
Write to `.superpowers/sdd/tfis-site-optimization/task-5-report.md` with:
- All 7 changes confirmed
- No `export` keywords remain
- `DOMContentLoaded` init block showing all 8 inits
- Git status
- Commit message: "feat(js): remove exports, add assessment localStorage persistence, nav state, backdrop close, section tracker, phil filter"
