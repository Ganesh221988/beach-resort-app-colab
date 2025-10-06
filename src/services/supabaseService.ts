import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { Property, Booking, User } from '../types';

type Tables = Database['public']['Tables'];

// Favorites Services
export const favoritesService = {
  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        *,
        properties (*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async addToFavorites(userId: string, propertyId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        property_id: propertyId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeFromFavorites(userId: string, propertyId: string) {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);
    
    if (error) throw error;
  },

  async isFavorite(userId: string, propertyId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};

// User Profile Services
export const userService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Tables['user_profiles']['Update']>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Property Services
export const propertyService = {
  async getProperties(ownerId?: string) {
    let query = supabase
      .from('properties')
      .select(`
        *,
        room_types (*),
        user_profiles!owner_id (name, business_name)
      `);

    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    } else {
      query = query.eq('status', 'active');
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createProperty(property: Tables['properties']['Insert']) {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProperty(propertyId: string, updates: Tables['properties']['Update']) {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', propertyId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProperty(propertyId: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);
    
    if (error) throw error;
  }
};

// Room Type Services
export const roomTypeService = {
  async createRoomType(roomType: Tables['room_types']['Insert']) {
    const { data, error } = await supabase
      .from('room_types')
      .insert(roomType)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateRoomType(roomTypeId: string, updates: Tables['room_types']['Update']) {
    const { data, error } = await supabase
      .from('room_types')
      .update(updates)
      .eq('id', roomTypeId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteRoomType(roomTypeId: string) {
    const { error } = await supabase
      .from('room_types')
      .delete()
      .eq('id', roomTypeId);
    
    if (error) throw error;
  }
};

// Booking Services
export const bookingService = {
  async getBookings(userId?: string, userRole?: string) {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        properties (title, city, images),
        user_profiles!customer_id (name),
        user_profiles!broker_id (name),
        user_profiles!owner_id (name, business_name)
      `);

    if (userId && userRole) {
      switch (userRole) {
        case 'owner':
          query = query.eq('owner_id', userId);
          break;
        case 'broker':
          query = query.eq('broker_id', userId);
          break;
        case 'customer':
          query = query.eq('customer_id', userId);
          break;
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createBooking(booking: Tables['bookings']['Insert']) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateBooking(bookingId: string, updates: Tables['bookings']['Update']) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Admin Settings Services
export const adminService = {
  async getSettings() {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .order('key');
    
    if (error) throw error;
    return data;
  },

  async updateSetting(key: string, value: any, updatedBy: string) {
    const { data, error } = await supabase
      .from('admin_settings')
      .upsert({
        key,
        value,
        updated_by: updatedBy,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSubscriptionPlans() {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('created_at');
    
    if (error) throw error;
    return data;
  },

  async createSubscriptionPlan(plan: Tables['subscription_plans']['Insert']) {
    const { data, error } = await supabase
      .from('subscription_plans')
      .insert(plan)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSubscriptionPlan(planId: string, updates: Tables['subscription_plans']['Update']) {
    const { data, error } = await supabase
      .from('subscription_plans')
      .update(updates)
      .eq('id', planId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteSubscriptionPlan(planId: string) {
    const { error } = await supabase
      .from('subscription_plans')
      .update({ is_active: false })
      .eq('id', planId);
    
    if (error) throw error;
  }
};

// Dashboard Statistics
export const statsService = {
  async getDashboardStats(userId: string, userRole: string) {
    try {
      switch (userRole) {
        case 'admin':
          return await this.getAdminStats();
        case 'owner':
          return await this.getOwnerStats(userId);
        case 'broker':
          return await this.getBrokerStats(userId);
        case 'customer':
          return await this.getCustomerStats(userId);
        default:
          return {};
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {};
    }
  },

  async getAdminStats() {
    const [properties, bookings, users] = await Promise.all([
      supabase.from('properties').select('id', { count: 'exact' }),
      supabase.from('bookings').select('id, total_amount', { count: 'exact' }),
      supabase.from('user_profiles').select('id', { count: 'exact' })
    ]);

    const totalRevenue = bookings.data?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

    return {
      total_properties: properties.count || 0,
      total_bookings: bookings.count || 0,
      total_revenue: totalRevenue,
      total_users: users.count || 0,
      monthly_growth: 15.3 // Mock value
    };
  },

  async getOwnerStats(ownerId: string) {
    const [properties, bookings] = await Promise.all([
      supabase.from('properties').select('id', { count: 'exact' }).eq('owner_id', ownerId),
      supabase.from('bookings').select('id, net_to_owner', { count: 'exact' }).eq('owner_id', ownerId)
    ]);

    const totalRevenue = bookings.data?.reduce((sum, booking) => sum + (booking.net_to_owner || 0), 0) || 0;

    return {
      total_properties: properties.count || 0,
      total_bookings: bookings.count || 0,
      total_revenue: totalRevenue,
      occupancy_rate: 78.5, // Mock value
      monthly_growth: 12.8
    };
  },

  async getBrokerStats(brokerId: string) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id, broker_commission')
      .eq('broker_id', brokerId);

    const totalCommission = bookings?.reduce((sum, booking) => sum + (booking.broker_commission || 0), 0) || 0;

    return {
      total_bookings: bookings?.length || 0,
      commission_earned: totalCommission,
      monthly_growth: 24.7
    };
  },

  async getCustomerStats(customerId: string) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id, total_amount')
      .eq('customer_id', customerId);

    const totalSpent = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

    return {
      total_bookings: bookings?.length || 0,
      total_revenue: totalSpent,
      monthly_growth: 0
    };
  }
};