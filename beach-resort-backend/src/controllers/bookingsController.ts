// src/controllers/bookingController.ts
import { Request, Response } from "express";
import Booking from "../models/Booking";
import Property from "../models/Property";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

// ----------------- OWNER BOOKINGS -----------------
export const getOwnerBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "owner") return res.status(403).json({ message: "Forbidden" });

    // Get all properties for this owner
    const properties = await Property.findAll({ where: { ownerId: req.user.id } });
    const propertyIds = properties.map(p => p.id);

    // Get bookings for these properties
    const bookings = await Booking.findAll({
      where: { propertyId: propertyIds },
      include: [
        { model: Property },
        { model: User, as: "customer", attributes: ["id", "name", "email"] }
      ],
      order: [["date", "DESC"]],
    });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching owner bookings:", err);
    res.status(500).json({ message: "Failed to fetch owner bookings" });
  }
};

// ----------------- CUSTOMER BOOKINGS -----------------
export const getCustomerBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "customer") return res.status(403).json({ message: "Forbidden" });

    const bookings = await Booking.findAll({
      where: { customerId: req.user.id },
      include: [
        { model: Property },
        { model: User, as: "customer", attributes: ["id", "name", "email"] }
      ],
      order: [["date", "DESC"]],
    });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching customer bookings:", err);
    res.status(500).json({ message: "Failed to fetch customer bookings" });
  }
};
