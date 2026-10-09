# Office Stationery & Pantry Inventory — PRD

## Problem
Manual stock books, Excel sheets, and WhatsApp requests cause stock shortages, duplicate purchases, wastage (esp. pantry expiry), and wasted time on monthly reports.

## Target user
Office administration team (admins) manage inventory; employees request stationery and pantry supplies.

## Core objects
- **Items** — name, item_code, category (Stationery/Pantry), unit, opening_stock, stock_received, stock_issued, current_balance, minimum_stock_level, expiry_date, supplier, unit_price, stock_location.
- **Stock Transactions** — item, type (received/issued), quantity, requestor, department, transaction_date, notes.
- **Requests** — item, requestor, department, quantity, status, notes.
- **Departments** & **Suppliers** — reference data.

## MVP (v1) checklist
- [ ] Admin registers items with all core fields.
- [ ] Admin records stock received/issued; system auto-updates current_balance.
- [ ] Low-stock items (current_balance <= minimum_stock_level) appear on a Reorder list.
- [ ] Employees submit supply requests (item, qty, department, requestor).
- [ ] Admin sees requests and can approve/fulfil them (issuing stock).
- [ ] Pantry items show expiry date; expiring-soon flagged.
- [ ] Inventory list + reorder list + requests list pages, no login wall.

## Non-goals (v1)
- No login/signup, no per-user isolation (demo-first).
- No purchase orders, no barcode scanning, no mobile app, no multi-branch.
- No auto-email to suppliers, no AI auto-reorder.

## Success criteria (one end-to-end scenario)
Admin adds a ream of A4 paper (opening 10, min 5), records 3 issued to Sales dept → balance shows 7; an employee requests 2 binders, admin approves and issues 2 → request fulfilled, balance drops; any item at/below min appears on the Reorder list with correct name and qty-to-reorder.
