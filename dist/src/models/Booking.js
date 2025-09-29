"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Booking.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Property_1 = __importDefault(require("./Property"));
const User_1 = __importDefault(require("./User"));
class Booking extends sequelize_1.Model {
}
Booking.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    propertyId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    customerId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    startDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    totalAmount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
    },
}, {
    sequelize: database_1.default,
    modelName: "Booking",
    tableName: "bookings",
    timestamps: true,
});
// 🔗 Associations
Booking.belongsTo(Property_1.default, { foreignKey: "propertyId", as: "property" });
Booking.belongsTo(User_1.default, { foreignKey: "customerId", as: "customer" });
exports.default = Booking;
