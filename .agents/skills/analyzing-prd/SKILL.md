---
name: analyzing-prd
description: Extracts requirements, user stories, acceptance criteria, non-functional requirements, ambiguities, and dependencies from PRDs. Use when analyzing new or updated product requirement documents.
---

# Purpose
Extract structured requirements, acceptance criteria, non-functional requirements (NFRs), and implicit dependencies from PRDs while identifying genuine ambiguities without stalling execution.

# When to Use
- A new or updated PRD is provided in `doc/prd.md` or chat.
- Requirements completeness needs to be validated against `.ai/templates/prd-template.md`.
- Acceptance criteria must be derived for task planning.

# Procedure
1. **Ingest & Validate**:
   - Read the PRD. Check presence of vision, target users, core features, and data requirements.
   - Separate explicitly stated requirements, technical inferences, and open questions.
2. **Feature & Criteria Extraction**:
   - Extract user stories in the format: `As a <role>, I want <goal>, so that <benefit>`.
   - Define concrete, testable acceptance criteria for every feature.
   - Extract non-functional requirements: latency, concurrency, security, and responsiveness.
3. **Ambiguity & Gap Analysis**:
   - Apply the AEW Decision Policy:
     - If an answer can be inferred from technical best practice or existing code, infer and record it.
     - Only flag an item as ambiguous if it represents an irreconcilable business choice or product trade-off.
4. **Output Synthesis**:
   - Output structured feature breakdown ready for task planning.

# Decision Tree
```
Is PRD present?
├── No ──► Request PRD from user or initialize default template.
└── Yes ──► Check feature completeness
    ├── Complete ──► Extract features & criteria ──► Handoff to planning
    └── Gaps Found ──► Can gaps be inferred or researched?
        ├── Yes ──► Infer/research & document rationale ──► Handoff to planning
        └── No (genuine business ambiguity) ──► Prompt user with concise options
```

# Verification
- Every PRD feature has at least one testable acceptance criterion.
- No blocking questions generated for inferrable standard technical choices.
- Output requirements documented in structured machine-consumable format.

# References
- [PRD Template](file:///e:/AI%20Engineering%20Workflow/.ai/templates/prd-template.md)
- [Decision Policy](file:///e:/AI%20Engineering%20Workflow/.ai/orchestration/decision-policy.json)
