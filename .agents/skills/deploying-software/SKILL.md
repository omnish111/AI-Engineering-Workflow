---
name: deploying-software
description: Manages build creation, container packaging, environment validation, pre-flight checks, and production readiness audits. Use when preparing releases, Docker images, or deployment manifests.
---

# Purpose
Execute safe, reproducible, verified software builds, container packaging, infrastructure manifests, and pre-flight readiness checks.

# When to Use
- Preparing a production release, Dockerfile, or docker-compose configuration.
- Verifying deployment readiness, environment variable templates, and health endpoints.
- Setting up or validating CI/CD pipelines (GitHub Actions).

# Procedure
1. **Pre-Flight Readiness Check**:
   - Verify all unit, integration, and E2E tests pass.
   - Confirm all required environment variables are documented in `.env.example`.
   - Verify health check endpoints exist (e.g. `GET /health` or `GET /api/health`).
2. **Production Bundle Build**:
   - Run production compilation / build script (`npm run build`).
   - Confirm zero build warnings, missing chunk errors, or invalid asset imports.
3. **Container Packaging**:
   - Validate multi-stage `Dockerfile`:
     - Stage 1: Build & compile with devDependencies.
     - Stage 2: Minimal runtime image (e.g. Alpine/Distroless) with only production dependencies and non-root user.
   - Test Docker build locally or perform manifest syntax validation.
4. **Deploy Gate Confirmation**:
   - Per checkpoint policy, actual deployment to production requires explicit human approval.

# Decision Tree
```
Deploy Preparation
├── Are all tests passing & code clean?
│   ├── No ──► Halt deployment preparation until verification passes
│   └── Yes ──► Check environment & build
│       ├── Build succeeds?
│       │   ├── Yes ──► Check container & health endpoint
│       │   │   ├── Valid ──► Generate deployment readiness manifest
│       │   │   └── Invalid ──► Fix Dockerfile or health check
│       │   └── No ──► Fix build errors
```

# Verification
- Production build succeeds without errors.
- Docker configuration uses non-root user and multi-stage builds.
- Pre-flight checklist 100% verified.

# References
- [Docker Compose Template](file:///e:/AI%20Engineering%20Workflow/.ai/templates/devops/docker-compose.yml.template)
- [Checkpoint Policy](file:///e:/AI%20Engineering%20Workflow/.ai/orchestration/checkpoint-policy.json)
