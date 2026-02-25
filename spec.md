# Specification

## Summary
**Goal:** Add a Weapons tab to the W.R.A.I.T.H. agency portal, allowing staff to browse and admins to manage agency weapons.

**Planned changes:**
- Add a `Weapon` type and CRUD functions (`createWeapon`, `getWeapons`, `updateWeapon`, `deleteWeapon`) to the backend Motoko actor with auto-incrementing IDs
- Add React Query hooks for weapons (`useGetWeapons`, `useCreateWeapon`, `useUpdateWeapon`, `useDeleteWeapon`) with cache invalidation
- Create a public-facing Weapons page displaying weapon cards with name, type, department, clearance level (color-coded), status, and description, matching the dark terminal aesthetic
- Add a `/weapons` route and a Weapons navigation link alongside Agents, Missions, Assets, and Most Wanted
- Create a `WeaponManager` admin component with full CRUD (table + create/edit/delete dialogs) and add a Weapons tab to the Admin panel

**User-visible outcome:** Users can navigate to a Weapons tab to browse all agency weapons as styled cards, and admins can create, edit, and delete weapons from the admin panel.
