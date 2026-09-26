---
trigger: always_on
description: Mandatory security invariants, secret protection, input sanitization, and authorization rules.
---

# Security Invariants

- **Zero Secret Exposure**: Never log, commit, or return in API responses passwords, hashes, JWT secrets, private keys, API tokens, or PII.
- **Strict Boundary Validation**: Validate and sanitize all external inputs (request bodies, query params, route parameters, headers) before passing to services or databases.
- **Defense in Depth**: Enforce both authentication (identity verification) and resource-level authorization (ownership/RBAC) on the server side. Never rely on client-side security checks alone.
- **Injection Prevention**: Use parameterized queries, ORM/ODM sanitization, and structured bindings to eliminate SQL injection, NoSQL operator injection, command injection, and SSRF.
- **Safe Session & Token Management**: Use cryptographically secure random bytes for tokens (`crypto.randomBytes(32)`). Enforce expiration, single-use guarantees for password reset/verification tokens, and constant-time token comparison (`crypto.timingSafeEqual`).
- **Least Privilege**: Services, database connections, and operational scripts must operate with minimum required permissions.
