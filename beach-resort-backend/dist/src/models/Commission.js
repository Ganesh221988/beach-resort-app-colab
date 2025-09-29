"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Booking_1 = __importDefault(require("./Booking"));
class Commission extends sequelize_1.Model {
}
Commission.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bookingId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    brokerId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    mode: { type: sequelize_1.DataTypes.ENUM("percentage", "flat"), allowNull: false },
    value: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM("requested", "approved", "rejected", "paid"), allowNull: false, defaultValue: "requested" }
}, { sequelize: database_1.default, modelName: "Commission", tableName: "commissions" });
Booking_1.default.hasMany(Commission, { foreignKey: "bookingId", as: "commissions" });
Commission.belongsTo(Booking_1.default, { foreignKey: "bookingId", as: "booking" });
exports.default = Commission;
