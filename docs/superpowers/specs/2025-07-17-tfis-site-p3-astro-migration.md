# TFIS Site P3 — Astro Migration & Writing Platform

## 1. Purpose

Migrate the current hand-edited static HTML site to **Astro 7**, introducing a Markdown-driven writing platform (`/writing`) while preserving every existing page, URL, design token, and feature built in P0-P2.

**The goal is not to change how the site looks. It's to change how content is created.** Instead of editing HTML files to publish an essay, you drop a `.md` file into a folder.

---

## 2. Constraints

- **All existing URLs must work.** `/`, `/functional-life.html`, `/meaning-of-life.html`, `/philosophers.html`, `/404.html`, `/feed.xml` — every link stays valid.
- **All existing features must work.** Dark mode toggle, assessment persistence, section tracker, philosophers search, UTM links, skip-link, OG tags, analytics.
- **Zero visual regressions.** The Atkinson + JetBrains Mono design system, spacing, colors, breakpoints — identical output.
- **Progressive adoption.** The current hand-edited pages coexist with the new Astro output during migration. You can migrate one page, verify it, then do the next.
- **Stay static.** Astro builds to plain HTML/CSS/JS in `dist/`. No server-rendered routes, no Node.js at runtime.

---

## 3. Architecture

```
tfis-site/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro      # <html>, <head>, nav, footer, scripts
│   ├── pages/
│   │   ├── index.astro           # Home page (migrated from index.html)
│   │   ├── functional-life.astro # Essay (migrated from functional-life.html)
│   │   ├── meaning-of-life.astro # Essay (migrated from meaning-of-life.html)
│   │   ├── philosophers.astro    # Appendix (migrated from philosophers.html)
│   │   ├── 404.astro             # 404 page
│   │   ├── writing/
│   │   │   └── index.astro       # Writing index (new — lists all posts)
│   │   │   └── [...slug].astro   # Individual post route
│   │   └── feed.xml.ts           # RSS feed generated from content collection
│   ├── content/
│   │   └── writing/
│   │       ├── functional-life.md    # Existing essay as Markdown
│   │       └── meaning-of-life.md    # Existing essay as Markdown
│   ├── styles/
│   │   └── shared.css            # Moved from root (unchanged)
│   └── scripts/
│       └── shared.js             # Moved from root (unchanged)
├── public/
│   ├── fonts/                    # Static assets (moved from root)
│   ├── favicon.svg
│   └── _redirects (if needed)
├── astro.config.mjs
├── tsconfig.json
├── package.json
└── shared.css (delete after migration) + shared.js (delete after migration)
```

**Key design decisions:**

- **`.astro` pages for the migrated existing content.** The home page, essays, and philosophers page are `.astro` files — they have HTML-like templates that directly embed the existing markup. No Markdown conversion for the complex interactive pages (assessment, ladder, architecture reveal).
- **Markdown (`.md`) for new writing.** The `src/content/writing/` collection holds Markdown files with frontmatter. Astro generates listing and individual post pages from them.
- **CSS and JS stay exactly as they are.** `shared.css` and `shared.js` are copied into `src/` unchanged. No refactoring. No converting to Astro components.
- **`public/` for static assets.** Fonts, favicon, and any binary assets live in `public/` and get copied to `dist/` verbatim.
- **RSS generated programmatically.** Astro's `@astrojs/rss` plugin generates `/feed.xml` from the writing collection + the 2 existing essays.

---

## 4. Scope

### 4.1 Scaffold Astro project

```bash
npm create astro@latest . -- --template minimal --yes --no-install
npm install
```

Then remove the default boilerplate and add dependencies:
```bash
npm install @astrojs/rss
```

**Files created:**
- `package.json`, `astro.config.mjs`, `tsconfig.json`
- `src/layouts/`, `src/pages/`, `src/content/config.ts`

### 4.2 Create BaseLayout

One Astro layout component that contains the `<html>`, `<head>` (meta, OG tags, favicon, RSS alternate link, CSS, inline theme script, analytics), `<body>` (skip-link, nav, footer), and `<script>` loading `shared.js`.

The layout accepts:
- `title: string` — page title
- `description: string` — meta description
- `page: 'home' | 'functional-life' | 'meaning-of-life' | 'philosophers'` — for `data-page` and active nav
- `ogType?: 'website' | 'article'` — for OG meta
- `ogTitle?: string` — override for OG title (defaults to `title`)
- `ogDescription?: string` — override for OG description

This eliminates the duplicated `<head>`, nav, overlay, footer, and script tags across all 5 pages.

**Files created:**
- `src/layouts/BaseLayout.astro`

### 4.3 Migrate existing pages

| Current file | New Astro file | Complexity |
|-------------|----------------|------------|
| `index.html` | `src/pages/index.astro` | **High** — assessment JS, drill sections, pillar cards, spectrum, architecture reveal, section tracker. Must preserve all interactive behavior. |
| `functional-life.html` | `src/pages/functional-life.astro` | Medium — essay content, axioms, pairs, CTA block |
| `meaning-of-life.html` | `src/pages/meaning-of-life.astro` | Medium — essay content, top-10 philosophers, link to philosophers page |
| `philosophers.html` | `src/pages/philosophers.astro` | Low — 50-item listing with search input |
| `404.html` | `src/pages/404.astro` | Low — simple error page |

**Migration approach per page:**
1. Create `.astro` file wrapping the existing markup in `BaseLayout`
2. Copy the HTML body content (inside `<main>`) directly into the Astro template
3. Verify the rendered output matches the original pixel-for-pixel
4. Delete the old `.html` file (or keep it during transition)

### 4.4 Set up content collection for writing

Create `src/content/config.ts`:
```ts
import { defineCollection, z } from 'astro:content';

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { writing };
```

**Files created:**
- `src/content/config.ts`
- `src/content/writing/` (initially empty — for future posts)

### 4.5 Create writing listing and post pages

**Writing index** (`src/pages/writing/index.astro`):
- Lists all published posts (not draft) from the writing collection
- Each entry shows: title, date, description, tags
- Simple layout matching the TFIS design system

**Post route** (`src/pages/writing/[...slug].astro`):
- `getStaticPaths()` generates a page per post
- Renders the Markdown content through Astro's built-in content rendering
- Wraps in BaseLayout

### 4.6 Generate RSS feed from content

Create `src/pages/feed.xml.ts`:
```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('writing');
  return rss({
    title: 'The Future Is Solo',
    description: 'Intellectual sovereignty in the agentic AI era.',
    site: 'https://thefutureissolo.com',
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/writing/${post.slug}/`,
    })),
  });
}
```

The existing `feed.xml` can be kept or removed — this generates the same feed dynamically.

### 4.7 Move static assets

- `shared.css` → `src/styles/shared.css`
- `shared.js` → `src/scripts/shared.js`
- `fonts/` → `public/fonts/`
- `favicon.svg` → `public/favicon.svg`

**Files changed:**
- Update path references in `BaseLayout.astro` to point to `src/styles/shared.css` and `src/scripts/shared.js`

### 4.8 Configure Astro

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://thefutureissolo.com',
  output: 'static',
  build: {
    format: 'file', // generates functional-life.html, not functional-life/index.html
  },
});
```

The `build.format: 'file'` option is critical — it produces `functional-life.html` (flat) instead of `functional-life/index.html`, preserving all existing URLs.

### 4.9 Migration order

| Phase | Pages | Verification |
|-------|-------|-------------|
| **1. Scaffold + layout** | — | Astro dev server starts |
| **2. 404.astro** | 404 | Navigate to `/nonexistent` → shows 404 |
| **3. philosophers.astro** | Philosophers | Search works, all 50 present |
| **4. functional-life.astro** | Functional Life | All axioms, pairs, CTAs render |
| **5. meaning-of-life.astro** | Meaning of Life | Top-10 philosophers, link to philosophers |
| **6. index.astro** | Home | Assessment works, dark mode, section tracker, spectrum, pillars, architecture reveal, all interactive |
| **7. Content collection + writing routes** | Writing index | `/writing/` shows empty state |
| **8. RSS feed** | feed.xml | Valid Atom XML at `/feed.xml` |

Each step is independently verifiable — you can `npm run dev` and check only the migrated page while others are still served from `.html`.

---

## 5. What Stays the Same

| Feature | How it survives migration |
|---------|--------------------------|
| Dark mode toggle | `shared.js` untouched, inline theme script in BaseLayout |
| Assessment persistence | `shared.js` untouched |
| Section dot-tracker | `shared.js` + CSS untouched |
| Philosopher search | `shared.js` + CSS untouched |
| UTM links | Hardcoded in Astro templates |
| OG tags | Moved to BaseLayout props |
| RSS feed | Generated from Astro content collection |
| Print stylesheet | In shared.css, untouched |
| Atkinson + JetBrains Mono | In shared.css, fonts in public/ |
| All URLs | `build.format: 'file'` preserves flat `.html` extension |

---

## 6. What Changes

| Change | Benefit |
|--------|---------|
| `index.html` → `src/pages/index.astro` | Component reuse, no duplicated `<head>`/nav/footer |
| Google Fonts removal | ✅ Already done in P0 |
| Writing content as `.md` | Write in Markdown, published automatically |
| Feed generated programmatically | Always in sync with content |
| Build step required | `npm run build` outputs `dist/` |
| `shared.css` / `shared.js` in `src/` | Cleaner root, Astro handles cache-busting |

---

## 7. Not in Scope (This Phase)

- **Redesigning the home page or any existing page.** Visual output is identical.
- **Converting CSS/JS to Astro components or modules.** They stay vanilla.
- **Adding comments, webmentions, or social features.** That's a later addition.
- **i18n / Malay language support.** Strategic, not structural.
- **Visual changes to the assessment, philosophers page, or any interactive element.**

---

## 8. Design Decisions for You

1. **`build.format: 'file'` vs `'directory'`** — File mode produces `functional-life.html` (preserving URLs). Directory mode produces `functional-life/index.html` (cleaner URLs, needs redirects). **Recommendation:** `'file'` — zero redirects, zero broken links.
2. **Writing index URL** — `/writing/` vs `/blog/`. **Recommendation:** `/writing/` — more natural for essays, less generic.
3. **Keep the old `.html` files during migration?** — Yes, they can coexist with Astro's output. Delete them only after verifying the Astro version is identical.
4. **Existing feed.xml** — Keep the hand-crafted file or let Astro generate it. **Recommendation:** Let Astro generate it — it stays in sync automatically. Keep the old one as `feed-legacy.xml` during migration for comparison.
5. **TypeScript strictness** — Astro scaffolds with strict TS. The migrated pages won't use TS (they're just HTML templates). **Recommendation:** Accept the defaults, don't fight it.
