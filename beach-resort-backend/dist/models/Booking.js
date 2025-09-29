// src/models/Booking.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Customer from "./Customer";
import Property from "./Property";
class Booking extends Model {
}
Booking.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    customerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    propertyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM("pending", "confirmed", "cancelled"), defaultValue: "pending" },
    created_at: { type: DataTypes.DATE, allowNull: true },
}, { sequelize, tableName: "bookings", timestamps: false });
Booking.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });
Customer.hasMany(Booking, { foreignKey: "customerId", as: "bookings" });
Booking.belongsTo(Property, { foreignKey: "propertyId", as: "property" });
Property.hasMany(Booking, { foreignKey: "propertyId", as: "bookings" });
export default Booking;
