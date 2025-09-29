import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Booking from "./Booking";
class Commission extends Model {
}
Commission.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: false },
    brokerId: { type: DataTypes.INTEGER, allowNull: true },
    mode: { type: DataTypes.ENUM("percentage", "flat"), allowNull: false },
    value: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM("requested", "approved", "rejected", "paid"), allowNull: false, defaultValue: "requested" }
}, { sequelize, modelName: "Commission", tableName: "commissions" });
Booking.hasMany(Commission, { foreignKey: "bookingId", as: "commissions" });
Commission.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });
export default Commission;
