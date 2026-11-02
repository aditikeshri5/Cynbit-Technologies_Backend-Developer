# Recommended Improvements

## P1 — Protect data boundaries
- Classify every route as public, authenticated, or privileged.
- Use `Cache-Control: private, no-store` for sensitive personalized responses where caching is not explicitly required.
- Verify CDN cache keys and revalidation rules.
- Test cache isolation using separate authorized staging accounts.

## P1 — Validate inquiry data server-side
- Apply a strict schema, maximum lengths, normalization, and safe output handling.
- Do not rely on HTML `required` or browser-side checks.
- Add rate limits and anti-automation controls to public endpoints.
- Avoid logging full message bodies unless there is a documented need.

## P1 — Scope CORS
- Allow only required origins on private APIs.
- Do not use wildcard origins with credentials.
- Limit allowed methods and headers.

## P2 — Security headers
- Add a carefully tested CSP, including `frame-ancestors`.
- Add `X-Content-Type-Options: nosniff`.
- Set an intentional Referrer-Policy and Permissions-Policy.
- Keep HSTS and assess subdomain/preload implications.

## P2 — Reliable errors
- Return consistent status codes and a stable error envelope.
- Include a request ID for support/debugging.
- Do not expose stack traces or internal exception details to clients.

## P2 — Observability
- Capture p95/p99 latency, cache hit ratio, 4xx/5xx rate, queue delay, and email-provider failures.
- Add alerts for sustained error-rate and latency regressions.

## P3 — Performance
- Track Core Web Vitals.
- Audit RSC payload and JS bundle size.
- Optimize images and third-party scripts.
