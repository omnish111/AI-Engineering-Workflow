---
name: code-review
description: Code review for security, performance, quality, and architectural compliance.
triggers:
  - code review requested
  - PR review needed
  - security audit
  - performance review
required_context:
  - .ai/context/coding-rules.md
  - .ai/context/architecture-rules.md
---

# Code Review Skill

## When to Use

Activate this skill when the task involves:
- Reviewing code changes for quality and correctness
- Security audit of new or modified code
- Performance review of implementations
- Architectural compliance verification

## Review Checklist

1. **Security**: No hardcoded secrets, input validation, parameterized queries
2. **Performance**: No N+1 queries, proper indexing, caching where needed
3. **Quality**: Clean code, proper naming, no dead code, no `any` types
4. **Architecture**: Follows layered pattern, proper module boundaries
5. **Testing**: Adequate test coverage, meaningful test descriptions
6. **Documentation**: API docs updated, inline comments for complex logic

## Verification Expectations

- All CRITICAL/HIGH findings resolved before approval
- No security vulnerabilities introduced
- Performance benchmarks not degraded
- Architectural conventions followed
