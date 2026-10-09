# Security

## Secret handling
Supabase service key only server-side; never in client bundles or `NEXT_PUBLIC_*` other than anon key. Server actions for all writes.

## Permission model
- v1 (demo-first): permissive RLS, no login wall — app renders for anonymous visitors.
- Lock-down sprint: each table scoped to `auth.uid() = user_id`; admin vs employee roles via a `role` column on a users table later.
- Agent inherits the signed-in user's permissions; cannot exceed them.

## Approved-tools rule
Only named server actions/tools execute writes. No arbitrary SQL from frontend; no raw `run_any`/`send_any`.

## Audit principle
Every meaningful write (receive/issue/approve/fulfil/delete) is logged with actor, action, target, before/after. Deletes are human-only.

## Honesty
Per-user isolation and payments are NOT in v1; if real money or sensitive data is involved, stop and get a human before proceeding.
