import axiosClient from './axiosClient';

interface PaymentGatewayCredentials {
  razorpay?: {
    keyId: string;
    keySecret: string;
    webhookSecret: string;
  };
  stripe?: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  paypal?: {
    clientId: string;
    clientSecret: string;
    environment: 'sandbox' | 'production';
  };
}

export interface PaymentGatewayConfig {
  gatewayType: 'RAZORPAY' | 'STRIPE' | 'PAYPAL';
  credentials: PaymentGatewayCredentials;
  isDefault: boolean;
  userRole: string;
}

export const paymentGatewayApi = {
  // Create or update payment gateway configuration
  createOrUpdate: async (config: PaymentGatewayConfig) => {
    const response = await axiosClient.post('/payment-gateway', config);
    return response.data;
  },

  // Get payment gateway configuration for current user
  getConfig: async () => {
    const response = await axiosClient.get('/payment-gateway');
    return response.data;
  },

  // Get payment gateway configuration for a specific owner
  getOwnerConfig: async (ownerId: string) => {
    const response = await axiosClient.get(`/payment-gateway/owner/${ownerId}`);
    return response.data;
  },

  // Get active payment gateway for a specific broker
  getBrokerConfig: async (brokerId: string) => {
    const response = await axiosClient.get(`/payment-gateway/broker/${brokerId}`);
    return response.data;
  },

  // Delete a payment gateway configuration
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/payment-gateway/${id}`);
    return response.data;
  },

  // Test payment gateway configuration
  test: async (id: string) => {
    const response = await axiosClient.post(`/payment-gateway/${id}/test`);
    return response.data;
  },
  
  // Admin only - get all payment gateways
  getAllConfigs: async () => {
    const response = await axiosClient.get('/payment-gateway/all');
    return response.data;
  }
};
export function updatePaymentGateway(arg0: any) {
    throw new Error('Function not implemented.');
}

