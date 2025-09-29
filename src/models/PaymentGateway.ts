// src/models/PaymentGateway.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

interface PaymentGatewayAttributes {
  id: string;
  user_id: string;
  gateway_type: 'RAZORPAY' | 'STRIPE' | 'PAYPAL';
  is_default: boolean;
  is_active: boolean;
  credentials: {
    razorpay?: {
      keyId: string;
      keySecret: string;
      webhookSecret: string;
    };
    stripe?: {
      publishableKey: string;
      secretKey: string;
      webhookSecret: string;
    };
    paypal?: {
      clientId: string;
      clientSecret: string;
      environment: 'sandbox' | 'production';
    };
  };
  user_role: 'admin' | 'owner';
  commission_rate: number;
  metadata?: Record<string, any>;
  last_webhook_received?: Date;
}

type PaymentGatewayCreation = Optional<PaymentGatewayAttributes, "id" | "is_default" | "is_active" | "metadata" | "last_webhook_received">;

class PaymentGateway
  extends Model<PaymentGatewayAttributes, PaymentGatewayCreation>
  implements PaymentGatewayAttributes 
{
  public id!: string;
  public user_id!: string;
  public gateway_type!: 'RAZORPAY' | 'STRIPE' | 'PAYPAL';
  public is_default!: boolean;
  public is_active!: boolean;
  public credentials!: {
    razorpay?: {
      keyId: string;
      keySecret: string;
      webhookSecret: string;
    };
    stripe?: {
      publishableKey: string;
      secretKey: string;
      webhookSecret: string;
    };
    paypal?: {
      clientId: string;
      clientSecret: string;
      environment: 'sandbox' | 'production';
    };
  };
  public user_role!: 'admin' | 'owner';
  public commission_rate!: number;
  public userRole!: 'admin' | 'owner';
  public commissionRate!: number;
  public metadata?: Record<string, any>;
  public lastWebhookReceived?: Date;
}

PaymentGateway.init(
  {
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },
    user_id: { 
      type: DataTypes.UUID, 
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    gateway_type: { 
      type: DataTypes.ENUM('RAZORPAY', 'STRIPE', 'PAYPAL'), 
      allowNull: false 
    },
    is_default: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false,
      allowNull: false 
    },
    is_active: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true,
      allowNull: false 
    },
    credentials: { 
      type: DataTypes.JSON, 
      allowNull: false 
    },
    user_role: { 
      type: DataTypes.ENUM('admin', 'owner'), 
      allowNull: false 
    },
    commission_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    last_webhook_received: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "PaymentGateway",
    tableName: "payment_gateways",
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'gateway_type']
      },
      {
        fields: ['is_active']
      }
    ]
  }
);

PaymentGateway.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default PaymentGateway;
