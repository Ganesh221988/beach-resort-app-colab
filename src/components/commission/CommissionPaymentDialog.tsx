import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Typography,
  FormHelperText,
  Box
} from '@mui/material';
import { Commission, CommissionPaymentData } from '../../types/commission';

interface PaymentGateway {
  id: string;
  name: string;
  type: string;
}

interface CommissionPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (commissionId: string, paymentData: CommissionPaymentData) => void;
  commission: Commission;
  paymentGateways: PaymentGateway[];
}

const CommissionPaymentDialog: React.FC<CommissionPaymentDialogProps> = ({
  open,
  onClose,
  onSubmit,
  commission,
  paymentGateways
}) => {
  const [paymentGatewayId, setPaymentGatewayId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!paymentGatewayId) {
      setError('Please select a payment method');
      return;
    }

    const paymentData: CommissionPaymentData = {
      paymentGatewayId,
      paymentDetails: {
        amount: commission.amount,
        currency: 'USD',
        status: 'PENDING',
        notes: notes || undefined
      }
    };

    onSubmit(commission.id, paymentData);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Pay Commission</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Property
                </Typography>
                <Typography variant="body1">
                  {commission.property?.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Broker
                </Typography>
                <Typography variant="body1">
                  {commission.broker?.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Amount
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(commission.amount)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentGatewayId}
                  onChange={(e) => setPaymentGatewayId(e.target.value)}
                  label="Payment Method"
                >
                  {paymentGateways.map((gateway) => (
                    <MenuItem key={gateway.id} value={gateway.id}>
                      {gateway.name} ({gateway.type})
                    </MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText>{error}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Notes (Optional)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Proceed to Payment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CommissionPaymentDialog;
