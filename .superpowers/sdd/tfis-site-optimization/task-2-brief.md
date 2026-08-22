# Task 2: Add @font-face, contrast fix, skip-link, tracker, phil-filter CSS

**Goal:** Modify `shared.css` to add self-hosted font declarations, fix color contrast, and add new component styles.

**File to modify:** `shared.css` (in repo root)

## Changes (in order)

**Note from Task 1:** Font files are woff2 format (the subagent resolved this by downloading TTF from Google Fonts and converting via woff2_compress). Use `format('woff2')` and `.woff2` extension in the `@font-face` URLs. Actual file paths: `fonts/Inter-Regular.woff2`, `fonts/Inter-SemiBold.woff2`, `fonts/JetBrainsMono-Medium.woff2`. All valid woff2.

### 1. Add @font-face blocks at the very top (before `:root`)

After the comment header block (lines 1-4) and before line 7 (`:root`), insert:

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

### 2. Fix color contrast — change `--g400`

In the `:root` block, change:
```
--g400: #999;
```
to:
```
--g400: #777;
```

### 3. Add skip-link styles

After the `::selection` and `::-moz-selection` block (line 57), add:

```css
/* ─── SKIP LINK ─── */
.skip-link{position:absolute;top:-100%;left:0;z-index:1000;padding:8px 16px;background:var(--accent);color:var(--white);font-family:var(--mono);font-size:.7rem;text-decoration:none;transition:top .15s}
.skip-link:focus{top:0;outline:none}
```

### 4. Add nav active page style

Find `nav .nav-right a:hover{color:var(--accent)}` and add after it:
```css
nav .nav-right a[aria-current="page"]{color:var(--accent);border-bottom:1px solid var(--accent)}
```

### 5. Add section tracker styles

Add before the FOOTER section (before `/* ─── FOOTER ─── */`):
```css
/* ─── SECTION TRACKER ─── */
.section-tracker{position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:50;display:flex;flex-direction:column;gap:10px;opacity:0;transition:opacity .4s}
.section-tracker.visible{opacity:1}
.section-tracker a{display:block;width:8px;height:8px;border-radius:50%;background:var(--g300);border:1px solid transparent;transition:all .2s;text-decoration:none}
.section-tracker a.active{background:var(--accent);border-color:var(--accent);transform:scale(1.3)}
.section-tracker a:hover{background:var(--accent);border-color:var(--accent)}
@media(max-width:640px){.section-tracker{display:none}}
```

### 6. Add assessment greeting style

Add after the `.assess-retake` block:
```css
.assess-greeting{font-family:var(--mono);font-size:.72rem;color:var(--g500);margin:16px 0 -16px;padding:0 4px}
```

### 7. Add philosopher page filter styles

Add at the end of the file (before FOOTER if that's the end):
```css
/* ─── PHILOSOPHER SEARCH ─── */
.phil-search{margin:20px 0 24px}
.phil-search input{width:100%;padding:10px 14px;font-family:var(--sans);font-size:.85rem;border:1px solid var(--g200);border-radius:4px;outline:none;transition:border-color .2s;color:var(--g900)}
.phil-search input:focus{border-color:var(--accent)}
.phil-search input::placeholder{color:var(--g400)}
```

## Verification
- Read the final `shared.css` and confirm no syntax errors
- The file should have no `export` statements (those are in shared.js, not CSS)
- Make sure the existing rules are intact — only add/modify what's listed above

## Report
Write to `.superpowers/sdd/tfis-site-optimization/task-2-report.md` with:
- Confirmation each change was made
- Line numbers of each inserted/modified block
- Git status
- Commit message: "feat(css): self-host fonts, fix g400 contrast, add skip-link, section tracker, phil-filter, greeting styles"
