---
name: securing-applications
description: Performs threat modeling, vulnerability auditing, authentication/authorization validation, input sanitization, and secrets protection. Use when implementing security controls or reviewing attack surfaces.
---

# Purpose
Protect applications against security flaws, authorization bypasses, secret leakage, injection attacks, and OWASP Top 10 vulnerabilities.

# When to Use
- Implementing or reviewing authentication, authorization, RBAC, or password management.
- Processing untrusted external data, file uploads, or third-party webhooks.
- Performing pre-merge security reviews or dependency vulnerability audits.

# Procedure
1. **Threat Modeling & Attack Surface Review**:
   - Trace untrusted inputs from entry point (HTTP handler) to data sink (database, shell, external API).
   - Verify boundary sanitization, parameterized queries, and allowlist validation.
2. **Authentication & Password Security**:
   - Enforce strong password hashing (bcrypt salt >= 10, argon2id, or scrypt).
   - Guard against timing attacks using `crypto.timingSafeEqual`.
   - Prevent user enumeration (e.g. password reset must return the same generic response whether the email exists or not).
   - Enforce single-use and expiration constraints on reset/verification tokens.
3. **Authorization & Access Control**:
   - Enforce authorization checks on the server for every resource query (prevent Insecure Direct Object References - IDOR).
   - Ensure tenant isolation in multi-tenant systems by scoping queries to tenant ID.
4. **Secrets & Data Protection**:
   - Verify zero hardcoded API keys, JWT secrets, or passwords in code or git history.
   - Enforce HTTPS and secure cookie attributes (`HttpOnly`, `Secure`, `SameSite=Strict/Lax`).

# Decision Tree
```
Security Audit
├── Auth/Password change? ──► Verify hash cost, timing-safe compare, enumeration prevention, single-use token
├── Database query? ──► Verify parameterized bindings & tenant/user ownership filter
├── File/Command execution? ──► Validate input against strict allowlist, prevent shell interpolation
└── Response payload? ──► Verify no passwords, hashes, tokens, or PII exposed
```

# Verification
- Automated security regression tests pass (enumeration prevention, token expiration, single-use checks).
- No secrets found in source code, logs, or commit diffs.
- Parameterized queries eliminate injection vectors.

# References
- [Security Invariants](file:///e:/AI%20Engineering%20Workflow/.agents/rules/security.md)
- [Security Reviewer Subagent](file:///e:/AI%20Engineering%20Workflow/.agents/agents/security-reviewer.md)
