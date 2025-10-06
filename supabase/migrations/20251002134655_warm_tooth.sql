/*
  # Create Integration Tables

  1. New Tables
    - `user_integrations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `integration_type` (enum: razorpay, mailchimp, instagram, facebook)
      - `integration_data` (jsonb)
      - `is_enabled` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `admin_integrations`
      - `id` (uuid, primary key)
      - `integration_type` (enum: razorpay, mailchimp)
      - `integration_data` (jsonb)
      - `is_enabled` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for integration management

  3. Constraints
    - Unique constraint on user_id + integration_type
    - Unique constraint on integration_type for admin
*/

-- Create enum
CREATE TYPE integration_type AS ENUM ('razorpay', 'mailchimp', 'instagram', 'facebook');

-- Create user_integrations table
CREATE TABLE IF NOT EXISTS user_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  integration_type integration_type NOT NULL,
  integration_data jsonb DEFAULT '{}',
  is_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, integration_type)
);

-- Create admin_integrations table
CREATE TABLE IF NOT EXISTS admin_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_type integration_type NOT NULL UNIQUE,
  integration_data jsonb DEFAULT '{}',
  is_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_integrations ENABLE ROW LEVEL SECURITY;

-- User integrations policies
CREATE POLICY "Users can manage own integrations"
  ON user_integrations
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all user integrations"
  ON user_integrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin integrations policies
CREATE POLICY "Only admins can manage admin integrations"
  ON admin_integrations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can read admin integrations"
  ON admin_integrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_type ON user_integrations(integration_type);
CREATE INDEX IF NOT EXISTS idx_admin_integrations_type ON admin_integrations(integration_type);

-- Create triggers
CREATE TRIGGER update_user_integrations_updated_at
  BEFORE UPDATE ON user_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_integrations_updated_at
  BEFORE UPDATE ON admin_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();