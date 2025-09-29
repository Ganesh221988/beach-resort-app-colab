// src/controllers/bookingsController.ts
import { Request, Response } from "express";
import Booking from "../models/Booking";
import Property from "../models/Property";
import User from "../models/User";
import { AuthenticatedRequest } from "../types/express";

/**
 * ----------------- CUSTOMER: Create Booking -----------------
 */
export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "customer")
      return res.status(403).json({ message: "Forbidden" });

    const { propertyId, startDate, endDate, totalAmount } = req.body;

    if (!propertyId || !startDate || !endDate || !totalAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await Booking.create({
      propertyId,
      customerId: req.user.id, // ✅ force customerId from token
      startDate,
      endDate,
      checkIn: startDate,
      checkOut: endDate,
      totalAmount,
      status: "PENDING",
      isHourlyBooking: false,
      baseAmount: totalAmount,
      numberOfGuests: 1,
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

/**
 * ----------------- OWNER: Get All Bookings for Their Properties -----------------
 */
export const getOwnerBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "owner")
      return res.status(403).json({ message: "Forbidden" });

    // Get all properties for this owner
    const properties = await Property.findAll({ where: { ownerId: req.user.id } });
    const propertyIds = properties.map((p) => p.id);

    // If no properties, return empty
    if (propertyIds.length === 0) {
      return res.json([]);
    }

    const bookings = await Booking.findAll({
      where: { propertyId: propertyIds },
      include: [
        { model: Property },
        { model: User, as: "customer", attributes: ["id", "name", "email"] },
      ],
      order: [["date", "DESC"]],
    });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching owner bookings:", err);
    res.status(500).json({ message: "Failed to fetch owner bookings" });
  }
};

/**
 * ----------------- CUSTOMER: Get Own Bookings -----------------
 */
export const getCustomerBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "customer")
      return res.status(403).json({ message: "Forbidden" });

    const bookings = await Booking.findAll({
      where: { customerId: req.user.id }, // ✅ only their bookings
      include: [
        { model: Property },
        { model: User, as: "customer", attributes: ["id", "name", "email"] },
      ],
      order: [["date", "DESC"]],
    });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching customer bookings:", err);
    res.status(500).json({ message: "Failed to fetch customer bookings" });
  }
};
