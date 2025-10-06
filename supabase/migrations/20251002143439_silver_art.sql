/*
  # Fix Database Schema Migration

  This migration ensures all tables, relationships, and security policies are properly configured.

  ## 1. Tables Created/Updated
  - user_profiles: User information with roles and KYC status
  - properties: Property listings with booking configurations
  - room_types: Individual room configurations for properties
  - bookings: Booking records with commission calculations
  - transactions: Payment and financial records
  - commissions: Commission tracking for brokers
  - coupons: Discount codes and promotions
  - calendar_slots: Availability management
  - user_favorites: User saved properties
  - marketing_campaigns: Social media marketing automation
  - social_media_posts: Posted content tracking
  - user_integrations: User-specific service integrations
  - admin_integrations: Platform-wide integrations
  - subscription_plans: Pricing plans for users
  - admin_settings: Platform configuration

  ## 2. Security
  - Enable RLS on all tables
  - Create appropriate policies for each user role
  - Ensure data isolation and access control

  ## 3. Functions and Triggers
  - Auto-update timestamps
  - Handle new user registration
*/

-- Create custom types/enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'owner', 'broker', 'customer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'trial');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_mode AS ENUM ('full_villa', 'rooms_only', 'both');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_types AS ENUM ('daily', 'hourly', 'both');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE property_status AS ENUM ('active', 'inactive', 'under_review');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE duration_type AS ENUM ('day', 'hour');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('payment', 'refund', 'commission', 'payout', 'subscription');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE commission_status AS ENUM ('pending', 'paid');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE plan_type AS ENUM ('owner', 'broker');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE pricing_model AS ENUM ('percentage', 'flat');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE billing_cycle AS ENUM ('monthly', 'yearly');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE integration_type AS ENUM ('razorpay', 'mailchimp', 'instagram', 'facebook');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE marketing_frequency AS ENUM ('every_2_days', 'weekly', 'monthly');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE social_platform AS ENUM ('instagram', 'facebook');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE post_status AS ENUM ('scheduled', 'posted', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 'customer');
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  role user_role DEFAULT 'customer' NOT NULL,
  kyc_status kyc_status DEFAULT 'pending' NOT NULL,
  subscription_status subscription_status,
  business_name text,
  agency_name text,
  gst_number text,
  pan_number text,
  license_number text,
  bank_details jsonb DEFAULT '{}' NOT NULL,
  contact_info jsonb DEFAULT '{}' NOT NULL,
  integrations jsonb DEFAULT '{}' NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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
  booking_mode booking_mode DEFAULT 'both' NOT NULL,
  booking_types booking_types DEFAULT 'both' NOT NULL,
  full_villa_rates jsonb DEFAULT '{}',
  policies jsonb DEFAULT '{}',
  check_in_time time DEFAULT '15:00:00',
  check_out_time time DEFAULT '11:00:00',
  status property_status DEFAULT 'under_review' NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create room_types table
CREATE TABLE IF NOT EXISTS room_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  title text NOT NULL,
  capacity integer DEFAULT 2 NOT NULL,
  price_per_night numeric(10,2) NOT NULL,
  price_per_hour numeric(10,2),
  extra_person_charge numeric(10,2) DEFAULT 0,
  amenities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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
  duration_type duration_type DEFAULT 'day' NOT NULL,
  guests integer DEFAULT 1 NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  platform_commission numeric(10,2) DEFAULT 0 NOT NULL,
  broker_commission numeric(10,2) DEFAULT 0,
  net_to_owner numeric(10,2) NOT NULL,
  status booking_status DEFAULT 'pending' NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  booking_details jsonb DEFAULT '{}',
  coupon_code text,
  discount_amount numeric(10,2) DEFAULT 0,
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
  status payment_status DEFAULT 'pending' NOT NULL,
  gateway_txn_id text,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create commissions table
CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id),
  broker_id uuid NOT NULL REFERENCES user_profiles(id),
  owner_id uuid NOT NULL REFERENCES user_profiles(id),
  booking_amount numeric(10,2) NOT NULL,
  platform_commission numeric(10,2) NOT NULL,
  broker_commission numeric(10,2) NOT NULL,
  net_to_owner numeric(10,2) NOT NULL,
  status commission_status DEFAULT 'pending' NOT NULL,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type coupon_type NOT NULL,
  value numeric(10,2) NOT NULL,
  valid_from timestamptz NOT NULL,
  valid_to timestamptz NOT NULL,
  applicable_to text DEFAULT 'all' NOT NULL,
  property_ids uuid[] DEFAULT '{}',
  usage_limit integer DEFAULT 1000,
  used_count integer DEFAULT 0,
  min_booking_amount numeric(10,2),
  created_by uuid NOT NULL REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create calendar_slots table
CREATE TABLE IF NOT EXISTS calendar_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id),
  room_type_id uuid REFERENCES room_types(id),
  date date NOT NULL,
  hour integer,
  status text DEFAULT 'available' NOT NULL,
  booking_id uuid REFERENCES bookings(id),
  price numeric(10,2),
  created_at timestamptz DEFAULT now()
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  frequency marketing_frequency DEFAULT 'weekly',
  is_active boolean DEFAULT false,
  instagram_enabled boolean DEFAULT false,
  facebook_enabled boolean DEFAULT false,
  last_posted_at timestamptz,
  next_post_at timestamptz,
  post_content_template jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_media_posts table
CREATE TABLE IF NOT EXISTS social_media_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  platform social_platform NOT NULL,
  post_content text NOT NULL,
  images text[] DEFAULT '{}',
  posted_at timestamptz,
  engagement_stats jsonb DEFAULT '{}',
  status post_status DEFAULT 'scheduled',
  external_post_id text,
  created_at timestamptz DEFAULT now()
);

-- Create user_integrations table
CREATE TABLE IF NOT EXISTS user_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  integration_type integration_type NOT NULL,
  integration_data jsonb DEFAULT '{}' NOT NULL,
  is_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, integration_type)
);

-- Create admin_integrations table
CREATE TABLE IF NOT EXISTS admin_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_type integration_type NOT NULL UNIQUE,
  integration_data jsonb DEFAULT '{}' NOT NULL,
  is_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
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
  billing_cycle billing_cycle DEFAULT 'monthly' NOT NULL,
  features text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb DEFAULT '{}' NOT NULL,
  description text,
  updated_by uuid REFERENCES user_profiles(id),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

CREATE INDEX IF NOT EXISTS idx_room_types_property_id ON room_types(property_id);

CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_broker_id ON bookings(broker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_booking_id ON transactions(booking_id);

CREATE INDEX IF NOT EXISTS idx_commissions_broker_id ON commissions(broker_id);

CREATE INDEX IF NOT EXISTS idx_calendar_slots_property_date ON calendar_slots(property_id, date);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property_id ON user_favorites(property_id);

CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_owner_id ON marketing_campaigns(owner_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_property_id ON marketing_campaigns(property_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_next_post ON marketing_campaigns(next_post_at) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_social_media_posts_campaign_id ON social_media_posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_platform ON social_media_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_status ON social_media_posts(status);

CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_type ON user_integrations(integration_type);

CREATE INDEX IF NOT EXISTS idx_admin_integrations_type ON admin_integrations(integration_type);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;

DROP POLICY IF EXISTS "Everyone can read active properties" ON properties;
DROP POLICY IF EXISTS "Owners can read own properties" ON properties;
DROP POLICY IF EXISTS "Owners can insert own properties" ON properties;
DROP POLICY IF EXISTS "Owners can update own properties" ON properties;
DROP POLICY IF EXISTS "Admins can read all properties" ON properties;

DROP POLICY IF EXISTS "Everyone can read room types for active properties" ON room_types;
DROP POLICY IF EXISTS "Owners can manage room types for own properties" ON room_types;

DROP POLICY IF EXISTS "Users can read own bookings as customer" ON bookings;
DROP POLICY IF EXISTS "Users can read own bookings as broker" ON bookings;
DROP POLICY IF EXISTS "Users can read own bookings as owner" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;

DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;

DROP POLICY IF EXISTS "Brokers can read own commissions" ON commissions;
DROP POLICY IF EXISTS "Owners can read commissions for their properties" ON commissions;

DROP POLICY IF EXISTS "Everyone can read calendar slots" ON calendar_slots;
DROP POLICY IF EXISTS "Property owners can manage calendar slots" ON calendar_slots;

DROP POLICY IF EXISTS "Users can manage own favorites" ON user_favorites;

DROP POLICY IF EXISTS "Owners can manage own marketing campaigns" ON marketing_campaigns;
DROP POLICY IF EXISTS "Admins can read all marketing campaigns" ON marketing_campaigns;

DROP POLICY IF EXISTS "Owners can read own social media posts" ON social_media_posts;
DROP POLICY IF EXISTS "System can insert social media posts" ON social_media_posts;
DROP POLICY IF EXISTS "Admins can read all social media posts" ON social_media_posts;

DROP POLICY IF EXISTS "Users can manage own integrations" ON user_integrations;
DROP POLICY IF EXISTS "Admins can read all user integrations" ON user_integrations;

DROP POLICY IF EXISTS "Only admins can manage admin integrations" ON admin_integrations;

DROP POLICY IF EXISTS "Everyone can read active subscription plans" ON subscription_plans;
DROP POLICY IF EXISTS "Only admins can manage subscription plans" ON subscription_plans;

DROP POLICY IF EXISTS "Only admins can read admin settings" ON admin_settings;
DROP POLICY IF EXISTS "Only admins can manage admin settings" ON admin_settings;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create RLS policies for properties
CREATE POLICY "Everyone can read active properties"
  ON properties FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Owners can read own properties"
  ON properties FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can insert own properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can read all properties"
  ON properties FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create RLS policies for room_types
CREATE POLICY "Everyone can read room types for active properties"
  ON room_types FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM properties
    WHERE id = room_types.property_id AND status = 'active'
  ));

CREATE POLICY "Owners can manage room types for own properties"
  ON room_types FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM properties
    WHERE id = room_types.property_id AND owner_id = auth.uid()
  ));

-- Create RLS policies for bookings
CREATE POLICY "Users can read own bookings as customer"
  ON bookings FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Users can read own bookings as broker"
  ON bookings FOR SELECT
  TO authenticated
  USING (broker_id = auth.uid());

CREATE POLICY "Users can read own bookings as owner"
  ON bookings FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid() OR broker_id = auth.uid() OR owner_id = auth.uid());

-- Create RLS policies for transactions
CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create RLS policies for commissions
CREATE POLICY "Brokers can read own commissions"
  ON commissions FOR SELECT
  TO authenticated
  USING (broker_id = auth.uid());

CREATE POLICY "Owners can read commissions for their properties"
  ON commissions FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

-- Create RLS policies for calendar_slots
CREATE POLICY "Everyone can read calendar slots"
  ON calendar_slots FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Property owners can manage calendar slots"
  ON calendar_slots FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM properties
    WHERE id = calendar_slots.property_id AND owner_id = auth.uid()
  ));

-- Create RLS policies for user_favorites
CREATE POLICY "Users can manage own favorites"
  ON user_favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for marketing_campaigns
CREATE POLICY "Owners can manage own marketing campaigns"
  ON marketing_campaigns FOR ALL
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Admins can read all marketing campaigns"
  ON marketing_campaigns FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create RLS policies for social_media_posts
CREATE POLICY "Owners can read own social media posts"
  ON social_media_posts FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM marketing_campaigns
    WHERE id = social_media_posts.campaign_id AND owner_id = auth.uid()
  ));

CREATE POLICY "System can insert social media posts"
  ON social_media_posts FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM marketing_campaigns
    WHERE id = social_media_posts.campaign_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Admins can read all social media posts"
  ON social_media_posts FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create RLS policies for user_integrations
CREATE POLICY "Users can manage own integrations"
  ON user_integrations FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all user integrations"
  ON user_integrations FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create RLS policies for admin_integrations
CREATE POLICY "Only admins can manage admin integrations"
  ON admin_integrations FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create RLS policies for subscription_plans
CREATE POLICY "Everyone can read active subscription plans"
  ON subscription_plans FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can manage subscription plans"
  ON subscription_plans FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create RLS policies for admin_settings
CREATE POLICY "Only admins can read admin settings"
  ON admin_settings FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Only admins can manage admin settings"
  ON admin_settings FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_room_types_updated_at ON room_types;
CREATE TRIGGER update_room_types_updated_at
  BEFORE UPDATE ON room_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_marketing_campaigns_updated_at ON marketing_campaigns;
CREATE TRIGGER update_marketing_campaigns_updated_at
  BEFORE UPDATE ON marketing_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_integrations_updated_at ON user_integrations;
CREATE TRIGGER update_user_integrations_updated_at
  BEFORE UPDATE ON user_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_integrations_updated_at ON admin_integrations;
CREATE TRIGGER update_admin_integrations_updated_at
  BEFORE UPDATE ON admin_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_settings_updated_at ON admin_settings;
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert default admin settings
INSERT INTO admin_settings (key, value, description) VALUES
  ('platform_commission_rate', '10', 'Platform commission percentage on bookings'),
  ('broker_commission_rate', '20', 'Broker commission percentage of platform commission'),
  ('currency', '"INR"', 'Default platform currency'),
  ('timezone', '"Asia/Kolkata"', 'Platform timezone')
ON CONFLICT (key) DO NOTHING;

-- Insert default subscription plans
INSERT INTO subscription_plans (name, type, pricing_model, percentage, flat_rate, billing_cycle, features, is_active) VALUES
  ('Owner Free', 'owner', 'percentage', 10.00, NULL, 'monthly', ARRAY['Up to 2 properties', 'Basic booking management', 'Email support'], true),
  ('Owner Pro', 'owner', 'percentage', 8.00, NULL, 'monthly', ARRAY['Unlimited properties', 'Advanced analytics', 'Priority support', 'Calendar management', 'Custom pricing rules'], true),
  ('Owner Enterprise', 'owner', 'percentage', 5.00, NULL, 'monthly', ARRAY['Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'White-label options', 'API access'], true),
  ('Broker Free', 'broker', 'flat', NULL, 0, 'monthly', ARRAY['Up to 10 bookings/month', 'Basic commission tracking', 'Email support'], true),
  ('Broker Plus', 'broker', 'flat', NULL, 999, 'monthly', ARRAY['Unlimited bookings', 'Advanced commission tracking', 'Customer management', 'Priority support', 'Marketing materials'], true),
  ('Broker Pro', 'broker', 'flat', NULL, 1999, 'monthly', ARRAY['Everything in Plus', 'Team management', 'Custom branding', 'API access', 'Dedicated support'], true)
ON CONFLICT DO NOTHING;