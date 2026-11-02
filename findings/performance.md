# Performance Findings

## Observed positive indicators

- `Content-Encoding: br` — Brotli compression was used for the inspected document.
- `X-Vercel-Cache: HIT` — the inspected response was served from Vercel cache.
- `X-Nextjs-Prerender: 1` and `X-Nextjs-Stale-Time: 300` — Next.js prerender/stale-time metadata was present.
- RSC responses referenced static JS/CSS chunks.

## Opportunities

1. Measure LCP, INP, and CLS on desktop and mobile.
2. Review image sizing, modern formats, responsive delivery, and lazy-loading.
3. Track cache hit ratio and revalidation behaviour by route.
4. Monitor p50/p95/p99 latency and 4xx/5xx rates.
5. Reduce unused client-side JavaScript and third-party scripts.
6. Set route-specific cache policies; do not assume all routes are equally cacheable.

## Limitations

No load test, synthetic benchmark, or production stress test was performed. The browser request timings are single-session observations and should not be treated as representative performance metrics.
