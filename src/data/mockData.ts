import { Property, Booking, Transaction, Commission, Coupon, DashboardStats } from '../types';

export const mockEvents = [
  { id: '1', name: 'Wedding', description: 'Perfect venues for your special day' },
  { id: '2', name: 'Corporate Event', description: 'Professional spaces for business gatherings' },
  { id: '3', name: 'Birthday Party', description: 'Celebrate in style with our party venues' },
  { id: '4', name: 'Anniversary', description: 'Romantic settings for milestone celebrations' },
  { id: '5', name: 'Conference', description: 'Modern facilities for conferences and seminars' },
  { id: '6', name: 'Workshop', description: 'Interactive spaces for learning and development' },
  { id: '7', name: 'Reunion', description: 'Comfortable venues for family and friend gatherings' },
  { id: '8', name: 'Product Launch', description: 'Impressive venues for product presentations' }
];

export const mockProperties: Property[] = [
  {
    id: '1',
    owner_id: 'ECO2547001',
    title: 'Luxury Beachside Villa',
    description: 'Stunning 4-bedroom villa with private beach access, infinity pool, and modern amenities. Perfect for families and groups.',
    address: '123 Beach Road, Goa',
    city: 'Goa',
    state: 'Goa',
    geo: { lat: 15.2993, lng: 74.1240 },
    amenities: ['Private Pool', 'Beach Access', 'WiFi', 'AC', 'Kitchen', 'Parking', 'Garden'],
    images: [
      'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
    ],
    video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    booking_mode: 'both',
    booking_types: 'both',
    full_villa_rates: {
      daily_rate: 25000,
      hourly_rate: 3500
    },
    cancellation_policy: 'Free cancellation up to 24 hours before check-in',
    check_in_time: '15:00',
    check_out_time: '11:00',
    room_types: [
      {
        id: '1',
        property_id: '1',
        title: 'Master Suite',
        capacity: 2,
        price_per_night: 8500,
        price_per_hour: 1200,
        extra_person_charge: 500,
        amenities: ['King Bed', 'Private Bathroom', 'Balcony', 'AC']
      },
      {
        id: '2',
        property_id: '1',
        title: 'Standard Room',
        capacity: 2,
        price_per_night: 6500,
        price_per_hour: 900,
        extra_person_charge: 300,
        amenities: ['Queen Bed', 'Private Bathroom', 'AC']
      }
    ],
    created_at: '2024-01-15T10:00:00Z',
    status: 'active'
  },
  {
    id: '2',
    owner_id: 'ECO2547001',
    title: 'Mountain View Resort',
    description: 'Peaceful resort nestled in the hills with panoramic mountain views. Ideal for romantic getaways and wellness retreats.',
    address: '456 Hill Station Road, Manali',
    city: 'Manali',
    state: 'Himachal Pradesh',
    geo: { lat: 32.2396, lng: 77.1887 },
    amenities: ['Mountain View', 'Spa', 'Restaurant', 'WiFi', 'Fireplace', 'Trekking'],
    images: [
      'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
      'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg'
    ],
    video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    booking_mode: 'rooms_only',
    booking_types: 'daily',
    full_villa_rates: {
      daily_rate: 18000,
      hourly_rate: 2500
    },
    cancellation_policy: 'Free cancellation up to 48 hours before check-in',
    check_in_time: '14:00',
    check_out_time: '12:00',
    room_types: [
      {
        id: '3',
        property_id: '2',
        title: 'Deluxe Suite',
        capacity: 3,
        price_per_night: 7200,
        price_per_hour: 1000,
        extra_person_charge: 400,
        amenities: ['King Bed', 'Mountain View', 'Fireplace', 'Mini Bar']
      }
    ],
    created_at: '2024-02-01T08:30:00Z',
    status: 'active'
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    property_id: '1',
    property_title: 'Luxury Beachside Villa',
    room_type_ids: ['1'],
    room_types: ['Master Suite'],
    customer_id: 'ECC1547001',
    customer_name: 'David Johnson',
    broker_id: 'ECB3547001',
    broker_name: 'Sarah Wilson',
    owner_id: 'ECO2547001',
    start_date: '2024-03-15T15:00:00Z',
    end_date: '2024-03-18T11:00:00Z',
    duration_type: 'day',
    guests: 2,
    total_amount: 25500,
    platform_commission: 2550,
    broker_commission: 510,
    net_to_owner: 22440,
    status: 'confirmed',
    payment_status: 'success',
    created_at: '2024-03-01T14:30:00Z'
  },
  {
    id: '2',
    property_id: '2',
    property_title: 'Mountain View Resort',
    room_type_ids: ['3'],
    room_types: ['Deluxe Suite'],
    customer_id: 'ECC1547001',
    customer_name: 'David Johnson',
    owner_id: 'ECO2547001',
    start_date: '2024-04-10T10:00:00Z',
    end_date: '2024-04-10T16:00:00Z',
    duration_type: 'hour',
    guests: 2,
    total_amount: 6000,
    platform_commission: 600,
    net_to_owner: 5400,
    status: 'pending',
    payment_status: 'pending',
    created_at: '2024-03-25T09:15:00Z',
    coupon_code: 'WELCOME20',
    discount_amount: 1200
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    booking_id: '1',
    user_id: 'ECC1547001',
    amount: 25500,
    type: 'payment',
    status: 'success',
    gateway_txn_id: 'razorpay_123456789',
    description: 'Booking payment for Luxury Beachside Villa',
    created_at: '2024-03-01T14:35:00Z'
  },
  {
    id: '2',
    booking_id: '1',
    user_id: 'ECB3547001',
    amount: 510,
    type: 'commission',
    status: 'pending',
    description: 'Broker commission for booking #1',
    created_at: '2024-03-01T14:36:00Z'
  }
];

export const mockCommissions: Commission[] = [
  {
    id: '1',
    booking_id: '1',
    broker_id: 'ECB3547001',
    owner_id: 'ECO2547001',
    booking_amount: 25500,
    platform_commission: 2550,
    broker_commission: 510,
    net_to_owner: 22440,
    status: 'pending',
    created_at: '2024-03-01T14:36:00Z'
  }
];

export const mockCoupons: Coupon[] = [
  {
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    valid_from: '2024-03-01T00:00:00Z',
    valid_to: '2024-06-30T23:59:59Z',
    applicable_to: 'all',
    usage_limit: 1000,
    used_count: 45,
    created_by: 'ADMIN001',
    min_booking_amount: 5000
  },
  {
    code: 'BEACH500',
    type: 'fixed',
    value: 500,
    valid_from: '2024-03-01T00:00:00Z',
    valid_to: '2024-05-31T23:59:59Z',
    applicable_to: 'property',
    property_ids: ['1'],
    usage_limit: 100,
    used_count: 12,
    created_by: 'ECO2547001',
    min_booking_amount: 10000
  }
];

export const mockDashboardStats: Record<string, DashboardStats> = {
  admin: {
    total_properties: 156,
    total_bookings: 1847,
    total_revenue: 4567890,
    pending_payouts: 234567,
    monthly_growth: 15.3
  },
  owner: {
    total_properties: 2,
    total_bookings: 47,
    total_revenue: 189750,
    pending_payouts: 15200,
    occupancy_rate: 78.5,
    monthly_growth: 12.8
  },
  broker: {
    total_bookings: 23,
    commission_earned: 18750,
    monthly_growth: 24.7
  },
  customer: {
    total_bookings: 8,
    total_revenue: 45600,
    monthly_growth: 0
  }
}