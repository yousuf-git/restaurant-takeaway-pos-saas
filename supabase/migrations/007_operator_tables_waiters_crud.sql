-- ============================================================
-- Migration 007: Grant operators full CRUD on tables & waiters
-- Fixes: 403 error when operators try to create/update/delete
-- ============================================================

-- Drop the old SELECT-only policies (if they exist)
DROP POLICY IF EXISTS "operator_read_tables" ON tables;
DROP POLICY IF EXISTS "operator_read_waiters" ON waiters;

-- Drop the ALL policy too in case 006 was re-applied with the updated version
DROP POLICY IF EXISTS "operator_all_tables" ON tables;
DROP POLICY IF EXISTS "operator_all_waiters" ON waiters;

-- Operator: full CRUD on tables for own restaurant
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

-- Operator: full CRUD on waiters for own restaurant
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
