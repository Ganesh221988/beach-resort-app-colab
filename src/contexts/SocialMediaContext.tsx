import React, { createContext, useContext, useState, useCallback } from 'react';
import socialMediaApi from '../api/socialMediaApi';
import { SocialMediaAccounts } from '../types/settings';
import { SocialMediaPost, ScheduledPost } from '../types/socialMedia';
import { useAuth } from './AuthContext';

interface SocialMediaContextType {
  accounts: SocialMediaAccounts;
  loading: boolean;
  error: string | null;
  scheduledPosts: ScheduledPost[];
  connectFacebook: () => Promise<void>;
  connectInstagram: () => Promise<void>;
  disconnectFacebook: () => Promise<void>;
  disconnectInstagram: () => Promise<void>;
  refreshFacebookToken: () => Promise<void>;
  createPost: (post: SocialMediaPost) => Promise<void>;
  schedulePost: (post: SocialMediaPost) => Promise<void>;
  getScheduledPosts: () => Promise<void>;
  cancelScheduledPost: (postId: string) => Promise<void>;
}

const SocialMediaContext = createContext<SocialMediaContextType | undefined>(undefined);

export const SocialMediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [accounts, setAccounts] = useState<SocialMediaAccounts>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  const fetchAccounts = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const data = await socialMediaApi.getConnectedAccounts();
      setAccounts(data);
    } catch (err) {
      setError('Failed to fetch social media accounts');
      console.error('Error fetching social media accounts:', err);
    }
  }, [isAuthenticated]);

  const connectFacebook = useCallback(async () => {
    setLoading(true);
    try {
      const authUrl = await socialMediaApi.initiateFacebookOAuth();
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to connect Facebook account');
      console.error('Error connecting Facebook:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const connectInstagram = useCallback(async () => {
    setLoading(true);
    try {
      const authUrl = await socialMediaApi.initiateInstagramOAuth();
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to connect Instagram account');
      console.error('Error connecting Instagram:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectFacebook = useCallback(async () => {
    setLoading(true);
    try {
      await socialMediaApi.disconnectFacebook();
      setAccounts(prev => ({ ...prev, facebook: undefined }));
    } catch (err) {
      setError('Failed to disconnect Facebook account');
      console.error('Error disconnecting Facebook:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectInstagram = useCallback(async () => {
    setLoading(true);
    try {
      await socialMediaApi.disconnectInstagram();
      setAccounts(prev => ({ ...prev, instagram: undefined }));
    } catch (err) {
      setError('Failed to disconnect Instagram account');
      console.error('Error disconnecting Instagram:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshFacebookToken = useCallback(async () => {
    setLoading(true);
    try {
      await socialMediaApi.refreshFacebookToken();
      await fetchAccounts();
    } catch (err) {
      setError('Failed to refresh Facebook token');
      console.error('Error refreshing Facebook token:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchAccounts]);

  const createPost = useCallback(async (post: SocialMediaPost) => {
    setLoading(true);
    try {
      await socialMediaApi.createPost(post);
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const schedulePost = useCallback(async (post: SocialMediaPost) => {
    setLoading(true);
    try {
      const scheduledPost = await socialMediaApi.schedulePost(post);
      setScheduledPosts(prev => [...prev, scheduledPost]);
    } catch (err) {
      setError('Failed to schedule post');
      console.error('Error scheduling post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getScheduledPosts = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const posts = await socialMediaApi.getScheduledPosts();
      setScheduledPosts(posts);
    } catch (err) {
      setError('Failed to fetch scheduled posts');
      console.error('Error fetching scheduled posts:', err);
    }
  }, [isAuthenticated]);

  const cancelScheduledPost = useCallback(async (postId: string) => {
    setLoading(true);
    try {
      await socialMediaApi.cancelScheduledPost(postId);
      setScheduledPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      setError('Failed to cancel scheduled post');
      console.error('Error canceling scheduled post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const value = {
    accounts,
    loading,
    error,
    scheduledPosts,
    connectFacebook,
    connectInstagram,
    disconnectFacebook,
    disconnectInstagram,
    refreshFacebookToken,
    createPost,
    schedulePost,
    getScheduledPosts,
    cancelScheduledPost
  };

  return (
    <SocialMediaContext.Provider value={value}>
      {children}
    </SocialMediaContext.Provider>
  );
};

export const useSocialMedia = () => {
  const context = useContext(SocialMediaContext);
  if (context === undefined) {
    throw new Error('useSocialMedia must be used within a SocialMediaProvider');
  }
  return context;
};

export default SocialMediaContext;
