---
trigger: model_decision
description: Architectural invariants, layer separation, module boundaries, and dependency flow.
---

# Architecture Invariants

- **Strict Layer Separation**:
  - **Controllers**: Handle HTTP, request validation, and status code dispatch. No business logic.
  - **Services**: Pure business logic and domain rules. No direct HTTP request/response objects.
  - **Repositories**: Data persistence, schema interactions, and query optimization.
  - **Entities/Models**: Core domain models and schema definitions.
- **Dependency Flow**: Dependencies point inward. Higher layers may depend on abstractions of lower layers; lower layers must never import higher layers.
- **Zero Circular Dependencies**: Modules, files, and services must maintain clean acyclic dependency graphs.
- **Explicit Interfaces**: All inter-service communications, repository contracts, and external API integrations must use explicitly typed interfaces.
- **State Management**: Persist durable state in canonical machine-readable stores (`.ai/state/`). Avoid scattered hidden state.
