// src/models/Owner.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

class Owner extends Model {
  public id!: number;
  public owner_id!: string;
  public userId!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public companyName!: string; // ✅ Add this
}

Owner.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    owner_id: { type: DataTypes.STRING, allowNull: true, unique: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    companyName: { type: DataTypes.STRING, allowNull: true }, // ✅ Added field
  },
  {
    sequelize,
    tableName: "owners",
    timestamps: true,
  }
);

// Associations
Owner.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Owner;
