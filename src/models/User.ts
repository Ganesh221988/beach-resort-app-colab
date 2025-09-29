import { Model, DataTypes, CreationOptional } from "sequelize";
import sequelize from "../config/database";

export interface UserAttributes {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'owner' | 'customer' | 'broker';
  phone?: string;
  whatsapp?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  isVerified: boolean;
  customerId?: string;
  ownerId?: string;
  brokerId?: string;
  aadharNumber?: string;
  panNumber?: string;
  aadharFrontUrl?: string;
  aadharBackUrl?: string;
  panCardUrl?: string;
  businessProofUrl?: string;
  companyName?: string;
  location?: string;
  profilePhoto?: string;
  notificationPreferences: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
  };
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: CreationOptional<string>;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'owner' | 'customer' | 'broker';
  public phone?: string;
  public whatsapp?: string;
  public status!: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  public isVerified!: boolean;
  public customerId?: string;
  public ownerId?: string;
  public brokerId?: string;
  public aadharNumber?: string;
  public panNumber?: string;
  public aadharFrontUrl?: string;
  public aadharBackUrl?: string;
  public panCardUrl?: string;
  public businessProofUrl?: string;
  public companyName?: string;
  public location?: string;
  public profilePhoto?: string;
  public notificationPreferences!: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
  };
  public twoFactorSecret?: string;
  public twoFactorEnabled!: boolean;
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { 
      type: DataTypes.ENUM('admin', 'owner', 'customer', 'broker'),
      allowNull: false
    },
    phone: { type: DataTypes.STRING, allowNull: true },
    whatsapp: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BLOCKED'),
      defaultValue: 'ACTIVE',
      allowNull: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    customerId: { type: DataTypes.STRING, allowNull: true, unique: true },
    ownerId: { type: DataTypes.STRING, allowNull: true, unique: true },
    brokerId: { type: DataTypes.STRING, allowNull: true, unique: true },
    aadharNumber: { type: DataTypes.STRING, allowNull: true },
    panNumber: { type: DataTypes.STRING, allowNull: true },
    aadharFrontUrl: { type: DataTypes.STRING, allowNull: true },
    aadharBackUrl: { type: DataTypes.STRING, allowNull: true },
    panCardUrl: { type: DataTypes.STRING, allowNull: true },
    businessProofUrl: { type: DataTypes.STRING, allowNull: true },
    companyName: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    profilePhoto: { type: DataTypes.STRING, allowNull: true },
    notificationPreferences: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        email: true,
        whatsapp: false,
        sms: false
      }
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
    timestamps: true,
  }
);

export default User; // ✅ must be default
