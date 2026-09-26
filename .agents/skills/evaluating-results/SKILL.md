---
name: evaluating-results
description: Independently assesses whether software changes deliver the requested end-to-end outcome, acceptance criteria, and user experience. Use when evaluating tasks or running golden evals.
---

# Purpose
Perform independent, outcome-based evaluation of software features to guarantee that user goals and acceptance criteria are satisfied in practice, beyond internal unit test passes.

# When to Use
- After verification passes, to validate end-user functionality before task sign-off.
- Running golden-task benchmark evaluations or regression suites.
- Assessing whether an AI agent deliverable truly satisfies a user's PRD requirements.

# Procedure
1. **Extract Evaluation Rubric**:
   - Extract the explicit acceptance criteria and user journey steps from the PRD or task contract.
   - Define expected inputs, interactions, and observable outcomes.
2. **Execute Independent Outcome Checks**:
   - Trigger the feature through its external interface (HTTP API call, CLI invocation, UI browser interaction).
   - Assert on external observable state: database mutations, HTTP responses, file outputs, error envelopes.
3. **Score Against Golden Rubric**:
   - Grade criteria objectively:
     - Functional completeness (100% of user criteria met)
     - Error handling (graceful handling of invalid user actions)
     - Performance & latency within thresholds
     - Zero side-effects or regressions in unrelated paths
4. **Compile Independent Evaluation Report**:
   - Generate structured evaluation result with grade (PASS / FAIL), criteria scores, and recommendations.

# Decision Tree
```
Outcome Evaluation
├── Are all acceptance criteria satisfied in practice?
│   ├── No ──► Flag specific unmet criteria ──► Trigger targeted fix
│   └── Yes ──► Are negative/edge-case paths handled properly?
│       ├── No ──► Flag unhandled edge cases
│       └── Yes ──► Issue PASS verdict with independent evidence
```

# Verification
- Independent grader output confirming every acceptance criterion was executed and passed.
- Evaluation run against actual runtime behavior, not mocked code.

# References
- [Evaluator Subagent](file:///e:/AI%20Engineering%20Workflow/.agents/agents/evaluator.md)
- [Golden Task Evaluator](file:///e:/AI%20Engineering%20Workflow/.ai/scripts/eval-runner.js)
