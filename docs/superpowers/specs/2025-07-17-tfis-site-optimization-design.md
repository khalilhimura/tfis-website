# TFIS Site Optimization — Design Spec

## 1. Purpose

Transform the TFIS site from a hand-coded static brochure into a **lightweight, conversion-optimized, accessible, and maintainable content platform** that serves the Solo Systems Architect (SSA) audience along the full visitor journey: discover → understand → self-assess → act → return.

This spec covers **P0 and P1** improvements only. P2/P3 items are tracked separately as future enhancements.

---

## 2. Constraints

- **No backend.** The site must remain fully static — served from any CDN, S3 bucket, or static host. No Node.js middleware, no server-rendered pages.
- **No build step required for the immediate implementation.** Files remain hand-editable HTML/CSS/JS. A future SSG migration (P3) may introduce a build step, but it is not part of this plan.
- **White mode only** for now. Dark mode is P2.
- **Zero new external dependencies.** Vanilla JS, plain CSS. No framework, no utility library.
- **Existing URL structure is preserved.** No broken links.

---

## 3. Scope (P0 + P1)

### 3.1 P0 — Must Fix (Structural)

#### 3.1.1 Assessment persistence via localStorage

**Problem:** The SSA self-assessment result (level 0–5) disappears on page reload. A user who discovers their level, navigates to an essay, then returns to the home page must retake the assessment.

**Solution:**
- On `finishAssessment()` and `showResultForLevel()`, write to `localStorage`:
  ```js
  localStorage.setItem('tfis-assessment-level', level);
  localStorage.setItem('tfis-assessment-name', LEVEL_NAMES[level]);
  localStorage.setItem('tfis-assessment-timestamp', Date.now());
  ```
- On `DOMContentLoaded`, check `localStorage`. If a stored result exists and is less than 30 days old, auto-render the result panel (CTA cards, level badge) without showing the intro block.
- `resetAssessment()` clears the stored keys.
- The assessment intro block shows "You last scored L3 — Agent Supervisor. Retake?" when stored state exists.

**Files touched:** `shared.js`

#### 3.1.2 CTA link tracking

**Problem:** All "Whitepaper →" and "Start the Course →" links go to Thinkific without UTM parameters, making it impossible to measure conversion source.

**Solution:**
- Append `?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content={cta-name}` to every Thinkific link.
- Define a central link map in `shared.js` so CTAs are easy to audit:
  ```js
  const TFIS_LINKS = {
    whitepaper: 'https://mesolitica.thinkific.com/products/digital_downloads/tfis-whitepaper?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=whitepaper',
    course: 'https://mesolitica.thinkific.com?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=course',
  };
  ```
- Use the link map in the assessment CTA cards (dynamic) and also update all static `<a>` tags across the 3 HTML pages.
- No external analytics script is introduced — this is purely link decoration for whatever analytics tool is added later (P2).

**Files touched:** `shared.js`, `index.html`, `functional-life.html`, `meaning-of-life.html`

#### 3.1.3 Font loading optimization

**Problem:** Google Fonts (Inter + JetBrains Mono) are render-blocking. The preconnect headers are present but the `crossorigin` attribute is missing on the `fonts.gstatic.com` preconnect, which means the connection isn't reused.

**Solution:**
- Add `crossorigin` to the `fonts.gstatic.com` preconnect:
  ```html
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ```
- Add `font-display: swap` — but this must be done via a `&display=swap` parameter on the Google Fonts URL, which is already present in the current URL. Verified: the current URL ends with `&display=swap` — this is correct. The issue is only the missing `crossorigin`.
- **Medium-term (part of this plan):** Self-host Inter and JetBrains Mono via `@font-face` blocks in `shared.css` to eliminate the external request entirely. This is worthwhile because:
  - The fonts are small (Inter Latin ~30 KB woff2, JetBrains Mono ~25 KB woff2).
  - No external DNS lookup, no TLS negotiation.
  - Zero FOUT/FOIT risk — fonts are loaded with the CSS.
  - GDPR/privacy win (no Google servers contacted).
- For self-hosting, download the font files and add `@font-face` declarations:
  ```css
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    src: url('fonts/Inter-Regular.woff2') format('woff2');
    font-display: swap;
  }
  @font-face {
    font-family: 'Inter';
    font-weight: 600;
    src: url('fonts/Inter-SemiBold.woff2') format('woff2');
    font-display: swap;
  }
  @font-face {
    font-family: 'JetBrains Mono';
    font-weight: 500;
    src: url('fonts/JetBrainsMono-Medium.woff2') format('woff2');
    font-display: swap;
  }
  ```
- Remove Google Fonts `<link>` tags from all HTML heads once self-hosted. Remove preconnect tags.

**Files touched:** `shared.css` (add `@font-face`), `index.html`, `functional-life.html`, `meaning-of-life.html` (remove external font links and preconnects), new `fonts/` directory.

#### 3.1.4 Favicon

**Problem:** No favicon. Browsers show a generic page icon.

**Solution:**
- Create a minimal SVG favicon — the TFIS logomark (the "Solo" accent-colored dot, or an abstract "S" in JetBrains Mono style).
- Output `favicon.svg` in the site root.
- Reference in `<head>`:
  ```html
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  ```

**Files touched:** new `favicon.svg`, `index.html`, `functional-life.html`, `meaning-of-life.html`

#### 3.1.5 JS module cleanup

**Problem:** `shared.js` uses `export` statements (ES module syntax) but is loaded via `<script src="shared.js">` without `type="module"`. The exports are never imported — all functions rely on `window.*` globals. This is dead code that causes a syntax error in browsers that interpret the file as a classic script (Firefox logs a warning; some older browsers may reject the file entirely).

**Solution:**
- Remove all `export` keywords from `shared.js`. Keep the `window.*` pattern since it's how the inline `onclick` handlers in HTML call these functions.
- Or (better): Add `type="module"` to the script tag and refactor all `onclick` handlers to use `addEventListener`. This is the cleaner approach but requires touching more HTML. **Decision:** Remove `export` for now (minimal diff); add `type="module"` as a separate future task if the site is migrated to a build step.

**Files touched:** `shared.js`

---

### 3.2 P1 — Should Fix (UX & Content Architecture)

#### 3.2.1 Intra-page table of contents

**Problem:** The home page has 3 major sections (The Problem/Drift, SSA-CMM Ladder, The Framework) but no way to navigate between them once scrolled past the hero.

**Solution:**
- Add a sticky, subtle section indicator — not a full ToC sidebar (which would feel heavy for the minimal design). Instead, use a thin horizontal progress / section dot tracker fixed at the bottom of the viewport or on the right edge.
- Pattern: 3 thin vertical dots or a tiny "01 / 03" counter that updates on scroll via IntersectionObserver.
- Only shown on the home page. Not on essay pages.
- Implementation: Add a `<nav class="section-tracker" aria-label="Section">` element with links to `#thesis`, `#ladder`, `#pillars`. Style it as a minimal vertical list on the right edge. Show/hide via JS based on scroll position.

**Files touched:** `index.html`, `shared.css`, `shared.js`

#### 3.2.2 Breadcrumbs / active nav state

**Problem:** On essay pages, the nav has no active indicator. "Home" vs "Functional Life" vs "Meaning of Life" all look the same.

**Solution:**
- On each page, set a `data-page` attribute on `<body>` matching a known page key.
- In JS `initNavScroll()`, check the body's `data-page` and apply an `aria-current="page"` attribute and a subtle underline style to the matching nav link.

```html
<body data-page="functional-life">
```

```css
nav .nav-right a[aria-current="page"] {
  color: var(--accent);
  border-bottom: 1px solid var(--accent);
}
```

**Files touched:** `index.html`, `functional-life.html`, `meaning-of-life.html` (add `data-page`), `shared.css` (add nav active style), `shared.js`

#### 3.2.3 Accessibility — color contrast

**Problem:** The `--g400` token (#999999) on text fails WCAG AA 4.5:1 for normal-size text. `--g500` (#777777) achieves ~5.5:1 and is acceptable. This affects:
- `.muted` class and `<p class="muted">` elements (especially in the footer).
- `.ladder-note`, `.pillar-axiom`, `.assess-desc`, and various label/note elements.

**Solution:**
- Change `--g400` from #999999 to **#888888** which achieves ~4.56:1 — just barely AA pass for 18px text. For smaller text (below 18px / 14px), AA requires 4.5:1 even at larger sizes — but since body text is 18px and small text is 14px (some `.muted` uses `.73rem` = ~13px), ensure 13px+ text meets 4.5:1.
- Better approach: change the token to **#777777** (currently `--g500`) and shift the palette:
  - `--g400`: #888888 → new value: **#777777** (was G500)
  - `--g500`: #777777 → **#666666** (was G600)
  - `--g600`: keep #555555
- This is a one-token shift that elevates contrast without changing the design feel.

**Detailed review of problematic spots:**

| Element | Current color | Size | Ratio | Pass AA? |
|---------|--------------|------|-------|----------|
| `.muted`, `footer .f-copy` | #999 (G400) | ~13px | ~3.0:1 | ❌ |
| `.ladder-note` | #999 (G500) | .78rem ~14px | ~3.0:1 | ❌ |
| `.pillar-axiom` | #999 (G600) | .8rem ~14px | ~3.0:1 | ❌ |
| `.assess-desc` | #999 (G600) | .82rem ~15px | ~3.0:1 | ❌ |
| `.phil-item .summary` | #999 (G500) | .76rem ~14px | ~3.0:1 | ❌ |

All of these use either `--g400`, `--g500`, or `--g600` tokens that resolve to #999, #777, or #555. The root cause is `--g400: #999` being used for small text. Fix: change `--g400` to `#777`.

**Files touched:** `shared.css`

#### 3.2.4 Accessibility — skip-to-content link

**Solution:**
- Add a visually-hidden skip link as the first focusable element on every page:
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```
- Add `id="main-content"` to `<main>` on each page.
- Style the skip link to be positioned off-screen until focused:
```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 1000;
  padding: 8px 16px;
  background: var(--accent);
  color: var(--white);
  font-family: var(--mono);
  font-size: .7rem;
}
.skip-link:focus {
  top: 0;
}
```

**Files touched:** `index.html`, `functional-life.html`, `meaning-of-life.html`, `shared.css`

#### 3.2.5 Mobile nav — close on backdrop tap

**Problem:** The overlay has no way to close except tapping a link. On mobile, it's common to tap the darkened backdrop to dismiss a menu.

**Solution:**
- The overlay already has an `open` class toggle. Add a `click` listener on the overlay element itself that closes the nav when the backdrop (not a link) is tapped. `event.target === overlay` ensures link taps still navigate.
```js
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.remove('open');
});
```

**Files touched:** `shared.js`

#### 3.2.6 Philosopher appendix — extract to separate page

**Problem:** The 50-philosopher appendix on `meaning-of-life.html` is large (40+ inline divs), uses progressive disclosure that hides most entries, and is not searchable.

**Solution:**
- Extract the "Show all 50" list into a standalone `/philosophers.html` page.
- On `meaning-of-life.html`, keep the top 10 visible philosophers and change the toggle link to point to the new page: "Browse all 50 philosophers →".
- The new page uses the same nav, footer, and shared.css; has a simple search/filter (JS: filter by name as user types in a small input).
- This reduces the meaning-of-life page size by ~40% and makes the full list permanently accessible + searchable.

**Files touched:** new `philosophers.html`, `meaning-of-life.html`, `shared.js` (remove togglePhil, add filter logic for the new page), `shared.css`

---

## 4. What Is NOT in Scope (deferred to P2/P3)

| Item | Reason |
|------|--------|
| Dark mode | Requires full color token audit — P2 |
| Analytics | Needs a service decision (Plausible / Umami / GA4) — P2 |
| SSG migration | Architectural decision; requires tooling — P3 |
| Blog / content pipeline | Needs content strategy — P3 |
| Email capture | Requires a provider integration — P2 |
| OpenGraph / Twitter cards | Quick win; can be done alongside P0 — slipping into P0 scope in implementation |
| JSON-LD structured data | SSA-CMM model as schema.org — P3 |
| Print stylesheet | P2 |
| Animations / micro-interactions | P2 |
| i18n | Strategic; needs content — P3 |

---

## 5. Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Assessment persistence | localStorage (30-day TTL) | Zero dependencies, survives reload, no cookie banner needed |
| CTA tracking | UTM params only | No JS analytics added; links carry context to Thinkific |
| Font loading | Self-host woff2 + `@font-face` | Eliminates render-blocking, GDPR-friendly |
| Philosopher appendix | Separate page + inline search | Reduces page weight, improves discoverability |
| Section navigation | Thin dot-tracker (not sidebar) | Respects minimal design constraint |
| Active nav | `aria-current="page"` + underline | Semantic, accessible, minimal visual change |
| JS module pattern | Remove `export` (keep classic script) | Minimal diff; module pattern deferred to SSG migration |
| Color contrast | Shift `--g400` to #777 (was #999) | Single token change, AA pass across the palette |

---

## 6. File Change Summary

| File | Change Type | Notes |
|------|------------|-------|
| `shared.js` | Heavy edit | Remove `export`, add `localStorage` persistence, add nav active state, add backdrop close, add UTM link map, remove `togglePhilosophers` |
| `shared.css` | Moderate edit | Add `@font-face` blocks, add `.skip-link`, add nav active style, add section tracker styles, adjust `--g400` color, add philosopher page styles |
| `index.html` | Moderate edit | Remove Google Fonts links & preconnects, add `data-page="home"`, add skip-link, add favicon, update CTA links with UTM, add section tracker markup |
| `functional-life.html` | Light edit | Remove Google Fonts links & preconnects, add `data-page="functional-life"`, add skip-link, add favicon, update CTA links with UTM |
| `meaning-of-life.html` | Moderate edit | Remove Google Fonts links & preconnects, add `data-page="meaning-of-life"`, add skip-link, add favicon, update CTA links, replace phil-toggle with link to philosophers.html |
| `philosophers.html` | **New file** | Full philosopher list with search/filter, shared nav/footer |
| `favicon.svg` | **New file** | Minimal SVG favicon |
| `fonts/Inter-Regular.woff2` | **New binary** | Self-hosted font |
| `fonts/Inter-SemiBold.woff2` | **New binary** | Self-hosted font |
| `fonts/JetBrainsMono-Medium.woff2` | **New binary** | Self-hosted font |

---

## 7. Self-Review

- **Placeholder scan:** No TBDs or TODOs remain in this spec. All sections are complete.
- **Internal consistency:** The `localStorage` persistence approach is referenced in the assessment flow and the reset flow; they agree. Font self-hosting is referenced in CSS and HTML changes; they agree.
- **Scope check:** This is focused on P0+P1 improvements. P2/P3 items are explicitly excluded in §4. The implementation is scoped for a single round of work across ~8 files.
- **Ambiguity check:**
  - "Show section tracker only on home page" — clarified with `data-page` attribute matching.
  - "Self-host fonts" — clarified that the actual `.woff2` files must be downloaded from Google Fonts or sourced from the existing URL and placed in `fonts/`. No ambiguity on format.
  - "Contrast fix" — the token change `--g400` from #999 to #777 is explicitly stated, with a reference table of affected elements.
