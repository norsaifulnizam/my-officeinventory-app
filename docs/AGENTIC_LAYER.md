# Agentic Layer

## Draftable actions (low risk — auto)
- Tag/summarise a request.
- Score reorder urgency, expiry risk.
- Draft a reorder suggestion note.
- Confidence + review_status stored; never auto-applied to inventory.

## Executable after approval (medium)
- Convert approved request into a stock_transaction (issue).
- Mark request fulfilled.
- Update request status to approved/rejected.

## Human-only (critical)
- Delete items or transactions.
- Edit unit_price / opening_stock (financial truth).
- Send to supplier / spend money.

## Named tools
- `stock.issue(itemId, qty, requestor, dept)`
- `stock.receive(itemId, qty, supplierId)`
- `request.approve(requestId)`
- `request.fulfil(requestId)` → creates issue transaction.
- `item.create/update/delete` (delete = human-only).
- No raw `run_any`/`send_any`.

## Audit log fields
agent, action, tool, target_id, before_json, after_json, actor_user_id, created_at, status (ok/failed).

## v1 vs later
- v1: human-driven stock.issue/receive + request.approve/fulfil with server actions.
- Later: AI drafts reorder suggestions; sending to supplier gated to human approval.
