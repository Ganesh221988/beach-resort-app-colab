import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Property from "./Property";
import User from "./User";

interface BookingAttributes {
  id: number;
  propertyId: number;
  customerId: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  amount: number;
  date: Date;
}

// For creation (id auto-increment)
interface BookingCreationAttributes extends Optional<BookingAttributes, "id"> {}

class Booking extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes {
  public id!: number;
  public propertyId!: number;
  public customerId!: number;
  public status!: "pending" | "approved" | "rejected" | "cancelled";
  public amount!: number;
  public date!: Date;
}

Booking.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    propertyId: { type: DataTypes.INTEGER, allowNull: false },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "cancelled"),
      defaultValue: "pending",
    },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, modelName: "booking", tableName: "bookings" }
);

// ✅ Associations
Booking.belongsTo(Property, { foreignKey: "propertyId", as: "property" });
Booking.belongsTo(User, { foreignKey: "customerId", as: "customer" });

export default Booking;
