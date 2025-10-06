import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Save, User, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/supabaseService';

interface ContactSettingsProps {
  onSave?: () => void;
}

export function ContactSettings({ onSave }: ContactSettingsProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [contactData, setContactData] = useState({
    calling_number: '',
    whatsapp_number: '',
    contact_person_name: '',
    business_hours: '',
    email_for_inquiries: '',
    alternate_contact: ''
  });

  useEffect(() => {
    if (user) {
      loadContactSettings();
    }
  }, [user]);

  const loadContactSettings = async () => {
    if (!user) return;
    
    try {
      const profile = await userService.getProfile(user.id);
      if (profile?.contact_info) {
        setContactData({
          calling_number: profile.contact_info.calling_number || '',
          whatsapp_number: profile.contact_info.whatsapp_number || '',
          contact_person_name: profile.contact_info.contact_person_name || '',
          business_hours: profile.contact_info.business_hours || '9 AM - 6 PM',
          email_for_inquiries: profile.contact_info.email_for_inquiries || '',
          alternate_contact: profile.contact_info.alternate_contact || ''
        });
      }
    } catch (error) {
      console.error('Error loading contact settings:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await userService.updateProfile(user.id, {
        contact_info: {
          ...contactData,
          updated_at: new Date().toISOString()
        }
      });
      
      onSave?.();
      alert('Contact settings saved successfully!');
    } catch (error) {
      console.error('Error saving contact settings:', error);
      alert('Error saving contact settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Phone className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Contact Settings</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Contact Integration</h4>
        <p className="text-sm text-blue-700">
          These contact details will be displayed on your property pages and integrated with 
          calling and WhatsApp buttons for easy customer communication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Calling Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={contactData.calling_number}
              onChange={(e) => setContactData(prev => ({ ...prev, calling_number: e.target.value }))}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This number will appear with a call button on your property pages
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp Number *
          </label>
          <div className="relative">
            <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={contactData.whatsapp_number}
              onChange={(e) => setContactData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This number will appear with a WhatsApp button on your property pages
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Person Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={contactData.contact_person_name}
              onChange={(e) => setContactData(prev => ({ ...prev, contact_person_name: e.target.value }))}
              placeholder="John Smith"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Name to display for customer inquiries
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Hours
          </label>
          <input
            type="text"
            value={contactData.business_hours}
            onChange={(e) => setContactData(prev => ({ ...prev, business_hours: e.target.value }))}
            placeholder="9 AM - 6 PM"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email for Inquiries
          </label>
          <input
            type="email"
            value={contactData.email_for_inquiries}
            onChange={(e) => setContactData(prev => ({ ...prev, email_for_inquiries: e.target.value }))}
            placeholder="inquiries@yourproperty.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alternate Contact Number
          </label>
          <input
            type="tel"
            value={contactData.alternate_contact}
            onChange={(e) => setContactData(prev => ({ ...prev, alternate_contact: e.target.value }))}
            placeholder="+91 98765 43211"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Contact Button Preview</h4>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
            <Phone className="h-4 w-4" />
            <span>Call {contactData.contact_person_name || 'Owner'}</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg">
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          These buttons will appear on your property pages for customer inquiries
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">
          <Building2 className="h-4 w-4 inline mr-2" />
          Contact Integration Benefits:
        </h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Direct calling from property pages</li>
          <li>• One-click WhatsApp messaging</li>
          <li>• Increased customer inquiries</li>
          <li>• Better conversion rates</li>
          <li>• Professional contact display</li>
          <li>• Mobile-optimized communication</li>
        </ul>
      </div>

      {/* Test Contact Integration */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3">Test Contact Integration</h4>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              const testNumber = contactData.calling_number || '+91 98765 43210';
              window.open(`tel:${testNumber}`);
            }}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>Test Call</span>
          </button>
          
          <button
            onClick={() => {
              const testNumber = contactData.whatsapp_number || '+91 98765 43210';
              const message = encodeURIComponent('Test message from ECR Beach Resorts contact settings');
              const cleanNumber = testNumber.replace(/[^0-9]/g, '');
              window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
            }}
            className="flex items-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Test WhatsApp</span>
          </button>
        </div>
        <p className="text-xs text-blue-600 mt-2">Click to test your contact integration</p>
      </div>
      <button
        onClick={handleSave}
        disabled={loading || !contactData.calling_number || !contactData.whatsapp_number}
        className="flex items-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
      >
        <Save className="h-4 w-4" />
        <span>{loading ? 'Saving...' : 'Save Contact Settings'}</span>
      </button>
    </div>
  );
}