import React, { useState } from 'react';
import { X, User, CreditCard, Mail, MessageCircle, Save, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userIntegrationService } from '../../services/integrationService';
import { ContactSettings } from '../owner/ContactSettings';

interface BrokerSettingsProps {
  onClose: () => void;
}

export function BrokerSettings({ onClose }: BrokerSettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    agency_name: 'Sarah\'s Travel Agency',
    broker_name: 'Sarah Wilson',
    email: 'broker@ecrbeachresorts.com',
    phone: '+91 9876543212',
    address: 'Mumbai, Maharashtra, India',
    gst_number: 'GST987654321',
    pan_number: 'FGHIJ5678K',
    bank_account: '9876543210',
    bank_name: 'ICICI Bank',
    ifsc_code: 'ICIC0001234',
    license_number: 'TL123456789'
  });

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

  const [supportQuery, setSupportQuery] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const tabs = [
    { id: 'profile', label: 'Update Profile', icon: User },
    { id: 'contact', label: 'Contact Settings', icon: Phone },
    { id: 'razorpay', label: 'Payment Gateway', icon: CreditCard },
    { id: 'mailchimp', label: 'Email Marketing', icon: Mail },
    { id: 'support', label: 'Customer Support', icon: MessageCircle }
  ];

  const handleSaveProfile = () => {
    console.log('Saving broker profile:', profileData);
    alert('Profile updated successfully!');
  };

  const handleSaveRazorpay = () => {
    console.log('Saving Razorpay config:', razorpayConfig);
    alert('Payment gateway settings updated successfully!');
  };

  const handleSaveMailchimp = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await userIntegrationService.upsertUserIntegration(
        user.id,
        'mailchimp',
        {
          api_key: mailchimpConfig.api_key,
          server_prefix: mailchimpConfig.server_prefix,
          list_id: mailchimpConfig.list_id
        },
        mailchimpConfig.enabled
      );
      await loadIntegrations();
      alert('Email marketing settings updated successfully!');
    } catch (error) {
      console.error('Error saving Mailchimp config:', error);
      alert('Error saving email marketing settings. Please try again.');
    } finally {
      setLoading(false);
    }
    console.log('Saving Mailchimp config:', mailchimpConfig);
  };

  const handleSubmitSupport = () => {
    console.log('Submitting support query:', supportQuery);
    alert('Support query submitted successfully! We will get back to you within 24 hours.');
    setSupportQuery({ subject: '', message: '', priority: 'medium' });
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Update Profile</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name</label>
          <input
            type="text"
            value={profileData.agency_name}
            onChange={(e) => setProfileData(prev => ({ ...prev, agency_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Broker Name</label>
          <input
            type="text"
            value={profileData.broker_name}
            onChange={(e) => setProfileData(prev => ({ ...prev, broker_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
          <input
            type="text"
            value={profileData.gst_number}
            onChange={(e) => setProfileData(prev => ({ ...prev, gst_number: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
          <input
            type="text"
            value={profileData.pan_number}
            onChange={(e) => setProfileData(prev => ({ ...prev, pan_number: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Travel License Number</label>
          <input
            type="text"
            value={profileData.license_number}
            onChange={(e) => setProfileData(prev => ({ ...prev, license_number: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          value={profileData.address}
          onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-3">Bank Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              type="text"
              value={profileData.bank_account}
              onChange={(e) => setProfileData(prev => ({ ...prev, bank_account: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input
              type="text"
              value={profileData.bank_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, bank_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
            <input
              type="text"
              value={profileData.ifsc_code}
              onChange={(e) => setProfileData(prev => ({ ...prev, ifsc_code: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>
      
      <button
        onClick={handleSaveProfile}
        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
      >
        Save Profile
      </button>
    </div>
  );

  const renderRazorpay = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Payment Gateway Integration</h3>
      
      <div className="flex items-center space-x-3 mb-4">
        <input
          type="checkbox"
          id="razorpay-enabled"
          checked={razorpayConfig.enabled}
          onChange={(e) => setRazorpayConfig(prev => ({ ...prev, enabled: e.target.checked }))}
          className="text-green-500 focus:ring-green-500"
        />
        <label htmlFor="razorpay-enabled" className="text-sm font-medium text-gray-700">
          Enable Your Own Razorpay Gateway
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={!razorpayConfig.enabled}
        />
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Benefits for Brokers:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Collect payments directly from customers</li>
          <li>• Faster commission settlements</li>
          <li>• Lower transaction fees</li>
          <li>• Complete payment control</li>
          <li>• Custom payment experiences</li>
          <li>• Better cash flow management</li>
        </ul>
      </div>
      
      <button
        onClick={handleSaveRazorpay}
        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
      >
        Save Payment Settings
      </button>
    </div>
  );

  const renderMailchimp = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Email Marketing Integration</h3>
      
      <div className="flex items-center space-x-3 mb-4">
        <input
          type="checkbox"
          id="mailchimp-enabled"
          checked={mailchimpConfig.enabled}
          onChange={(e) => setMailchimpConfig(prev => ({ ...prev, enabled: e.target.checked }))}
          className="text-green-500 focus:ring-green-500"
        />
        <label htmlFor="mailchimp-enabled" className="text-sm font-medium text-gray-700">
          Enable Mailchimp Integration
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={!mailchimpConfig.enabled}
        />
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Bulk Email Marketing for Brokers:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Send booking confirmations to customers</li>
          <li>• Share travel tips and destination guides</li>
          <li>• Promote special deals and packages</li>
          <li>• Build customer loyalty programs</li>
          <li>• Send follow-up surveys and feedback requests</li>
          <li>• Create seasonal travel campaigns</li>
          <li>• Send bulk promotional emails to customer lists</li>
          <li>• Automated email sequences for lead nurturing</li>
        </ul>
      </div>
      
      <button
        onClick={handleSaveMailchimp}
        disabled={loading}
        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
      >
        {loading ? 'Saving...' : 'Save Mailchimp Settings'}
      </button>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Customer Support</h3>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-green-900 mb-2">Need Help?</h4>
        <p className="text-sm text-green-700">
          Our support team is here to help you with any questions about bookings, commissions, 
          or platform features. We typically respond within 24 hours.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
        <input
          type="text"
          value={supportQuery.subject}
          onChange={(e) => setSupportQuery(prev => ({ ...prev, subject: e.target.value }))}
          placeholder="Brief description of your query"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
        <select
          value={supportQuery.priority}
          onChange={(e) => setSupportQuery(prev => ({ ...prev, priority: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="low">Low - General inquiry</option>
          <option value="medium">Medium - Need assistance</option>
          <option value="high">High - Urgent issue</option>
          <option value="critical">Critical - System down</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea
          value={supportQuery.message}
          onChange={(e) => setSupportQuery(prev => ({ ...prev, message: e.target.value }))}
          rows={6}
          placeholder="Please describe your query in detail..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">📞 Phone Support</h4>
          <p className="text-sm text-blue-700">+91 98765 43210</p>
          <p className="text-xs text-blue-600">Mon-Fri, 9 AM - 6 PM IST</p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">📧 Email Support</h4>
          <p className="text-sm text-purple-700">support@ecrbeachresorts.com</p>
          <p className="text-xs text-purple-600">24/7 - Response within 24 hours</p>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">💡 Common Topics:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Commission payment issues</li>
          <li>• Booking management questions</li>
          <li>• Platform feature requests</li>
          <li>• Integration setup help</li>
          <li>• Customer dispute resolution</li>
        </ul>
      </div>
      
      <button
        onClick={handleSubmitSupport}
        disabled={!supportQuery.subject || !supportQuery.message}
        className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
      >
        Submit Support Query
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Broker Settings</h2>
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
                        ? 'bg-green-100 text-green-700 border border-green-200'
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
            {activeTab === 'contact' && <ContactSettings />}
            {activeTab === 'razorpay' && renderRazorpay()}
            {activeTab === 'mailchimp' && renderMailchimp()}
            {activeTab === 'support' && renderSupport()}
          </div>
        </div>
      </div>
    </div>
  );
}