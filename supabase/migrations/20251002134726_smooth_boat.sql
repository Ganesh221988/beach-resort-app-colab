/*
  # Create Marketing and Social Media Tables

  1. New Tables
    - `marketing_campaigns`
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key to properties)
      - `owner_id` (uuid, foreign key to user_profiles)
      - `frequency` (enum: every_2_days, weekly, monthly)
      - `is_active` (boolean, default false)
      - `instagram_enabled` (boolean, default false)
      - `facebook_enabled` (boolean, default false)
      - `last_posted_at` (timestamptz, nullable)
      - `next_post_at` (timestamptz, nullable)
      - `post_content_template` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `social_media_posts`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, foreign key to marketing_campaigns)
      - `property_id` (uuid, foreign key to properties)
      - `platform` (enum: instagram, facebook)
      - `post_content` (text)
      - `images` (text array)
      - `posted_at` (timestamptz, nullable)
      - `engagement_stats` (jsonb)
      - `status` (enum: scheduled, posted, failed)
      - `external_post_id` (text, nullable)
      - `created_at` (timestamptz)

    - `commissions`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, foreign key to bookings)
      - `broker_id` (uuid, foreign key to user_profiles)
      - `owner_id` (uuid, foreign key to user_profiles)
      - `booking_amount` (numeric)
      - `platform_commission` (numeric)
      - `broker_commission` (numeric)
      - `net_to_owner` (numeric)
      - `status` (enum: pending, paid)
      - `paid_at` (timestamptz, nullable)
      - `created_at` (timestamptz)

    - `coupons`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `type` (enum: percentage, fixed)
      - `value` (numeric)
      - `valid_from` (timestamptz)
      - `valid_to` (timestamptz)
      - `applicable_to` (text, default 'all')
      - `property_ids` (uuid array)
      - `usage_limit` (integer, default 1000)
      - `used_count` (integer, default 0)
      - `min_booking_amount` (numeric, nullable)
      - `created_by` (uuid, foreign key to user_profiles)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies

  3. Indexes
    - Add performance indexes
*/

-- Create enums
CREATE TYPE marketing_frequency AS ENUM ('every_2_days', 'weekly', 'monthly');
CREATE TYPE social_platform AS ENUM ('instagram', 'facebook');
CREATE TYPE post_status AS ENUM ('scheduled', 'posted', 'failed');
CREATE TYPE commission_status AS ENUM ('pending', 'paid');
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed');

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
  status commission_status DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  type coupon_type NOT NULL,
  value numeric(10,2) NOT NULL,
  valid_from timestamptz NOT NULL,
  valid_to timestamptz NOT NULL,
  applicable_to text DEFAULT 'all',
  property_ids uuid[] DEFAULT '{}',
  usage_limit integer DEFAULT 1000,
  used_count integer DEFAULT 0,
  min_booking_amount numeric(10,2),
  created_by uuid NOT NULL REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

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
      WHERE id = auth.uid() AND role = 'admin'
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
      WHERE id = auth.uid() AND role = 'admin'
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

-- Coupons policies (public read for validation)
-- No RLS policies needed for coupons as they should be readable for validation

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_property_id ON marketing_campaigns(property_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_owner_id ON marketing_campaigns(owner_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_next_post ON marketing_campaigns(next_post_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_social_media_posts_campaign_id ON social_media_posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_platform ON social_media_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_status ON social_media_posts(status);
CREATE INDEX IF NOT EXISTS idx_commissions_broker_id ON commissions(broker_id);

-- Create triggers
CREATE TRIGGER update_marketing_campaigns_updated_at
  BEFORE UPDATE ON marketing_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();