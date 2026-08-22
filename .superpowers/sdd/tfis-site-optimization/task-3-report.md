# Task 3 Report: Update all 3 HTML pages

## Status: DONE

## Commit
`36afbb1` — feat(html): remove Google Fonts, add favicon/OG/skip-link/data-page/UTM links; create philosophers.html

## Changes confirmed per page

### index.html
- [x] Removed 3 Google Fonts prefetch/stylesheet links
- [x] Added `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`
- [x] Added OG/Twitter meta tags (og:title, og:description, og:type, twitter:card)
- [x] `<body data-page="home">` with skip-link as first child
- [x] `<main id="main-content">`
- [x] Section tracker (`<nav class="section-tracker">`) before `</main>`
- [x] All Thinkific links updated with UTM params (`utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=whitepaper|cours`)

### functional-life.html
- [x] Removed 3 Google Fonts prefetch/stylesheet links
- [x] Added favicon link
- [x] Added OG/Twitter meta tags (og:title, og:description, og:type="article", twitter:card)
- [x] `<body data-page="functional-life">` with skip-link
- [x] `<main id="main-content">`
- [x] All Thinkific links updated with UTM params

### meaning-of-life.html
- [x] Removed 3 Google Fonts prefetch/stylesheet links
- [x] Added favicon link
- [x] Added OG/Twitter meta tags (og:title, og:description, og:type="article", twitter:card)
- [x] `<body data-page="meaning-of-life">` with skip-link
- [x] `<main id="main-content">`
- [x] All Thinkific links updated with UTM params
- [x] `phil-toggle` button replaced with `<a href="philosophers.html" class="phil-toggle">`
- [x] Entire `phil-all` div block removed (40+ philosopher entries)

## Git status
No uncommitted changes to the three HTML pages — all changes are in commit `36afbb1` on `main`.

## Summary
All 3 HTML pages updated: Google Fonts external links removed, favicon/OG meta/skip-link/data-page/section-tracker (index only) added, Thinkific links instrumented with UTM tracking, and philosopher appendix extracted from meaning-of-life.html (replaced with link to philosophers.html).
