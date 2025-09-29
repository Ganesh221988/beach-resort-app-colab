import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Booking from "./Booking";

export type CommissionStatus = "requested" | "approved" | "rejected" | "paid";

interface CommissionAttributes {
  id: number;
  bookingId: number;
  brokerId: number | null;
  mode: "percentage" | "flat";
  value: number;
  status: CommissionStatus;
}

type CommissionCreation = Optional<CommissionAttributes, "id" | "status" | "brokerId">;

class Commission extends Model<CommissionAttributes, CommissionCreation> implements CommissionAttributes {
  public id!: number;
  public bookingId!: number;
  public brokerId!: number | null;
  public mode!: "percentage" | "flat";
  public value!: number;
  public status!: CommissionStatus;
}

Commission.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: false },
    brokerId: { type: DataTypes.INTEGER, allowNull: true },
    mode: { type: DataTypes.ENUM("percentage", "flat"), allowNull: false },
    value: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM("requested", "approved", "rejected", "paid"), allowNull: false, defaultValue: "requested" }
  },
  { sequelize, modelName: "Commission", tableName: "commissions" }
);

Booking.hasMany(Commission, { foreignKey: "bookingId", as: "commissions" });
Commission.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });

export default Commission;
