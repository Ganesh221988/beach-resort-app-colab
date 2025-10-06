import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'owner' | 'broker';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  unique_id: string;
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'customer' | 'owner' | 'broker';
  created_at: string;
}

// Hash password (in production, use bcrypt or similar)
const hashPassword = async (password: string): Promise<string> => {
  // Simple hash for demo - in production use proper bcrypt
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'ecr_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Verify password
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const inputHash = await hashPassword(password);
  return inputHash === hash;
};

export const authService = {
  // Check if email exists
  async checkEmailExists(email: string): Promise<boolean> {
    if (!supabase) return false;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();
      
      // If no error and data exists, email is taken
      return !!data;
    } catch (error: any) {
      // PGRST116 means no rows found, so email is available
      if (error.code === 'PGRST116') {
        return false;
      }
      console.error('Error checking email:', error);
      return false;
    }
  },

  // Generate unique ID for user
  async generateUniqueId(role: string): Promise<string> {
    if (!supabase) {
      // Demo mode - generate mock unique ID
      const prefix = role === 'customer' ? 'CX01A' : role === 'owner' ? 'ON02A' : 'BK03A';
      return prefix + '0001';
    }

    try {
      const { data, error } = await supabase.rpc('generate_unique_id', { user_role: role });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating unique ID:', error);
      // Fallback to manual generation
      const prefix = role === 'customer' ? 'CX01A' : role === 'owner' ? 'ON02A' : 'BK03A';
      const timestamp = Date.now().toString().slice(-4);
      return prefix + timestamp;
    }
  },

  // Sign up user
  async signup(userData: SignupData): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    try {
      // Check if email already exists
      const emailExists = await this.checkEmailExists(userData.email);
      if (emailExists) {
        return { success: false, error: 'Email ID already exists, use different email' };
      }

      // Generate unique ID
      const uniqueId = await this.generateUniqueId(userData.role);

      // Hash password
      const passwordHash = await hashPassword(userData.password);

      if (!supabase) {
        // Demo mode - return success with mock data
        const mockUser: AuthUser = {
          id: crypto.randomUUID(),
          unique_id: uniqueId,
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
          created_at: new Date().toISOString()
        };
        return { success: true, user: mockUser };
      }

      // Create user in database
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          unique_id: uniqueId,
          email: userData.email.toLowerCase(),
          password_hash: passwordHash,
          name: userData.name,
          phone: userData.phone,
          role: userData.role
        })
        .select()
        .single();

      if (userError) {
        console.error('User creation error:', userError);
        return { success: false, error: 'Failed to create account. Please try again.' };
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: newUser.id,
          unique_id: uniqueId,
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
          kyc_status: 'pending',
          subscription_status: userData.role === 'customer' ? null : 'trial'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail signup if profile creation fails
      }

      return { 
        success: true, 
        user: {
          id: newUser.id,
          unique_id: newUser.unique_id,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
          role: newUser.role,
          created_at: newUser.created_at
        }
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  },

  // Sign in user
  async signin(loginData: LoginData): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    try {
      if (!supabase) {
        // Demo mode - check against stored signup data
        const signupData = sessionStorage.getItem('signupData');
        if (signupData) {
          const parsedData = JSON.parse(signupData);
          if (parsedData.email === loginData.email && parsedData.password === loginData.password) {
            const uniqueId = await this.generateUniqueId(parsedData.role);
            const mockUser: AuthUser = {
              id: crypto.randomUUID(),
              unique_id: uniqueId,
              email: parsedData.email,
              name: parsedData.name,
              phone: parsedData.phone,
              role: parsedData.role,
              created_at: new Date().toISOString()
            };
            sessionStorage.removeItem('signupData');
            return { success: true, user: mockUser };
          }
        }
        
        // Demo login for existing accounts
        let role: 'admin' | 'owner' | 'broker' | 'customer' = 'customer';
        let name = 'Demo User';
        let uniqueId = 'CX01A0001';
        
        if (loginData.email.includes('admin')) {
          role = 'admin';
          name = 'Admin User';
          uniqueId = 'AD00A0001';
        } else if (loginData.email.includes('owner')) {
          role = 'owner';
          name = 'John Smith';
          uniqueId = 'ON02A0001';
        } else if (loginData.email.includes('broker')) {
          role = 'broker';
          name = 'Sarah Wilson';
          uniqueId = 'BK03A0001';
        } else {
          role = 'customer';
          name = 'David Johnson';
          uniqueId = 'CX01A0001';
        }
        
        const mockUser: AuthUser = {
          id: crypto.randomUUID(),
          unique_id: uniqueId,
          email: loginData.email,
          name: name,
          phone: '+91 9876543210',
          role: role,
          created_at: new Date().toISOString()
        };
        
        return { success: true, user: mockUser };
      }

      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', loginData.email.toLowerCase())
        .single();

      if (error || !user) {
        return { success: false, error: 'Username or Password incorrect, Try again' };
      }

      // Verify password
      const passwordValid = await verifyPassword(loginData.password, user.password_hash);
      if (!passwordValid) {
        return { success: false, error: 'Username or Password incorrect, Try again' };
      }

      return { 
        success: true, 
        user: {
          id: user.id,
          unique_id: user.unique_id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          created_at: user.created_at
        }
      };
    } catch (error) {
      console.error('Signin error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  },

  // Send password reset email
  async sendPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!supabase) {
        // Demo mode
        alert(`Password reset link sent to ${email}\n\nIn production, this would send an actual email with a secure reset link.`);
        return { success: true };
      }

      // Check if user exists
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (!user) {
        return { success: false, error: 'No account found with this email address' };
      }

      // In production, this would send an actual email
      // For now, we'll simulate it
      console.log(`Password reset requested for: ${email}`);
      
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Failed to send password reset email' };
    }
  }
};