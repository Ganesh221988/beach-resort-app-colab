"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
const Booking_1 = __importDefault(require("./Booking"));
class Commission extends sequelize_1.Model {
}
Commission.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bookingId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    ownerId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    brokerId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    amount: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM("pending", "paid"), defaultValue: "pending" },
}, { sequelize: database_1.default, modelName: "Commission", tableName: "commissions" });
// Relations
Commission.belongsTo(User_1.default, { as: "owner", foreignKey: "ownerId" });
Commission.belongsTo(User_1.default, { as: "broker", foreignKey: "brokerId" });
Commission.belongsTo(Booking_1.default, { as: "booking", foreignKey: "bookingId" });
exports.default = Commission;
