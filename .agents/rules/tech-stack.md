---
trigger: model_decision
description: Baseline engineering technology stack preferences and compatibility requirements.
---

# Technical Stack Invariants

- **Frontend Baseline**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend Baseline**: Node.js LTS, NestJS / Express.js, TypeScript.
- **Data Layer**: MongoDB (Mongoose) or PostgreSQL (Prisma/Drizzle), Redis for caching and queues (BullMQ).
- **Testing Standard**: Node test runner or Jest for unit/integration tests, Playwright for E2E tests.
- **Package Management**: npm / pnpm. Avoid installing redundant or unmaintained dependencies without clear architectural justification.
