# Security Findings and Recommendations

## Confirmed observations

### S1 — HSTS is enabled
- Evidence: `Strict-Transport-Security: max-age=63072000`
- Assessment: Positive control; two-year max-age.
- Recommendation: Evaluate `includeSubDomains` and preload only after confirming subdomain readiness.

### S2 — Wildcard CORS header on the inspected homepage response
- Evidence: `Access-Control-Allow-Origin: *`
- Assessment: Context-dependent. Not a vulnerability by itself for public non-credentialed content.
- Recommendation: Inspect actual API responses. Use an explicit allowlist for private/user-specific endpoints. Never pair wildcard origin with credentialed CORS.

### S3 — Hosting/framework metadata is exposed
- Evidence: `Server: Vercel`, `X-Vercel-Cache`, `X-Vercel-Id`, `X-Nextjs-Prerender`.
- Assessment: Informational; common platform headers.
- Recommendation: Ensure no secrets, stack traces, or internal infrastructure details are exposed.

## Items requiring verification

The available screenshots do not establish whether CSP, `X-Content-Type-Options`, `X-Frame-Options`, and `Permissions-Policy` are absent from every response. Verify complete headers across representative routes before raising a finding.

## Recommended baseline

- Content-Security-Policy with a tested `default-src` and `frame-ancestors` policy.
- `X-Content-Type-Options: nosniff`.
- HSTS on HTTPS responses.
- Explicit `Referrer-Policy`.
- Least-privilege `Permissions-Policy`.
- API-specific CORS policy.
- Server-side schema validation, request size limits, rate limits, and safe error responses.
