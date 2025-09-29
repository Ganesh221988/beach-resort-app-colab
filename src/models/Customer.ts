// src/models/Customer.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

class Customer extends Model {
  public id!: number;
  public customer_id!: string;
  public userId!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone?: string;
}

Customer.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    customer_id: { type: DataTypes.STRING, allowNull: true, unique: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: "customers",
    timestamps: true,
  }
);
// src/controllers/customerController.ts
import { Request, Response } from "express";
import Booking from "../models/Booking";
import Property from "../models/Property";

// Get bookings for logged-in customer
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id; // comes from requireAuth middleware
    if (!customerId) return res.status(401).json({ message: "Unauthorized" });

    const bookings = await Booking.findAll({
      where: { customerId },
      include: [{ model: Property }]
    });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching customer bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// Associations
Customer.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Customer;
