@AGENTS.md
# School Admin Management System MVP

## Executive Summary & High-Level Goal
This project is a desktop-first School Admin Management System MVP custom-built for a Philippine school administration office. 

### The Core Problem
The school currently tracks all data across scattered, fragmented Google Sheets (historically structured as 1 sheet per section, per grade level, per school year). This causes extreme data isolation, file-hunting fatigue, loss of historical records, and high human error.

### The Target User Profile
School administrative clerks and encoders with **low-to-medium technical expertise**. They are deeply familiar with spreadsheet grids but get overwhelmed by abstract, hidden navigation, multi-layered nested settings, or unforgiving validation scripts.

### Ultimate MVP Goal
Consolidate these fragmented sheets into a unified database while providing an interface that is faster, more intuitive, and significantly more forgiving than a Google Sheet.

---

## Architecture & Structural Hierarchy
The platform's relational logic is anchored heavily around the Department of Education (DepEd) scheduling and grouping frameworks:

1. **Academic Enrollment Chain:** $$\text{SchoolYear} \longrightarrow \text{Grade Level} \longrightarrow \text{Section} \longrightarrow \text{Student}$$
   * Admins manage only **one Active School Year** at a time. All historical years are frozen as read-only snapshots.
2. **Global Inventory Taxonomy:** * Inventory categories (e.g., *Science Materials*, *Math Equipment*) are **global**. They do not wipe, cycle, or reset when a new School Year is initiated.
3. **Unlinked Teacher Directory:** * Teachers live in a flat personnel directory. To optimize MVP speed and prevent premature database locks, teacher assignments to subjects or sections are stored as free-text strings (`subjects_text`), not relational join tables.

---

## Core UX & Usability Directives (Priority No. 1)
Because our target users are non-technical, the UI must treat **forgiveness and visibility** as core features:

* **Filter Persistence (Anti-Fatigue):** Whenever an admin navigates away from the Student List, the system must cache their last selected `Grade` and `Section` filter state for that session. Returning to the screen must instantly restore their working context.
* **The Folder Metaphor for Inventory:** Non-technical users struggle with pure multi-select dynamic tables. The Inventory module must use a **Card Grid Layout** representing physical storage drawers (e.g., "Science Materials - 45 items"). Clicking a card "opens the drawer" into a clean, flat data table.
* **Destructive Action Guardrails:** Deletion of any student, teacher, or physical asset must utilize double-confirmation overlays with explicit text inputs (e.g., typing "DELETE" to confirm) or default to a safe soft-delete state.
* **Unmistakable Visual States:** To prevent staff from accidentally encoding data into an archived school year, a prominent, high-contrast global banner or colored status badge must dynamically render when viewing historical data blocks.
