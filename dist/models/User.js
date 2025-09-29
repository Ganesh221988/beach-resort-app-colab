// src/models/User.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
class User extends Model {
}
User.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("admin", "owner", "broker", "customer"), allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: true },
}, {
    sequelize,
    tableName: "users",
    timestamps: false,
});
export default User;
