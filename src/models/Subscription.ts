import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

interface SubscriptionAttributes {
  id: number;
  userId: number;
  plan: 'FREE' | 'BASIC' | 'PREMIUM';
  paymentType: 'FLAT_RATE' | 'COMMISSION';
  commissionRate?: number;
  flatRate?: number;
  startDate: Date;
  endDate: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
}

class Subscription extends Model<SubscriptionAttributes> implements SubscriptionAttributes {
  public id!: number;
  public userId!: number;
  public plan!: 'FREE' | 'BASIC' | 'PREMIUM';
  public paymentType!: 'FLAT_RATE' | 'COMMISSION';
  public commissionRate?: number;
  public flatRate?: number;
  public startDate!: Date;
  public endDate!: Date;
  public status!: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  public paymentStatus!: 'PENDING' | 'PAID' | 'FAILED';
}

Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    plan: {
      type: DataTypes.ENUM('FREE', 'BASIC', 'PREMIUM'),
      allowNull: false,
      defaultValue: 'FREE',
    },
    paymentType: {
      type: DataTypes.ENUM('FLAT_RATE', 'COMMISSION'),
      allowNull: false,
    },
    commissionRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    flatRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    paymentStatus: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
  },
  {
    sequelize,
    tableName: 'subscriptions',
    timestamps: true,
  }
);

// Associations
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Subscription;
