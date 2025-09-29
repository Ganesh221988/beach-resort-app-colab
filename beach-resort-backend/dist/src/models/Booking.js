"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Booking.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Customer_1 = __importDefault(require("./Customer"));
const Property_1 = __importDefault(require("./Property"));
class Booking extends sequelize_1.Model {
}
Booking.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    customerId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    propertyId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    startDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    endDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM("pending", "confirmed", "cancelled"), defaultValue: "pending" },
    created_at: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: database_1.default, tableName: "bookings", timestamps: false });
Booking.belongsTo(Customer_1.default, { foreignKey: "customerId", as: "customer" });
Customer_1.default.hasMany(Booking, { foreignKey: "customerId", as: "bookings" });
Booking.belongsTo(Property_1.default, { foreignKey: "propertyId", as: "property" });
Property_1.default.hasMany(Booking, { foreignKey: "propertyId", as: "bookings" });
exports.default = Booking;
