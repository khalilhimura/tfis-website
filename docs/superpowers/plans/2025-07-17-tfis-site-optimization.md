# TFIS Site P0+P1 Optimization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the TFIS static site from a hand-coded brochure to a conversion-optimized, accessible, maintainable content platform with assessment persistence, CTA tracking, self-hosted fonts, and UX/IA improvements.

**Architecture:** All changes are client-side only — vanilla JS, plain CSS, static HTML. No build step, no dependencies. The site remains fully static (CDN-deployable). The key architectural change is self-hosting fonts (from Google Fonts external requests) and using localStorage for assessment state.

**Tech Stack:** HTML5, CSS3, vanilla ES6 JS (no modules — classic script). Self-hosted woff2 fonts.

**Spec:** `docs/superpowers/specs/2025-07-17-tfis-site-optimization-design.md`

## Global Constraints

- No backend, no server-rendered pages, no build step required
- Zero new external dependencies (no frameworks, no utility libraries, no CDN fonts)
- Vanilla JS only — no `type="module"` (keep classic script pattern)
- White/light mode only — no dark mode in scope
- Existing URL structure must be preserved — no broken links
- All Thinkific links must carry UTM params: `?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content={name}`
- Favicon must be SVG — no PNG/ICO required
- Color contrast fixes must target WCAG AA 4.5:1 for body text

---

### Task 1: Self-host fonts + add favicon (prep — resources first)

**Files:**
- Create: `fonts/Inter-Regular.woff2`
- Create: `fonts/Inter-SemiBold.woff2`
- Create: `fonts/JetBrainsMono-Medium.woff2`
- Create: `favicon.svg`

**Interfaces:**
- Consumes: Nothing (new resources)
- Produces: Font files used by `shared.css` `@font-face` declarations; favicon linked from all HTML pages

- [ ] **Step 1: Download Inter Regular + SemiBold woff2 from Google Fonts**

```bash
# Inter Regular 400
curl -L "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeAmM.woff2" -o fonts/Inter-Regular.woff2

# Inter SemiBold 600
curl -L "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeAmM.woff2" -o fonts/Inter-SemiBold.woff2

# JetBrains Mono Medium 500
curl -L "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbV2o-flEEny0FZhsfKu5WU4xrH9Q.woff2" -o fonts/JetBrainsMono-Medium.woff2
```

Expected: 3 files in `fonts/`, sizes ~15-35 KB each.

- [ ] **Step 2: Create favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#c8511e"/>
  <text x="16" y="22" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="white" text-anchor="middle">S</text>
</svg>
```

Write to `favicon.svg`.

---

### Task 2: Add `@font-face` declarations to shared.css + fix color contrast

**Files:**
- Modify: `shared.css`

**Interfaces:**
- Consumes: Font files from Task 1
- Produces: Self-hosted font CSS declarations; color token fix

- [ ] **Step 1: Add `@font-face` blocks at the top of `shared.css` (before `:root`)**

```css
/* ─── SELF-HOSTED FONTS ─── */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  src: url('fonts/Inter-Regular.woff2') format('woff2');
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  src: url('fonts/Inter-SemiBold.woff2') format('woff2');
  font-display: swap;
}
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  src: url('fonts/JetBrainsMono-Medium.woff2') format('woff2');
  font-display: swap;
}
```

Insert this block between line 2 (the comment header) and line 5 ("Edit tokens here").

- [ ] **Step 2: Fix color contrast — change `--g400`**

Edit the `:root` block. Change:
```css
--g400: #999;
```
to:
```css
--g400: #777;
```

- [ ] **Step 3: Add skip-link styles**

Add after the `::selection` block (~line 57):
```css
/* ─── SKIP LINK ─── */
.skip-link{position:absolute;top:-100%;left:0;z-index:1000;padding:8px 16px;background:var(--accent);color:var(--white);font-family:var(--mono);font-size:.7rem;text-decoration:none;transition:top .15s}
.skip-link:focus{top:0;outline:none}
```

- [ ] **Step 4: Add nav active page style**

Find `nav .nav-right a:hover{color:var(--accent)}` (~line 71) and add after it:
```css
nav .nav-right a[aria-current="page"]{color:var(--accent);border-bottom:1px solid var(--accent)}
```

- [ ] **Step 5: Add section tracker styles**

Add before the FOOTER section (~line 282):
```css
/* ─── SECTION TRACKER ─── */
.section-tracker{position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:50;display:flex;flex-direction:column;gap:10px;opacity:0;transition:opacity .4s}
.section-tracker.visible{opacity:1}
.section-tracker a{display:block;width:8px;height:8px;border-radius:50%;background:var(--g300);border:1px solid transparent;transition:all .2s;text-decoration:none}
.section-tracker a.active{background:var(--accent);border-color:var(--accent);transform:scale(1.3)}
.section-tracker a:hover{background:var(--accent);border-color:var(--accent)}
@media(max-width:640px){.section-tracker{display:none}}
```

- [ ] **Step 6: Add philosopher page filter styles**

```css
/* ─── PHILOSOPHER SEARCH ─── */
.phil-search{margin:20px 0 24px}
.phil-search input{width:100%;padding:10px 14px;font-family:var(--sans);font-size:.85rem;border:1px solid var(--g200);border-radius:4px;outline:none;transition:border-color .2s;color:var(--g900)}
.phil-search input:focus{border-color:var(--accent)}
.phil-search input::placeholder{color:var(--g400)}
```

---

### Task 3: Update all 3 HTML pages — remove Google Fonts, add favicon, skip-link, data-page

**Files:**
- Modify: `index.html`
- Modify: `functional-life.html`
- Modify: `meaning-of-life.html`

**Interfaces:**
- Consumes: Font files (Task 1), favicon (Task 1), CSS changes (Task 2)
- Produces: Updated HTML pages that no longer load Google Fonts, have favicon, skip links, and `data-page` attributes

- [ ] **Step 1: Edit `index.html`**

   a. Remove these 3 lines (lines 8-10):
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
   ```

   b. Add favicon link after the meta viewport:
   ```html
   <link rel="icon" type="image/svg+xml" href="/favicon.svg">
   ```

   c. Add `data-page="home"` to `<body>`:
   Change `<body>` to `<body data-page="home">`

   d. Add skip link as first child of `<body>`:
   ```html
   <a href="#main-content" class="skip-link">Skip to main content</a>
   ```

   e. Add `id="main-content"` to `<main>`:
   Change `<main>` to `<main id="main-content">`

   f. Add section tracker markup before closing `</main>`:
   ```html
   <nav class="section-tracker" id="sectionTracker" aria-label="Section navigation">
     <a href="#thesis" aria-label="The Problem" data-section="thesis"></a>
     <a href="#ladder" aria-label="SSA-CMM Assessment" data-section="ladder"></a>
     <a href="#pillars" aria-label="The Framework" data-section="pillars"></a>
   </nav>
   ```

   g. Update Thinkific links with UTM params:
   - `https://mesolitica.thinkific.com/products/digital_downloads/tfis-whitepaper` → `https://mesolitica.thinkific.com/products/digital_downloads/tfis-whitepaper?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=whitepaper` (appears in nav, hero, footer)
   - `https://mesolitica.thinkific.com` → `https://mesolitica.thinkific.com?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=course` (the course link)

- [ ] **Step 2: Edit `functional-life.html`**

   Same changes as Step 1a through 1e (remove fonts, add favicon, `data-page="functional-life"`, skip-link, main-content id).
   
   Update Thinkific links with UTM params (same as Step 1g).
   
   No section tracker (essay pages don't get it).

- [ ] **Step 3: Edit `meaning-of-life.html`**

   Same as Step 2 (fonts, favicon, skip link, `data-page="meaning-of-life"`, main-content).
   
   Update Thinkific links with UTM params.
   
   **Additional change:** Replace the "Show all 50 philosophers" toggle with a link to the new `/philosophers.html` page:
   
   Find:
   ```html
   <button class="phil-toggle" onclick="togglePhilosophers()" id="philToggle">Show all 50 philosophers →</button>
   ```
   Replace with:
   ```html
   <a href="philosophers.html" class="phil-toggle">Browse all 50 philosophers →</a>
   ```
   
   Remove the entire `<div class="phil-all" id="philAll">...</div>` block (lines 79-120).

---

### Task 4: Create philosophers.html — standalone searchable page

**Files:**
- Create: `philosophers.html`

**Interfaces:**
- Consumes: `shared.css`, `shared.js` (nav/scroll/fade-in init)
- Produces: A searchable philosopher listing page linked from `meaning-of-life.html`

- [ ] **Step 1: Write `philosophers.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="50 philosophers, 2,500 years of answers on the meaning of life — the full appendix to the TFIS essay.">
<title>The Philosophers · TFIS</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="shared.css">
</head>
<body data-page="philosophers">

<a href="#main-content" class="skip-link">Skip to main content</a>

<nav id="topNav">
  <a href="/" class="logo"><em>TFIS</em></a>
  <div class="nav-right">
    <a href="/">Home</a>
    <a href="functional-life.html">Functional Life</a>
    <a href="meaning-of-life.html">Meaning of Life</a>
    <a href="https://mesolitica.thinkific.com/products/digital_downloads/tfis-whitepaper?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=whitepaper" target="_blank" rel="noopener" class="nav-btn">Whitepaper →</a>
    <button class="nav-toggle" id="navToggle" aria-label="Menu">☰</button>
  </div>
</nav>

<div class="nav-overlay" id="navOverlay">
  <a href="index.html">← Home</a>
  <a href="functional-life.html">The Functional Life</a>
  <a href="meaning-of-life.html">The Meaning of Life</a>
  <a href="https://mesolitica.thinkific.com/products/digital_downloads/tfis-whitepaper?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=whitepaper" target="_blank" rel="noopener">Download Whitepaper →</a>
</div>

<main id="main-content">
<section>
  <div class="container">
    <p class="num-stamp">Appendix</p>
    <h2>50 Philosophers on the <em>Meaning of Life</em></h2>
    <p class="muted" style="margin-bottom:12px">2,500 years of answers. Filter by name.</p>

    <div class="phil-search">
      <input type="text" id="philFilter" placeholder="Search philosophers..." autocomplete="off">
    </div>

    <div class="phil-all show" id="philList">
      <!-- 50 philosopher items go here — same content as the
           current meaning-of-life.html phil-all block but using CSS grid -->
    </div>

    <p class="muted" style="margin-top:12px;font-size:.73rem">
      <a href="meaning-of-life.html" style="color:var(--g500)">← Back to the essay</a>
    </p>
  </div>
</section>
</main>

<footer>...</footer>

<script src="shared.js"></script>
</body>
</html>
```

The philosopher items use the same `.phil-item` class structure as the current page:
```html
<div class="phil-item"><span class="name">Socrates</span><span class="summary">The unexamined life is not worth living.</span></div>
```

The `.phil-all` container uses `display: grid; grid-template-columns: 1fr 1fr` (responsive collapse to 1fr at 640px) instead of the current block layout.

Include ALL 50 philosophers as listed in the current `meaning-of-life.html` (lines 65-120).

- [ ] **Step 2: Add philosopher filter JS to `shared.js`** (see Task 5)

---

### Task 5: Clean up shared.js — remove exports, add assessment persistence, nav state, backdrop close, section tracker, philosopher filter

**Files:**
- Modify: `shared.js`

**Interfaces:**
- Consumes: HTML `data-page` attributes, `localStorage` API, section tracker markup (Task 3)
- Produces: Working assessment persistence, active nav, backdrop close, section tracking, philosopher search

- [ ] **Step 1: Remove all `export` keywords**

Find every instance of `export function` (there are 7: `initNavScroll`, `initMobileNav`, `initScrollTo`, `initFadeIn`, `initArchToggle`, `initPhilToggle`, `initAssessment`). Replace `export function` with `function`.

- [ ] **Step 2: Remove `initPhilToggle` and `togglePhilosophers`**

The philosophers page replaces the toggle pattern. Remove the entire `initPhilToggle` function (lines 62-70) and remove its call in `DOMContentLoaded` (line 278).

Add a new `initPhilFilter` function:
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

- [ ] **Step 3: Add assessment persistence to `initAssessment`**

Inside `initAssessment`:

a. Create a helper function (after the LEVEL_DESCS array, ~line 85):
```js
const ASSESS_KEY = 'tfis-assessment-level';
const ASSESS_NAME_KEY = 'tfis-assessment-name';
const ASSESS_TS_KEY = 'tfis-assessment-timestamp';
const ASSESS_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
```

b. In `showResultForLevel`, add localStorage writes at the end (before the closing `}`):
```js
try {
  localStorage.setItem(ASSESS_KEY, String(level));
  localStorage.setItem(ASSESS_NAME_KEY, LEVEL_NAMES[level]);
  localStorage.setItem(ASSESS_TS_KEY, String(Date.now()));
} catch(e) { /* localStorage may be blocked */ }
```

c. In `resetAssessment`, add localStorage clearing:
```js
try {
  localStorage.removeItem(ASSESS_KEY);
  localStorage.removeItem(ASSESS_NAME_KEY);
  localStorage.removeItem(ASSESS_TS_KEY);
} catch(e) { /* noop */ }
```

d. Add an auto-restore function called at the end of `initAssessment`:
```js
function restoreSavedAssessment() {
  try {
    const level = localStorage.getItem(ASSESS_KEY);
    const ts = localStorage.getItem(ASSESS_TS_KEY);
    if (level !== null && ts !== null && (Date.now() - Number(ts)) < ASSESS_TTL) {
      // Hide intro, show result
      const intro = document.querySelector('.assess-intro');
      const retake = document.getElementById('retakeAssess');
      if (intro) intro.style.display = 'none';
      if (retake) retake.style.display = 'inline';
      showResultForLevel(Number(level));
      // Also highlight the ladder item
      const el = document.querySelector(`#ssaLadder li[data-level="${level}"]`);
      if (el) el.classList.add('active');
    }
  } catch(e) { /* noop */ }
}
```

e. Call `restoreSavedAssessment()` at the end of `initAssessment`.

- [ ] **Step 4: Add nav active state**

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

- [ ] **Step 5: Add mobile nav backdrop close**

In `initMobileNav`, add after the existing `toggle.addEventListener`:
```js
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.remove('open');
});
```

- [ ] **Step 6: Add section tracker**

Add new function `initSectionTracker`:
```js
function initSectionTracker() {
  const tracker = document.getElementById('sectionTracker');
  if (!tracker) return;
  const links = tracker.querySelectorAll('a');
  const sections = Array.from(links).map(a => document.getElementById(a.dataset.section)).filter(Boolean);
  if (!sections.length) return;

  // Show tracker after scrolling past hero
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
  showTracker(); // initial check
}
```

- [ ] **Step 7: Update `DOMContentLoaded` handler**

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

- [ ] **Step 8: Verify no syntax errors**

Read the final `shared.js` and verify:
- No `export` keywords remain
- All `window.*` assignments are intact
- `initPhilFilter` and `initSectionTracker` are defined
- `restoreSavedAssessment` is called inside `initAssessment`
- No undefined references

---

### Task 6: Update CTA links in shared.js (dynamic assessment CTAs)

**Files:**
- Modify: `shared.js`

**Interfaces:**
- Consumes: UTM link map
- Produces: Dynamic CTAs in assessment result use tracked links

- [ ] **Step 1: Add link map near the top of `initAssessment` (after INIT block setup)**

```js
const TFIS_LINKS = {
  whitepaper: 'https://mesolitica.thinkific.com/products/digital_downloads/tfis-whitepaper?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=whitepaper',
  course: 'https://mesolitica.thinkific.com?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=course',
};
```

- [ ] **Step 2: Update `showResultForLevel` to use `TFIS_LINKS`**

In `showResultForLevel`, after the CTA card visibility logic, update the `href` attributes of links inside the CTA cards:

Locate the section (around line 204-229 in current file) where `result.classList.add('show')` and the level display happens. After setting the text content, add:
```js
// Update CTA links
document.querySelectorAll('.cta-card .btn').forEach(btn => {
  const href = btn.getAttribute('href') || '';
  if (href.includes('whitepaper')) btn.href = TFIS_LINKS.whitepaper;
  else if (btn.textContent.includes('Course')) btn.href = TFIS_LINKS.course;
});
```

---

### Task 7: Final review pass

**Files:**
- All modified files

- [ ] **Step 1: Verify all pages load without JS errors**

Open each page (`index.html`, `functional-life.html`, `meaning-of-life.html`, `philosophers.html`) in a browser or use a headless check. Look for:
- No Google Fonts requests in network tab
- Favicon loads
- Console: no errors
- Assessment works end-to-end: start → answer 5 → see result → refresh → result persists
- Mobile nav opens and closes (including backdrop tap)
- Section tracker appears on home page after scrolling past hero
- Active nav link has `aria-current="page"`
- Skip link appears on tab focus

- [ ] **Step 2: Verify all links work**

Click (or check):
- All nav links navigate correctly
- All UTM links point to Thinkific with params
- "Browse all 50 philosophers" on meaning-of-life.html opens philosophers.html
- Philosopher search/filter works

- [ ] **Step 3: Visual diff check**

- Fonts render correctly (Inter body, JetBrains Mono labels)
- Color contrast feels right (no washed-out gray text)
- Section tracker dots visible on right edge of home page
- Philosophers page layout renders 50 items in 2-column grid

- [ ] **Step 4: Check accessibility**

- Tab through the page: skip link appears first
- Screen reader reads nav landmark, main landmark
- Color contrast checker on `.muted` text shows 4.5:1+ ratio
