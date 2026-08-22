# Task 7: Final review pass

**Goal:** Verify all pages load correctly, all links work, all features function end-to-end.

**No file changes** — this is a verification-only task.

## Verification checklist

### Step 1: File existence
- [ ] `fonts/Inter-Regular.woff2` exists
- [ ] `fonts/Inter-SemiBold.woff2` exists
- [ ] `fonts/JetBrainsMono-Medium.woff2` exists
- [ ] `favicon.svg` exists
- [ ] `philosophers.html` exists

### Step 2: No Google Fonts references in any HTML file
- [ ] No `<link rel="preconnect"` to `fonts.googleapis.com` or `fonts.gstatic.com`
- [ ] No `<link href="https://fonts.googleapis.com/..."` in any HTML file

### Step 3: All favicon links present
- [ ] Each HTML file has `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`

### Step 4: All OG meta present
- [ ] `index.html` has `og:title="The Future Is Solo"`, `og:description`, `og:type="website"`, `twitter:card`
- [ ] `functional-life.html` has `og:title="The Functional Life · TFIS"`, `og:type="article"`
- [ ] `meaning-of-life.html` has `og:title="The Meaning of Life · TFIS"`, `og:type="article"`

### Step 5: All skip-link and main-content id present
- [ ] All 4 HTML pages have skip-link as first `<body>` child
- [ ] All 4 pages have `id="main-content"` on `<main>`

### Step 6: All data-page attributes
- [ ] `index.html`: `data-page="home"`
- [ ] `functional-life.html`: `data-page="functional-life"`
- [ ] `meaning-of-life.html`: `data-page="meaning-of-life"`
- [ ] `philosophers.html`: `data-page="philosophers"`

### Step 7: Section tracker on index.html only
- [ ] `index.html` has `<nav class="section-tracker" ...>` with 3 anchor links (#thesis, #ladder, #pillars)

### Step 8: UTM links on all Thinkific URLs
- [ ] All `tfis-whitepaper` URLs end with `?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=whitepaper`
- [ ] All `mesolitica.thinkific.com` course URLs end with `?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=course`

### Step 9: meaning-of-life.html phil changes
- [ ] No `<button class="phil-toggle" onclick="togglePhilosophers()"...>` exists
- [ ] Instead has `<a href="philosophers.html" class="phil-toggle">Browse all 50 philosophers →</a>`
- [ ] No `<div class="phil-all" id="philAll">` block exists (the hidden 40 philosophers removed)

### Step 10: shared.css checks
- [ ] `@font-face` declarations present for Inter 400, Inter 600, JetBrains Mono 500
- [ ] `--g400: #777;` (not `#999`)
- [ ] `.skip-link` class defined
- [ ] `nav .nav-right a[aria-current="page"]` style defined
- [ ] `.section-tracker` styles defined
- [ ] `.assess-greeting` style defined
- [ ] `.phil-search` styles defined

### Step 11: shared.js checks
- [ ] No `export` keywords remain
- [ ] No `initPhilToggle` or `togglePhilosophers` function
- [ ] `initPhilFilter` function exists
- [ ] `initSectionTracker` function exists
- [ ] `restoreSavedAssessment` function exists inside `initAssessment`
- [ ] `TFIS_LINKS` constant exists inside `initAssessment`
- [ ] `DOMContentLoaded` calls: initNavScroll, initMobileNav, initScrollTo, initFadeIn, initArchToggle, initAssessment, initPhilFilter, initSectionTracker
- [ ] Nav active state code present in `initNavScroll`
- [ ] Backdrop close code present in `initMobileNav`
- [ ] All `window.*` globals intact (selectLevel, startAssessment, nextQuestion, prevQuestion, selectOpt, resetAssessment, scrollToSection, toggleArch, closeNav)

### Step 12: philosophers.html checks
- [ ] Has search input with `id="philFilter"`
- [ ] Has list container with `id="philList"`
- [ ] All 50 philosophers present
- [ ] Has shared nav, footer, favicon, skip-link, main-content
- [ ] Consistent footer with other pages
- [ ] "← Back to the essay" link to `meaning-of-life.html`

## Report
Write to `.superpowers/sdd/tfis-site-optimization/task-7-report.md` with:
- Pass/fail per section above
- Any issues found
- Final `git log --oneline` showing all commits
- No commit needed (verification only)
