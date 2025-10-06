import { supabase } from '../lib/supabase';
import { userIntegrationService, adminIntegrationService } from './integrationService';

export interface PaymentConfig {
  key_id: string;
  key_secret: string;
  webhook_secret?: string;
}

export interface PaymentResult {
  success: boolean;
  payment_id?: string;
  order_id?: string;
  error?: string;
}

// Payment Service for handling Razorpay integrations
export const paymentService = {
  // Get payment configuration for a user (owner/broker)
  async getPaymentConfig(userId: string): Promise<PaymentConfig | null> {
    try {
      // First try to get user's own Razorpay integration
      const userIntegration = await userIntegrationService.getUserIntegration(userId, 'razorpay');
      
      if (userIntegration && userIntegration.is_enabled) {
        return userIntegration.integration_data as PaymentConfig;
      }
      
      // Fallback to admin's default Razorpay integration
      const adminIntegration = await adminIntegrationService.getAdminIntegration('razorpay');
      
      if (adminIntegration && adminIntegration.is_enabled) {
        return adminIntegration.integration_data as PaymentConfig;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting payment config:', error);
      return null;
    }
  },

  // Create Razorpay order
  async createOrder(userId: string, amount: number, currency: string = 'INR', receipt?: string): Promise<any> {
    try {
      const config = await this.getPaymentConfig(userId);
      
      if (!config) {
        throw new Error('No payment gateway configured');
      }

      // In a real implementation, this would call Razorpay API
      // For now, we'll simulate the order creation
      const order = {
        id: `order_${Date.now()}`,
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        status: 'created',
        created_at: new Date().toISOString()
      };

      console.log('Created Razorpay order:', order);
      return order;
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  },

  // Process payment
  async processPayment(
    userId: string, 
    orderId: string, 
    paymentId: string, 
    signature: string
  ): Promise<PaymentResult> {
    try {
      const config = await this.getPaymentConfig(userId);
      
      if (!config) {
        return { success: false, error: 'No payment gateway configured' };
      }

      // In a real implementation, this would verify the payment signature
      // and call Razorpay API to confirm payment
      
      // Simulate payment verification
      const isValidSignature = true; // Would verify using Razorpay signature
      
      if (isValidSignature) {
        return {
          success: true,
          payment_id: paymentId,
          order_id: orderId
        };
      } else {
        return {
          success: false,
          error: 'Invalid payment signature'
        };
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: 'Payment processing failed'
      };
    }
  },

  // Record transaction in database
  async recordTransaction(transactionData: {
    booking_id?: string;
    user_id: string;
    amount: number;
    type: 'payment' | 'refund' | 'commission' | 'payout' | 'subscription';
    status: 'pending' | 'success' | 'failed' | 'refunded';
    gateway_txn_id?: string;
    description: string;
    metadata?: any;
  }) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transactionData,
          metadata: transactionData.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording transaction:', error);
      throw error;
    }
  },

  // Get user's payment gateway status
  async getUserPaymentStatus(userId: string) {
    try {
      const userIntegration = await userIntegrationService.getUserIntegration(userId, 'razorpay');
      const adminIntegration = await adminIntegrationService.getAdminIntegration('razorpay');
      
      return {
        hasOwnGateway: !!(userIntegration && userIntegration.is_enabled),
        hasAdminGateway: !!(adminIntegration && adminIntegration.is_enabled),
        canAcceptPayments: !!(
          (userIntegration && userIntegration.is_enabled) || 
          (adminIntegration && adminIntegration.is_enabled)
        )
      };
    } catch (error) {
      console.error('Error getting payment status:', error);
      return {
        hasOwnGateway: false,
        hasAdminGateway: false,
        canAcceptPayments: false
      };
    }
  }
};

// Subscription payment service
export const subscriptionService = {
  // Process subscription payment
  async processSubscriptionPayment(userId: string, planId: string, amount: number) {
    try {
      // Create order for subscription
      const order = await paymentService.createOrder(
        userId, 
        amount, 
        'INR', 
        `subscription_${planId}`
      );

      // Record subscription transaction
      await paymentService.recordTransaction({
        user_id: userId,
        amount,
        type: 'subscription',
        status: 'pending',
        gateway_txn_id: order.id,
        description: `Subscription payment for plan ${planId}`,
        metadata: { plan_id: planId, order_id: order.id }
      });

      return order;
    } catch (error) {
      console.error('Error processing subscription payment:', error);
      throw error;
    }
  },

  // Update subscription status after payment
  async updateSubscriptionStatus(userId: string, planId: string, status: 'active' | 'inactive') {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          subscription_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }
};