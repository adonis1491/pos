/*
  # Customer and Order Management Schema

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `loyalty_card_number` (text, unique, nullable)
      - `name` (text, nullable)
      - `email` (text, nullable)
      - `phone` (text, nullable)
      - `points` (integer, default: 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `visitors`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)

    - `daily_financials`
      - `id` (uuid, primary key)
      - `date` (date)
      - `total_sales` (numeric)
      - `total_orders` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loyalty_card_number text UNIQUE,
  name text,
  email text,
  phone text,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

-- Create daily_financials table
CREATE TABLE IF NOT EXISTS daily_financials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  total_sales numeric DEFAULT 0,
  total_orders integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add customer/visitor reference to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES customers(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS visitor_id uuid REFERENCES visitors(id);
ALTER TABLE orders ADD CONSTRAINT customer_or_visitor_required 
  CHECK (
    (customer_id IS NOT NULL AND visitor_id IS NULL) OR 
    (customer_id IS NULL AND visitor_id IS NOT NULL)
  );

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_financials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Customers are viewable by staff"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Visitors are viewable by staff"
  ON visitors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Daily financials are viewable by staff"
  ON daily_financials FOR SELECT
  TO authenticated
  USING (true);

-- Create function to update daily financials
CREATE OR REPLACE FUNCTION update_daily_financials()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO daily_financials (date, total_sales, total_orders)
  VALUES (
    DATE(NEW.created_at),
    NEW.total,
    1
  )
  ON CONFLICT (date) DO UPDATE
  SET 
    total_sales = daily_financials.total_sales + NEW.total,
    total_orders = daily_financials.total_orders + 1,
    updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for orders
CREATE TRIGGER update_daily_financials_on_order
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_financials();