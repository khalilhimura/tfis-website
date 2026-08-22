# Task 1: Self-host fonts + add favicon (prep — resources first)

**Goal:** Download Inter and JetBrains Mono woff2 font files, create favicon SVG.

**Files to create:**
- `fonts/Inter-Regular.woff2`
- `fonts/Inter-SemiBold.woff2`
- `fonts/JetBrainsMono-Medium.woff2`
- `favicon.svg`

## Steps

### Step 1: Download fonts from Google Fonts

Run these curl commands from the repo root (`/Users/khalilhimura/Projects/tfis/tfis-site`):

```bash
mkdir -p fonts

# Inter Regular 400
curl -sL "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeAmM.woff2" -o fonts/Inter-Regular.woff2

# Inter SemiBold 600
curl -sL "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeAmM.woff2" -o fonts/Inter-SemiBold.woff2

# JetBrains Mono Medium 500
curl -sL "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbV2o-flEEny0FZhsfKu5WU4xrH9Q.woff2" -o fonts/JetBrainsMono-Medium.woff2
```

Verify: each file should be 15-35 KB and have a valid woff2 header.

### Step 2: Create favicon.svg

A minimal accent-colored dot SVG:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="10" fill="#c8511e"/>
</svg>
```

Write to `favicon.svg` in the repo root.

## Report

After completing, write a report to `.superpowers/sdd/tfis-site-optimization/task-1-report.md` containing:
- Each font file's size and confirmation it's a valid woff2 (`file fonts/*.woff2`)
- favicon.svg content verification
- `git status` output
- Commit hash after `git add -A && git commit -m "feat: self-host Inter + JetBrains Mono fonts; add favicon dot"`
