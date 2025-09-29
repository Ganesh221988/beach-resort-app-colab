// src/models/Booking.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Property from "./Property";
import User from "./User";

interface BookingAttributes {
  id: string;
  bookingId: string;
  propertyId: string;
  customerId: string;
  brokerId?: string;
  startDate: Date;
  endDate: Date;
  checkIn: Date;  // Alias for startDate
  checkOut: Date; // Alias for endDate
  isHourlyBooking: boolean;
  totalAmount: number;
  baseAmount: number;
  brokerMarkup?: number;
  numberOfGuests: number;
  eventType?: string;
  specialRequests?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CASH_ON_HAND';
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  commissionStatus?: 'PENDING' | 'PAID';
  commissionAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookingCreationAttributes = Optional<BookingAttributes, 
  "id" | "bookingId" | "status" | "paymentStatus" | "createdAt" | "updatedAt" | 
  "brokerId" | "brokerMarkup" | "commissionStatus" | "commissionAmount"
>;

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: string;
  public bookingId!: string;
  public propertyId!: string;
  public customerId!: string;
  public brokerId?: string;
  public startDate!: Date;
  public endDate!: Date;

  // Virtual getters/setters for checkIn/checkOut aliases
  get checkIn(): Date {
    return this.startDate;
  }

  set checkIn(value: Date) {
    this.startDate = value;
  }

  get checkOut(): Date {
    return this.endDate;
  }

  set checkOut(value: Date) {
    this.endDate = value;
  }

  public isHourlyBooking!: boolean;
  public totalAmount!: number;
  public baseAmount!: number;
  public brokerMarkup?: number;
  public numberOfGuests!: number;
  
  // Eager loaded associations
  public property?: Property;
  public eventType?: string;
  public specialRequests?: string;
  public status!: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  public paymentStatus!: 'PENDING' | 'PAID' | 'FAILED' | 'CASH_ON_HAND';
  public paymentId?: string;
  public razorpayOrderId?: string;
  public razorpayPaymentId?: string;
  public commissionStatus?: 'PENDING' | 'PAID';
  public commissionAmount?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Properties',
        key: 'id',
      },
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    brokerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('startDate');
      },
      set(value: Date) {
        this.setDataValue('startDate', value);
      }
    },
    checkOut: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('endDate');
      },
      set(value: Date) {
        this.setDataValue('endDate', value);
      }
    },
    isHourlyBooking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    baseAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    brokerMarkup: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    numberOfGuests: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eventType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    paymentStatus: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'CASH_ON_HAND'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpayPaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    commissionStatus: {
      type: DataTypes.ENUM('PENDING', 'PAID'),
      allowNull: true,
    },
    commissionAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Booking",
    tableName: "bookings",
    timestamps: true,
  }
);

// 🔗 Associations
Booking.belongsTo(Property, { foreignKey: "propertyId", as: "property" });
Booking.belongsTo(User, { foreignKey: "customerId", as: "customer" });

export default Booking;
