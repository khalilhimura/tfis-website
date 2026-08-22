# Task 6: Update CTA links in shared.js (dynamic assessment CTAs)

**Goal:** Add UTM link map to shared.js and update dynamic CTA links in the assessment result.

**File to modify:** `shared.js` (repo root)

**Important:** This task builds on Task 5's changes. The file already has the `initAssessment` function with localStorage persistence, restored assessment, etc.

## Changes

### 1. Add link map inside `initAssessment`, after the newly-added `ASSESS_TTL` constant

```js
const TFIS_LINKS = {
  whitepaper: 'https://mesolitica.thinkific.com/products/digital_downloads/tfis-whitepaper?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=whitepaper',
  course: 'https://mesolitica.thinkific.com?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=course',
};
```

### 2. In `showResultForLevel`, after setting the CTA card visibility and grid, add:

```js
// Update CTA links with UTM tracking
document.querySelectorAll('.cta-card .btn').forEach(btn => {
  if (btn.getAttribute('href')?.includes('whitepaper')) btn.href = TFIS_LINKS.whitepaper;
  else if (btn.textContent?.includes('Course')) btn.href = TFIS_LINKS.course;
});
```

The current code around that area (after Task 5) handles `cards.style` and showing/hiding foundation/architect cards. Add this block after the `gridTemplateColumns` assignment.

## Verification
- Read the file and confirm `TFIS_LINKS` is defined and `showResultForLevel` contains the link update block
- The static links in HTML were already updated in Task 3

## Report
Write to `.superpowers/sdd/tfis-site-optimization/task-6-report.md` with:
- Confirmation of link map added
- Confirmation of showResultForLevel update
- Git status
- Commit message: "feat(js): add UTM link map for dynamic assessment CTA links"
