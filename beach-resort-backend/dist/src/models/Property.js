"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Property.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Owner_1 = __importDefault(require("./Owner"));
class Property extends sequelize_1.Model {
}
Property.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    ownerId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    location: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    price: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    created_at: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: database_1.default, tableName: "properties", timestamps: false });
Property.belongsTo(Owner_1.default, { foreignKey: "ownerId", as: "owner" });
Owner_1.default.hasMany(Property, { foreignKey: "ownerId", as: "properties" });
exports.default = Property;
