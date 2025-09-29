import axiosClient from './axiosClient';
import {
  FacebookOAuthResponse,
  InstagramOAuthResponse,
  SocialMediaPost,
  FacebookPostResponse,
  InstagramPostResponse,
  ScheduledPost
} from '../types/socialMedia';
import { SocialMediaAccounts } from '../types/settings';

class SocialMediaApi {
  // OAuth endpoints
  async initiateFacebookOAuth(): Promise<string> {
    const { data } = await axiosClient.get('/api/social/facebook/auth');
    return data.authUrl;
  }

  async initiateInstagramOAuth(): Promise<string> {
    const { data } = await axiosClient.get('/api/social/instagram/auth');
    return data.authUrl;
  }

  // OAuth callbacks
  async handleFacebookCallback(code: string): Promise<void> {
    await axiosClient.post('/api/social/facebook/callback', { code });
  }

  async handleInstagramCallback(code: string): Promise<void> {
    await axiosClient.post('/api/social/instagram/callback', { code });
  }

  // Account management
  async getConnectedAccounts(): Promise<SocialMediaAccounts> {
    const { data } = await axiosClient.get('/api/social/accounts');
    return data;
  }

  async disconnectFacebook(): Promise<void> {
    await axiosClient.delete('/api/social/facebook');
  }

  async disconnectInstagram(): Promise<void> {
    await axiosClient.delete('/api/social/instagram');
  }

  async refreshFacebookToken(): Promise<void> {
    await axiosClient.post('/api/social/facebook/refresh');
  }

  async refreshInstagramToken(): Promise<void> {
    await axiosClient.post('/api/social/instagram/refresh');
  }

  // Post management
  async createPost(post: SocialMediaPost): Promise<{ facebook?: FacebookPostResponse; instagram?: InstagramPostResponse }> {
    const { data } = await axiosClient.post('/api/social/post', post);
    return data;
  }

  async schedulePost(post: SocialMediaPost): Promise<ScheduledPost> {
    const { data } = await axiosClient.post('/api/social/post/schedule', post);
    return data;
  }

  async getScheduledPosts(): Promise<ScheduledPost[]> {
    const { data } = await axiosClient.get('/api/social/post/scheduled');
    return data;
  }

  async cancelScheduledPost(postId: string): Promise<void> {
    await axiosClient.delete(`/api/social/post/scheduled/${postId}`);
  }
}

export const socialMediaApi = new SocialMediaApi();
export default socialMediaApi;
