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
    owner_id: { type: sequelize_1.DataTypes.STRING, allowNull: true, unique: true },
    userId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    companyName: { type: sequelize_1.DataTypes.STRING, allowNull: true }, // ✅ Added field
}, {
    sequelize: database_1.default,
    tableName: "owners",
    timestamps: true,
});
// Associations
Owner.belongsTo(User_1.default, { foreignKey: "userId", as: "user" });
exports.default = Owner;
