/*
  # Insert Sample Data for Testing

  1. Sample Data
    - Demo user profiles for all roles
    - Sample properties with room types
    - Sample bookings and transactions

  2. Purpose
    - Provide working demo data
    - Enable immediate testing
    - Show platform capabilities
*/

-- Insert sample user profiles
INSERT INTO user_profiles (id, name, role, kyc_status, business_name, agency_name, contact_info) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Admin User', 'admin', 'verified', 'ECR Beach Resorts', NULL, '{"calling_number": "+91 98765 43210", "whatsapp_number": "+91 98765 43210", "contact_person_name": "Admin", "business_hours": "24/7", "email_for_inquiries": "admin@ecrbeachresorts.com"}'),
  ('550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'owner', 'verified', 'John''s Beach Resorts', NULL, '{"calling_number": "+91 98765 43211", "whatsapp_number": "+91 98765 43211", "contact_person_name": "John Smith", "business_hours": "9 AM - 6 PM", "email_for_inquiries": "owner@ecrbeachresorts.com"}'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sarah Wilson', 'broker', 'verified', NULL, 'Sarah''s Travel Agency', '{"calling_number": "+91 98765 43212", "whatsapp_number": "+91 98765 43212", "contact_person_name": "Sarah Wilson", "business_hours": "9 AM - 8 PM", "email_for_inquiries": "broker@ecrbeachresorts.com"}'),
  ('550e8400-e29b-41d4-a716-446655440003', 'David Johnson', 'customer', 'verified', NULL, NULL, '{"calling_number": "+91 98765 43213", "whatsapp_number": "+91 98765 43213", "contact_person_name": "David Johnson", "business_hours": "Anytime", "email_for_inquiries": "customer@ecrbeachresorts.com"}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample properties
INSERT INTO properties (id, owner_id, title, description, address, city, state, amenities, images, booking_mode, booking_types, full_villa_rates, status) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Luxury Beachside Villa', 'Stunning 4-bedroom villa with private beach access, infinity pool, and modern amenities. Perfect for families and groups seeking luxury and comfort by the sea.', '123 Beach Road, Calangute', 'Goa', 'Goa', '{"Private Pool", "Beach Access", "WiFi", "AC", "Kitchen", "Parking", "Garden", "BBQ Area", "Hot Tub", "Security"}', '{"https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg", "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg", "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg", "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg"}', 'both', 'both', '{"daily_rate": 25000, "hourly_rate": 3500}', 'active'),
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Mountain View Resort', 'Peaceful resort nestled in the hills with panoramic mountain views. Ideal for romantic getaways and wellness retreats with spa facilities.', '456 Hill Station Road, Old Manali', 'Manali', 'Himachal Pradesh', '{"Mountain View", "Spa", "Restaurant", "WiFi", "Fireplace", "Trekking", "Hot Tub", "Garden", "Valley View", "Peaceful"}', '{"https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg", "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg", "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg"}', 'rooms_only', 'daily', '{"daily_rate": 18000}', 'active'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Royal Heritage Hotel', 'Experience royal luxury in this heritage hotel with stunning architecture and world-class amenities. Perfect for special occasions and luxury stays.', '789 Palace Road, City Palace Area', 'Udaipur', 'Rajasthan', '{"Palace View", "Pool", "Heritage", "Luxury", "Spa", "Restaurant", "WiFi", "AC", "Butler Service", "Royal Decor"}', '{"https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg", "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg", "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg"}', 'both', 'daily', '{"daily_rate": 35000}', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample room types
INSERT INTO room_types (property_id, title, capacity, price_per_night, price_per_hour, extra_person_charge, amenities) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', 'Master Suite', 2, 8500, 1200, 500, '{"King Bed", "Private Bathroom", "Balcony", "AC", "Mini Bar", "Ocean View"}'),
  ('660e8400-e29b-41d4-a716-446655440000', 'Standard Room', 2, 6500, 900, 300, '{"Queen Bed", "Private Bathroom", "AC", "WiFi", "Pool View"}'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Deluxe Suite', 3, 7200, NULL, 400, '{"King Bed", "Mountain View", "Fireplace", "Mini Bar", "Balcony", "Sitting Area"}'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Standard Mountain Room', 2, 5800, NULL, 300, '{"Queen Bed", "Mountain View", "AC", "WiFi", "Heater"}'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Royal Suite', 4, 12500, NULL, 800, '{"King Bed", "Palace View", "Luxury Bathroom", "Sitting Area", "Butler Service", "Royal Decor"}'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Heritage Room', 2, 8500, NULL, 500, '{"Queen Bed", "Heritage Decor", "AC", "WiFi", "Mini Bar", "Courtyard View"}')
ON CONFLICT DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (id, property_id, customer_id, broker_id, owner_id, room_type_ids, start_date, end_date, duration_type, guests, total_amount, platform_commission, broker_commission, net_to_owner, status, payment_status) VALUES
  (gen_random_uuid(), '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', ARRAY['660e8400-e29b-41d4-a716-446655440000'], '2024-03-15T15:00:00+00:00', '2024-03-18T11:00:00+00:00', 'day', 2, 25500, 2550, 510, 22440, 'confirmed', 'success'),
  (gen_random_uuid(), '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', NULL, '550e8400-e29b-41d4-a716-446655440001', ARRAY['660e8400-e29b-41d4-a716-446655440001'], '2024-04-10T14:00:00+00:00', '2024-04-12T12:00:00+00:00', 'day', 2, 14400, 1440, NULL, 12960, 'pending', 'pending')
ON CONFLICT DO NOTHING;

-- Insert sample coupons
INSERT INTO coupons (code, type, value, valid_from, valid_to, applicable_to, usage_limit, used_count, created_by, min_booking_amount) VALUES
  ('WELCOME20', 'percentage', 20, '2024-03-01T00:00:00+00:00', '2024-06-30T23:59:59+00:00', 'all', 1000, 45, '550e8400-e29b-41d4-a716-446655440000', 5000),
  ('BEACH500', 'fixed', 500, '2024-03-01T00:00:00+00:00', '2024-05-31T23:59:59+00:00', 'property', 100, 12, '550e8400-e29b-41d4-a716-446655440001', 10000)
ON CONFLICT (code) DO NOTHING;