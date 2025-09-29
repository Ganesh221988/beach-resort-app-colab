// src/models/Property.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Owner from "./Owner";
class Property extends Model {
}
Property.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    ownerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: true },
}, { sequelize, tableName: "properties", timestamps: false });
Property.belongsTo(Owner, { foreignKey: "ownerId", as: "owner" });
Owner.hasMany(Property, { foreignKey: "ownerId", as: "properties" });
export default Property;
