# Tasks

## Sprint 1 — Database & core inventory engine
- [ ] Create items, stock_transactions, departments, suppliers tables + RLS + seed.
- [ ] `lib/data/` items CRUD + list/detail.
- [ ] Sidebar nav shell (Inventory, Reorder, Requests, Depts, Suppliers).
- [ ] Inventory list page (loading/empty/error/ready states).
- **Definition of Done:** Admin can add/edit/delete an item and see it in the list; page shows all five states; seeded demo rows render for anonymous visitors.

## Sprint 2 — Stock in/out + auto balance (core engine)
- [ ] `stock.receive` + `stock.issue` server actions updating stock_received/issued/current_balance.
- [ ] Item detail Issue/Receive forms (qty, requestor, dept).
- [ ] Transaction history on item.
- **DoD:** Issue 3 from an item → balance drops by 3, reflected after refresh; works without login.

## Sprint 3 — Reorder list & expiry
- [ ] Reorder page: items where current_balance <= minimum_stock_level, sorted by shortfall.
- [ ] Pantry expiry flag (<=14 days).
- **DoD:** Force an item below min → it appears on Reorder with qty-to-reorder; expiring pantry item flagged.

## Sprint 4 — Staff requests & approval (v1 functional milestone)
- [ ] Requests page: submit (item/qty/dept/requestor).
- [ ] Admin approve/fulfil; fulfil issues stock via `stock.issue`.
- [ ] Status badges (pending/approved/fulfilled/rejected).
- **DoD (v1 functional):** Employee requests 2 binders → admin approves & fulfils → request fulfilled, item balance drops, remains below min → on Reorder list. Success scenario usable end-to-end without login.

## Sprint 5 — Lock it down (later)
- [ ] Login/signup (Supabase Auth).
- [ ] Owner-scoped RLS: `auth.uid() = user_id` per table.
- [ ] Seed rows bound to a demo user.
- **DoD:** Anonymous blocked from writes; logged-in owner sees only own data; prior demo still viewable via demo login.

## Sprint 6 — Intelligence (later)
- [ ] AI request parser into structured items.
- [ ] Reorder suggestion drafts.
- [ ] Monthly usage report + CSV export.

## Gantt
| Task | S1 | S2 | S3 | S4 | S5 | S6 |
|---|---|---|---|---|---|---|
| DB+inventory | x | | | | | |
| Stock in/out | | x | | | | |
| Reorder+expiry | | | x | | | |
| Requests+approval | | | | x | | |
| Lock down | | | | | x | |
| Intelligence | | | | | | x |
