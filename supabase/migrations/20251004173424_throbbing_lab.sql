/*
  # Authentication System with Unique IDs

  1. New Tables
    - `users` - Custom user table with unique IDs
    - Updated `user_profiles` to reference custom users table
  
  2. Unique ID Generation
    - Customer: CX01A0001, CX01A0002, etc.
    - Owner: ON02A0001, ON02A0002, etc.
    - Broker: BK03A0001, BK03A0002, etc.
  
  3. Security
    - Enable RLS on users table
    - Add policies for user access
    - Password hashing for security
*/

-- Create custom users table with unique IDs
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_id text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  phone text,
  role user_role DEFAULT 'customer'::user_role,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Function to generate unique IDs
CREATE OR REPLACE FUNCTION generate_unique_id(user_role text)
RETURNS text AS $$
DECLARE
  prefix text;
  next_number integer;
  unique_id text;
BEGIN
  -- Set prefix based on role
  CASE user_role
    WHEN 'customer' THEN prefix := 'CX01A';
    WHEN 'owner' THEN prefix := 'ON02A';
    WHEN 'broker' THEN prefix := 'BK03A';
    ELSE prefix := 'CX01A'; -- Default to customer
  END CASE;
  
  -- Get next number for this role
  SELECT COALESCE(MAX(CAST(SUBSTRING(unique_id FROM LENGTH(prefix) + 1) AS INTEGER)), 0) + 1
  INTO next_number
  FROM users
  WHERE unique_id LIKE prefix || '%';
  
  -- Format with leading zeros
  unique_id := prefix || LPAD(next_number::text, 4, '0');
  
  RETURN unique_id;
END;
$$ LANGUAGE plpgsql;

-- Update user_profiles to reference custom users table
DO $$
BEGIN
  -- Add unique_id column to user_profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'unique_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN unique_id text;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_unique_id ON users(unique_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();