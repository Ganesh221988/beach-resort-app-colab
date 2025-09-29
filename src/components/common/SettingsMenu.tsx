import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Tab,
  Tabs,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import * as paymentGatewayApi from '../../api/paymentGatewayApi';

interface PaymentGatewayForm extends Omit<paymentGatewayApi.PaymentGatewayConfig, 'userRole'> {}

const SettingsMenu = () => {
  const context = React.useContext(AuthContext);
  const user = context?.user;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState<PaymentGatewayForm>({
    gatewayType: 'RAZORPAY',
    credentials: {},
    isDefault: true
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenPaymentSettings = () => {
    setOpenDialog(true);
    handleClose();
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setFormData({
      ...formData,
      gatewayType: ['RAZORPAY', 'STRIPE', 'PAYPAL'][newValue] as 'RAZORPAY' | 'STRIPE' | 'PAYPAL'
    });
  };

  const handleInputChange = (gateway: 'razorpay' | 'stripe' | 'paypal', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [gateway]: {
          ...prev.credentials[gateway],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!user?.role) {
        throw new Error('User role not found');
      }
      
      await paymentGatewayApi.updatePaymentGateway({
        ...formData,
        userRole: user.role
      } as any); // TODO: Update API types to match new structure
      
      setSuccessMessage('Payment gateway configuration saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to save payment gateway configuration. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const renderGatewayForm = () => {
    switch (formData.gatewayType) {
      case 'RAZORPAY':
        return (
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Key ID"
              margin="normal"
              value={formData.credentials.razorpay?.keyId || ''}
              onChange={(e) => handleInputChange('razorpay', 'keyId', e.target.value)}
            />
            <TextField
              fullWidth
              label="Key Secret"
              type="password"
              margin="normal"
              value={formData.credentials.razorpay?.keySecret || ''}
              onChange={(e) => handleInputChange('razorpay', 'keySecret', e.target.value)}
            />
            <TextField
              fullWidth
              label="Webhook Secret"
              type="password"
              margin="normal"
              value={formData.credentials.razorpay?.webhookSecret || ''}
              onChange={(e) => handleInputChange('razorpay', 'webhookSecret', e.target.value)}
            />
          </Box>
        );

      case 'STRIPE':
        return (
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Publishable Key"
              margin="normal"
              value={formData.credentials.stripe?.publishableKey || ''}
              onChange={(e) => handleInputChange('stripe', 'publishableKey', e.target.value)}
            />
            <TextField
              fullWidth
              label="Secret Key"
              type="password"
              margin="normal"
              value={formData.credentials.stripe?.secretKey || ''}
              onChange={(e) => handleInputChange('stripe', 'secretKey', e.target.value)}
            />
            <TextField
              fullWidth
              label="Webhook Secret"
              type="password"
              margin="normal"
              value={formData.credentials.stripe?.webhookSecret || ''}
              onChange={(e) => handleInputChange('stripe', 'webhookSecret', e.target.value)}
            />
          </Box>
        );

      case 'PAYPAL':
        return (
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Client ID"
              margin="normal"
              value={formData.credentials.paypal?.clientId || ''}
              onChange={(e) => handleInputChange('paypal', 'clientId', e.target.value)}
            />
            <TextField
              fullWidth
              label="Client Secret"
              type="password"
              margin="normal"
              value={formData.credentials.paypal?.clientSecret || ''}
              onChange={(e) => handleInputChange('paypal', 'clientSecret', e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Environment</InputLabel>
              <Select
                value={formData.credentials.paypal?.environment || 'sandbox'}
                onChange={(e) => handleInputChange('paypal', 'environment', e.target.value)}
              >
                <MenuItem value="sandbox">Sandbox</MenuItem>
                <MenuItem value="production">Production</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <IconButton onClick={handleMenuClick} sx={{ color: 'inherit' }}>
        <SettingsIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenPaymentSettings}>Payment Settings</MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Payment Gateway Settings</DialogTitle>
        <DialogContent>
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Razorpay" />
            <Tab label="Stripe" />
            <Tab label="PayPal" />
          </Tabs>

          {renderGatewayForm()}

          <Box sx={{ mt: 2, p: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isDefault}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                />
              }
              label="Set as default payment gateway"
            />
          </Box>

          <Box sx={{ mt: 2, p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save Configuration
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingsMenu;
