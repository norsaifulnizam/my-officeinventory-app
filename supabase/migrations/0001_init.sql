-- Office Stationery & Pantry Inventory — v1 schema (demo-first, idempotent)

create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  contact text,
  created_at timestamptz not null default now()
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  item_code text,
  category text not null default 'Stationery',
  unit text,
  opening_stock int not null default 0,
  stock_received int not null default 0,
  stock_issued int not null default 0,
  current_balance int not null default 0,
  minimum_stock_level int not null default 0,
  expiry_date date,
  supplier_id uuid,
  unit_price numeric,
  stock_location text,
  created_at timestamptz not null default now()
);

create table if not exists stock_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  item_id uuid not null,
  type text not null,
  quantity int not null,
  requestor text,
  department text,
  transaction_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  item_id uuid,
  requestor text not null,
  department text,
  quantity int not null,
  status text not null default 'pending',
  notes text,
  ai_summary text,
  source text,
  confidence numeric,
  review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  actor text,
  action text not null,
  tool text,
  target_id uuid,
  before_json jsonb,
  after_json jsonb,
  status text,
  created_at timestamptz not null default now()
);

-- Enable RLS + permissive v1 policies
alter table items enable row level security;
alter table stock_transactions enable row level security;
alter table requests enable row level security;
alter table departments enable row level security;
alter table suppliers enable row level security;
alter table audit_logs enable row level security;

drop policy if exists "items_v1_read" on items;
create policy "items_v1_read" on items for select using (true);
drop policy if exists "items_v1_write" on items;
create policy "items_v1_write" on items for all using (true) with check (true);

drop policy if exists "stock_transactions_v1_read" on stock_transactions;
create policy "stock_transactions_v1_read" on stock_transactions for select using (true);
drop policy if exists "stock_transactions_v1_write" on stock_transactions;
create policy "stock_transactions_v1_write" on stock_transactions for all using (true) with check (true);

drop policy if exists "requests_v1_read" on requests;
create policy "requests_v1_read" on requests for select using (true);
drop policy if exists "requests_v1_write" on requests;
create policy "requests_v1_write" on requests for all using (true) with check (true);

drop policy if exists "departments_v1_read" on departments;
create policy "departments_v1_read" on departments for select using (true);
drop policy if exists "departments_v1_write" on departments;
create policy "departments_v1_write" on departments for all using (true) with check (true);

drop policy if exists "suppliers_v1_read" on suppliers;
create policy "suppliers_v1_read" on suppliers for select using (true);
drop policy if exists "suppliers_v1_write" on suppliers;
create policy "suppliers_v1_write" on suppliers for all using (true) with check (true);

drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

-- Seed: departments
insert into departments (id, name) values
  ('11111111-0000-0000-0000-dept00000001', 'Administration'),
  ('11111111-0000-0000-0000-dept00000002', 'Sales'),
  ('11111111-0000-0000-0000-dept00000003', 'Finance'),
  ('11111111-0000-0000-0000-dept00000004', 'Operations')
on conflict (id) do nothing;

-- Seed: suppliers
insert into suppliers (id, name, contact) values
  ('22222222-0000-0000-0000-sup0000000001', 'OfficeMart Supplies', 'orders@officemart.example'),
  ('22222222-0000-0000-0000-sup0000000002', 'PantryPro Distributors', 'sales@pantrypro.example'),
  ('22222222-0000-0000-0000-sup0000000003', 'StationeryHub', 'hello@stationeryhub.example')
on conflict (id) do nothing;

-- Seed: items
insert into items (id, name, item_code, category, unit, opening_stock, stock_received, stock_issued, current_balance, minimum_stock_level, expiry_date, supplier_id, unit_price, stock_location) values
  ('33333333-0000-0000-0000-item00000001', 'A4 Paper (Ream)', 'STA-A4', 'Stationery', 'ream', 20, 10, 18, 12, 5, null, '22222222-0000-0000-0000-sup0000000001', 4.50, 'Store Room A'),
  ('33333333-0000-0000-0000-item00000002', 'Blue Ballpoint Pen', 'STA-PEN-BL', 'Stationery', 'pcs', 200, 50, 210, 40, 100, null, '22222222-0000-0000-0000-sup0000000001', 0.25, 'Stationery Cupboard'),
  ('33333333-0000-0000-0000-item00000003', 'Instant Coffee 200g', 'PAN-COF-200', 'Pantry', 'jar', 15, 5, 9, 11, 4, '2025-02-28', '22222222-0000-0000-0000-sup0000000002', 6.20, 'Pantry Shelf 1'),
  ('33333333-0000-0000-0000-item00000004', 'Sugar Sachets (Box)', 'PAN-SGR-100', 'Pantry', 'box', 10, 0, 9, 1, 3, '2025-01-15', '22222222-0000-0000-0000-sup0000000002', 3.40, 'Pantry Shelf 2'),
  ('33333333-0000-0000-0000-item00000005', 'Binder Clip (Medium)', 'STA-BC-M', 'Stationery', 'box', 30, 0, 27, 3, 5, null, '22222222-0000-0000-0000-sup0000000003', 1.80, 'Stationery Cupboard')
on conflict (id) do nothing;

-- Seed: stock_transactions
insert into stock_transactions (id, item_id, type, quantity, requestor, department, transaction_date, notes) values
  ('44444444-0000-0000-0000-txn0000000001', '33333333-0000-0000-0000-item00000001', 'received', 10, 'Admin', 'Administration', '2025-01-05', 'Monthly restock'),
  ('44444444-0000-0000-0000-txn0000000002', '33333333-0000-0000-0000-item00000001', 'issued', 8, 'John', 'Sales', '2025-01-08', 'Weekly issue'),
  ('44444444-0000-0000-0000-txn0000000003', '33333333-0000-0000-0000-item00000003', 'issued', 4, 'Jane', 'Finance', '2025-01-10', 'Pantry use')
on conflict (id) do nothing;

-- Seed: requests
insert into requests (id, item_id, requestor, department, quantity, status, notes) values
  ('55555555-0000-0000-0000-req0000000001', '33333333-0000-0000-0000-item00000002', 'John', 'Sales', 10, 'fulfilled', 'Monthly stationery'),
  ('55555555-0000-0000-0000-req0000000002', '33333333-0000-0000-0000-item00000005', 'Jane', 'Finance', 2, 'pending', 'For filing'),
  ('55555555-0000-0000-0000-req0000000003', '33333333-0000-0000-0000-item00000004', 'Mike', 'Operations', 1, 'pending', 'Sugar for tea area')
on conflict (id) do nothing;