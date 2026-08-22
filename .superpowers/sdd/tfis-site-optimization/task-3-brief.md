# Task 3: Update all 3 HTML pages

**Goal:** Remove Google Fonts links, add favicon, skip-link, data-page, OG/Twitter meta, UTM links, and section tracker (index only).

**Files to modify:**
- `index.html`
- `functional-life.html`
- `meaning-of-life.html`

## Changes per page

### index.html

1. **Remove** these 3 lines:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
   ```

2. **Add** favicon link after `<meta name="viewport" ...>`:
   ```html
   <link rel="icon" type="image/svg+xml" href="/favicon.svg">
   ```

3. **Add** OG/Twitter meta after the favicon link:
   ```html
   <meta property="og:title" content="The Future Is Solo">
   <meta property="og:description" content="A framework for intellectual sovereignty in the agentic AI era. Assess your SSA-CMM level and find your path.">
   <meta property="og:type" content="website">
   <meta name="twitter:card" content="summary_large_image">
   ```

4. **Change** `<body>` to `<body data-page="home">`

5. **Add** skip-link as first child of `<body>`:
   ```html
   <a href="#main-content" class="skip-link">Skip to main content</a>
   ```

6. **Change** `<main>` to `<main id="main-content">`

7. **Add** section tracker before closing `</main>`:
   ```html
   <nav class="section-tracker" id="sectionTracker" aria-label="Section navigation">
     <a href="#thesis" aria-label="The Problem" data-section="thesis"></a>
     <a href="#ladder" aria-label="SSA-CMM Assessment" data-section="ladder"></a>
     <a href="#pillars" aria-label="The Framework" data-section="pillars"></a>
   </nav>
   ```

8. **Update** all Thinkific links with UTM params:
   - `.../tfis-whitepaper` → `.../tfis-whitepaper?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=whitepaper`
   - `https://mesolitica.thinkific.com` → `https://mesolitica.thinkific.com?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=course`

### functional-life.html

1. Same as index.html steps 1-6 (remove fonts, add favicon, add OG, data-page="functional-life", skip-link, main-content)
2. OG meta:
   ```html
   <meta property="og:title" content="The Functional Life · TFIS">
   <meta property="og:description" content="Aristotle supplies the structure. Feynman supplies the method. The SSA supplies the practice. Field Manual Nº 01.">
   <meta property="og:type" content="article">
   <meta name="twitter:card" content="summary_large_image">
   ```
3. Update Thinkific links with UTM (same as index step 8)
4. **No** section tracker

### meaning-of-life.html

1. Same as functional-life steps 1-2 (remove fonts, add favicon, OG, data-page="meaning-of-life", skip-link, main-content)
2. OG meta:
   ```html
   <meta property="og:title" content="The Meaning of Life · TFIS">
   <meta property="og:description" content="Khalil Nooh responds to 2,500 years of philosophy. A techno-optimist's answer to WITMOLv2.">
   <meta property="og:type" content="article">
   <meta name="twitter:card" content="summary_large_image">
   ```
3. Update Thinkific links with UTM
4. **Replace** the phil-toggle button with a link:
   Find: `<button class="phil-toggle" onclick="togglePhilosophers()" id="philToggle">Show all 50 philosophers →</button>`
   Replace with: `<a href="philosophers.html" class="phil-toggle">Browse all 50 philosophers →</a>`
5. **Remove** the entire `<div class="phil-all" id="philAll">...</div>` block (the 40+ hidden philosopher entries)

## Verification
- Each page should open in a browser without JS errors
- No Google Fonts external requests remain
- Favicon link present in all 3 pages
- All Thinkific links have UTM params
- meaning-of-life.html no longer has the phil-all block
- meaning-of-life.html links to philosophers.html

## Report
Write to `.superpowers/sdd/tfis-site-optimization/task-3-report.md` with:
- Confirmation of changes per page
- Git status
- Commit message: "feat(html): remove Google Fonts, add favicon/OG/skip-link/data-page/UTM links; extract philosopher appendix to separate page"
