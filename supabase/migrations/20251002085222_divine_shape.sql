/*
  # Create additional supporting tables

  1. New Tables
    - `user_favorites` - User favorite properties
    - `calendar_slots` - Property availability calendar
    - `commissions` - Commission tracking
    - `coupons` - Discount coupons
    - `subscription_plans` - Platform subscription plans
    - `admin_settings` - Platform configuration
    - `user_integrations` - User-specific integrations
    - `admin_integrations` - Platform-wide integrations
    - `marketing_campaigns` - Social media marketing campaigns
    - `social_media_posts` - Posted content tracking

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table

  3. Indexes
    - Add performance indexes for all tables
*/

-- Create additional enums
CREATE TYPE commission_status AS ENUM ('pending', 'paid');
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed');
CREATE TYPE plan_type AS ENUM ('owner', 'broker');
CREATE TYPE pricing_model AS ENUM ('percentage', 'flat');
CREATE TYPE billing_cycle AS ENUM ('monthly', 'yearly');
CREATE TYPE integration_type AS ENUM ('razorpay', 'mailchimp', 'instagram', 'facebook');
CREATE TYPE marketing_frequency AS ENUM ('every_2_days', 'weekly', 'monthly');
CREATE TYPE social_platform AS ENUM ('instagram', 'facebook');
CREATE TYPE post_status AS ENUM ('scheduled', 'posted', 'failed');

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
  status text DEFAULT 'available'::text NOT NULL,
  booking_id uuid REFERENCES bookings(id),
  price numeric(10,2),
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
  status commission_status DEFAULT 'pending'::commission_status NOT NULL,
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
  applicable_to text DEFAULT 'all'::text NOT NULL,
  property_ids uuid[],
  usage_limit integer DEFAULT 1000,
  used_count integer DEFAULT 0,
  min_booking_amount numeric(10,2),
  created_by uuid NOT NULL REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type plan_type NOT NULL,
  pricing_model pricing_model NOT NULL,
  percentage numeric(5,2),
  flat_rate numeric(10,2),
  billing_cycle billing_cycle DEFAULT 'monthly'::billing_cycle NOT NULL,
  features text[] DEFAULT '{}'::text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb DEFAULT '{}'::jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES user_profiles(id),
  updated_at timestamptz DEFAULT now()
);

-- Create user_integrations table
CREATE TABLE IF NOT EXISTS user_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  integration_type integration_type NOT NULL,
  integration_data jsonb DEFAULT '{}'::jsonb NOT NULL,
  is_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, integration_type)
);

-- Create admin_integrations table
CREATE TABLE IF NOT EXISTS admin_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_type integration_type NOT NULL UNIQUE,
  integration_data jsonb DEFAULT '{}'::jsonb NOT NULL,
  is_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  frequency marketing_frequency DEFAULT 'weekly'::marketing_frequency,
  is_active boolean DEFAULT false,
  instagram_enabled boolean DEFAULT false,
  facebook_enabled boolean DEFAULT false,
  last_posted_at timestamptz,
  next_post_at timestamptz,
  post_content_template jsonb DEFAULT '{}'::jsonb,
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
  images text[] DEFAULT '{}'::text[],
  posted_at timestamptz,
  engagement_stats jsonb DEFAULT '{}'::jsonb,
  status post_status DEFAULT 'scheduled'::post_status,
  external_post_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;

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

-- Commissions policies
CREATE POLICY "Brokers can read own commissions"
  ON commissions
  FOR SELECT
  TO authenticated
  USING (broker_id = auth.uid());

CREATE POLICY "Owners can read commissions for their properties"
  ON commissions
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

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
      WHERE id = auth.uid() AND role = 'admin'::user_role
    )
  );

-- Admin settings policies
CREATE POLICY "Only admins can read admin settings"
  ON admin_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'::user_role
    )
  );

CREATE POLICY "Only admins can manage admin settings"
  ON admin_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'::user_role
    )
  );

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
      WHERE id = auth.uid() AND role = 'admin'::user_role
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
      WHERE id = auth.uid() AND role = 'admin'::user_role
    )
  );

-- Marketing campaigns policies
CREATE POLICY "Owners can manage own marketing campaigns"
  ON marketing_campaigns
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Admins can read all marketing campaigns"
  ON marketing_campaigns
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'::user_role
    )
  );

-- Social media posts policies
CREATE POLICY "Owners can read own social media posts"
  ON social_media_posts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketing_campaigns 
      WHERE id = social_media_posts.campaign_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "System can insert social media posts"
  ON social_media_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM marketing_campaigns 
      WHERE id = social_media_posts.campaign_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all social media posts"
  ON social_media_posts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'::user_role
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property_id ON user_favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_calendar_slots_property_date ON calendar_slots(property_id, date);
CREATE INDEX IF NOT EXISTS idx_commissions_broker_id ON commissions(broker_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_type ON user_integrations(integration_type);
CREATE INDEX IF NOT EXISTS idx_admin_integrations_type ON admin_integrations(integration_type);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_owner_id ON marketing_campaigns(owner_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_property_id ON marketing_campaigns(property_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_next_post ON marketing_campaigns(next_post_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_social_media_posts_campaign_id ON social_media_posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_platform ON social_media_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_status ON social_media_posts(status);

-- Create triggers
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_integrations_updated_at
  BEFORE UPDATE ON user_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_integrations_updated_at
  BEFORE UPDATE ON admin_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_campaigns_updated_at
  BEFORE UPDATE ON marketing_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();