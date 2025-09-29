"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Property extends sequelize_1.Model {
}
Property.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    location: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    price: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
    ownerId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
}, {
    sequelize: database_1.default,
    tableName: "properties",
    modelName: "Property",
    timestamps: true,
});
exports.default = Property; // ✅ must be default
