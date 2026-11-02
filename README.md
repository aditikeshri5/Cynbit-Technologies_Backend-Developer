# Cynbit — Backend Perspective Technical Audit

**Assessment:** Backend Developer Intern — Analyze Cynbit From a Backend Perspective  
**Target:** https://www.cynbit.in/  
**Assessment date:** 2 November 2026  
**Method:** Passive inspection of publicly accessible pages and browser-generated network traffic.

## Executive summary

This repository documents a bounded, non-invasive review of Cynbit's public website. The review observed Next.js-style React Server Component (RSC) page navigation, Vercel delivery/caching headers, HTTPS, HSTS, Brotli compression, and an email-composer action initiated by the “Write us” control.

The observations do **not** establish the implementation of private APIs, authentication, database access, or internal services. No exploitation, scanning, fuzzing, credential testing, form submission, load testing, or unauthorized access was performed. Findings are separated into observed facts, items requiring verification, and recommendations.

## Repository contents

- `report/backend-technical-audit.md` — full audit report and evidence.
- `findings/security.md` — security observations and risk prioritization.
- `findings/performance.md` — delivery and caching observations.
- `findings/api-observations.md` — observed request patterns and limits.
- `recommendations/architecture.md` — proposed backend architecture.
- `recommendations/improvements.md` — prioritized improvements.
- `examples/` — illustrative Node.js/Express snippets for validation, errors, CORS, and rate limiting.

## How to use the examples

These are **reference implementation snippets**, not code extracted from Cynbit and not claims about its production stack. They can be adapted to an authorized backend service.

```bash
npm init -y
npm install express zod helmet cors express-rate-limit
```

The snippets assume a modern Node.js runtime and Express. Review configuration and test in a staging environment before production use.

## Evidence handling

Evidence was collected from Microsoft Edge DevTools using the Network panel. Screenshots and notes were captured manually. Dynamic values such as request IDs, cache age, ETags, timestamps, and IP addresses may change between visits.

## Important limitations

This is a black-box review of the public website only. It is not a penetration test, source-code review, infrastructure assessment, or compliance certification. A header not visible in a partial screenshot is not treated as conclusively absent. No claim is made about vulnerabilities in private product applications.

## Suggested next steps

1. Obtain written authorization and a defined scope for deeper testing.
2. Review server-side source/configuration and API contracts with the engineering team.
3. Verify cache behaviour for personalized and non-personalized routes.
4. Review the actual contact workflow and any server-side form/API processing, if present.
5. Add automated tests for validation, authorization, error handling, and cache isolation.
