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

## Nous-Jev Integration

The site integrates with the Nous-Jev Worker API for memory record validation.

### Configuration

The Worker API base URL is configured in:

- **Demo page**: `/public/nous-jev/app.js` — `API_BASE_URL` constant
- **SovMemGrok integration**: `/public/sovmem-grok/app.js` — `JEV_API_BASE` constant

Default Worker endpoint: `https://nous-jev.khalil-himura.workers.dev`

### Features

1. **Nous-Jev Demo** (`/nous-jev/`)
   - Interactive comparison tool for two memory records
   - Displays confidence scores and suggestions
   - Uses Worker `/api/compare` endpoint

2. **SovMemGrok Capture Gate**
   - Validates records before saving to localStorage
   - Shows suggestions if confidence below threshold (0.75)
   - Prompts user to confirm or mark as "needs revision"
   - Gracefully degrades if Worker API unavailable

3. **SovMemGrok Export Gate**
   - Batch validates all records before OKF export
   - Lists records with validation issues
   - Options: Fix, Export Anyway, or Cancel
   - Soft-fail if Worker API unavailable

### API Endpoints

- `POST /api/jev` — validate single record
- `POST /api/compare` — compare two records

See the [nous-jev repository](https://github.com/khalilhimura/nous-jev) for Worker API details.

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production (auto-deployed) |
| `v3`   | Archived v3 site (previous version) |
| `v4`   | Current development version |
