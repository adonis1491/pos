/*
  # Add order status tracking
  
  1. Changes
    - Add status column to orders table
    - Add status enum type
    - Add default status constraint
    
  2. Security
    - Update RLS policies to include status field
*/

-- Create order status enum
CREATE TYPE order_status AS ENUM (
  'pending',
  'completed',
  'cancelled'
);

-- Add status to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS status order_status 
DEFAULT 'pending'::order_status;

-- Add index for faster status queries
CREATE INDEX IF NOT EXISTS idx_orders_status 
ON orders(status);

-- Update orders policies to include status
CREATE POLICY "Staff can update order status"
  ON orders
  FOR UPDATE
  TO staff
  USING (true)
  WITH CHECK (true);