# Product Requirements Document

> **Instructions**: Fill in all sections below to define your SaaS product. The AI Factory will use this document to automatically generate architecture, database schemas, API contracts, task breakdowns, and the complete application. Be as specific as possible — the quality of the generated application depends on the quality of this PRD.
>
> **Reference**: See `.ai/templates/prd-template.md` for the full template with detailed guidance.

---

## Document Information

| Field | Value |
|-------|-------|
| **Product Name** | [Your Product Name] |
| **Version** | 1.0 |
| **Author** | [Your Name] |
| **Date** | [YYYY-MM-DD] |
| **Status** | Draft |

---

## 1. Executive Summary

> What is this product? What problem does it solve? Who is it for?

[Write 2-3 paragraphs describing your product]

---

## 2. Problem Statement

### 2.1 Current Pain Points
- [What problem exists today?]
- [Why is the current solution inadequate?]
- [What do users struggle with?]

### 2.2 Target Users
- **Primary**: [Who is the main user?]
- **Secondary**: [Who else will use it?]

---

## 3. Product Vision

### 3.1 Vision Statement
> [One sentence describing the future state this product enables]

### 3.2 Success Metrics
| Metric | Target |
|--------|--------|
| [Key metric 1] | [Target value] |
| [Key metric 2] | [Target value] |

---

## 4. User Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|----------------|
| Super Admin | Full system access | Everything |
| Admin | Organization management | Manage users, settings, billing |
| User | Standard access | Core features |
| Guest | Unauthenticated | Public pages only |

---

## 5. Feature Requirements

### 5.1 Authentication (Built-in)
> The AI Factory will automatically implement:
> - User registration with email/password
> - Login with JWT tokens (access + refresh)
> - Password reset via email
> - Account lockout after failed attempts
> - Role-based access control

### 5.2 [Your Feature Category 1]

#### F-001: [Feature Name]
- **Priority**: P0 (Must Have) | P1 (Should Have) | P2 (Nice to Have) | P3 (Future)
- **Description**: [What does this feature do?]
- **User Story**: As a [role], I want to [action] so that [benefit].
- **Acceptance Criteria**:
  - [ ] [Specific, testable criterion 1]
  - [ ] [Specific, testable criterion 2]
  - [ ] [Specific, testable criterion 3]

#### F-002: [Feature Name]
- **Priority**: [P0-P3]
- **Description**: [Description]
- **User Story**: As a [role], I want to [action] so that [benefit].
- **Acceptance Criteria**:
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]

### 5.3 [Your Feature Category 2]

[Add more features following the same pattern]

---

## 6. Non-Functional Requirements

### Performance
- Page load time: < 2 seconds
- API response time: < 200ms (reads), < 500ms (writes)
- Concurrent users: [number]

### Security
- [Any specific security requirements beyond the defaults]

### Scalability
- [Expected growth, data volume, etc.]

---

## 7. UI/UX Requirements

### Design Style
- [Modern / Minimal / Corporate / Playful]
- [Dark mode required? Yes / No]
- [Any brand colors or design references?]

### Key Screens
1. **Landing Page**: [What should it communicate?]
2. **Dashboard**: [What key metrics/widgets?]
3. **[Feature Page]**: [What should the user see/do?]
4. **Settings**: [What settings are needed?]

---

## 8. Data Model (High Level)

### Core Entities
> Define the main data objects in your system.

- **User**: email, name, role, isActive
- **[Entity 1]**: [key fields]
- **[Entity 2]**: [key fields]
- **[Entity 3]**: [key fields]

### Key Relationships
- User has many [Entity]
- [Entity 1] belongs to [Entity 2]
- [Entity 2] has many [Entity 3]

---

## 9. Integrations (Optional)

| Service | Purpose | Priority |
|---------|---------|----------|
| [e.g., Stripe] | [Payments] | [P0-P3] |
| [e.g., SendGrid] | [Email] | [P0-P3] |
| [e.g., AWS S3] | [File storage] | [P0-P3] |

---

## 10. Open Questions

1. [Any unclear requirements?]
2. [Any decisions that need input?]
3. [Any dependencies on external factors?]

---

## Ready to Build?

Once this PRD is complete:

1. Save this file at `doc/prd.md`
2. The Super Agent will read and validate it
3. The Deep Planning Agent will create the architecture and roadmap
4. Development begins automatically, phase by phase

> **Tip**: The more detailed your acceptance criteria, the better the generated application will match your expectations.
