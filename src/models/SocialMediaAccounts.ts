import { Model, DataTypes } from "sequelize";
import sequelize from '../config/database';
import User from './User';

class SocialMediaAccounts extends Model {
  public id!: number;
  public userId!: number;
  public facebookPageId!: string | null;
  public facebookPageName!: string | null;
  public facebookAccessToken!: string | null;
  public facebookTokenExpires!: Date | null;
  public instagramAccountId!: string | null;
  public instagramUsername!: string | null;
  public instagramAccessToken!: string | null;
}

SocialMediaAccounts.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  facebookPageId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  facebookPageName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  facebookAccessToken: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  facebookTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  instagramAccountId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  instagramUsername: {
    type: DataTypes.STRING,
    allowNull: true
  },
  instagramAccessToken: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'SocialMediaAccounts',
  tableName: 'social_media_accounts'
});

SocialMediaAccounts.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

export default SocialMediaAccounts;
