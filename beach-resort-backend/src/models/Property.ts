import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Property extends Model {
  public id!: number;
  public name!: string;
  public location!: string;
  public price!: number;
  public ownerId!: number;
}

Property.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    ownerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    tableName: "properties",
    modelName: "Property",
    timestamps: true,
  }
);

export default Property; // ✅ must be default
