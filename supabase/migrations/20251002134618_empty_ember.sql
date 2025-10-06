/*
  # Create Properties and Room Types Tables

  1. New Tables
    - `properties`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, foreign key to user_profiles)
      - `title` (text, not null)
      - `description` (text, not null)
      - `address` (text, not null)
      - `city` (text, not null)
      - `state` (text, not null)
      - `geo` (jsonb) - Coordinates
      - `amenities` (text array)
      - `images` (text array) - URLs
      - `video_url` (text, nullable)
      - `booking_mode` (enum: full_villa, rooms_only, both)
      - `booking_types` (enum: daily, hourly, both)
      - `full_villa_rates` (jsonb)
      - `policies` (jsonb)
      - `check_in_time` (time)
      - `check_out_time` (time)
      - `status` (enum: active, inactive, under_review)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `room_types`
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key to properties)
      - `title` (text, not null)
      - `capacity` (integer, default 2)
      - `price_per_night` (numeric)
      - `price_per_hour` (numeric, nullable)
      - `extra_person_charge` (numeric, default 0)
      - `amenities` (text array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for property management
    - Add policies for public property viewing

  3. Indexes
    - Add indexes for performance optimization
*/

-- Create enums
CREATE TYPE booking_mode AS ENUM ('full_villa', 'rooms_only', 'both');
CREATE TYPE booking_types AS ENUM ('daily', 'hourly', 'both');
CREATE TYPE property_status AS ENUM ('active', 'inactive', 'under_review');

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  geo jsonb DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  video_url text,
  booking_mode booking_mode DEFAULT 'both',
  booking_types booking_types DEFAULT 'both',
  full_villa_rates jsonb DEFAULT '{}',
  policies jsonb DEFAULT '{}',
  check_in_time time DEFAULT '15:00:00',
  check_out_time time DEFAULT '11:00:00',
  status property_status DEFAULT 'under_review',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create room_types table
CREATE TABLE IF NOT EXISTS room_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  title text NOT NULL,
  capacity integer DEFAULT 2,
  price_per_night numeric(10,2) NOT NULL,
  price_per_hour numeric(10,2),
  extra_person_charge numeric(10,2) DEFAULT 0,
  amenities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;

-- Properties policies
CREATE POLICY "Everyone can read active properties"
  ON properties
  FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Owners can read own properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can insert own properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can read all properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Room types policies
CREATE POLICY "Everyone can read room types for active properties"
  ON room_types
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = room_types.property_id AND status = 'active'
    )
  );

CREATE POLICY "Owners can manage room types for own properties"
  ON room_types
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = room_types.property_id AND owner_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_room_types_property_id ON room_types(property_id);

-- Create triggers
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_types_updated_at
  BEFORE UPDATE ON room_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();