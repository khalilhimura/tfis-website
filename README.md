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
   - Checks typed answers, confidence, and adverse judgments with shared rules in `public/sovmem-grok/core.js`
   - Concerns require explicit **Save as Needs Revision**, **Retry evaluation**, or **Cancel & Revise**
   - An unavailable/malformed evaluation is never presented as a pass; a subsequent attempt retries the API
   - Jev's `ok` recommendation never automatically marks a record as human-reviewed
   - WebMCP capture/revision uses the same rules and saves concerning records as `needs-revision`

3. **SovMemGrok Export Gate**
   - Evaluates a fixed snapshot of all records sequentially before OKF export
   - Lists records with validation issues
   - Options: Fix, Export Anyway, or Cancel
   - API failures also require explicit **Export Anyway**; the export includes `jev-evaluations.json`
   - Filenames include record IDs so repeated titles do not overwrite one another; log links use the same paths

4. **Jev API metadata**
   - Expand **Jev API payload & response** in record details or either evaluation dialog
   - Shows the exact request JSON, full response body, endpoint, HTTP status, timestamp, round-trip time, and request error
   - The response JSON retains probabilities, legends, server latency, and any additional fields returned by the Worker
   - Capture/revision metadata is stored as `jev_evaluation` with the record and included in JSON backups. OKF exports include fresh evaluations of their export snapshot
   - Older records show “No evaluation recorded”; content edits invalidate older evidence. Historical imported evidence is labelled when its payload differs

### SovMemGrok evaluation policy

The Worker defines three-level Score questions: provenance `0 weak / 1 moderate / 2 strong` and load `0 calm / 1 stressed / 2 overloaded`. Scores are finite numbers from 0 to 2, not percentages. Choice/Score confidence must be present and at least 0.75; Noul is a probability and has no required confidence field. See [TypeSafe Score](https://docs.typesafe.ai/primitives/score) and [Noul](https://docs.typesafe.ai/primitives/noul).

The local gate flags type disagreement/noise, `needs_revision` or `escalate` recommendations, provenance below 0.5, and load at or above 1.5. Decisions require a stop-rule probability of at least 0.75 (below 0.5 means likely absent; 0.5–0.75 is uncertain). Claims/corrections can explicitly use `none`. These thresholds are application policy, not proof of factual accuracy or calibrated for a particular dataset.

### Local verification

Run `node --test tests/sovmem-regression.test.mjs` for the SovMemGrok regression suite and `npm run build` for the site build. The tests exercise the real DOM, storage, import/export ZIP, and WebMCP registration, with deterministic HTTP fixtures for success/failure/races.

The existing Nous-Jev Worker CORS allowlist includes `http://localhost:8080` but not Astro's default `http://localhost:4321`. For live browser checks, run `python3 -m http.server 8080 --bind 127.0.0.1 --directory public` from `tfis-site`, then open `http://localhost:8080/sovmem-grok/`. Astro's development server serves the static entry at `/sovmem-grok/index.html`; its port-4321 requests show the unavailable-evaluation flow until the separate Worker allowlist is updated. No Worker deployment is part of this frontend change.

The vendored `webmcp.js` has a small browser-export patch (`window.WebMCP = R`); retain it when replacing the bundle. The bridge uses that version's positional registration arguments.

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
