# Architecture

## Stack
Next.js (App Router) + Supabase (Postgres) + Vercel. Tailwind for UI.

## Now vs Next vs Later
- **Now:** items CRUD, stock in/out transactions with auto balance, low-stock reorder list, staff requests + approval, departments/suppliers reference, expiry flag.
- **Next:** login/signup + per-user owner scoping, usage reports per month, CSV export, supplier reorder suggestions.
- **Later:** auto-draft purchase orders, expiry-waste analytics, barcode/scan, multi-branch.

## Key user action flow (one stock issue)
1. Admin opens Inventory, clicks an item, chooses "Issue".
2. Enters qty, requestor, department; confirms.
3. System writes a stock_transaction (type=issued) and decrements current_balance via server logic (truth is DB-derived).
4. UI refreshes balance live; if balance <= min, item moves to Reorder list.

## Responsive nav shell
Multi-page app → persistent left sidebar on desktop (Inventory, Reorder List, Requests, Departments, Suppliers), collapses to hamburger on mobile, current section highlighted, keyboard accessible.

## Layer plan
1. **Data first:** tables, constraints, RLS (permissive v1), seed.
2. **App logic:** data-access layer (`lib/data/`) + server actions for receive/issue/request approval — balance math server-side.
3. **Smart features (later):** `lib/ai/` for request summarisation, reorder suggestions, expiry waste scoring.

The core (inventory + transactions + balance + reorder) runs with AI switched off; balance is computed by Postgres/server, never client-only.

## Repo structure (feature-oriented)
```
app/(sidebar)/inventory, reorder, requests, departments, suppliers
lib/data/        # all DB reads/writes
lib/actions/     # server actions (receive/issue/approve)
lib/ai/          # intelligence module
components/       # shared UI
__tests__/        # beside features
```

## Module map
| Module | Responsibility | Owns | Build order |
|---|---|---|---|
| inventory | item catalog CRUD | items | 1st |
| stock | receive/issue + balance | stock_transactions, balance | 2nd |
| reorder | low-stock ranking | items view | 3rd |
| requests | staff request + approval | requests | 4th |
| reference | departments/suppliers | lookup tables | 5th |
| ai (later) | summarise/suggest | reads only | later |
| auth (later) | login + owner RLS | users | later |
