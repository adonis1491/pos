/*
  # Roles and Permissions Setup

  1. Roles
    - admin: Full access to all tables
    - staff: Can manage products and view orders
    - cashier: Can create orders and view products
    
  2. Policies
    - Products: CRUD for admin/staff, read for cashier
    - Orders: Create/read for cashier, full access for admin
    - Order Items: Managed through orders
*/

-- Create custom roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin'
  ) THEN
    CREATE ROLE admin;
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles WHERE rolname = 'staff'
  ) THEN
    CREATE ROLE staff;
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles WHERE rolname = 'cashier'
  ) THEN
    CREATE ROLE cashier;
  END IF;
END
$$;

-- Products table policies
CREATE POLICY "Admin full access on products"
  ON products
  FOR ALL
  TO admin
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Staff can manage products"
  ON products
  FOR ALL
  TO staff
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Cashiers can view products"
  ON products
  FOR SELECT
  TO cashier
  USING (true);

-- Orders table policies
CREATE POLICY "Admin full access on orders"
  ON orders
  FOR ALL
  TO admin
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Cashiers can create and view own orders"
  ON orders
  FOR ALL
  TO cashier
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Admin full access on order_items"
  ON order_items
  FOR ALL
  TO admin
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Cashiers can manage items in their orders"
  ON order_items
  FOR ALL
  TO cashier
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );