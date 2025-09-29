import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

interface PropertyAttributes {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  propertyType: 'FULL_VILLA' | 'ROOMS' | 'BOTH';
  basePrice: number;
  hourlyRate: number | null;
  maxGuests: number;
  totalRooms: number;
  confirmBeforeBooking: boolean;
  ownerId: string;
  amenities: string[];
  eventTypes: string[];
  photos: string[];
  images: string[];
  imageBlurHashes: string[];
  videoUrl: string | null;
  rating: number;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REJECTED';
  isVerified: boolean;
  isPremium: boolean;
  title: string;
  pricePerNight: number;
  keywords: string[];
  seoMetadata: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    structuredData: any;
  };
  blockedDates: string[];
}

class Property extends Model<PropertyAttributes> implements PropertyAttributes {
  public id!: string;
  public propertyId!: string;
  public title!: string;
  public name!: string;
  public description!: string;
  public location!: string;
  public latitude!: number;
  public longitude!: number;
  public propertyType!: 'FULL_VILLA' | 'ROOMS' | 'BOTH';
  public basePrice!: number;
  public pricePerNight!: number;
  public hourlyRate!: number | null;
  public maxGuests!: number;
  public totalRooms!: number;
  public confirmBeforeBooking!: boolean;
  public ownerId!: string;
  public amenities!: string[];
  public eventTypes!: string[];
  public photos!: string[];
  public images!: string[];
  public imageBlurHashes!: string[];
  public keywords!: string[];
  public videoUrl!: string | null;
  public rating!: number;
  public status!: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REJECTED';
  public isVerified!: boolean;
  public isPremium!: boolean;
  public seoMetadata!: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    structuredData: any;
  };
  public blockedDates!: string[];
}

Property.init(
  {
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },
    propertyId: { 
      type: DataTypes.STRING,
      unique: true,
      allowNull: false 
    },
    title: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
    propertyType: { 
      type: DataTypes.ENUM('FULL_VILLA', 'ROOMS', 'BOTH'),
      allowNull: false 
    },
    basePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    pricePerNight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    hourlyRate: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    maxGuests: { type: DataTypes.INTEGER, allowNull: false },
    totalRooms: { type: DataTypes.INTEGER, allowNull: false },
    confirmBeforeBooking: { 
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false 
    },
    ownerId: { 
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    amenities: { 
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [] 
    },
    eventTypes: { 
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [] 
    },
    photos: { 
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [] 
    },
    images: { 
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [] 
    },
    imageBlurHashes: { 
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [] 
    },
    keywords: { 
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [] 
    },
    videoUrl: { type: DataTypes.STRING, allowNull: true },
    rating: { 
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      allowNull: false 
    },
    status: { 
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'REJECTED'),
      defaultValue: 'PENDING',
      allowNull: false 
    },
    isVerified: { 
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false 
    },
    isPremium: { 
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false 
    },
    seoMetadata: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        title: '',
        description: '',
        keywords: [],
        ogImage: '',
        structuredData: {}
      }
    },
    blockedDates: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    }
  },
  {
    sequelize,
    tableName: "properties",
    modelName: "Property",
    timestamps: true,
  }
);

export default Property; // ✅ must be default
