---
name: architecture
description: System design, architectural decision-making, and design pattern application.
triggers:
  - system architecture design or review
  - design pattern decisions
  - module communication design
  - scalability planning
  - architecture decision records
required_context:
  - .ai/context/architecture-rules.md
  - .ai/context/tech-stack.md
---

# Architecture Skill

## When to Use

Activate this skill when the task involves:
- Designing or reviewing system architecture
- Choosing design patterns for new features
- Planning module communication strategies
- Making scalability decisions
- Creating Architecture Decision Records (ADRs)

## Capabilities

### System Architecture Design
- Design modular monolith architecture with NestJS modules.
- Define clear domain boundaries for future microservice extraction.
- Implement layered architecture (Controller → Service → Repository → Database).
- Design event-driven communication patterns between modules.
- Plan horizontal scaling strategies.

### Design Patterns
- **Repository Pattern**: Abstract database access behind interfaces.
- **Strategy Pattern**: Pluggable algorithms for business logic variations.
- **Observer Pattern**: Event-driven module communication.
- **Factory Pattern**: Dynamic object creation based on configuration.
- **Decorator Pattern**: Cross-cutting concerns (logging, caching, auth).
- **CQRS**: Command Query Responsibility Segregation for complex domains.

### Architecture Decision Records (ADR)
```
Format:
  Title: ADR-XXX: [Decision Title]
  Status: Proposed | Accepted | Deprecated | Superseded
  Context: What is the technical problem?
  Decision: What is the chosen solution?
  Alternatives: What alternatives were considered?
  Consequences: What are the trade-offs?
  Date: YYYY-MM-DD
```

## Principles

1. **Separation of Concerns**: Each layer has a single responsibility.
2. **Dependency Inversion**: High-level modules depend on abstractions.
3. **Open/Closed Principle**: Open for extension, closed for modification.
4. **Interface Segregation**: Clients don't depend on unused interfaces.
5. **Single Responsibility**: Every module has one reason to change.
6. **Don't Repeat Yourself**: Extract shared logic into reusable modules.
7. **YAGNI**: Don't build features until they're needed.

## Architecture Layers

```
┌─────────────────────────────────────┐
│          Presentation Layer          │  Controllers, Guards, Pipes
├─────────────────────────────────────┤
│          Application Layer           │  Services, Use Cases
├─────────────────────────────────────┤
│           Domain Layer               │  Entities, Value Objects, Events
├─────────────────────────────────────┤
│        Infrastructure Layer          │  Repositories, External Services
├─────────────────────────────────────┤
│           Data Layer                 │  Database, Cache, Queue
└─────────────────────────────────────┘
```

## Scalability Checklist

- [ ] No in-memory application state — all state externalized
- [ ] Stateless application instances
- [ ] Database connection pooling configured
- [ ] Background jobs offloaded to message queues
- [ ] File storage uses external object storage
- [ ] Caching strategy defined for hot data paths
- [ ] Database indexes defined for all query patterns
- [ ] Rate limiting protects against abuse

## Verification Expectations

- Architecture follows layered pattern consistently
- No circular dependencies between modules
- All significant decisions documented as ADRs
- Scalability checklist items addressed
