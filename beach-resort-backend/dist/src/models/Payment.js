"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Booking_1 = __importDefault(require("./Booking"));
class Payment extends sequelize_1.Model {
}
Payment.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bookingId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    amount: { type: sequelize_1.DataTypes.FLOAT, allowNull: false }, // ✅ FIX: FLOAT not BOOLEAN
    status: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: "pending" },
    razorpayOrderId: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, {
    sequelize: database_1.default,
    modelName: "Payment",
    tableName: "payments",
});
Payment.belongsTo(Booking_1.default, { foreignKey: "bookingId", as: "booking" });
exports.default = Payment;
