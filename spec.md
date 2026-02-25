# Specification

## Summary
**Goal:** Fix runtime errors introduced in the W.R.A.I.T.H. portal by the Version 12 deployment that added admin access across all clearance level departments.

**Planned changes:**
- Inspect and fix broken references, missing imports, type mismatches, or runtime exceptions in `Admin.tsx`, `DepartmentManager.tsx`, and `useQueries.ts`
- Ensure the Admin page and all its tabs (Agents, Missions, Assets, Most Wanted, Departments) render without errors
- Ensure the Departments tab correctly displays all clearance-level department cards
- Resolve any TypeScript compilation errors introduced by the latest changes

**User-visible outcome:** The W.R.A.I.T.H. portal loads and operates without console errors or blank screens, with all admin tabs and existing CRUD operations functioning correctly.
