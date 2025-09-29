// Types for OAuth responses from social media platforms
export interface FacebookOAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface InstagramOAuthResponse {
  access_token: string;
  user_id: string;
}

// Types for social media post content
export interface SocialMediaPost {
  propertyId: string;
  platforms: ('facebook' | 'instagram')[];
  content: string;
  images?: string[];
  scheduledTime?: Date;
}

// Types for API responses
export interface FacebookPageResponse {
  id: string;
  name: string;
  access_token: string;
}

export interface InstagramAccountResponse {
  id: string;
  username: string;
}

// Types for post responses
export interface FacebookPostResponse {
  id: string;
  post_id: string;
}

export interface InstagramPostResponse {
  id: string;
  media_id: string;
}

// Types for post scheduling
export interface ScheduledPost extends SocialMediaPost {
  id: string;
  status: 'pending' | 'published' | 'failed';
  createdAt: Date;
  publishedAt?: Date;
  error?: string;
}
