# TFIS Website

[thefutureissolo.com](https://thefutureissolo.com)

The **Future Is Solo** — a framework for intellectual sovereignty in the agentic AI era. Built with Astro, deployed on Cloudflare Pages.

## Tech

- [Astro](https://astro.build) v7 — static site generation
- [Cloudflare Pages](https://pages.cloudflare.com) — hosting & CDN
- Static output, no SSR

## Quick start

```bash
npm install
npm run dev      # local dev at localhost:4321
npm run build    # production build to dist/
npm run preview  # preview the build locally
```

## Deployment

The `main` branch is deployed automatically to Cloudflare Pages:

- `https://tfis.pages.dev`
- `https://thefutureissolo.com`

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production (auto-deployed) |
| `v3`   | Archived v3 site (previous version) |
| `v4`   | Current development version |
