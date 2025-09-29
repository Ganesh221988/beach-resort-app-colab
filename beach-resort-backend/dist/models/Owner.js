// src/models/Owner.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./User";
class Owner extends Model {
}
Owner.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    companyName: { type: DataTypes.STRING, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: true },
}, { sequelize, tableName: "owners", timestamps: false });
Owner.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Owner, { foreignKey: "userId", as: "owner" });
export default Owner;
