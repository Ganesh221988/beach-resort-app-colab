/*
  # Create User Profiles Table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key) - References auth.users
      - `name` (text, not null)
      - `phone` (text, nullable)
      - `role` (enum: admin, owner, broker, customer)
      - `kyc_status` (enum: pending, verified, rejected)
      - `subscription_status` (enum: active, inactive, trial)
      - `business_name` (text, nullable) - For owners
      - `agency_name` (text, nullable) - For brokers
      - `gst_number` (text, nullable)
      - `pan_number` (text, nullable)
      - `license_number` (text, nullable)
      - `bank_details` (jsonb)
      - `contact_info` (jsonb)
      - `integrations` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to read/update own profile
    - Add policy for admins to read all profiles

  3. Functions
    - Create trigger function for updated_at
    - Create trigger function for new user profile creation
*/

-- Create enums
CREATE TYPE user_role AS ENUM ('admin', 'owner', 'broker', 'customer');
CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'trial');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  role user_role DEFAULT 'customer',
  kyc_status kyc_status DEFAULT 'pending',
  subscription_status subscription_status,
  business_name text,
  agency_name text,
  gst_number text,
  pan_number text,
  license_number text,
  bank_details jsonb DEFAULT '{}',
  contact_info jsonb DEFAULT '{}',
  integrations jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();