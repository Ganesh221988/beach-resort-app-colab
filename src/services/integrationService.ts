import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Tables = Database['public']['Tables'];
type IntegrationType = Database['public']['Enums']['integration_type'];

// User Integration Services
export const userIntegrationService = {
  // Get user's integrations
  async getUserIntegrations(userId: string) {
    const { data, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  // Get specific integration for user
  async getUserIntegration(userId: string, integrationType: IntegrationType) {
    const { data, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('integration_type', integrationType)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  // Create or update user integration
  async upsertUserIntegration(
    userId: string, 
    integrationType: IntegrationType, 
    integrationData: any, 
    isEnabled: boolean = true
  ) {
    const { data, error } = await supabase
      .from('user_integrations')
      .upsert({
        user_id: userId,
        integration_type: integrationType,
        integration_data: integrationData,
        is_enabled: isEnabled,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete user integration
  async deleteUserIntegration(userId: string, integrationType: IntegrationType) {
    const { error } = await supabase
      .from('user_integrations')
      .delete()
      .eq('user_id', userId)
      .eq('integration_type', integrationType);
    
    if (error) throw error;
  },

  // Toggle integration status
  async toggleUserIntegration(userId: string, integrationType: IntegrationType, isEnabled: boolean) {
    const { data, error } = await supabase
      .from('user_integrations')
      .update({ 
        is_enabled: isEnabled,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('integration_type', integrationType)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Admin Integration Services
export const adminIntegrationService = {
  // Get all admin integrations
  async getAdminIntegrations() {
    const { data, error } = await supabase
      .from('admin_integrations')
      .select('*')
      .order('integration_type');
    
    if (error) throw error;
    return data;
  },

  // Get specific admin integration
  async getAdminIntegration(integrationType: 'razorpay' | 'mailchimp') {
    const { data, error } = await supabase
      .from('admin_integrations')
      .select('*')
      .eq('integration_type', integrationType)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Update admin integration
  async updateAdminIntegration(
    integrationType: 'razorpay' | 'mailchimp',
    integrationData: any,
    isEnabled: boolean = true
  ) {
    const { data, error } = await supabase
      .from('admin_integrations')
      .upsert({
        integration_type: integrationType,
        integration_data: integrationData,
        is_enabled: isEnabled,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Toggle admin integration
  async toggleAdminIntegration(integrationType: 'razorpay' | 'mailchimp', isEnabled: boolean) {
    const { data, error } = await supabase
      .from('admin_integrations')
      .update({ 
        is_enabled: isEnabled,
        updated_at: new Date().toISOString()
      })
      .eq('integration_type', integrationType)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Integration data interfaces
export interface RazorpayIntegration {
  key_id: string;
  key_secret: string;
  webhook_secret: string;
}

export interface MailchimpIntegration {
  api_key: string;
  server_prefix: string;
  list_id: string;
}

export interface InstagramIntegration {
  username: string;
  access_token: string;
}

export interface FacebookIntegration {
  page_id: string;
  access_token: string;
}

// Helper functions to get typed integration data
export const getTypedIntegrationData = {
  razorpay: (data: any): RazorpayIntegration => data as RazorpayIntegration,
  mailchimp: (data: any): MailchimpIntegration => data as MailchimpIntegration,
  instagram: (data: any): InstagramIntegration => data as InstagramIntegration,
  facebook: (data: any): FacebookIntegration => data as FacebookIntegration,
};