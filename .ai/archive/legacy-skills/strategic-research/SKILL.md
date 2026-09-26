---
name: strategic-research
description: 5-dimensional strategic research engine covering competitive intelligence, best practices/UX, technology evaluation, market differentiation, and failure risk assessment.
triggers:
  - strategic research
  - competitor research
  - market analysis
  - technology evaluation
  - new product planning
  - project onboarding research
required_context:
  - .ai/templates/strategic-research-template.md
  - .ai/settings.json
---

# Strategic Research Skill

## When to Use

Activate this skill when:
- Starting a new software product in **CREATE** mode before generating architectural plans.
- Analyzing an existing codebase in **ONBOARD** mode to benchmark it against market leaders.
- Upgrading an existing project in **UPGRADE** mode to integrate modern patterns.
- Performing pure market and technical research in **RESEARCH** mode.

## 5-Dimensional Research Framework

The engine conducts research across 5 strategic dimensions:

### 1. Competitive Intelligence
- Query the web for the top 5 to 10 products in the target niche.
- Identify their feature sets, pricing models, target customer profiles, and user criticisms/reviews (Reddit, G2, Trustpilot, Product Hunt, GitHub).
- Pinpoint gaps where competitors fall short (unaddressed pain points, poor mobile experience, rigid pricing, lack of offline support).

### 2. Best Practices & Modern UX Patterns
- Identify modern (2026) UI/UX paradigms for this domain (e.g. command bars, contextual action panels, mobile-first cards, instant tactile feedback).
- Research workflow accessibility, responsive touch targets, and micro-interactions.
- Define visual hierarchy, theme harmony, and typography direction.

### 3. Technology & Architecture Evaluation
- Evaluate framework choices, database models, caching strategies, and API paradigms suitable for this workload.
- Compare conventional/legacy approaches with modern, battle-tested 2026 alternatives.
- Highlight specific libraries, ORMs, and packages that reduce boilerplate and enhance reliability.

### 4. Market Differentiation & Strategic Opportunities
- Formulate unique value propositions (UVPs): what can this application do 10x better or simpler than existing products?
- Identify features that delight users (e.g., smart autocomplete, offline-first sync, natural language summaries).

### 5. Risk Assessment & Failure Modes
- Uncover common pitfalls in this product vertical (e.g., complex accounting reconciliation bugs, latency on large datasets, security oversights).
- Formulate concrete preventative measures before writing a single line of code.

## Execution Instructions

1. **Scope Definition**: Determine target domain, primary user persona, and geographic/operational constraints.
2. **Execute Multi-Angle Web Research**:
   - Query 1: Competitors & market landscape: `top [domain] software tools competitors 2026`
   - Query 2: User pain points: `[competitor name] alternatives complaints issues reddit`
   - Query 3: Modern UI/UX patterns: `best UI UX design patterns for [domain] app`
   - Query 4: Modern tech stack: `modern tech stack architecture for [domain] app`
3. **Synthesize Findings**: Compile gathered intelligence into `.ai/templates/strategic-research-template.md`.
4. **Output Report**: Save the finalized report to:
   - For new projects / factory: `.ai/research/strategic-report-[topic].md`
   - For onboarded projects: `[projectRoot]/.ai/research/strategic-report-[topic].md`
5. **Present Highlights to User**: Summarize top 3 competitive advantages, recommended tech choices, and critical pitfalls.
