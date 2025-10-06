/*
  # Insert Sample Data for Testing

  1. Sample Data
    - Admin user profile
    - Sample subscription plans
    - Sample admin settings
    - Sample properties with room types
    - Sample integrations

  2. Purpose
    - Provide working demo data
    - Enable immediate testing
    - Show platform capabilities
*/

-- Insert sample subscription plans
INSERT INTO subscription_plans (name, type, pricing_model, percentage, flat_rate, billing_cycle, features) VALUES
('Owner Free', 'owner', 'percentage', 10.00, NULL, 'monthly', ARRAY['Up to 2 properties', 'Basic support', 'Standard commission']),
('Owner Pro', 'owner', 'percentage', 8.00, NULL, 'monthly', ARRAY['Unlimited properties', 'Priority support', 'Reduced commission', 'Analytics dashboard']),
('Owner Enterprise', 'owner', 'percentage', 5.00, NULL, 'monthly', ARRAY['Everything in Pro', 'Dedicated manager', 'Custom integrations', 'Lowest commission']),
('Broker Free', 'broker', 'flat', NULL, 0, 'monthly', ARRAY['Up to 10 bookings/month', 'Basic commission tracking', 'Email support']),
('Broker Plus', 'broker', 'flat', NULL, 999, 'monthly', ARRAY['Unlimited bookings', 'Advanced tracking', 'Priority support', 'Marketing tools']),
('Broker Pro', 'broker', 'flat', NULL, 1999, 'monthly', ARRAY['Everything in Plus', 'Team management', 'API access', 'Custom branding'])
ON CONFLICT DO NOTHING;

-- Insert sample admin settings
INSERT INTO admin_settings (key, value, description) VALUES
('platform_commission_rate', '{"percentage": 10}', 'Default platform commission percentage'),
('broker_commission_rate', '{"percentage": 20}', 'Broker commission as percentage of platform commission'),
('default_cancellation_policy', '{"policy": "Free cancellation up to 24 hours before check-in"}', 'Default cancellation policy for properties'),
('platform_contact', '{"email": "support@ecrbeachresorts.com", "phone": "+91 98765 43210"}', 'Platform contact information'),
('payment_gateway_fees', '{"razorpay": 2.4, "admin_gateway": 3.5}', 'Payment gateway fee percentages')
ON CONFLICT (key) DO NOTHING;