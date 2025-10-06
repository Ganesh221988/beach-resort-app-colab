export interface User {
  id: string;
  unique_id: string;
  name: string;
  email: string;
  phone: string;
  phone: string;
  role: 'admin' | 'owner' | 'broker' | 'customer';
  created_at: string;
}

export interface OwnerProfile extends User {
  business_name: string;
  bank_details: {
    account_number: string;
    bank_name: string;
    ifsc_code: string;
  };
  contact_info: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface BrokerProfile extends User {
  agency_name: string;
  commission_rate_override?: number;
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  geo: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  images: string[];
  video_url?: string;
  booking_mode: 'full_villa' | 'rooms_only' | 'both';
  booking_types: 'daily' | 'hourly' | 'both';
  full_villa_rates?: {
    daily_rate?: number;
    hourly_rate?: number;
  };
  cancellation_policy: string;
  check_in_time: string;
  check_out_time: string;
  room_types: RoomType[];
  created_at: string;
  status: 'active' | 'inactive' | 'under_review';
}

export interface RoomType {
  id: string;
  property_id: string;
  title: string;
  capacity: number;
  price_per_night: number;
  price_per_hour?: number;
  extra_person_charge: number;
  amenities: string[];
}

export interface Booking {
  id: string;
  property_id: string;
  property_title: string;
  room_type_ids: string[];
  room_types: string[];
  customer_id: string;
  customer_name: string;
  broker_id?: string;
  broker_name?: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  duration_type: 'day' | 'hour';
  guests: number;
  total_amount: number;
  platform_commission: number;
  broker_commission?: number;
  net_to_owner: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'success' | 'failed' | 'refunded';
  created_at: string;
  coupon_code?: string;
  discount_amount?: number;
}

export interface Transaction {
  id: string;
  booking_id?: string;
  user_id: string;
  amount: number;
  type: 'payment' | 'refund' | 'commission' | 'payout' | 'subscription';
  status: 'pending' | 'success' | 'failed';
  gateway_txn_id?: string;
  description: string;
  created_at: string;
}

export interface Commission {
  id: string;
  booking_id: string;
  broker_id: string;
  owner_id: string;
  booking_amount: number;
  platform_commission: number;
  broker_commission: number;
  net_to_owner: number;
  status: 'pending' | 'paid';
  created_at: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  valid_from: string;
  valid_to: string;
  applicable_to: 'property' | 'broker' | 'all';
  usage_limit: number;
  used_count: number;
  created_by: string;
  property_ids?: string[];
  min_booking_amount?: number;
}

export interface CalendarSlot {
  id: string;
  property_id: string;
  room_type_id: string;
  date: string;
  hour?: number;
  status: 'available' | 'booked' | 'blocked';
  booking_id?: string;
  price?: number;
}

export interface DashboardStats {
  total_properties?: number;
  total_bookings: number;
  total_revenue: number;
  pending_payouts?: number;
  commission_earned?: number;
  occupancy_rate?: number;
  monthly_growth: number;
}