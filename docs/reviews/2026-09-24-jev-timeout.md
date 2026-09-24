# Jev timeout and non-JSON error recovery

## Evidence

The production browser reported HTTP 504 after 15,091 ms and exposed a JSON parse error because the response was HTML. Live Pages logs captured a handled 504 at 15,001 ms (5 ms CPU, no exceptions), matching the proxy's 15-second deadline. Replaying the submitted evidence reproduced its reported L3 and pillar scores, then returned HTTP 200 from `jev-1.13.0` after 8,461 ms. The user also confirmed retry succeeds. This is an intermittent timeout, not invalid assessment evidence. The exact cause of the provider's variable latency is not established.

## Change

Give the provider 45 seconds and the browser 55 seconds. Both requests advertise `Accept: application/json`. The browser retains HTTP status even when an error body cannot be parsed, displays a readable timeout/retry message, and preserves the submitted answers. Diagnostics retain content type, Cloudflare Ray ID, and Retry-After; raw HTML is not saved or rendered. Successful malformed responses remain unvalidated. The cache key advances to `app.js?v=7`.

Cloudflare documents that [error responses default to HTML unless a structured format is requested](https://developers.cloudflare.com/fundamentals/reference/error-responses/), and custom error configuration can still override that negotiation. The client therefore handles either format. Live evidence confirms the timeout; it does not establish which edge layer produced the reported HTML.

## Verification

Four new regressions failed before the fix: HTML 504/retry, malformed or structured gateway responses, a provider response after 15 seconds, and a browser response after 20 seconds. They pass after the fix; stalled requests remain bounded. All 62 tests and the 57-page Astro build pass. The exact submitted payload is kept out of repository fixtures.
