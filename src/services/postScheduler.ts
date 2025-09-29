import { Model, DataTypes, Op } from 'sequelize';
import sequelize from '../config/database';
import axios from 'axios';
import SocialMediaAccounts from '../models/SocialMediaAccounts';
import Property from '../models/Property';

class ScheduledPost extends Model {
  public id!: string;
  public userId!: number;
  public propertyId!: string;
  public platforms!: string[];
  public content!: string;
  public images?: string[];
  public scheduledTime!: Date;
  public status!: 'pending' | 'published' | 'failed';
  public error?: string;
}

ScheduledPost.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  propertyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Properties',
      key: 'id'
    }
  },
  platforms: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  scheduledTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'published', 'failed'),
    defaultValue: 'pending'
  },
  error: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'ScheduledPost',
  tableName: 'scheduled_posts'
});

export class PostScheduler {
  private static async postToFacebook(pageId: string, accessToken: string, content: string, imageUrls?: string[]) {
    try {
      let postId: string;

      if (imageUrls && imageUrls.length > 0) {
        // First upload the images
        const uploadPromises = imageUrls.map(url =>
          axios.post(`https://graph.facebook.com/v18.0/${pageId}/photos`, {
            url,
            published: false,
            access_token: accessToken
          })
        );

        const uploadResults = await Promise.all(uploadPromises);
        const mediaIds = uploadResults.map(result => ({ media_fbid: result.data.id }));

        // Create a post with the uploaded images
        const response = await axios.post(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
          message: content,
          attached_media: mediaIds,
          access_token: accessToken
        });

        postId = response.data.id;
      } else {
        // Text-only post
        const response = await axios.post(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
          message: content,
          access_token: accessToken
        });

        postId = response.data.id;
      }

      return { success: true, postId };
    } catch (error) {
      console.error('Facebook post error:', error);
      throw new Error(`Facebook post failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async postToInstagram(accountId: string, accessToken: string, content: string, imageUrl?: string) {
    try {
      if (!imageUrl) {
        throw new Error('Instagram requires at least one image');
      }

      // Create a container
      const containerResponse = await axios.post(`https://graph.facebook.com/v18.0/${accountId}/media`, {
        image_url: imageUrl,
        caption: content,
        access_token: accessToken
      });

      // Publish the container
      const publishResponse = await axios.post(`https://graph.facebook.com/v18.0/${accountId}/media_publish`, {
        creation_id: containerResponse.data.id,
        access_token: accessToken
      });

      return { success: true, mediaId: publishResponse.data.id };
    } catch (error) {
      console.error('Instagram post error:', error);
      throw new Error(`Instagram post failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async processScheduledPosts() {
    try {
      const now = new Date();
      const posts = await ScheduledPost.findAll({
        where: {
          status: 'pending',
          scheduledTime: {
            [Op.lte]: now
          }
        },
        include: [{
          model: Property,
          attributes: ['id', 'name', 'description', 'location']
        }]
      });

      for (const post of posts) {
        try {
          const accounts = await SocialMediaAccounts.findOne({
            where: { userId: post.userId }
          });

          if (!accounts) {
            throw new Error('No social media accounts found');
          }

          const results = await Promise.allSettled(
            post.platforms.map(async platform => {
              if (platform === 'facebook' && accounts.facebookAccessToken) {
                return PostScheduler.postToFacebook(
                  accounts.facebookPageId!,
                  accounts.facebookAccessToken,
                  post.content,
                  post.images
                );
              } else if (platform === 'instagram' && accounts.instagramAccessToken) {
                return PostScheduler.postToInstagram(
                  accounts.instagramAccountId!,
                  accounts.instagramAccessToken,
                  post.content,
                  post.images?.[0]
                );
              }
              throw new Error(`Invalid platform or missing credentials: ${platform}`);
            })
          );

          const errors = results
            .filter(r => r.status === 'rejected')
            .map(r => (r as PromiseRejectedResult).reason.message);

          if (errors.length > 0) {
            await post.update({
              status: 'failed',
              error: errors.join('; ')
            });
          } else {
            await post.update({
              status: 'published'
            });
          }
        } catch (error) {
          await post.update({
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    } catch (error) {
      console.error('Error processing scheduled posts:', error);
    }
  }
}

export default ScheduledPost;
