import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Tables = Database['public']['Tables'];

export interface MarketingCampaign {
  id: string;
  property_id: string;
  owner_id: string;
  frequency: 'every_2_days' | 'weekly' | 'monthly';
  is_active: boolean;
  instagram_enabled: boolean;
  facebook_enabled: boolean;
  last_posted_at: string | null;
  next_post_at: string | null;
  post_content_template: any;
  created_at: string;
  updated_at: string;
}

export interface SocialMediaPost {
  id: string;
  campaign_id: string;
  property_id: string;
  platform: 'instagram' | 'facebook';
  post_content: string;
  images: string[];
  posted_at: string;
  engagement_stats: any;
  status: 'scheduled' | 'posted' | 'failed';
}

// Marketing Campaign Services
export const marketingService = {
  // Get campaigns for owner
  async getOwnerCampaigns(ownerId: string) {
    // This would be implemented with a proper campaigns table
    // For now, return mock data based on properties
    const { data: properties } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', ownerId);
    
    return properties?.map(property => ({
      id: `campaign_${property.id}`,
      property_id: property.id,
      owner_id: ownerId,
      frequency: 'weekly' as const,
      is_active: false,
      instagram_enabled: false,
      facebook_enabled: false,
      last_posted_at: null,
      next_post_at: null,
      post_content_template: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })) || [];
  },

  // Create or update campaign
  async upsertCampaign(campaign: Partial<MarketingCampaign>) {
    // This would save to a campaigns table
    console.log('Saving campaign:', campaign);
    return campaign;
  },

  // Generate post content
  generatePostContent(property: any, contactPerson: string, contactPhone: string) {
    const minPrice = Math.min(...property.room_types.map((r: any) => r.price_per_night));
    
    return {
      caption: `🏖️ Discover ${property.title} in ${property.city}! ✨

🌟 ${property.description.slice(0, 100)}...

🏡 Features:
${property.amenities.slice(0, 5).map((amenity: string) => `• ${amenity}`).join('\n')}

💰 Starting from ₹${minPrice.toLocaleString()}/night

📞 Book now: ${contactPerson}
📱 ${contactPhone}

#ECRBeachResorts #${property.city.replace(/\s+/g, '')} #Vacation #Travel #BookNow #${property.title.replace(/\s+/g, '')}`,
      
      images: property.images.slice(0, 10),
      hashtags: [
        '#ECRBeachResorts',
        `#${property.city.replace(/\s+/g, '')}`,
        '#Vacation',
        '#Travel',
        '#BookNow',
        `#${property.title.replace(/\s+/g, '')}`
      ]
    };
  },

  // Schedule posts
  async schedulePost(campaignId: string, platform: 'instagram' | 'facebook', content: any) {
    // This would integrate with Instagram/Facebook APIs
    console.log('Scheduling post:', { campaignId, platform, content });
    return {
      id: Date.now().toString(),
      campaign_id: campaignId,
      platform,
      content,
      scheduled_for: new Date().toISOString(),
      status: 'scheduled'
    };
  },

  // Get posting frequency in days
  getFrequencyInDays(frequency: string) {
    switch (frequency) {
      case 'every_2_days': return 2;
      case 'weekly': return 7;
      case 'monthly': return 30;
      default: return 7;
    }
  },

  // Calculate next post date
  calculateNextPostDate(frequency: string, lastPosted?: string) {
    const days = this.getFrequencyInDays(frequency);
    const baseDate = lastPosted ? new Date(lastPosted) : new Date();
    baseDate.setDate(baseDate.getDate() + days);
    return baseDate.toISOString();
  }
};

// Instagram API helpers (would integrate with actual Instagram Graph API)
export const instagramAPI = {
  async publishPost(accessToken: string, imageUrl: string, caption: string) {
    // Mock implementation - would use Instagram Graph API
    console.log('Publishing to Instagram:', { imageUrl, caption });
    return {
      id: 'ig_post_' + Date.now(),
      permalink: 'https://instagram.com/p/mock_post',
      timestamp: new Date().toISOString()
    };
  },

  async publishCarousel(accessToken: string, images: string[], caption: string) {
    // Mock implementation for multiple images
    console.log('Publishing carousel to Instagram:', { images, caption });
    return {
      id: 'ig_carousel_' + Date.now(),
      permalink: 'https://instagram.com/p/mock_carousel',
      timestamp: new Date().toISOString()
    };
  }
};

// Facebook API helpers (would integrate with actual Facebook Graph API)
export const facebookAPI = {
  async publishPost(accessToken: string, pageId: string, imageUrl: string, message: string) {
    // Mock implementation - would use Facebook Graph API
    console.log('Publishing to Facebook:', { pageId, imageUrl, message });
    return {
      id: 'fb_post_' + Date.now(),
      permalink: 'https://facebook.com/mock_post',
      created_time: new Date().toISOString()
    };
  },

  async publishPhotoAlbum(accessToken: string, pageId: string, images: string[], message: string) {
    // Mock implementation for multiple images
    console.log('Publishing album to Facebook:', { pageId, images, message });
    return {
      id: 'fb_album_' + Date.now(),
      permalink: 'https://facebook.com/mock_album',
      created_time: new Date().toISOString()
    };
  }
};