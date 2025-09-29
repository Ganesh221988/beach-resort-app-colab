import axiosClient from './axiosClient';
import {
  Commission,
  CommissionFormData,
  CommissionPaymentData,
  CommissionStats
} from '../types/commission';

const commissionApi = {
  // Admin endpoints
  getAllCommissions: async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await axiosClient.get('/commissions/admin', { params });
    return response.data as Commission[];
  },

  getCommissionById: async (id: string) => {
    const response = await axiosClient.get(`/commissions/admin/${id}`);
    return response.data as Commission;
  },

  createCommission: async (data: CommissionFormData) => {
    const response = await axiosClient.post('/commissions', data);
    return response.data as Commission;
  },

  updateCommission: async (id: string, data: Partial<CommissionFormData>) => {
    const response = await axiosClient.put(`/commissions/admin/${id}`, data);
    return response.data as Commission;
  },

  deleteCommission: async (id: string) => {
    await axiosClient.delete(`/commissions/admin/${id}`);
  },

  // Broker endpoints
  getBrokerCommissions: async (brokerId: string, params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await axiosClient.get(`/commissions/broker/${brokerId}`, {
      params
    });
    return response.data as Commission[];
  },

  getBrokerStats: async (brokerId: string, params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await axiosClient.get(
      `/commissions/broker/${brokerId}/stats`,
      { params }
    );
    return response.data as CommissionStats;
  },

  // Owner endpoints
  getOwnerCommissions: async () => {
    const response = await axiosClient.get('/commissions/owner');
    return response.data as Commission[];
  },

  payCommission: async (
    commissionId: string,
    paymentData: CommissionPaymentData
  ) => {
    const response = await axiosClient.put(
      `/commissions/owner/${commissionId}/pay`,
      paymentData
    );
    return response.data as Commission;
  },

  // General stats endpoint
  getCommissionStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await axiosClient.get('/commissions/stats', { params });
    return response.data as CommissionStats;
  }
};

export default commissionApi;
