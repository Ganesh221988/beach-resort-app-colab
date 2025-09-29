import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import {
  Commission,
  CommissionFormData,
  CommissionPaymentData,
  CommissionStats
} from '../types/commission';
import commissionApi from '../api/commissionApi';

interface UseCommissionsProps {
  role: 'admin' | 'owner' | 'broker';
  brokerId?: string;
}

interface UseCommissionsReturn {
  commissions: Commission[];
  stats: CommissionStats | null;
  loading: boolean;
  error: string | null;
  fetchCommissions: (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
  fetchStats: (params?: {
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
  createCommission: (data: CommissionFormData) => Promise<void>;
  updateCommission: (id: string, data: Partial<CommissionFormData>) => Promise<void>;
  deleteCommission: (id: string) => Promise<void>;
  payCommission: (id: string, paymentData: CommissionPaymentData) => Promise<void>;
}

export const useCommissions = ({
  role,
  brokerId
}: UseCommissionsProps): UseCommissionsReturn => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [stats, setStats] = useState<CommissionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleError = (error: any) => {
    console.error('Commission operation failed:', error);
    const errorMessage =
      error.response?.data?.error || error.message || 'Operation failed';
    setError(errorMessage);
    enqueueSnackbar(errorMessage, { variant: 'error' });
  };

  const fetchCommissions = useCallback(
    async (params?: {
      status?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      try {
        setLoading(true);
        setError(null);

        let fetchedCommissions: Commission[];

        switch (role) {
          case 'admin':
            fetchedCommissions = await commissionApi.getAllCommissions(params);
            break;
          case 'broker':
            if (!brokerId) throw new Error('Broker ID is required');
            fetchedCommissions = await commissionApi.getBrokerCommissions(
              brokerId,
              params
            );
            break;
          case 'owner':
            fetchedCommissions = await commissionApi.getOwnerCommissions();
            break;
          default:
            throw new Error('Invalid role');
        }

        setCommissions(fetchedCommissions);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [role, brokerId]
  );

  const fetchStats = useCallback(
    async (params?: { startDate?: string; endDate?: string }) => {
      try {
        setLoading(true);
        setError(null);

        let fetchedStats: CommissionStats;

        switch (role) {
          case 'admin':
            fetchedStats = await commissionApi.getCommissionStats(params);
            break;
          case 'broker':
            if (!brokerId) throw new Error('Broker ID is required');
            fetchedStats = await commissionApi.getBrokerStats(brokerId, params);
            break;
          default:
            throw new Error('Stats not available for this role');
        }

        setStats(fetchedStats);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [role, brokerId]
  );

  const createCommission = async (data: CommissionFormData) => {
    try {
      setLoading(true);
      setError(null);

      await commissionApi.createCommission(data);
      enqueueSnackbar('Commission created successfully', { variant: 'success' });
      await fetchCommissions();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateCommission = async (
    id: string,
    data: Partial<CommissionFormData>
  ) => {
    try {
      setLoading(true);
      setError(null);

      await commissionApi.updateCommission(id, data);
      enqueueSnackbar('Commission updated successfully', { variant: 'success' });
      await fetchCommissions();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCommission = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await commissionApi.deleteCommission(id);
      enqueueSnackbar('Commission deleted successfully', { variant: 'success' });
      setCommissions((prev) => prev.filter((commission) => commission.id !== id));
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const payCommission = async (id: string, paymentData: CommissionPaymentData) => {
    try {
      setLoading(true);
      setError(null);

      await commissionApi.payCommission(id, paymentData);
      enqueueSnackbar('Commission paid successfully', { variant: 'success' });
      await fetchCommissions();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    commissions,
    stats,
    loading,
    error,
    fetchCommissions,
    fetchStats,
    createCommission,
    updateCommission,
    deleteCommission,
    payCommission
  };
};

export default useCommissions;
