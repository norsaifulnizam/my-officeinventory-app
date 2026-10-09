# Data Model

## items
- id uuid pk
- user_id uuid (nullable, owner-scoping later)
- name text not null
- item_code text
- category text (Stationery/Pantry)
- unit text (e.g. ream, box, pcs)
- opening_stock int default 0
- stock_received int default 0
- stock_issued int default 0
- current_balance int default 0
- minimum_stock_level int default 0
- expiry_date date (nullable, pantry)
- supplier_id uuid (nullable)
- unit_price numeric
- stock_location text
- created_at timestamptz default now()
- RLS v1: open read/write; later: owner = user_id.
- Balance is server-derived: stock_received - stock_issued from transactions; opening_stock only seeds initial.

## stock_transactions
- id uuid pk
- user_id uuid nullable
- item_id uuid not null
- type text (received/issued)
- quantity int not null
- requestor text
- department text
- transaction_date date
- notes text
- created_at timestamptz default now()
- RLS v1 open.

## requests
- id uuid pk
- user_id uuid nullable
- item_id uuid nullable (free-text item ok)
- requestor text not null
- department text
- quantity int not null
- status text default 'pending' (pending/approved/fulfilled/rejected)
- notes text
- ai_summary text (later) + source/confidence/review_status
- created_at timestamptz default now()
- RLS v1 open.

## departments
- id uuid pk, name text, created_at.

## suppliers
- id uuid pk, name text, contact text, created_at.

## AI fields rule
Any AI-generated field stores value + source text + confidence numeric + review_status text default 'unreviewed'.
