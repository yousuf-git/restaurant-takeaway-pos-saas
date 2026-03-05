-- ============================================================
-- Migration 006: Dine-In Feature
-- Adds: tables, waiters, dine_ins tables
-- ============================================================

-- ============================================================
-- tables (restaurant dining tables)
-- ============================================================
CREATE TABLE tables (
  id              int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  restaurant_id   int NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number    text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  UNIQUE (restaurant_id, table_number)
);

CREATE TRIGGER trg_tables_updated_at
  BEFORE UPDATE ON tables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- waiters
-- ============================================================
CREATE TABLE waiters (
  id              int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  restaurant_id   int NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  fullname        text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_waiters_updated_at
  BEFORE UPDATE ON waiters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- dine_ins (links an order to a table + waiter)
-- ============================================================
CREATE TABLE dine_ins (
  id              int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id        int NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  table_id        int NOT NULL REFERENCES tables(id) ON DELETE SET NULL,
  waiter_id       int NOT NULL REFERENCES waiters(id) ON DELETE SET NULL,

  UNIQUE (order_id)
);

CREATE INDEX idx_dine_ins_order ON dine_ins (order_id);

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE dine_ins ENABLE ROW LEVEL SECURITY;

-- tables: admin full access
CREATE POLICY "admin_all_tables" ON tables
  FOR ALL TO authenticated
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');

-- tables: operator full CRUD on own restaurant
CREATE POLICY "operator_all_tables" ON tables
  FOR ALL TO authenticated
  USING (
    public.get_my_role() = 'operator'
    AND restaurant_id = public.get_my_restaurant_id()
  )
  WITH CHECK (
    public.get_my_role() = 'operator'
    AND restaurant_id = public.get_my_restaurant_id()
  );

-- waiters: admin full access
CREATE POLICY "admin_all_waiters" ON waiters
  FOR ALL TO authenticated
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');

-- waiters: operator full CRUD on own restaurant
CREATE POLICY "operator_all_waiters" ON waiters
  FOR ALL TO authenticated
  USING (
    public.get_my_role() = 'operator'
    AND restaurant_id = public.get_my_restaurant_id()
  )
  WITH CHECK (
    public.get_my_role() = 'operator'
    AND restaurant_id = public.get_my_restaurant_id()
  );

-- dine_ins
CREATE POLICY "admin_all_dine_ins" ON dine_ins
  FOR ALL TO authenticated
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "operator_read_dine_ins" ON dine_ins
  FOR SELECT TO authenticated
  USING (
    public.get_my_role() = 'operator'
    AND order_id IN (
      SELECT id FROM orders WHERE restaurant_id = public.get_my_restaurant_id()
    )
  );

CREATE POLICY "operator_insert_dine_ins" ON dine_ins
  FOR INSERT TO authenticated
  WITH CHECK (
    public.get_my_role() = 'operator'
    AND order_id IN (
      SELECT id FROM orders WHERE restaurant_id = public.get_my_restaurant_id()
    )
  );

-- ============================================================
-- Seed Data for Karachi Kitchen (restaurant_id = 1)
-- ============================================================

-- Tables
INSERT INTO tables (id, restaurant_id, table_number)
OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 'T-1'),
  (2, 1, 'T-2'),
  (3, 1, 'T-3'),
  (4, 1, 'T-4'),
  (5, 1, 'T-5'),
  (6, 2, 'A1'),
  (7, 2, 'A2'),
  (8, 2, 'A3');

SELECT setval(pg_get_serial_sequence('tables', 'id'), 8);

-- Waiters
INSERT INTO waiters (id, restaurant_id, fullname)
OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 'Ahmed Khan'),
  (2, 1, 'Bilal Shah'),
  (3, 1, 'Imran Ali'),
  (4, 2, 'Tariq Mehmood'),
  (5, 2, 'Saleem Raza');

SELECT setval(pg_get_serial_sequence('waiters', 'id'), 5);

-- Make order #2 a dine-in order (existing sample order)
INSERT INTO dine_ins (id, order_id, table_id, waiter_id)
OVERRIDING SYSTEM VALUE VALUES
  (1, 2, 3, 1);

SELECT setval(pg_get_serial_sequence('dine_ins', 'id'), 1);
