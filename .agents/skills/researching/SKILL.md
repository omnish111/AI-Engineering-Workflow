---
name: researching
description: Performs targeted technical investigations, library evaluations, architecture benchmarking, and competitor analysis. Use when technical requirements or library behaviors are uncertain.
---

# Purpose
Conduct focused, token-efficient technical and domain research to resolve specific technical uncertainties, evaluate libraries, compare patterns, and verify modern version-matched documentation.

# When to Use
- Encountering an unfamiliar third-party library, API deprecation, or configuration option.
- Evaluating architectural tradeoffs (e.g., SQL vs. NoSQL, Redis cache vs. in-memory, JWT vs. session).
- Investigating competitive features or UX patterns during early discovery.

# Procedure
1. **Scope Definition**:
   - Formulate a precise, narrow research question (e.g., "Mongoose 8 transaction patterns with replica sets").
   - Avoid generic open-ended searches that flood context with irrelevant data.
2. **Execute Targeted Retrieval**:
   - Query authoritative sources (official documentation, release notes, reputable benchmarks).
   - Check version compatibility with packages declared in the workspace.
3. **Analyze Tradeoffs**:
   - Compare options across latency, token overhead, maintenance burden, and security blast radius.
4. **Record Findings**:
   - Synthesize a concise summary (under 200 words) with clear recommendations and code snippets.
   - Record architectural choices in `.ai/state/decisions.json`.

# Decision Tree
```
Is the technical question already answered in repository conventions?
├── Yes ──► Adopt existing convention immediately (Zero unnecessary research)
└── No ──► Can it be tested with a small local snippet?
    ├── Yes ──► Create scratch test in scratch/ and verify behavior
    └── No ──► Execute targeted web search ──► Record finding in decisions.json
```

# Verification
- Findings cite concrete versions and official sources.
- Recommendation fits within existing repository architecture without unnecessary dependencies.

# References
- [Decisions State](file:///e:/AI%20Engineering%20Workflow/.ai/state/decisions.json)
