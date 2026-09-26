---
name: prd-analysis
description: Product Requirements Document analysis, validation, and feature extraction.
triggers:
  - PRD submitted or updated
  - feature requirements analysis
  - requirements gap detection
  - acceptance criteria extraction
required_context:
  - doc/prd.md
  - .ai/templates/prd-template.md
---

# PRD Analysis Skill

## When to Use

Activate this skill when:
- A new or updated PRD needs to be analyzed
- Feature requirements need extraction and categorization
- Requirements completeness needs validation
- Acceptance criteria need to be identified

## Execution Instructions

### 1. Validation
- Check PRD against `.ai/templates/prd-template.md` structure
- Flag missing sections as warnings (not blockers unless critical)
- Identify ambiguities that require user clarification

### 2. Feature Extraction
Extract and categorize:
- **Functional Requirements**: Features, user stories, acceptance criteria
- **Non-Functional Requirements**: Performance, scalability, security, compliance
- **User Personas**: Roles, permissions, access levels
- **Business Logic**: Workflows, state machines, calculation rules
- **Integrations**: Third-party services, APIs, payment gateways

### 3. Gap Analysis
- Identify features mentioned but not fully specified
- Detect contradicting requirements
- Flag missing acceptance criteria
- Identify implicit dependencies between features

### 4. Output
- Structured feature list with categorization
- Gap report (only for critical gaps that block planning)
- Recommended questions for user (only genuinely ambiguous items)

## Verification Expectations

- Every PRD feature has been extracted and categorized
- Critical gaps are flagged
- No unnecessary questions generated for inferrable items
