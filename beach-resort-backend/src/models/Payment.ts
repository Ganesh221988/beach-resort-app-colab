import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Booking from "./Booking";

interface PaymentAttributes {
  id: number;
  bookingId: number;
  amount: number;   // ✅ Ensure this is number
  status: string;
  razorpayOrderId?: string;
}

type PaymentCreation = Optional<PaymentAttributes, "id" | "status" | "razorpayOrderId">;

class Payment extends Model<PaymentAttributes, PaymentCreation>
  implements PaymentAttributes {
  public id!: number;
  public bookingId!: number;
  public amount!: number;
  public status!: string;
  public razorpayOrderId?: string;
}

Payment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false }, // ✅ FIX: FLOAT not BOOLEAN
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "pending" },
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
