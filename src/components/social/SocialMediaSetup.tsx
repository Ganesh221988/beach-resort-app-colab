import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, Save, Eye, Camera, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userIntegrationService } from '../../services/integrationService';
import { Property } from '../../types';

interface SocialMediaSetupProps {
  properties: Property[];
  onSave?: () => void;
}

export function SocialMediaSetup({ properties, onSave }: SocialMediaSetupProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [instagramConfig, setInstagramConfig] = useState({
    username: '',
    access_token: '',
    enabled: false
  });

  const [facebookConfig, setFacebookConfig] = useState({
    page_id: '',
    access_token: '',
    enabled: false
  });

  const [marketingSettings, setMarketingSettings] = useState({
    contact_person_name: '',
    contact_phone: '',
    post_frequency: 'weekly' as 'every_2_days' | 'weekly' | 'monthly',
    auto_post_enabled: false
  });

  useEffect(() => {
    if (user) {
      loadSocialMediaConfig();
    }
  }, [user]);

  const loadSocialMediaConfig = async () => {
    if (!user) return;
    
    try {
      // Load Instagram integration
      const instagramIntegration = await userIntegrationService.getUserIntegration(user.id, 'instagram');
      if (instagramIntegration) {
        setInstagramConfig({
          ...instagramIntegration.integration_data,
          enabled: instagramIntegration.is_enabled
        });
      }

      // Load Facebook integration
      const facebookIntegration = await userIntegrationService.getUserIntegration(user.id, 'facebook');
      if (facebookIntegration) {
        setFacebookConfig({
          ...facebookIntegration.integration_data,
          enabled: facebookIntegration.is_enabled
        });
      }
    } catch (error) {
      console.error('Error loading social media config:', error);
    }
  };

  const handleSaveInstagram = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await userIntegrationService.upsertUserIntegration(
        user.id,
        'instagram',
        {
          username: instagramConfig.username,
          access_token: instagramConfig.access_token,
          contact_person_name: marketingSettings.contact_person_name,
          contact_phone: marketingSettings.contact_phone
        },
        instagramConfig.enabled
      );
      
      onSave?.();
      alert('Instagram integration saved successfully!');
    } catch (error) {
      console.error('Error saving Instagram config:', error);
      alert('Error saving Instagram settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFacebook = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await userIntegrationService.upsertUserIntegration(
        user.id,
        'facebook',
        {
          page_id: facebookConfig.page_id,
          access_token: facebookConfig.access_token,
          contact_person_name: marketingSettings.contact_person_name,
          contact_phone: marketingSettings.contact_phone
        },
        facebookConfig.enabled
      );
      
      onSave?.();
      alert('Facebook integration saved successfully!');
    } catch (error) {
      console.error('Error saving Facebook config:', error);
      alert('Error saving Facebook settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSamplePost = (property: Property) => {
    const minPrice = Math.min(...property.room_types.map(r => r.price_per_night));
    
    return {
      caption: `🏖️ Discover ${property.title} in ${property.city}! ✨

🌟 ${property.description.slice(0, 100)}...

🏡 Features:
${property.amenities.slice(0, 5).map(amenity => `• ${amenity}`).join('\n')}

💰 Starting from ₹${minPrice.toLocaleString()}/night

📞 Book now: ${marketingSettings.contact_person_name || 'Contact us'}
📱 ${marketingSettings.contact_phone || '+91 XXXXXXXXXX'}

#ECRBeachResorts #${property.city.replace(/\s+/g, '')} #Vacation #Travel #BookNow`,
      
      images: property.images.slice(0, 10)
    };
  };

  return (
    <div className="space-y-8">
      {/* Marketing Contact Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Contact Information</h3>
        <p className="text-sm text-gray-600 mb-4">
          This information will be included in your automated social media posts
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person Name
            </label>
            <input
              type="text"
              value={marketingSettings.contact_person_name}
              onChange={(e) => setMarketingSettings(prev => ({ ...prev, contact_person_name: e.target.value }))}
              placeholder="Name to display in posts"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone Number
            </label>
            <input
              type="tel"
              value={marketingSettings.contact_phone}
              onChange={(e) => setMarketingSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Instagram Integration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Instagram className="h-6 w-6 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-900">Instagram Business Integration</h3>
        </div>
        
        <div className="flex items-center space-x-3 mb-4">
          <input
            type="checkbox"
            id="instagram-enabled"
            checked={instagramConfig.enabled}
            onChange={(e) => setInstagramConfig(prev => ({ ...prev, enabled: e.target.checked }))}
            className="text-pink-500 focus:ring-pink-500"
          />
          <label htmlFor="instagram-enabled" className="text-sm font-medium text-gray-700">
            Enable Instagram Auto-Posting
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Username
            </label>
            <input
              type="text"
              value={instagramConfig.username}
              onChange={(e) => setInstagramConfig(prev => ({ ...prev, username: e.target.value }))}
              placeholder="@your_property_handle"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={!instagramConfig.enabled}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Access Token
            </label>
            <input
              type="password"
              value={instagramConfig.access_token}
              onChange={(e) => setInstagramConfig(prev => ({ ...prev, access_token: e.target.value }))}
              placeholder="Instagram Business API token"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={!instagramConfig.enabled}
            />
          </div>
        </div>
        
        <button
          onClick={handleSaveInstagram}
          disabled={loading}
          className="px-6 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
        >
          Save Instagram Settings
        </button>
      </div>

      {/* Facebook Integration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Facebook className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Facebook Page Integration</h3>
        </div>
        
        <div className="flex items-center space-x-3 mb-4">
          <input
            type="checkbox"
            id="facebook-enabled"
            checked={facebookConfig.enabled}
            onChange={(e) => setFacebookConfig(prev => ({ ...prev, enabled: e.target.checked }))}
            className="text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="facebook-enabled" className="text-sm font-medium text-gray-700">
            Enable Facebook Auto-Posting
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook Page ID
            </label>
            <input
              type="text"
              value={facebookConfig.page_id}
              onChange={(e) => setFacebookConfig(prev => ({ ...prev, page_id: e.target.value }))}
              placeholder="Your Facebook page ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!facebookConfig.enabled}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook Access Token
            </label>
            <input
              type="password"
              value={facebookConfig.access_token}
              onChange={(e) => setFacebookConfig(prev => ({ ...prev, access_token: e.target.value }))}
              placeholder="Facebook Page access token"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!facebookConfig.enabled}
            />
          </div>
        </div>
        
        <button
          onClick={handleSaveFacebook}
          disabled={loading}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
        >
          Save Facebook Settings
        </button>
      </div>

      {/* Sample Post Preview */}
      {properties.length > 0 && (marketingSettings.contact_person_name || marketingSettings.contact_phone) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <Eye className="h-5 w-5 inline mr-2" />
            Sample Post Preview
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">ECR</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{instagramConfig.username || '@your_property'}</p>
                <p className="text-xs text-gray-500">Sponsored</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {generateSamplePost(properties[0]).caption}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Marketing Campaign Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <Calendar className="h-5 w-5 inline mr-2" />
          Marketing Campaign Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Posting Frequency
            </label>
            <select
              value={marketingSettings.post_frequency}
              onChange={(e) => setMarketingSettings(prev => ({ ...prev, post_frequency: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="every_2_days">Every 2 Days</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="auto-post-enabled"
              checked={marketingSettings.auto_post_enabled}
              onChange={(e) => setMarketingSettings(prev => ({ ...prev, auto_post_enabled: e.target.checked }))}
              className="text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="auto-post-enabled" className="text-sm font-medium text-gray-700">
              Enable Automatic Posting
            </label>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-medium text-orange-900 mb-2">What Gets Posted Automatically:</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Property photos with attractive captions</li>
            <li>• Booking availability updates</li>
            <li>• Special offers and seasonal promotions</li>
            <li>• Customer testimonials and reviews</li>
            <li>• Local attractions and experiences</li>
          </ul>
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Integration Status</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Instagram Integration</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              instagramConfig.enabled && instagramConfig.access_token
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {instagramConfig.enabled && instagramConfig.access_token ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Facebook Integration</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              facebookConfig.enabled && facebookConfig.access_token
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {facebookConfig.enabled && facebookConfig.access_token ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Auto-Posting</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              marketingSettings.auto_post_enabled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {marketingSettings.auto_post_enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}