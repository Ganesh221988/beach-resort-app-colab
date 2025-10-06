import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userIntegrationService } from '../../services/integrationService';
import { paymentService } from '../../services/paymentService';

interface PaymentGatewaySetupProps {
  onSave?: () => void;
}

export function PaymentGatewaySetup({ onSave }: PaymentGatewaySetupProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({
    hasOwnGateway: false,
    hasAdminGateway: false,
    canAcceptPayments: false
  });
  
  const [razorpayConfig, setRazorpayConfig] = useState({
    key_id: '',
    key_secret: '',
    webhook_secret: '',
    enabled: false
  });

  useEffect(() => {
    if (user) {
      loadPaymentConfig();
      checkPaymentStatus();
    }
  }, [user]);

  const loadPaymentConfig = async () => {
    if (!user) return;
    
    try {
      const integration = await userIntegrationService.getUserIntegration(user.id, 'razorpay');
      
      if (integration) {
        setRazorpayConfig({
          ...integration.integration_data,
          enabled: integration.is_enabled
        });
      }
    } catch (error) {
      console.error('Error loading payment config:', error);
    }
  };

  const checkPaymentStatus = async () => {
    if (!user) return;
    
    try {
      const status = await paymentService.getUserPaymentStatus(user.id);
      setPaymentStatus(status);
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await userIntegrationService.upsertUserIntegration(
        user.id,
        'razorpay',
        {
          key_id: razorpayConfig.key_id,
          key_secret: razorpayConfig.key_secret,
          webhook_secret: razorpayConfig.webhook_secret
        },
        razorpayConfig.enabled
      );
      
      await checkPaymentStatus();
      onSave?.();
      alert('Payment gateway settings saved successfully!');
    } catch (error) {
      console.error('Error saving payment config:', error);
      alert('Error saving payment gateway settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const testPaymentGateway = async () => {
    if (!user) return;
    
    try {
      const order = await paymentService.createOrder(user.id, 100, 'INR', 'test_order');
      alert(`Test order created successfully! Order ID: ${order.id}`);
    } catch (error) {
      alert('Payment gateway test failed. Please check your configuration.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <CreditCard className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Payment Gateway Setup</h3>
      </div>

      {/* Payment Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Current Payment Status</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {paymentStatus.hasOwnGateway ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
            <span className="text-sm">
              {paymentStatus.hasOwnGateway ? 'Your own Razorpay gateway is configured' : 'No personal gateway configured'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {paymentStatus.hasAdminGateway ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">
              {paymentStatus.hasAdminGateway ? 'Platform fallback gateway available' : 'No platform gateway available'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {paymentStatus.canAcceptPayments ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm font-medium">
              {paymentStatus.canAcceptPayments ? 'Ready to accept payments' : 'Cannot accept payments'}
            </span>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="razorpay-enabled"
            checked={razorpayConfig.enabled}
            onChange={(e) => setRazorpayConfig(prev => ({ ...prev, enabled: e.target.checked }))}
            className="text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="razorpay-enabled" className="text-sm font-medium text-gray-700">
            Enable My Own Razorpay Gateway
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razorpay Key ID
            </label>
            <input
              type="text"
              value={razorpayConfig.key_id}
              onChange={(e) => setRazorpayConfig(prev => ({ ...prev, key_id: e.target.value }))}
              placeholder="rzp_test_xxxxxxxxxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!razorpayConfig.enabled}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razorpay Key Secret
            </label>
            <input
              type="password"
              value={razorpayConfig.key_secret}
              onChange={(e) => setRazorpayConfig(prev => ({ ...prev, key_secret: e.target.value }))}
              placeholder="Enter your key secret"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!razorpayConfig.enabled}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook Secret (Optional)
          </label>
          <input
            type="password"
            value={razorpayConfig.webhook_secret}
            onChange={(e) => setRazorpayConfig(prev => ({ ...prev, webhook_secret: e.target.value }))}
            placeholder="Enter webhook secret for enhanced security"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!razorpayConfig.enabled}
          />
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">
          <Shield className="h-4 w-4 inline mr-2" />
          Benefits of Your Own Gateway:
        </h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Direct payments to your bank account</li>
          <li>• Lower transaction fees (2.4% vs 3.5%)</li>
          <li>• Faster settlement (T+1 vs T+3 days)</li>
          <li>• Complete control over payment flow</li>
          <li>• Custom checkout experience</li>
          <li>• Better dispute management</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>{loading ? 'Saving...' : 'Save Configuration'}</span>
        </button>
        
        {razorpayConfig.enabled && razorpayConfig.key_id && (
          <button
            onClick={testPaymentGateway}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            Test Gateway
          </button>
        )}
        
        <button
          onClick={() => alert('Payment Gateway Help:\n\n1. Sign up at https://razorpay.com\n2. Get your API keys from Dashboard > Settings > API Keys\n3. Enter Key ID and Key Secret above\n4. Enable the integration\n5. Test with a small transaction\n\nFor webhook setup:\n• Add webhook URL in Razorpay dashboard\n• Use the webhook secret for verification')}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Setup Help
        </button>
      </div>
    </div>
  );
}