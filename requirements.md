# SAMS — Requirements Document (MVP)

**Project:** School Admin Management System (SAMS)  
**Version:** 0.1 (MVP draft)  
**Last updated:** June 2026  
**Status:** Living document — supersedes informal notes in README; complements [CLAUDE.md](./CLAUDE.md) (product context) and [AGENTS.md](./AGENTS.md) (implementation guardrails).

---

## 1. Purpose

This document defines **what** the SAMS MVP must do before implementation details are locked in [design.md](./design.md). It captures functional requirements (features and behaviors) and non-functional requirements (quality attributes, constraints).

### 1.1 Problem Statement

The school administration office currently tracks students, teachers, and inventory across **fragmented Google Sheets** — historically one sheet per section, per grade level, per school year. This causes:

- Data isolation and file-hunting fatigue
- Loss of historical records
- High human error during encoding and reporting

### 1.2 MVP Goal

Consolidate fragmented spreadsheets into a **unified database** with an interface that is **faster, more intuitive, and more forgiving** than Google Sheets for non-technical administrative staff.

### 1.3 Scope Boundary

| In scope (MVP) | Out of scope (post-MVP) |
|----------------|-------------------------|
| Single-school deployment | Multi-school / district tenancy |
| Clerk/admin user role only | Teacher portal, parent portal |
| One active school year at a time | Complex grading / report card generation |
| Student roster CRUD + filters | Full DepEd LMS integration |
| Flat teacher directory | Relational teacher–subject–section assignments |
| Inventory by category (card grid) | Barcode/RFID asset tracking |
| Spreadsheet-style import (students) | Real-time collaborative editing |
| Soft-delete with confirmation guardrails | Full audit log UI |
| Read-only historical school years | Automated year rollover workflows |

---

## 2. Stakeholders & Users

### 2.1 Primary Users

**Administrative clerks and encoders** at a Philippine DepEd-aligned school office.

| Attribute | Description |
|-----------|-------------|
| Technical skill | Low to medium |
| Familiarity | Spreadsheet grids, paper forms, section/grade vocabulary |
| Pain points | Hidden navigation, nested settings, strict validation with no recovery |
| Success criteria | Find and update records quickly without training manuals |

### 2.2 Secondary Stakeholders

- **Registrar / admin head** — oversees data accuracy and school year transitions
- **IT support** — account provisioning, backup, local deployment support

---

## 3. Domain Model (Business Context)

The system follows DepEd scheduling and grouping conventions:

```
SchoolYear → GradeLevel → Section → Student
```

Additional domains:

- **Teachers** — flat personnel directory (not year-scoped enrollment)
- **Inventory categories** — global taxonomy (not reset per school year)

---

## 4. Functional Requirements

Requirements use IDs for traceability: `FR-<module>-<number>`.

### 4.1 Authentication & Session

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | Users shall sign in with username/email and password. | Must |
| FR-AUTH-02 | Invalid credentials shall display a clear, non-technical error message. | Must |
| FR-AUTH-03 | Successful login shall redirect to the dashboard. | Must |
| FR-AUTH-04 | Authenticated routes shall be inaccessible without a valid session. | Must |
| FR-AUTH-05 | Users shall be able to sign out from the dashboard shell. | Must |
| FR-AUTH-06 | Optional "keep session logged in" shall persist session per user preference. | Should |
| FR-AUTH-07 | Password reset shall be deferred to IT helpdesk contact (no self-service in MVP). | Must |

### 4.2 Application Shell & Navigation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-NAV-01 | Authenticated users shall see a persistent **side navigation** with labeled modules. | Must |
| FR-NAV-02 | Navigation shall indicate the **active module** visually. | Must |
| FR-NAV-03 | Layout shall be **desktop-first** with a collapsible sidebar on large screens. | Must |
| FR-NAV-04 | On small screens, navigation shall collapse into a **mobile drawer** (sheet). | Must |
| FR-NAV-05 | Top bar shall display the **current school year** and its status (Active / Archived). | Must |
| FR-NAV-06 | Users shall toggle **light/dark theme** from the dashboard shell. | Should |

**MVP navigation modules:**

1. Dashboard (overview)
2. Students
3. Teachers
4. Inventory
5. Settings

### 4.3 School Year Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SY-01 | Exactly **one school year** shall be marked **Active** at any time. | Must |
| FR-SY-02 | All enrollment data (students, sections) shall be scoped to a school year. | Must |
| FR-SY-03 | Historical school years shall be **read-only** — no create/update/delete on frozen records. | Must |
| FR-SY-04 | When viewing archived year data, a **high-contrast global banner** shall appear. | Must |
| FR-SY-05 | Admins shall create a new school year from Settings (MVP: manual process). | Should |
| FR-SY-06 | School year label shall follow Philippine convention (e.g., `2025–2026`). | Must |

### 4.4 Students Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-STU-01 | Users shall view a **filterable student roster** by grade level and section. | Must |
| FR-STU-02 | Grade and section filter selections shall **persist for the session** when navigating away and returning. | Must |
| FR-STU-03 | Users shall add, edit, and soft-delete student records within the active school year. | Must |
| FR-STU-04 | Student form shall capture core identity fields: name, LRN (if applicable), sex, birthdate, address, guardian contact. | Must |
| FR-STU-05 | Validation shall be **forgiving** — highlight errors inline with plain-language messages, not blocking scripts. | Must |
| FR-STU-06 | Users shall import students from a spreadsheet (CSV/XLSX) with a **preview step** before commit. | Should |
| FR-STU-07 | Deleting a student shall require **double confirmation** (e.g., type `DELETE`). | Must |
| FR-STU-08 | Student list shall support text search by name or LRN. | Should |

### 4.5 Teachers Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TCH-01 | Users shall view a flat **teacher directory** (not tied to school year enrollment). | Must |
| FR-TCH-02 | Users shall add, edit, and soft-delete teacher records. | Must |
| FR-TCH-03 | Teacher record shall include: full name, employee ID (optional), contact, position, and **subjects_text** (free-text assignment summary). | Must |
| FR-TCH-04 | Teacher–subject–section relationships shall **not** use relational join tables in MVP. | Must |
| FR-TCH-05 | Deleting a teacher shall require double confirmation. | Must |
| FR-TCH-06 | Users shall search teachers by name. | Should |

### 4.6 Inventory Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-INV-01 | Inventory categories shall be **global** and persist across school years. | Must |
| FR-INV-02 | Landing view shall use a **card grid** ("drawer" metaphor) — one card per category showing item count. | Must |
| FR-INV-03 | Clicking a category card shall open a **flat item table** for that category. | Must |
| FR-INV-04 | Users shall add, edit, and soft-delete inventory items within a category. | Must |
| FR-INV-05 | Item fields shall include: name, quantity, unit, condition, location/notes. | Must |
| FR-INV-06 | Users shall create and rename categories from Settings or within Inventory. | Should |
| FR-INV-07 | Deleting an item or category shall require double confirmation. | Must |

### 4.7 Dashboard (Home)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DASH-01 | Dashboard shall show **at-a-glance counts**: total students (active year), teachers, inventory items. | Should |
| FR-DASH-02 | Dashboard shall provide **quick links** to frequently used modules. | Should |
| FR-DASH-03 | Dashboard shall display the active school year prominently. | Must |

### 4.8 Settings

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SET-01 | Settings shall allow viewing and switching context to historical school years (read-only). | Should |
| FR-SET-02 | Settings shall allow marking a school year as Active (with confirmation). | Should |
| FR-SET-03 | Settings shall display application version and helpdesk contact. | Should |

---

## 5. Non-Functional Requirements

### 5.1 Usability (Priority #1)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-UX-01 | Primary workflows shall require **no more clicks than the equivalent Google Sheet task**. | Qualitative |
| NFR-UX-02 | All destructive actions shall have **visible guardrails** before execution. | 100% coverage |
| NFR-UX-03 | Error messages shall use **plain language** (no stack traces, no error codes shown to users). | 100% coverage |
| NFR-UX-04 | Filter state shall restore within **one navigation cycle** (leave and return). | Session-scoped |
| NFR-UX-05 | Archived-year editing shall be **impossible** via UI (disabled controls + banner). | Must |

### 5.2 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-PERF-01 | Initial page load (dashboard shell) | < 3s on office LAN |
| NFR-PERF-02 | Student roster with filters applied | < 1s for ≤ 2,000 records |
| NFR-PERF-03 | Inventory category grid | < 1s for ≤ 50 categories |

### 5.3 Reliability & Data Integrity

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-REL-01 | Soft-delete shall preserve records for recovery (no hard delete in MVP UI). | Must |
| NFR-REL-02 | Import preview shall show row-level errors before any write. | Must |
| NFR-REL-03 | Database writes shall use transactions for multi-row imports. | Must |

### 5.4 Security

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-SEC-01 | All authenticated API/database access shall enforce **row-level security** or server-side auth checks. | Must |
| NFR-SEC-02 | Passwords shall never be stored in plain text. | Must |
| NFR-SEC-03 | Session tokens shall expire after configurable idle timeout. | Should |
| NFR-SEC-04 | HTTPS shall be enforced in production. | Must |

### 5.5 Accessibility

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-A11Y-01 | Navigation shall be keyboard-operable. | WCAG 2.1 AA (target) |
| NFR-A11Y-02 | Form fields shall have associated labels. | Must |
| NFR-A11Y-03 | Color contrast shall meet AA for text and interactive elements. | Must |

### 5.6 Maintainability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-MAINT-01 | No single source file shall exceed **250 lines** (see AGENTS.md). | Must |
| NFR-MAINT-02 | Data fetching shall live in `/hooks`, not in view components. | Must |
| NFR-MAINT-03 | UI primitives shall be isolated in `/components/ui`. | Must |

### 5.7 Compatibility

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-COMPAT-01 | Primary target: **desktop browsers** (Chrome, Edge) on Windows 10/11. | Must |
| NFR-COMPAT-02 | Tablet/mobile: navigation usable but not primary design target. | Should |

---

## 6. Assumptions & Constraints

### 6.1 Assumptions

- Single school, single office deployment
- Supabase (or equivalent) provides auth + PostgreSQL backend
- Staff have stable office LAN connectivity
- Historical Google Sheets can be migrated manually or via CSV import
- One clerk role is sufficient for MVP (no RBAC granularity)

### 6.2 Constraints

- MVP timeline favors speed over relational purity (e.g., `subjects_text` for teachers)
- Must align with DepEd grade/section vocabulary used by the school
- Desktop-first; mobile is secondary
- Philippine English UI labels; date formats follow local convention (DD/MM/YYYY display)

---

## 7. Acceptance Criteria (MVP Release)

The MVP is acceptable when:

1. A clerk can log in and reach the dashboard within 3 clicks.
2. A clerk can filter students by grade + section, edit a record, leave the module, return, and find the same filters restored.
3. A clerk can add a teacher with free-text subject assignment.
4. A clerk can browse inventory by category card and add an item inside a category.
5. Viewing a past school year shows the archived banner and disables all edit controls.
6. Deleting any student, teacher, or inventory item requires typing `DELETE`.
7. No production data loss occurs during a 50-row student CSV import with 5 intentional bad rows (preview catches all 5).

---

## 8. Traceability

| Document | Role |
|----------|------|
| [requirements.md](./requirements.md) | What the system must do (this file) |
| [design.md](./design.md) | How the system is structured |
| [CLAUDE.md](./CLAUDE.md) | Product context and UX philosophy for AI agents |
| [AGENTS.md](./AGENTS.md) | Code organization and implementation guardrails |

---

## 9. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | June 2026 | — | Initial MVP requirements draft |
