export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_integrations: {
        Row: {
          id: string
          user_id: string
          integration_type: 'razorpay' | 'mailchimp' | 'instagram' | 'facebook'
          integration_data: Json
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          integration_type: 'razorpay' | 'mailchimp' | 'instagram' | 'facebook'
          integration_data: Json
          is_enabled?: boolean
        }
        Update: {
          integration_data?: Json
          is_enabled?: boolean
          updated_at?: string
        }
      }
      admin_integrations: {
        Row: {
          id: string
          integration_type: 'razorpay' | 'mailchimp'
          integration_data: Json
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          integration_type: 'razorpay' | 'mailchimp'
          integration_data: Json
          is_enabled?: boolean
        }
        Update: {
          integration_data?: Json
          is_enabled?: boolean
          updated_at?: string
        }
      }
      user_integrations: {
        Row: {
          id: string
          user_id: string
          integration_type: 'razorpay' | 'mailchimp' | 'instagram' | 'facebook'
          integration_data: Json
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          integration_type: 'razorpay' | 'mailchimp' | 'instagram' | 'facebook'
          integration_data: Json
          is_enabled?: boolean
        }
        Update: {
          integration_data?: Json
          is_enabled?: boolean
          updated_at?: string
        }
      }
      admin_integrations: {
        Row: {
          id: string
          integration_type: 'razorpay' | 'mailchimp'
          integration_data: Json
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          integration_type: 'razorpay' | 'mailchimp'
          integration_data: Json
          is_enabled?: boolean
        }
        Update: {
          integration_data?: Json
          is_enabled?: boolean
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          name: string
          phone: string | null
          role: 'admin' | 'owner' | 'broker' | 'customer'
          kyc_status: 'pending' | 'verified' | 'rejected'
          subscription_status: 'active' | 'inactive' | 'trial' | null
          business_name: string | null
          agency_name: string | null
          gst_number: string | null
          pan_number: string | null
          license_number: string | null
          bank_details: Json
          contact_info: Json
          integrations: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          phone?: string | null
          role?: 'admin' | 'owner' | 'broker' | 'customer'
          kyc_status?: 'pending' | 'verified' | 'rejected'
          subscription_status?: 'active' | 'inactive' | 'trial' | null
          business_name?: string | null
          agency_name?: string | null
          gst_number?: string | null
          pan_number?: string | null
          license_number?: string | null
          bank_details?: Json
          contact_info?: Json
          integrations?: Json
        }
        Update: {
          name?: string
          phone?: string | null
          role?: 'admin' | 'owner' | 'broker' | 'customer'
          kyc_status?: 'pending' | 'verified' | 'rejected'
          subscription_status?: 'active' | 'inactive' | 'trial' | null
          business_name?: string | null
          agency_name?: string | null
          gst_number?: string | null
          pan_number?: string | null
          license_number?: string | null
          bank_details?: Json
          contact_info?: Json
          integrations?: Json
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string
          address: string
          city: string
          state: string
          geo: Json
          amenities: string[]
          images: string[]
          video_url: string | null
          booking_mode: 'full_villa' | 'rooms_only' | 'both'
          booking_types: 'daily' | 'hourly' | 'both'
          full_villa_rates: Json
          policies: Json
          check_in_time: string
          check_out_time: string
          status: 'active' | 'inactive' | 'under_review'
          created_at: string
          updated_at: string
        }
        Insert: {
          owner_id: string
          title: string
          description: string
          address: string
          city: string
          state: string
          geo?: Json
          amenities?: string[]
          images?: string[]
          video_url?: string | null
          booking_mode?: 'full_villa' | 'rooms_only' | 'both'
          booking_types?: 'daily' | 'hourly' | 'both'
          full_villa_rates?: Json
          policies?: Json
          check_in_time?: string
          check_out_time?: string
          status?: 'active' | 'inactive' | 'under_review'
        }
        Update: {
          title?: string
          description?: string
          address?: string
          city?: string
          state?: string
          geo?: Json
          amenities?: string[]
          images?: string[]
          video_url?: string | null
          booking_mode?: 'full_villa' | 'rooms_only' | 'both'
          booking_types?: 'daily' | 'hourly' | 'both'
          full_villa_rates?: Json
          policies?: Json
          check_in_time?: string
          check_out_time?: string
          status?: 'active' | 'inactive' | 'under_review'
          updated_at?: string
        }
      }
      room_types: {
        Row: {
          id: string
          property_id: string
          title: string
          capacity: number
          price_per_night: number
          price_per_hour: number | null
          extra_person_charge: number
          amenities: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          property_id: string
          title: string
          capacity?: number
          price_per_night: number
          price_per_hour?: number | null
          extra_person_charge?: number
          amenities?: string[]
        }
        Update: {
          title?: string
          capacity?: number
          price_per_night?: number
          price_per_hour?: number | null
          extra_person_charge?: number
          amenities?: string[]
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          property_id: string
          customer_id: string
          broker_id: string | null
          owner_id: string
          room_type_ids: string[]
          start_date: string
          end_date: string
          duration_type: 'day' | 'hour'
          guests: number
          total_amount: number
          platform_commission: number
          broker_commission: number | null
          net_to_owner: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status: 'pending' | 'success' | 'failed' | 'refunded'
          booking_details: Json
          coupon_code: string | null
          discount_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          property_id: string
          customer_id: string
          broker_id?: string | null
          owner_id: string
          room_type_ids?: string[]
          start_date: string
          end_date: string
          duration_type?: 'day' | 'hour'
          guests?: number
          total_amount: number
          platform_commission?: number
          broker_commission?: number | null
          net_to_owner: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'success' | 'failed' | 'refunded'
          booking_details?: Json
          coupon_code?: string | null
          discount_amount?: number | null
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'success' | 'failed' | 'refunded'
          booking_details?: Json
          updated_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          type: 'owner' | 'broker'
          pricing_model: 'percentage' | 'flat'
          percentage: number | null
          flat_rate: number | null
          billing_cycle: 'monthly' | 'yearly'
          features: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          type: 'owner' | 'broker'
          pricing_model: 'percentage' | 'flat'
          percentage?: number | null
          flat_rate?: number | null
          billing_cycle?: 'monthly' | 'yearly'
          features?: string[]
          is_active?: boolean
        }
        Update: {
          name?: string
          type?: 'owner' | 'broker'
          pricing_model?: 'percentage' | 'flat'
          percentage?: number | null
          flat_rate?: number | null
          billing_cycle?: 'monthly' | 'yearly'
          features?: string[]
          is_active?: boolean
          updated_at?: string
        }
      }
      admin_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          description?: string | null
          updated_by?: string | null
        }
        Update: {
          value?: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      integration_type: 'razorpay' | 'mailchimp' | 'instagram' | 'facebook'
      user_role: 'admin' | 'owner' | 'broker' | 'customer'
      kyc_status: 'pending' | 'verified' | 'rejected'
      subscription_status: 'active' | 'inactive' | 'trial'
      booking_mode: 'full_villa' | 'rooms_only' | 'both'
      booking_types: 'daily' | 'hourly' | 'both'
      property_status: 'active' | 'inactive' | 'under_review'
      duration_type: 'day' | 'hour'
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
      payment_status: 'pending' | 'success' | 'failed' | 'refunded'
      plan_type: 'owner' | 'broker'
      pricing_model: 'percentage' | 'flat'
      billing_cycle: 'monthly' | 'yearly'
    }
  }
}