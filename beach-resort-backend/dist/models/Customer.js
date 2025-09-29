// src/models/Customer.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./User";
class Customer extends Model {
}
Customer.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: true },
}, { sequelize, tableName: "customers", timestamps: false });
Customer.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Customer, { foreignKey: "userId", as: "customer" });
export default Customer;
