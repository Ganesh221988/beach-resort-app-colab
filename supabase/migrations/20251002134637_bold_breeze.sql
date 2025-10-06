/*
  # Create Bookings and Related Tables

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key to properties)
      - `customer_id` (uuid, foreign key to user_profiles)
      - `broker_id` (uuid, foreign key to user_profiles, nullable)
      - `owner_id` (uuid, foreign key to user_profiles)
      - `room_type_ids` (uuid array)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `duration_type` (enum: day, hour)
      - `guests` (integer, default 1)
      - `total_amount` (numeric)
      - `platform_commission` (numeric, default 0)
      - `broker_commission` (numeric, nullable)
      - `net_to_owner` (numeric)
      - `status` (enum: pending, confirmed, cancelled, completed)
      - `payment_status` (enum: pending, success, failed, refunded)
      - `booking_details` (jsonb)
      - `coupon_code` (text, nullable)
      - `discount_amount` (numeric, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `transactions`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, foreign key to bookings, nullable)
      - `user_id` (uuid, foreign key to user_profiles)
      - `amount` (numeric)
      - `type` (enum: payment, refund, commission, payout, subscription)
      - `status` (enum: pending, success, failed, refunded)
      - `gateway_txn_id` (text, nullable)
      - `description` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for booking management
    - Add policies for transaction access

  3. Indexes
    - Add performance indexes
*/

-- Create enums
CREATE TYPE duration_type AS ENUM ('day', 'hour');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');
CREATE TYPE transaction_type AS ENUM ('payment', 'refund', 'commission', 'payout', 'subscription');

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id),
  customer_id uuid NOT NULL REFERENCES user_profiles(id),
  broker_id uuid REFERENCES user_profiles(id),
  owner_id uuid NOT NULL REFERENCES user_profiles(id),
  room_type_ids uuid[] DEFAULT '{}',
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  duration_type duration_type DEFAULT 'day',
  guests integer DEFAULT 1,
  total_amount numeric(10,2) NOT NULL,
  platform_commission numeric(10,2) DEFAULT 0,
  broker_commission numeric(10,2),
  net_to_owner numeric(10,2) NOT NULL,
  status booking_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  booking_details jsonb DEFAULT '{}',
  coupon_code text,
  discount_amount numeric(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  user_id uuid NOT NULL REFERENCES user_profiles(id),
  amount numeric(10,2) NOT NULL,
  type transaction_type NOT NULL,
  status payment_status DEFAULT 'pending',
  gateway_txn_id text,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Booking policies
CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id = auth.uid() OR 
    broker_id = auth.uid() OR 
    owner_id = auth.uid()
  );

CREATE POLICY "Users can read own bookings as customer"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Users can read own bookings as broker"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (broker_id = auth.uid());

CREATE POLICY "Users can read own bookings as owner"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

-- Transaction policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_broker_id ON bookings(broker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_booking_id ON transactions(booking_id);

-- Create triggers
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();