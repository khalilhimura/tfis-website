# TFIS Site P2 — Design Spec

## 1. Purpose

Layer on delight, community-building, and observability while keeping the site fully static, zero-dependency, and consistent with the existing design system. Each item is independently deployable.

**Constraint:** No backend, no build step, no external JS frameworks. Vanilla JS + plain CSS. Same design tokens from `shared.css`.

---

## 2. Scope — P2 Items

### 2.1 Analytics (Quick Win)

**Problem:** No visibility into how visitors interact with the site — which CTAs get clicked, where users drop off in the assessment, which essays resonate.

**Options:**
| Service | Cost | JS footprint | GDPR-friendly | Notes |
|---------|------|-------------|---------------|-------|
| **Plausible** (Recommended) | ~€10/mo self-host or €9/mo Cloud | < 1 KB | ✅ Yes (no cookies) | Built for indie projects; dashboard is clean |
| **Umami** | Free self-host | ~2 KB | ✅ Yes (no cookies) | More setup, self-hosted |
| GA4 | Free | ~45 KB | ❌ Needs cookie banner | Overkill for this site |

**Recommendation:** Plausible. One `<script>` tag, no cookie banner needed, privacy-first. The TFIS audience (solo developers, AI engineers) is exactly the Plausible demographic.

**Implementation:**
```html
<script defer data-domain="thefutureissolo.com" src="https://plausible.io/js/script.js"></script>
```
- Add to `<head>` of all pages (or just `index.html` if that's the landing entry).
- No custom events needed initially — pageviews and outbound link clicks are tracked automatically.
- If/when the assessment becomes a funnel, add `plausible('SSA-Assessment-Complete', {props: {level: 'L3'}})` in `finishAssessment()`.

**Files touched:** `index.html` (and possibly other pages)

### 2.2 Email Capture (Quick Win)

**Problem:** No way for interested visitors to subscribe for updates, new essays, or product launches.

**Options:**
| Service | Free tier | Form type | Notes |
|---------|-----------|-----------|-------|
| **Buttondown** (Recommended) | Free up to 1K subs | API or embed | Developer-friendly, plain-text aesthetic fits TFIS |
| ConvertKit | Free up to 1K subs | Embed or JS | More features, heavier |
| Mailchimp | Free up to 500 subs | Embed | Overkill, dated UX |
| Beehiiv | Free up to 2.5K subs | Embed | Growing, newsletter-first |

**Recommendation:** Buttondown. API-first, minimalist, the "solo developer" newsletter vibe matches TFIS perfectly.

**Implementation (Buttondown inline form):**
```html
<form class="subscribe-form" action="https://buttondown.com/api/emails/embed-subscribe/{your-username}" method="post" target="popupwindow">
  <label for="bd-email" class="subscribe-label">Subscribe for updates</label>
  <div class="subscribe-row">
    <input type="email" name="email" id="bd-email" class="subscribe-input" placeholder="your@email.com" required>
    <input type="hidden" value="1" name="embed">
    <button type="submit" class="btn btn--accent btn--small">Subscribe</button>
  </div>
</form>
```

**Placement:** Footer of all pages, plus optionally as a subtle inline CTA after the assessment result.

**CSS needed:**
```css
.subscribe-form{margin:24px 0}
.subscribe-label{font-family:var(--mono);font-size:.62rem;text-transform:uppercase;letter-spacing:.06em;color:var(--g500);display:block;margin-bottom:8px}
.subscribe-row{display:flex;gap:8px;max-width:360px}
.subscribe-input{flex:1;padding:10px 14px;font-family:var(--sans);font-size:.82rem;border:1px solid var(--g200);border-radius:3px;outline:none;color:var(--g900)}
.subscribe-input:focus{border-color:var(--accent)}
```

**Files touched:** `shared.css`, `index.html` (footer), plus setting up a Buttondown account.

### 2.3 Print Stylesheet (Quick Win)

**Problem:** The essays (Functional Life, Meaning of Life) are reading material. Printing or saving as PDF gives an unstyled, broken layout.

**Implementation:** Add a print stylesheet block at the end of `shared.css`:
```css
/* ─── PRINT ─── */
@media print {
  nav, footer, .section-tracker, .skip-link, .cta-block, .cta-cards { display:none!important }
  body { padding-top:0!important; font-size:12pt; color:#000; background:#fff }
  .container { max-width:100%; padding:0 }
  a { color:#000; text-decoration:underline }
  h2, h3 { page-break-after:avoid }
  p, li { orphans:3; widows:3 }
}
```

**Files touched:** `shared.css`

### 2.4 404 Page (Quick Win)

**Problem:** Navigating to a non-existent path shows a generic browser error page.

**Implementation:** Create `404.html` with the same nav/footer as other pages, a simple message, and links back to home and the assessment:

```html
<main id="main-content" style="min-height:60vh;display:flex;align-items:center">
  <div class="container" style="text-align:center">
    <p class="num-stamp" style="color:var(--g400)">404</p>
    <h2>This page doesn't <em>exist</em></h2>
    <p style="max-width:40ch;margin:0 auto 28px">Sovereignty means knowing where you are. This URL leads nowhere — but the path forward is clear.</p>
    <div class="btn-group" style="justify-content:center">
      <a href="/" class="btn btn--accent">Back Home →</a>
      <a href="/#ladder" class="btn btn--ghost">Take the Assessment →</a>
    </div>
  </div>
</main>
```

**Note:** On static hosts (S3, Cloudflare Pages, Netlify), the 404 page is served automatically. No server config needed.

**Files touched:** new `404.html`

### 2.5 RSS / Atom Feed (Quick Win)

**Problem:** The TFIS audience includes solo developers and indie hackers who use RSS readers. No feed means no subscription path outside email.

**Implementation:** Create `/feed.xml` — a hand-crafted Atom feed pointing to the current content:

```xml
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>The Future Is Solo</title>
  <link href="https://thefutureissolo.com/" rel="self"/>
  <link href="https://thefutureissolo.com/"/>
  <updated>2025-07-17T00:00:00Z</updated>
  <author><name>Khalil Nooh</name></author>
  <id>urn:uuid:tfis-feed</id>
  <entry>
    <title>The Functional Life</title>
    <link href="https://thefutureissolo.com/functional-life.html"/>
    <updated>2025-07-17T00:00:00Z</updated>
    <id>urn:uuid:functional-life</id>
    <summary>What is the meaning of life? Aristotle supplies the structure. Feynman supplies the method. The Solo Systems Architect supplies the practice.</summary>
  </entry>
  <entry>
    <title>The Meaning of Life: A Techno-Optimist's Response</title>
    <link href="https://thefutureissolo.com/meaning-of-life.html"/>
    <updated>2025-07-17T00:00:00Z</updated>
    <id>urn:uuid:meaning-of-life</id>
    <summary>A response to 2,500 years of philosophy from a techno-optimist building in Malaysia.</summary>
  </entry>
</feed>
```

Add a feed link in the `<head>` of all pages:
```html
<link rel="alternate" type="application/atom+xml" title="The Future Is Solo" href="/feed.xml">
```

Also add a visible "RSS" link in the footer.

**Files touched:** new `feed.xml`, `index.html`, `functional-life.html`, `meaning-of-life.html`, `philosophers.html`
(Add `<link rel="alternate">` to `<head>` and RSS link to footer on all pages)

### 2.6 Dark Mode (Medium Effort)

**Problem:** The target audience (solo developers, AI engineers, indie hackers) works in dark IDEs and terminals. A white-only site feels out of place.

**Approach:** Add `prefers-color-scheme: dark` media query. No toggle button — respect the OS setting (simpler, zero JS, no state management).

**What changes:**
- Background: `#fff` → `#111`
- Text: `#000`/`#333`/`#555` → `#ddd`/`#bbb`/`#999`
- Accent: Keep `#c8511e` (it works on dark backgrounds)
- Cards/borders: `#e6e6e6` → `#333`
- Nav: keep dark background matching body

```css
@media (prefers-color-scheme: dark) {
  :root {
    --g100: #1a1a1a;
    --g200: #2a2a2a;
    --g300: #444;
    --g400: #888;
    --g500: #aaa;
    --g600: #ccc;
    --g800: #ddd;
    --g900: #eee;
    --black: #eee;
    --white: #111;
    --accent-light: #2a1a10;
  }
  body { background: #111; color: #ddd }
  nav { background: #111 }
  .card, .ladder li { border-color: #2a2a2a }
  .spectrum { background: #1a1a1a }
  .assess-intro, .assess-result, .plate { background: #1a1a1a }
  .btn { border-color: #444; color: #ddd }
  .btn--accent { border-color: var(--accent) }
  .btn--ghost:hover { border-color: #ddd; color: #ddd }
  img, svg { opacity: .9 }
}
```

**Files touched:** `shared.css`

**Caveat:** The accent-light (`#faf0eb`) becomes `#2a1a10` — subtle highlight that won't clash. The orange accent stays vibrant on dark backgrounds.

### 2.7 Micro-interactions (Optional / Medium)

**Problem:** The hero is static. A subtle animation could reinforce the "solo systems" aesthetic without violating the minimal constraint.

**Ideas (pick 0-2):**
- **Terminal cursor blink** on the hero subtitle or the SSA-CMM level name.
- **Spectrum dots gentle pulse** — the active "Pilot" dot has a slow breathing animation.
- **Assessment "skip" button fade** — subtle transition when navigating questions.

**Recommendation:** Just the terminal cursor blink on the hero stamp — one line of CSS:
```css
.hero-stamp::after {
  content: '▊';
  animation: blink 1s step-end infinite;
  color: var(--accent);
  margin-left: 4px;
}
@keyframes blink { 50% { opacity: 0 } }
```

**Files touched:** `shared.css`

---

## 3. Items NOT in this Phase

| Item | Reason |
|------|--------|
| Blog / content pipeline | Needs actual content strategy and writing — P3 |
| SSG migration (Astro/11ty) | Worthwhile when content exceeds ~15 pages — P3 |
| JSON-LD structured data | Effective after SSG migration — P3 |
| i18n / Malay | Strategic; needs content translation — P3 |
| Webmentions / comments | Needs a hosted service decision — P3 |
| Animations beyond cursor | Keep the minimal constraint — can revisit |

---

## 4. Summary: Effort x Impact Matrix

```
                    HIGH IMPACT
                      │
        Dark Mode     │  Analytics
        (medium)      │  (small)
                      │
──────────────┼──────────────
                      │
        404 Page     │  Email Capture
        (small)      │  (small)
        RSS Feed     │
        (small)      │  Print CSS
                      │  (small)
                    LOW IMPACT
```

**My recommendation for sequencing:**

| Round | Items | Rationale |
|-------|-------|-----------|
| **1** | Analytics, 404 page, RSS feed | Zero design decisions needed — implement immediately |
| **2** | Email capture, Print stylesheet | Need provider choice (Buttondown) — one decision each |
| **3** | Dark mode | Largest change — do after quick wins are settled |
| **4** | Micro-interactions (cursor blink) | Cherry on top — skip if time is short |

---

## 5. Design Decisions for You

1. **Analytics provider:** Plausible (recommended) vs Umami vs GA4
2. **Email provider:** Buttondown (recommended) vs ConvertKit vs Beehiiv — or skip entirely
3. **Dark mode:** OS-preference only (auto) vs add a manual toggle button
4. **Micro-interactions:** Terminal cursor blink on hero — yes or skip?
5. **RSS feed URL:** `/feed.xml` vs `/rss.xml` vs `/atom.xml` — any preference?
