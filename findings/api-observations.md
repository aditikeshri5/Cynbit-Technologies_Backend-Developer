# API and Network Observations

## Observed requests

| Request pattern | Method/status | Evidence and interpretation |
|---|---|---|
| `/contact?_rsc=...` | GET / 200 | `text/x-component`; Next.js RSC-style page data, not a conventional JSON REST response |
| Main `/` document | GET / 200 (fresh capture) | `text/html; charset=utf-8`; Vercel response headers |
| Other route requests (`story`, `team`, `careers`, `impact`, `services`, `products`, `case-studies`) | GET / 200 or 304 | Browser-generated route/RSC requests; status varied with cache/revalidation |
| `collect?...` | 204 | Appears analytics-related based on request name; not treated as a business API |
| “Write us” interaction | Local email composer opened | Recipient `opportunities@cynbit.in`; no website POST observed |

## Interpretation

The `_rsc` query parameter and `text/x-component` response indicate Next.js React Server Component transport. A 304 response is a normal conditional-cache response and is not an error. A 204 response means no response body; the `collect` request name suggests analytics, but the destination/service should be verified before making a definitive attribution.

## What was not established

- No public JSON REST endpoint was confirmed from the captured requests.
- No contact-form POST was observed.
- No authentication flow or private API was tested.
- No database technology can be inferred from these browser requests.

## Next authorized checks

With written permission and a staging environment, request API documentation and test:
- Request/response schemas.
- Authentication and resource-level authorization.
- Validation and error contracts.
- Rate limits and idempotency.
- CORS and cache headers per endpoint.
