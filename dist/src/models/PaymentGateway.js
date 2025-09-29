"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/PaymentGateway.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class PaymentGateway extends sequelize_1.Model {
}
PaymentGateway.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    razorpayKeyId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    razorpayKeySecret: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, {
    sequelize: database_1.default,
    modelName: "PaymentGateway",
    tableName: "payment_gateways",
});
PaymentGateway.belongsTo(User_1.default, { foreignKey: "userId", as: "user" });
exports.default = PaymentGateway;
