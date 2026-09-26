---
name: security
description: Application security auditing, threat modeling, and secure coding practices.
triggers:
  - authentication or authorization changes
  - security audit or review
  - input validation implementation
  - data encryption or protection
  - OWASP compliance checks
required_context:
  - .ai/context/coding-rules.md
  - .ai/context/architecture-rules.md
---

# Security Skill

## When to Use

Activate this skill when the task involves:
- Authentication or authorization implementation
- Security auditing or threat modeling
- Input validation and sanitization
- Data encryption or protection
- CORS, rate limiting, or security headers
- OWASP compliance review

## Capabilities

### Authentication Security
- JWT implementation with RS256 algorithm and key rotation.
- Access token short expiry (15 min), refresh token long expiry (7 days).
- Refresh token rotation — invalidate old refresh token on use.
- Account lockout after 5 failed login attempts (30-min cooldown).
- Password policy enforcement (8+ chars, upper, lower, number, special).
- Secure password reset with time-limited, single-use tokens.

### Authorization Security
- RBAC with NestJS guards.
- Resource-level authorization — verify user owns the resource.
- Principle of least privilege — minimum permissions by default.
- Admin actions require re-authentication.

### Input Security
- Validate all inputs with class-validator (backend) and Zod (frontend).
- Sanitize HTML inputs to prevent XSS (DOMPurify or sanitize-html).
- Parameterized queries only — never interpolate user input into queries.
- Request body size limits (1MB default, 10MB for file uploads).

### Infrastructure Security
- Helmet middleware for HTTP security headers.
- CORS with explicit origin whitelist.
- Rate limiting on all public endpoints.
- Docker containers run as non-root users.
- Environment variables for all secrets; `.env` in `.gitignore`.

## OWASP Top 10 Checklist

- [ ] A01: Broken Access Control — RBAC + resource ownership validation
- [ ] A02: Cryptographic Failures — Strong encryption, no sensitive data exposure
- [ ] A03: Injection — Parameterized queries, input validation
- [ ] A04: Insecure Design — Threat modeling, security by design
- [ ] A05: Security Misconfiguration — Secure defaults, remove debug endpoints
- [ ] A06: Vulnerable Components — Regular dependency audits (`npm audit`)
- [ ] A07: Auth Failures — Strong passwords, MFA support, account lockout
- [ ] A08: Data Integrity Failures — Input validation, signed JWTs
- [ ] A09: Logging Failures — Comprehensive security event logging
- [ ] A10: SSRF — URL validation, allowlist for external requests

## Security Review Checklist

1. No hardcoded secrets in source code.
2. All user inputs validated and sanitized.
3. Parameterized queries used exclusively.
4. Authentication required on all non-public endpoints.
5. Authorization checks on every resource access.
6. Sensitive data excluded from API responses and logs.
7. Rate limiting active on authentication endpoints.
8. CORS configured with specific origins.
9. Security headers enabled via Helmet.
10. Dependencies audited for known vulnerabilities.

## Verification Expectations

- No hardcoded secrets in codebase
- All endpoints have appropriate auth guards
- Input validation on all user-facing endpoints
- Security headers configured via Helmet
- `npm audit` shows no critical vulnerabilities
