import { Response } from 'express';
import axios from 'axios';
import { AuthenticatedRequest } from '../types/express';
import User from '../models/User';
import SocialMediaAccounts from '../models/SocialMediaAccounts';
import config from '../config/config';

// Ensure socialMedia config is defined at startup
if (!config.development.socialMedia) {
  throw new Error('Social media configuration missing in config.development');
}
const socialMediaConfig = config.development.socialMedia;

export class SocialMediaController {
  // Facebook OAuth flow
  async initiateFacebookAuth(req: AuthenticatedRequest, res: Response) {
    try {
      if (!socialMediaConfig.facebook) {
        return res.status(500).json({ error: 'Facebook configuration missing' });
      }

      const { appId, callbackUrl } = socialMediaConfig.facebook;
      const scope = 'pages_show_list,pages_read_engagement,pages_manage_posts';
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${callbackUrl}&scope=${scope}`;
      res.json({ authUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to initiate Facebook authentication' });
    }
  }

  async handleFacebookCallback(req: AuthenticatedRequest, res: Response) {
    try {
      if (!socialMediaConfig.facebook) {
        return res.status(500).json({ error: 'Facebook configuration missing' });
      }
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { code } = req.body;
      const { appId, appSecret, callbackUrl } = socialMediaConfig.facebook;
      
      // Exchange code for access token
      const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
        params: {
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: callbackUrl,
          code
        }
      });

      const { access_token, expires_in } = tokenResponse.data;

      // Get user's Facebook pages
      const pagesResponse = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
        params: { access_token }
      });

      const page = pagesResponse.data.data[0]; // Get first page for now
      
      // Save to database
      await SocialMediaAccounts.update(
        {
          facebookPageId: page.id,
          facebookPageName: page.name,
          facebookAccessToken: page.access_token,
          facebookTokenExpires: new Date(Date.now() + expires_in * 1000)
        },
        { where: { userId: req.user.id } }
      );

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to complete Facebook authentication' });
    }
  }

  // Instagram OAuth flow
  async initiateInstagramAuth(req: AuthenticatedRequest, res: Response) {
    try {
      if (!socialMediaConfig.instagram) {
        return res.status(500).json({ error: 'Instagram configuration missing' });
      }

      const { appId, callbackUrl } = socialMediaConfig.instagram;
      const scope = 'instagram_basic,instagram_content_publish';
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${callbackUrl}&scope=${scope}&response_type=code`;
      res.json({ authUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to initiate Instagram authentication' });
    }
  }

  async handleInstagramCallback(req: AuthenticatedRequest, res: Response) {
    try {
      if (!socialMediaConfig.instagram) {
        return res.status(500).json({ error: 'Instagram configuration missing' });
      }
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { code } = req.body;
      const { appId, appSecret, callbackUrl } = socialMediaConfig.instagram;
      
      // Exchange code for access token
      const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
        client_id: appId,
        client_secret: appSecret,
        grant_type: 'authorization_code',
        redirect_uri: callbackUrl,
        code
      });

      const { access_token, user_id } = tokenResponse.data;

      // Get account details
      const accountResponse = await axios.get(`https://graph.instagram.com/v18.0/${user_id}`, {
        params: {
          fields: 'username',
          access_token
        }
      });

      // Save to database
      await SocialMediaAccounts.update(
        {
          instagramAccountId: user_id,
          instagramUsername: accountResponse.data.username,
          instagramAccessToken: access_token
        },
        { where: { userId: req.user.id } }
      );

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to complete Instagram authentication' });
    }
  }

  // Account management
  async getConnectedAccounts(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const accounts = await SocialMediaAccounts.findOne({
        where: { userId: req.user.id }
      });

      res.json({
        facebook: accounts?.facebookPageId ? {
          pageId: accounts.facebookPageId,
          pageName: accounts.facebookPageName,
          accessToken: accounts.facebookAccessToken,
          tokenExpires: accounts.facebookTokenExpires
        } : undefined,
        instagram: accounts?.instagramAccountId ? {
          accountId: accounts.instagramAccountId,
          username: accounts.instagramUsername,
          accessToken: accounts.instagramAccessToken
        } : undefined
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch connected accounts' });
    }
  }

  async disconnectFacebook(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      await SocialMediaAccounts.update(
        {
          facebookPageId: null,
          facebookPageName: null,
          facebookAccessToken: null,
          facebookTokenExpires: null
        },
        { where: { userId: req.user.id } }
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to disconnect Facebook account' });
    }
  }

  async disconnectInstagram(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      await SocialMediaAccounts.update(
        {
          instagramAccountId: null,
          instagramUsername: null,
          instagramAccessToken: null
        },
        { where: { userId: req.user.id } }
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to disconnect Instagram account' });
    }
  }

  async refreshFacebookToken(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const accounts = await SocialMediaAccounts.findOne({
        where: { userId: req.user.id }
      });

      if (!accounts?.facebookAccessToken) {
        return res.status(400).json({ error: 'No Facebook account connected' });
      }

      const { appId, appSecret } = socialMediaConfig.facebook;
      
      const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: appId,
          client_secret: appSecret,
          fb_exchange_token: accounts.facebookAccessToken
        }
      });

      await accounts.update({
        facebookAccessToken: response.data.access_token,
        facebookTokenExpires: new Date(Date.now() + response.data.expires_in * 1000)
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to refresh Facebook token' });
    }
  }
}

export const socialMediaController = new SocialMediaController();
