import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { SnackbarProvider } from 'notistack';
import CommissionList from '../components/commission/CommissionList';
import CommissionForm from '../components/commission/CommissionForm';
import CommissionPaymentDialog from '../components/commission/CommissionPaymentDialog';
import useCommissions from '../hooks/useCommissions';
import { Commission, CommissionFormData, CommissionPaymentData } from '../types/commission';

// Mock data for development - replace with actual API calls
const mockProperties = [
  { id: '1', name: 'Beach Villa' },
  { id: '2', name: 'Mountain Cabin' }
];

const mockBrokers = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' }
];

const mockPaymentGateways = [
  { id: '1', name: 'Stripe', type: 'Credit Card' },
  { id: '2', name: 'PayPal', type: 'Digital Wallet' }
];

const CommissionsPage: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [userRole] = useState<'admin' | 'owner' | 'broker'>('admin'); // Replace with actual user role

  const {
    commissions,
    loading,
    error,
    fetchCommissions,
    createCommission,
    updateCommission,
    payCommission
  } = useCommissions({ role: userRole });

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  const handleCreateClick = () => {
    setSelectedCommission(null);
    setFormOpen(true);
  };

  const handleEditClick = (commission: Commission) => {
    setSelectedCommission(commission);
    setFormOpen(true);
  };

  const handlePayClick = (commission: Commission) => {
    setSelectedCommission(commission);
    setPaymentOpen(true);
  };

  const handleFormSubmit = async (values: CommissionFormData) => {
    if (selectedCommission) {
      await updateCommission(selectedCommission.id, values);
    } else {
      await createCommission(values);
    }
    setFormOpen(false);
  };

  const handlePaymentSubmit = async (
    commissionId: string,
    paymentData: CommissionPaymentData
  ) => {
    await payCommission(commissionId, paymentData);
    setPaymentOpen(false);
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <Container maxWidth="lg">
        <Box py={4}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Commissions
            </Typography>
            {userRole === 'admin' && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateClick}
              >
                Create Commission
              </Button>
            )}
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <CommissionList
                commissions={commissions}
                userRole={userRole}
                onEdit={handleEditClick}
                onPay={handlePayClick}
              />
            )}
          </Paper>

          <CommissionForm
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSubmit={handleFormSubmit}
            initialValues={selectedCommission || undefined}
            properties={mockProperties}
            brokers={mockBrokers}
            mode={selectedCommission ? 'edit' : 'create'}
          />

          {selectedCommission && (
            <CommissionPaymentDialog
              open={paymentOpen}
              onClose={() => setPaymentOpen(false)}
              onSubmit={handlePaymentSubmit}
              commission={selectedCommission}
              paymentGateways={mockPaymentGateways}
            />
          )}
        </Box>
      </Container>
    </SnackbarProvider>
  );
};

export default CommissionsPage;
