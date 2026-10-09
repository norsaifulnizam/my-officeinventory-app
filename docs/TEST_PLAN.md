# Test Plan (v1 manual)

## Success scenario
1. Open app (no login) → Inventory shows seeded items (A4 paper, coffee, etc.).
2. Add item: Binder, category Stationery, unit pcs, opening 5, min 3. Save → appears in list.
3. Open Binder → Issue 3 to Sales/requestor Jane → confirm.
4. Balance shows 2 (≤ min 3) → Binder appears on Reorder List with qty-to-reorder.
5. Requests page → submit request: Binder x2, dept Sales, requestor Jane.
6. Admin approves → fulfils → request status "fulfilled", Binder balance becomes 0, Reorder shows it.

## Empty / error cases
- **Empty inventory:** list shows empty state copy "No items yet — add your first item" + button.
- **Empty reorder:** "All stock above minimum levels."
- **Empty requests:** "No requests yet."
- **Issue more than balance:** server action blocks, shows "Cannot issue more than available stock (X)."
- **Network error:** error state with retry on Inventory + Reorder.
- **Delete item with transactions:** confirm prompt; delete blocked if transactions exist (or cascade with confirm).

## State checks
- Loading: skeleton/spinner on list pages.
- Error: per-page error boundary + retry.
- Ready: seeded + user-created rows both render; created rows persist after refresh.
