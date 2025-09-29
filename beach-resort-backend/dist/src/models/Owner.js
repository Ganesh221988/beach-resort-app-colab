"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Owner.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class Owner extends sequelize_1.Model {
}
Owner.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    companyName: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    created_at: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: database_1.default, tableName: "owners", timestamps: false });
Owner.belongsTo(User_1.default, { foreignKey: "userId", as: "user" });
User_1.default.hasOne(Owner, { foreignKey: "userId", as: "owner" });
exports.default = Owner;
