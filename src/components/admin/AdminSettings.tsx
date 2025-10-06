import React, { useState } from 'react';
import { X, Upload, Save, CreditCard, Mail, DollarSign, Users, Crown, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { adminIntegrationService } from '../../services/integrationService';

interface AdminSettingsProps {
  onClose: () => void;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'owner' | 'broker';
  pricing_model: 'percentage' | 'flat';
  percentage?: number;
  flat_rate?: number;
  billing_cycle: 'monthly' | 'yearly';
  features: string[];
  is_active: boolean;
}

export function AdminSettings({ onClose }: AdminSettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    company_name: 'ECR Beach Resorts',
    admin_name: 'Admin User',
    email: 'admin@ecrbeachresorts.com',
    phone: '+91 9876543210',
    address: 'Mumbai, Maharashtra, India'
  });

  const [logoUrl, setLogoUrl] = useState('');
  const [razorpayConfig, setRazorpayConfig] = useState({
    key_id: '',
    key_secret: '',
    webhook_secret: '',
    enabled: false
  });

  const [mailchimpConfig, setMailchimpConfig] = useState({
    api_key: '',
    server_prefix: '',
    list_id: '',
    enabled: false
  });

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: '1',
      name: 'Owner Pro',
      type: 'owner',
      pricing_model: 'percentage',
      percentage: 10,
      billing_cycle: 'monthly',
      features: ['Unlimited Properties', 'Priority Support', 'Analytics Dashboard'],
      is_active: true
    },
    {
      id: '2',
      name: 'Broker Plus',
      type: 'broker',
      pricing_model: 'flat',
      flat_rate: 999,
      billing_cycle: 'monthly',
      features: ['Commission Tracking', 'Customer Management', 'Booking Tools'],
      is_active: true
    }
  ]);

  // Load integrations on component mount
  React.useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const data = await adminIntegrationService.getAdminIntegrations();
      const integrationsMap = data.reduce((acc, integration) => {
        acc[integration.integration_type] = integration;
        return acc;
      }, {} as any);
      setIntegrations(integrationsMap);
      
      // Update local state with loaded data
      if (integrationsMap.razorpay) {
        setRazorpayConfig({
          ...integrationsMap.razorpay.integration_data,
          enabled: integrationsMap.razorpay.is_enabled
        });
      }
      if (integrationsMap.mailchimp) {
        setMailchimpConfig({
          ...integrationsMap.mailchimp.integration_data,
          enabled: integrationsMap.mailchimp.is_enabled
        });
      }
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Update Profile', icon: Users },
    { id: 'logo', label: 'Change Logo', icon: Upload },
    { id: 'razorpay', label: 'Razorpay Integration', icon: CreditCard },
    { id: 'mailchimp', label: 'Mailchimp Integration', icon: Mail },
    { id: 'subscriptions', label: 'Subscription Plans', icon: DollarSign }
  ];

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
    alert('Profile updated successfully!');
  };

  const handleSaveLogo = () => {
    console.log('Saving logo:', logoUrl);
    alert('Logo updated successfully!');
  };

  const handleSaveRazorpay = () => {
    console.log('Saving Razorpay config:', razorpayConfig);
    alert('Razorpay integration updated successfully!');
  };

  const handleSaveMailchimp = async () => {
    setLoading(true);
    try {
      await adminIntegrationService.updateAdminIntegration(
        'mailchimp',
        {
          api_key: mailchimpConfig.api_key,
          server_prefix: mailchimpConfig.server_prefix,
          list_id: mailchimpConfig.list_id
        },
        mailchimpConfig.enabled
      );
      await loadIntegrations();
      alert('Mailchimp integration updated successfully!');
    } catch (error) {
      console.error('Error saving Mailchimp config:', error);
      alert('Error saving Mailchimp configuration. Please try again.');
    } finally {
      setLoading(false);
    }
    console.log('Saving Mailchimp config:', mailchimpConfig);
  };

  const handleSaveSubscriptions = () => {
    console.log('Saving subscription plans:', subscriptionPlans);
    alert('Subscription plans updated successfully!');
  };

  const addSubscriptionPlan = () => {
    const newPlan: SubscriptionPlan = {
      id: Date.now().toString(),
      name: 'New Plan',
      type: 'owner',
      pricing_model: 'percentage',
      percentage: 5,
      billing_cycle: 'monthly',
      features: [],
      is_active: true
    };
    setSubscriptionPlans([...subscriptionPlans, newPlan]);
  };

  const updateSubscriptionPlan = (id: string, updates: Partial<SubscriptionPlan>) => {
    setSubscriptionPlans(plans => 
      plans.map(plan => plan.id === id ? { ...plan, ...updates } : plan)
    );
  };

  const removeSubscriptionPlan = (id: string) => {
    setSubscriptionPlans(plans => plans.filter(plan => plan.id !== id));
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Update Profile</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <input
            type="text"
            value={profileData.company_name}
            onChange={(e) => setProfileData(prev => ({ ...prev, company_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
          <input
            type="text"
            value={profileData.admin_name}
            onChange={(e) => setProfileData(prev => ({ ...prev, admin_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          value={profileData.address}
          onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      
      <button
        onClick={handleSaveProfile}
        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
      >
        Save Profile
      </button>
    </div>
  );

  const renderLogo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Change Logo</h3>
      
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-2xl">ECR</span>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">Current Logo</p>
          <p className="text-xs text-gray-500">Upload a new logo to replace the current one</p>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">New Logo URL</label>
        <input
          type="url"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="Enter logo image URL"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
        <p className="text-xs text-gray-500 mt-1">Recommended size: 200x200px, PNG or SVG format</p>
      </div>
      
      {logoUrl && (
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <img src={logoUrl} alt="New Logo" className="w-20 h-20 object-contain rounded-lg" />
        </div>
      )}
      
      <button
        onClick={handleSaveLogo}
        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
      >
        Update Logo
      </button>
    </div>
  );

  const renderRazorpay = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Razorpay Integration</h3>
      
      <div className="flex items-center space-x-3 mb-4">
        <input
          type="checkbox"
          id="razorpay-enabled"
          checked={razorpayConfig.enabled}
          onChange={(e) => setRazorpayConfig(prev => ({ ...prev, enabled: e.target.checked }))}
          className="text-orange-500 focus:ring-orange-500"
        />
        <label htmlFor="razorpay-enabled" className="text-sm font-medium text-gray-700">
          Enable Razorpay Payment Gateway
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Key ID</label>
          <input
            type="text"
            value={razorpayConfig.key_id}
            onChange={(e) => setRazorpayConfig(prev => ({ ...prev, key_id: e.target.value }))}
            placeholder="rzp_test_xxxxxxxxxx"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={!razorpayConfig.enabled}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Key Secret</label>
          <input
            type="password"
            value={razorpayConfig.key_secret}
            onChange={(e) => setRazorpayConfig(prev => ({ ...prev, key_secret: e.target.value }))}
            placeholder="Enter key secret"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={!razorpayConfig.enabled}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Secret</label>
        <input
          type="password"
          value={razorpayConfig.webhook_secret}
          onChange={(e) => setRazorpayConfig(prev => ({ ...prev, webhook_secret: e.target.value }))}
          placeholder="Enter webhook secret"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          disabled={!razorpayConfig.enabled}
        />
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Integration Purpose:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Subscription payments from owners and brokers</li>
          <li>• Commission collection from bookings</li>
          <li>• Automated payout processing</li>
          <li>• Secure payment handling</li>
        </ul>
      </div>
      
      <button
        onClick={handleSaveRazorpay}
        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
      >
        Save Razorpay Settings
      </button>
    </div>
  );

  const renderMailchimp = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Mailchimp Integration</h3>
      
      <div className="flex items-center space-x-3 mb-4">
        <input
          type="checkbox"
          id="mailchimp-enabled"
          checked={mailchimpConfig.enabled}
          onChange={(e) => setMailchimpConfig(prev => ({ ...prev, enabled: e.target.checked }))}
          className="text-orange-500 focus:ring-orange-500"
        />
        <label htmlFor="mailchimp-enabled" className="text-sm font-medium text-gray-700">
          Enable Mailchimp Bulk Email
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
          <input
            type="password"
            value={mailchimpConfig.api_key}
            onChange={(e) => setMailchimpConfig(prev => ({ ...prev, api_key: e.target.value }))}
            placeholder="Enter Mailchimp API key"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={!mailchimpConfig.enabled}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Server Prefix</label>
          <input
            type="text"
            value={mailchimpConfig.server_prefix}
            onChange={(e) => setMailchimpConfig(prev => ({ ...prev, server_prefix: e.target.value }))}
            placeholder="us1, us2, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={!mailchimpConfig.enabled}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Default List ID</label>
        <input
          type="text"
          value={mailchimpConfig.list_id}
          onChange={(e) => setMailchimpConfig(prev => ({ ...prev, list_id: e.target.value }))}
          placeholder="Enter default mailing list ID"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          disabled={!mailchimpConfig.enabled}
        />
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Platform-wide Email Campaigns:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Welcome emails for new users</li>
          <li>• Promotional offers and discounts</li>
          <li>• Property updates and newsletters</li>
          <li>• Booking confirmations and reminders</li>
          <li>• Platform announcements and updates</li>
          <li>• Bulk promotional campaigns to all users</li>
        </ul>
      </div>
      
      <button
        onClick={handleSaveMailchimp}
        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
      >
        Save Mailchimp Settings
      </button>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
        <button
          onClick={addSubscriptionPlan}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Add Plan
        </button>
      </div>
      
      <div className="space-y-6">
        {subscriptionPlans.map((plan) => (
          <div key={plan.id} className="border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => updateSubscriptionPlan(plan.id, { name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                <select
                  value={plan.type}
                  onChange={(e) => updateSubscriptionPlan(plan.id, { type: e.target.value as 'owner' | 'broker' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="owner">Owner</option>
                  <option value="broker">Broker</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Model</label>
                <select
                  value={plan.pricing_model}
                  onChange={(e) => updateSubscriptionPlan(plan.id, { pricing_model: e.target.value as 'percentage' | 'flat' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="percentage">Percentage on Earnings</option>
                  <option value="flat">Flat Rate</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Billing Cycle</label>
                <select
                  value={plan.billing_cycle}
                  onChange={(e) => updateSubscriptionPlan(plan.id, { billing_cycle: e.target.value as 'monthly' | 'yearly' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              {plan.pricing_model === 'percentage' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Percentage (%)</label>
                  <input
                    type="number"
                    value={plan.percentage || 0}
                    onChange={(e) => updateSubscriptionPlan(plan.id, { percentage: parseFloat(e.target.value) })}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flat Rate (₹)</label>
                  <input
                    type="number"
                    value={plan.flat_rate || 0}
                    onChange={(e) => updateSubscriptionPlan(plan.id, { flat_rate: parseFloat(e.target.value) })}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              )}
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
                <input
                  type="text"
                  value={plan.features.join(', ')}
                  onChange={(e) => updateSubscriptionPlan(plan.id, { features: e.target.value.split(', ').filter(f => f.trim()) })}
                  placeholder="Feature 1, Feature 2, Feature 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`plan-active-${plan.id}`}
                  checked={plan.is_active}
                  onChange={(e) => updateSubscriptionPlan(plan.id, { is_active: e.target.checked })}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor={`plan-active-${plan.id}`} className="text-sm font-medium text-gray-700">
                  Active Plan
                </label>
              </div>
              
              <button
                onClick={() => removeSubscriptionPlan(plan.id)}
                className="px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                Remove Plan
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={handleSaveSubscriptions}
        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
      >
        Save Subscription Plans
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'logo' && renderLogo()}
            {activeTab === 'razorpay' && renderRazorpay()}
            {activeTab === 'mailchimp' && renderMailchimp()}
            {activeTab === 'subscriptions' && renderSubscriptions()}
          </div>
        </div>
      </div>
    </div>
  );
}