import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Booking from "./Booking";

interface PaymentAttributes {
  id: number;
  bookingId: number;
  amount: number;
  status: string;
  gatewayType: 'RAZORPAY' | 'STRIPE' | 'PAYPAL';
  gatewayPaymentId: string;
  gatewayResponse?: any;
  error?: string;
  razorpayOrderId?: string;
}

type PaymentCreation = Optional<PaymentAttributes, 
  "id" | "status" | "razorpayOrderId" | "gatewayResponse" | "error"
>;

class Payment extends Model<PaymentAttributes, PaymentCreation>
  implements PaymentAttributes {
  public id!: number;
  public bookingId!: number;
  public amount!: number;
  public status!: string;
  public gatewayType!: 'RAZORPAY' | 'STRIPE' | 'PAYPAL';
  public gatewayPaymentId!: string;
  public gatewayResponse?: any;
  public error?: string;
  public razorpayOrderId?: string;
}

Payment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "pending" },
    gatewayType: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['RAZORPAY', 'STRIPE', 'PAYPAL']]
      }
    },
    gatewayPaymentId: { type: DataTypes.STRING, allowNull: false },
    gatewayResponse: { type: DataTypes.JSON, allowNull: true },
    error: { type: DataTypes.STRING, allowNull: true },
    razorpayOrderId: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "payments",
  }
);

Payment.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });

export default Payment;
