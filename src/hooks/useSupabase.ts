import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { mockProperties, mockBookings, mockDashboardStats } from '../data/mockData';

type Tables = Database['public']['Tables'];

// Check if we're in demo mode (no Supabase configured)
const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// Generic hook for fetching data from Supabase
export function useSupabaseQuery<T extends keyof Tables>(
  table: T,
  options?: {
    select?: string;
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }
) {
  const [data, setData] = useState<Tables[T]['Row'][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      // In demo mode, return empty data
      if (isDemoMode) {
        setData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let query = supabase.from(table).select(options?.select || '*');

        // Apply filters
        if (options?.filter) {
          Object.entries(options.filter).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }

        // Apply ordering
        if (options?.orderBy) {
          query = query.order(options.orderBy.column, { 
            ascending: options.orderBy.ascending ?? true 
          });
        }

        // Apply limit
        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error } = await query;

        if (error) throw error;
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [table, JSON.stringify(options)]);

  const refetch = async () => {
    if (isDemoMode) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase.from(table).select(options?.select || '*');

      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending ?? true 
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error } = await query;

      if (error) throw error;
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Hook for real-time subscriptions
export function useSupabaseSubscription<T extends keyof Tables>(
  table: T,
  callback: (payload: any) => void
) {
  useEffect(() => {
    // Disable subscriptions in demo mode
    if (isDemoMode) {
      return;
    }

    const subscription = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table, callback]);
}

// Hook for properties
export function useProperties(ownerId?: string) {
  const supabaseResult = useSupabaseQuery('properties', {
    select: `
      *,
      room_types (*)
    `,
    filter: ownerId ? { owner_id: ownerId } : undefined,
    orderBy: { column: 'created_at', ascending: false }
  });

  // In demo mode, return mock data
  if (isDemoMode) {
    const filteredProperties = ownerId 
      ? mockProperties.filter(p => p.owner_id === ownerId)
      : mockProperties;
    
    return {
      data: filteredProperties,
      loading: false,
      error: null,
      refetch: () => Promise.resolve()
    };
  }

  return supabaseResult;
}

// Hook for bookings
export function useBookings(userId?: string, userRole?: string) {
  const filter = userId && userRole ? {
    [userRole === 'owner' ? 'owner_id' : 
     userRole === 'broker' ? 'broker_id' : 'customer_id']: userId
  } : undefined;

  const supabaseResult = useSupabaseQuery('bookings', {
    select: `
      *,
      properties (title, city),
      user_profiles!customer_id (name)
    `,
    filter,
    orderBy: { column: 'created_at', ascending: false }
  });

  // In demo mode, return mock data
  if (isDemoMode) {
    let filteredBookings = mockBookings;
    
    if (userId && userRole) {
      filteredBookings = mockBookings.filter(booking => {
        if (userRole === 'owner') return booking.owner_id === userId;
        if (userRole === 'broker') return booking.broker_id === userId;
        if (userRole === 'customer') return booking.customer_id === userId;
        return true;
      });
    }
    
    return {
      data: filteredBookings,
      loading: false,
      error: null,
      refetch: () => Promise.resolve()
    };
  }

  return supabaseResult;
}

// Hook for subscription plans
export function useSubscriptionPlans(type?: 'owner' | 'broker') {
  const supabaseResult = useSupabaseQuery('subscription_plans', {
    filter: type ? { type, is_active: true } : { is_active: true },
    orderBy: { column: 'created_at', ascending: true }
  });

  // In demo mode, return mock data
  if (isDemoMode) {
    const mockPlans = [
      {
        id: '1',
        name: 'Basic Owner Plan',
        type: 'owner',
        pricing_model: 'percentage',
        percentage: 10,
        billing_cycle: 'monthly',
        features: ['Property Listing', 'Basic Analytics', 'Email Support'],
        is_active: true
      },
      {
        id: '2',
        name: 'Pro Broker Plan',
        type: 'broker',
        pricing_model: 'flat',
        flat_rate: 99,
        billing_cycle: 'monthly',
        features: ['Unlimited Bookings', 'Advanced Analytics', 'Priority Support'],
        is_active: true
      }
    ];

    const filteredPlans = type ? mockPlans.filter(p => p.type === type) : mockPlans;
    
    return {
      data: filteredPlans,
      loading: false,
      error: null,
      refetch: () => Promise.resolve()
    };
  }

  return supabaseResult;
}

// Hook for admin settings
export function useAdminSettings() {
  const supabaseResult = useSupabaseQuery('admin_settings', {
    orderBy: { column: 'key', ascending: true }
  });

  // In demo mode, return mock data
  if (isDemoMode) {
    const mockSettings = [
      {
        id: '1',
        key: 'platform_commission',
        value: { rate: 10 },
        description: 'Platform commission percentage'
      },
      {
        id: '2',
        key: 'payment_gateway',
        value: { provider: 'razorpay', enabled: true },
        description: 'Payment gateway configuration'
      }
    ];
    
    return {
      data: mockSettings,
      loading: false,
      error: null,
      refetch: () => Promise.resolve()
    };
  }

  return supabaseResult;
}