# Recommended Backend Architecture

This is a reference design for a typical public website inquiry service. It is not a claim about Cynbit's existing implementation.

```text
Browser
  |
  | HTTPS
  v
CDN / WAF
  |  - TLS/HSTS
  |  - request size limits
  |  - abuse/rate controls
  v
Application API
  |  - CORS allowlist
  |  - schema validation
  |  - request ID / structured logs
  v
Inquiry Service
  |  - business rules
  |  - idempotency / spam controls
  v
Persistence (if required)
  |
  v
Async job / email provider
  |
  v
Safe confirmation response
```

## Design principles

1. Keep public page rendering separate from application business APIs.
2. Validate all untrusted input on the server.
3. Apply route-specific caching; never publicly cache user-specific data.
4. Use an asynchronous queue for email delivery if delivery latency or retries matter.
5. Use idempotency keys to avoid duplicate inquiry processing.
6. Return a stable error contract and correlation/request ID.
7. Store secrets in a managed secret store, never in client bundles.
8. Log operational metadata while minimizing personal data.

## Example inquiry contract

`POST /api/v1/inquiries`

Request:
```json
{
  "name": "Example Person",
  "email": "person@example.com",
  "company": "Example Ltd",
  "message": "I'd like to discuss a project."
}
```

Success:
```json
{
  "data": {
    "inquiryId": "server-generated-id",
    "status": "received"
  },
  "requestId": "correlation-id"
}
```

The example is illustrative only; no such endpoint was confirmed on the public website.
