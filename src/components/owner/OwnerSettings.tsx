import React, { useState } from 'react';
import { X, User, CreditCard, Mail, Instagram, Facebook, MessageCircle, Save, Upload, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PaymentGatewaySetup } from '../payment/PaymentGatewaySetup';
import { SocialMediaSetup } from '../social/SocialMediaSetup';
import { ContactSettings } from './ContactSettings';

interface OwnerSettingsProps {
  onClose: () => void;
}

export function OwnerSettings({ onClose }: OwnerSettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState({
    business_name: 'John\'s Beach Resorts',
    owner_name: 'John Smith',
    email: 'owner@ecrbeachresorts.com',
    phone: '+91 9876543211',
    address: 'Goa, India',
    gst_number: 'GST123456789',
    pan_number: 'ABCDE1234F',
    bank_account: '1234567890',
    bank_name: 'HDFC Bank',
    ifsc_code: 'HDFC0001234'
  });

  const [supportQuery, setSupportQuery] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const tabs = [
    { id: 'profile', label: 'Update Profile', icon: User },
    { id: 'contact', label: 'Contact Settings', icon: Phone },
    { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
    { id: 'mailchimp', label: 'Bulk Email Integration', icon: Mail },
    { id: 'social', label: 'Social Media', icon: Instagram },
    { id: 'support', label: 'Customer Support', icon: MessageCircle }
  ];

  const handleSaveProfile = () => {
    console.log('Saving owner profile:', profileData);
    alert('Profile updated successfully!');
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
          <input
            type="text"
            value={profileData.business_name}
            onChange={(e) => setProfileData(prev => ({ ...prev, business_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
          <input
            type="text"
            value={profileData.owner_name}
            onChange={(e) => setProfileData(prev => ({ ...prev, owner_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Name</label>
          <input
            type="text"
            value={profileData.contact_person_name || ''}
            onChange={(e) => setProfileData(prev => ({ ...prev, contact_person_name: e.target.value }))}
            placeholder="Name for marketing posts"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">This name will appear in automated marketing posts</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number for Marketing</label>
          <input
            type="tel"
            value={profileData.marketing_phone || ''}
            onChange={(e) => setProfileData(prev => ({ ...prev, marketing_phone: e.target.value }))}
            placeholder="Phone number for marketing posts"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">This number will be included in social media posts</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
          <input
            type="text"
            value={profileData.gst_number}
            onChange={(e) => setProfileData(prev => ({ ...prev, gst_number: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
          <input
            type="text"
            value={profileData.pan_number}
            onChange={(e) => setProfileData(prev => ({ ...prev, pan_number: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          value={profileData.address}
          onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3">Bank Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              type="text"
              value={profileData.bank_account}
              onChange={(e) => setProfileData(prev => ({ ...prev, bank_account: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input
              type="text"
              value={profileData.bank_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, bank_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
            <input
              type="text"
              value={profileData.ifsc_code}
              onChange={(e) => setProfileData(prev => ({ ...prev, ifsc_code: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <button
        onClick={handleSaveProfile}
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        Save Profile
      </button>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Customer Support</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
        <p className="text-sm text-blue-700">
          Our support team is here to help you with any questions or issues. 
          We typically respond within 24 hours.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
        <input
          type="text"
          value={supportQuery.subject}
          onChange={(e) => setSupportQuery(prev => ({ ...prev, subject: e.target.value }))}
          placeholder="Brief description of your query"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
        <select
          value={supportQuery.priority}
          onChange={(e) => setSupportQuery(prev => ({ ...prev, priority: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">📞 Phone Support</h4>
          <p className="text-sm text-green-700">+91 98765 43210</p>
          <p className="text-xs text-green-600">Mon-Fri, 9 AM - 6 PM IST</p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">📧 Email Support</h4>
          <p className="text-sm text-purple-700">support@ecrbeachresorts.com</p>
          <p className="text-xs text-purple-600">24/7 - Response within 24 hours</p>
        </div>
      </div>
      
      <button
        onClick={handleSubmitSupport}
        disabled={!supportQuery.subject || !supportQuery.message}
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
      >
        Submit Support Query
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Owner Settings</h2>
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
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
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
            {activeTab === 'payment' && <PaymentGatewaySetup />}
            {activeTab === 'mailchimp' && renderMailchimp()}
            {activeTab === 'social' && <SocialMediaSetup properties={[]} />}
            {activeTab === 'support' && renderSupport()}
          </div>
        </div>
      </div>
    </div>
  );
}