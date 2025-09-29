import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Booking from "./Booking";
class Payment extends Model {
}
Payment.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false }, // ✅ FIX: FLOAT not BOOLEAN
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "pending" },
    razorpayOrderId: { type: DataTypes.STRING, allowNull: true },
}, {
    sequelize,
    modelName: "Payment",
    tableName: "payments",
});
Payment.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });
export default Payment;
