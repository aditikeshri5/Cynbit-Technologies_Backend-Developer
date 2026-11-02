# Backend Technical Audit Report — Cynbit

## 1. Executive summary

A passive review of `https://www.cynbit.in/` was performed from a backend developer's perspective. The strongest evidence indicates that the public site uses Next.js-style React Server Component (RSC) navigation and is delivered through Vercel infrastructure. The main document response exposed an HSTS policy and Brotli compression. The public “Write us” control opened an email composition window addressed to `opportunities@cynbit.in`.

No vulnerability was confirmed during this limited review. The most useful engineering opportunities are to document and test cache boundaries, apply a deliberate security-header baseline, scope CORS policies appropriately on API routes, and ensure that any inquiry-processing workflow has server-side validation, abuse controls, and reliable error handling.

## 2. Scope and methodology

### In scope
- Public pages and publicly generated browser requests on `www.cynbit.in`.
- Main document response headers.
- Publicly observable Next.js/RSC-style navigation requests.
- Visible contact-page interaction.

### Out of scope
- Authentication bypass, authorization testing, private endpoints, directory discovery, fuzzing, injection attempts, credential attacks, load testing, exploitation, and access to non-public systems.
- Submission of fabricated contact information.
- Source-code or database inspection.

### Method
Microsoft Edge DevTools Network panel was used with Fetch/XHR and Doc filters. Requests were observed during normal page loading. Only browser-generated, publicly accessible traffic was inspected.

## 3. Observed architecture and request behaviour

### 3.1 Next.js / React Server Components indicators

The public `/contact` page generated a request with:
- Method: `GET`
- Query parameter: `_rsc`
- Status: `200 OK`
- Response content type: `text/x-component`

The response preview contained React/Next.js component-stream markers and references to static chunks. Together, these are strong indicators of Next.js App Router / React Server Component transport.

**Interpretation:** This request is page-rendering/navigation data, not evidence of a conventional JSON REST API. The observation does not reveal the private backend implementation or data store.

**Recommendation:** Keep server-rendered page payloads free of secrets and user-specific data that should not be disclosed. Treat all server/client boundaries deliberately and review what is serialized into RSC payloads.

### 3.2 Hosting and delivery

The main document response exposed:
- `Server: Vercel`
- `X-Vercel-Cache: HIT`
- `X-Vercel-Id` containing a `bom1` location identifier
- `X-Nextjs-Prerender: 1`
- `X-Nextjs-Stale-Time: 300`
- `Vary` values associated with RSC and Next.js router state.

**Interpretation:** The public site is delivered through Vercel, and the inspected response was served as a cache hit. The `bom1` identifier is consistent with a Mumbai-region Vercel point of presence. These headers are infrastructure metadata, not a vulnerability by themselves.

### 3.3 Caching

The inspected response included:
- `Cache-Control: public, max-age=0, must-revalidate`
- `X-Vercel-Cache: HIT`
- An `Age` value was present in the captured response.

The combination warrants a configuration review. `max-age=0, must-revalidate` tells a browser to revalidate before treating the response as fresh; intermediary cache behaviour can still be governed by platform configuration and other cache directives.

**Recommendation:** Explicitly classify routes as public-static, public-dynamic, or private/personalized. Use shared caching only for public content. For personalized responses, use `private, no-store` (or an intentionally designed private caching policy), and verify that cache keys vary on every relevant dimension. Test with two separate authenticated test accounts in an authorized staging environment.

## 4. Security observations

### 4.1 HSTS — positive control

The main document response included:

`Strict-Transport-Security: max-age=63072000`

This sets a two-year HSTS max-age (63,072,000 seconds). It is a positive HTTPS enforcement control for browsers that have received the header.

**Opportunity:** Evaluate `includeSubDomains` only after confirming all applicable subdomains support HTTPS. Consider preload only after reviewing preload requirements and operational impact.

### 4.2 CORS — review required

The main document response showed:

`Access-Control-Allow-Origin: *`

A wildcard on a public, non-credentialed resource is not automatically a vulnerability. CORS should be evaluated on actual API responses and in conjunction with credential behaviour, allowed methods, allowed headers, and exposed headers.

**Recommendation:** For APIs that return public data, wildcard access may be intentional. For private or user-specific APIs, use an explicit origin allowlist, do not combine wildcard origins with credentialed requests, and validate `Origin` server-side where appropriate.

### 4.3 Other security headers — not fully established

The captured response-header screenshots did not show a complete, exhaustive header list for every route. Therefore this report does **not** claim that CSP, `X-Content-Type-Options`, `X-Frame-Options`, or `Permissions-Policy` are definitively absent.

**Recommendation:** Verify the complete headers on representative document and API responses. Consider:
- A tested Content-Security-Policy, including `frame-ancestors`.
- `X-Content-Type-Options: nosniff`.
- A deliberate `Referrer-Policy`.
- `Permissions-Policy` restricted to required browser capabilities.

### 4.4 Public metadata

Headers such as `Server`, `X-Vercel-Cache`, `X-Vercel-Id`, and Next.js metadata disclose hosting/framework clues. These are common operational headers and do not establish exploitable information disclosure.

**Recommendation:** Retain useful observability where needed, but avoid exposing secrets, stack traces, internal hostnames, environment variables, or sensitive identifiers in public responses.

## 5. Contact workflow observation

The public Contact page displayed a “Write us” action. Clicking it opened the local Outlook email composer with `opportunities@cynbit.in` populated as the recipient.

**Interpretation:** The observed button initiates an email-composition workflow (likely a `mailto:` link or equivalent browser handoff). This interaction did not demonstrate a website form submission, an HTTP POST, or a server-side inquiry API.

**Recommendation:** If email is the intended contact path, make the recipient and subject clear, provide a fallback address/contact route, and avoid implying that an inquiry has been submitted until the email is actually sent. If a web form is also offered, validate all fields server-side, protect against automated abuse, and return a clear confirmation only after successful processing.

## 6. Performance observations

Positive indicators:
- Brotli content compression (`Content-Encoding: br`) was observed.
- Vercel edge cache hit was observed.
- Next.js prerendering metadata was present.
- Static JavaScript/CSS chunk references appeared in the RSC stream.

Potential improvements:
1. Measure Core Web Vitals (LCP, INP, CLS) using representative devices and network conditions.
2. Audit image dimensions, responsive variants, and lazy-loading behaviour.
3. Review route-level caching and revalidation strategy.
4. Avoid unnecessary client-side JavaScript and large third-party scripts.
5. Monitor cache hit ratio, origin latency, error rate, and p95/p99 response latency.

No load or stress testing was performed.

## 7. Error handling, validation, and authentication

The passive inspection did not exercise a backend form submission or authenticated workflow. Therefore, server-side validation, authentication, authorization, and error handling could not be assessed conclusively.

Recommended controls:
- Validate request bodies with a schema on the server.
- Enforce maximum request sizes and field lengths.
- Normalize and validate email addresses; do not trust browser validation alone.
- Use consistent JSON error envelopes and avoid returning stack traces.
- Apply rate limits to public inquiry endpoints.
- Use authentication and resource-level authorization for private product APIs.
- Log request IDs and security-relevant events without logging passwords, tokens, or unnecessary personal data.

## 8. Prioritized recommendations

| Priority | Recommendation | Rationale |
|---|---|---|
| P1 | Verify cache isolation for private/user-specific routes | Prevent accidental cross-user data exposure |
| P1 | Validate and rate-limit any inquiry API server-side | Protect data integrity and reduce abuse |
| P1 | Review CORS on actual API endpoints | Ensure origin policy matches data sensitivity |
| P2 | Establish a tested security-header baseline | Improve browser-side defence in depth |
| P2 | Standardize error responses and request IDs | Improve reliability and troubleshooting |
| P2 | Monitor p95 latency, cache hit ratio and 5xx rate | Make performance measurable |
| P3 | Review RSC payload size and client bundle | Reduce navigation and rendering cost |

## 9. Conclusion

The public website shows a modern Next.js/Vercel delivery pattern with edge caching, prerendering metadata, Brotli compression, and HSTS. The most valuable next step is not speculative penetration testing; it is a scoped engineering review of cache boundaries, API-specific CORS/security headers, and any server-side inquiry-processing service. Deeper conclusions require authorized access to route specifications, source/configuration, and staging test accounts.
