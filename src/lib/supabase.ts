import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using demo mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Auth helpers
export const auth = supabase?.auth;

// Database helpers
export const db = supabase;

// Safe database operations with fallbacks
export const safeQuery = async (tableName: string, options: any = {}) => {
  if (!supabase) {
    console.log(`Demo mode: Would query ${tableName} with options:`, options);
    return { data: [], error: null };
  }
  
  try {
    const query = supabase.from(tableName).select(options.select || '*');
    const { data, error } = await query;
    return { data: data || [], error };
  } catch (error) {
    console.error(`Error querying ${tableName}:`, error);
    return { data: [], error };
  }
};

// Safe auth operations
export const safeAuth = {
  async signIn(email: string, password: string) {
    if (!auth) {
      console.log('Demo mode: Would sign in with', email);
      return { data: { user: { id: 'demo-user', email } }, error: null };
    }
    
    try {
      return await auth.signInWithPassword({ email, password });
    } catch (error) {
      console.error('Auth error:', error);
      return { data: null, error };
    }
  },
  
  async signUp(email: string, password: string, options: any = {}) {
    if (!auth) {
      console.log('Demo mode: Would sign up with', email);
      return { data: { user: { id: 'demo-user', email } }, error: null };
    }
    
    try {
      return await auth.signUp({ email, password, options });
    } catch (error) {
      console.error('Auth error:', error);
      return { data: null, error };
    }
  },
  
  async signOut() {
    if (!auth) {
      console.log('Demo mode: Would sign out');
      return { error: null };
    }
    
    try {
      return await auth.signOut();
    } catch (error) {
      console.error('Auth error:', error);
      return { error };
    }
  },
  
  async getSession() {
    if (!auth) {
      return { data: { session: null }, error: null };
    }
    
    try {
      return await auth.getSession();
    } catch (error) {
      console.error('Auth error:', error);
      return { data: { session: null }, error };
    }
  }
};