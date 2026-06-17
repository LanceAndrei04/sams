<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Agent Implementation Instructions & Technical Guardrails

## 1. Code Cleanliness & Architectural Separation
To prevent unmanageable "long ass files", agents must strictly adhere to modular design patterns and clean code principles (SOLID, SoC).

### File Size Limit & Code Splitting
- No single frontend component, route file, or backend utility file may exceed **250 lines of code**.
- If a component or file approaches 250 lines, it **must** be broken down into sub-components, standalone hooks, or separate business logic files.

### Frontend Modular Organization
- **Page Shells (`/pages`):** Responsible *only* for handling routing context, setting parent page layouts, and subscribing to top-level data streams.
- **Presentation Layer (`/components/ui`):** Dumb, isolated, pure UI components (e.g., standard tables, cards, modal boxes). They accept data solely via props and have zero direct connection to Supabase clients or global states.
- **Domain Components (`/components/features/...`):** Split strictly into modular domains:
  - `/features/students/...` (e.g., `StudentTable.tsx`, `ImportPreviewModal.tsx`)
  - `/features/teachers/...` (e.g., `PersonnelForm.tsx`, `TrainingTimeline.tsx`)
  - `/features/inventory/...` (e.g., `CategoryCardGrid.tsx`, `AssetItemTable.tsx`)
- **State & Queries (`/hooks`):** Extract all Supabase data fetching, cache mutations, and processing logic into standalone Custom Hooks (e.g., `useStudentRoster.ts`, `useInventoryItem.ts`). Do *not* write inline async fetches inside view layouts.

<!-- END:nextjs-agent-rules -->


