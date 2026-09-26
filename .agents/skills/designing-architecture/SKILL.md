---
name: designing-architecture
description: Designs system architecture, module boundaries, data flows, integration contracts, and Architecture Decision Records (ADRs). Use when defining system structure or major component boundaries.
---

# Purpose
Establish clean module boundaries, interface contracts, layered domain separation, data flows, and durable Architecture Decision Records (ADRs).

# When to Use
- Starting a new software application or subsystem.
- Introducing a major cross-cutting capability (authentication, billing, notifications, messaging).
- Refactoring complex components to eliminate tight coupling or circular dependencies.

# Procedure
1. **Define Boundaries & Layers**:
   - Enforce standard layered architecture:
     - `Controllers` / `Route Handlers`: HTTP transport, input validation, status responses.
     - `Services`: Business logic, domain rules, state mutations.
     - `Repositories`: Data access, query building, ORM/ODM persistence.
     - `Entities` / `DTOs`: Data transfer shapes and core schemas.
2. **Design Data Flow & Interfaces**:
   - Document data movement across boundaries. Ensure dependencies point inwards.
   - Specify explicit TypeScript interfaces for all service and repository contracts.
3. **Evaluate Tradeoffs & Blast Radius**:
   - Assess performance, security, observability, and failover characteristics.
4. **Record ADR**:
   - Document decision, context, alternatives considered, and consequences in `.ai/state/decisions.json`.

# Decision Tree
```
Architectural Decision Scope
├── Component-internal pattern? ──► Follow existing codebase convention
└── System-level / Cross-cutting?
    ├── Check if an accepted ADR exists in decisions.json
    ├── If change is needed, draft superseding ADR with rationale
    └── Validate interface contracts before implementation begins
```

# Verification
- No circular dependencies between proposed modules.
- Explicit TypeScript interfaces defined for all inter-module boundaries.
- Decision recorded in `.ai/state/decisions.json`.

# References
- [Architecture Rules](file:///e:/AI%20Engineering%20Workflow/.agents/rules/architecture-rules.md)
- [Decisions State](file:///e:/AI%20Engineering%20Workflow/.ai/state/decisions.json)
