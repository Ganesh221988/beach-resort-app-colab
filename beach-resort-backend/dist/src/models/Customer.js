"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Customer.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class Customer extends sequelize_1.Model {
}
Customer.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    phone: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    address: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    created_at: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: database_1.default, tableName: "customers", timestamps: false });
Customer.belongsTo(User_1.default, { foreignKey: "userId", as: "user" });
User_1.default.hasOne(Customer, { foreignKey: "userId", as: "customer" });
exports.default = Customer;
