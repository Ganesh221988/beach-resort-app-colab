/*
  # Create Additional Supporting Tables

  1. New Tables
    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `property_id` (uuid, foreign key to properties)
      - `created_at` (timestamptz)

    - `calendar_slots`
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key to properties)
      - `room_type_id` (uuid, foreign key to room_types, nullable)
      - `date` (date)
      - `hour` (integer, nullable)
      - `status` (text, default 'available')
      - `booking_id` (uuid, foreign key to bookings, nullable)
      - `price` (numeric, nullable)
      - `created_at` (timestamptz)

    - `admin_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (jsonb)
      - `description` (text, nullable)
      - `updated_by` (uuid, foreign key to user_profiles, nullable)
      - `updated_at` (timestamptz)

    - `subscription_plans`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (enum: owner, broker)
      - `pricing_model` (enum: percentage, flat)
      - `percentage` (numeric, nullable)
      - `flat_rate` (numeric, nullable)
      - `billing_cycle` (enum: monthly, yearly)
      - `features` (text array)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies

  3. Indexes
    - Add performance indexes
*/

-- Create enums
CREATE TYPE plan_type AS ENUM ('owner', 'broker');
CREATE TYPE pricing_model AS ENUM ('percentage', 'flat');
CREATE TYPE billing_cycle AS ENUM ('monthly', 'yearly');

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Create calendar_slots table
CREATE TABLE IF NOT EXISTS calendar_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id),
  room_type_id uuid REFERENCES room_types(id),
  date date NOT NULL,
  hour integer,
  status text DEFAULT 'available',
  booking_id uuid REFERENCES bookings(id),
  price numeric(10,2),
  created_at timestamptz DEFAULT now()
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb DEFAULT '{}',
  description text,
  updated_by uuid REFERENCES user_profiles(id),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type plan_type NOT NULL,
  pricing_model pricing_model NOT NULL,
  percentage numeric(5,2),
  flat_rate numeric(10,2),
  billing_cycle billing_cycle DEFAULT 'monthly',
  features text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- User favorites policies
CREATE POLICY "Users can manage own favorites"
  ON user_favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Calendar slots policies
CREATE POLICY "Everyone can read calendar slots"
  ON calendar_slots
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Property owners can manage calendar slots"
  ON calendar_slots
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = calendar_slots.property_id AND owner_id = auth.uid()
    )
  );

-- Admin settings policies
CREATE POLICY "Only admins can manage admin settings"
  ON admin_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can read admin settings"
  ON admin_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Subscription plans policies
CREATE POLICY "Everyone can read active subscription plans"
  ON subscription_plans
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can manage subscription plans"
  ON subscription_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property_id ON user_favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_calendar_slots_property_date ON calendar_slots(property_id, date);

-- Create triggers
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();