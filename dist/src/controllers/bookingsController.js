"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerBookings = exports.getOwnerBookings = exports.createBooking = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const Property_1 = __importDefault(require("../models/Property"));
const User_1 = __importDefault(require("../models/User"));
/**
 * ----------------- CUSTOMER: Create Booking -----------------
 */
const createBooking = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        if (req.user.role !== "customer")
            return res.status(403).json({ message: "Forbidden" });
        const { propertyId, amount, date, status } = req.body;
        if (!propertyId || !amount || !date) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const booking = await Booking_1.default.create({
            propertyId,
            customerId: req.user.id, // ✅ force customerId from token
            amount,
            date,
            status: status || "pending",
        });
        res.status(201).json({ message: "Booking created", booking });
    }
    catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).json({ message: "Failed to create booking" });
    }
};
exports.createBooking = createBooking;
/**
 * ----------------- OWNER: Get All Bookings for Their Properties -----------------
 */
const getOwnerBookings = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        if (req.user.role !== "owner")
            return res.status(403).json({ message: "Forbidden" });
        // Get all properties for this owner
        const properties = await Property_1.default.findAll({ where: { ownerId: req.user.id } });
        const propertyIds = properties.map((p) => p.id);
        // If no properties, return empty
        if (propertyIds.length === 0) {
            return res.json([]);
        }
        const bookings = await Booking_1.default.findAll({
            where: { propertyId: propertyIds },
            include: [
                { model: Property_1.default },
                { model: User_1.default, as: "customer", attributes: ["id", "name", "email"] },
            ],
            order: [["date", "DESC"]],
        });
        res.json(bookings);
    }
    catch (err) {
        console.error("Error fetching owner bookings:", err);
        res.status(500).json({ message: "Failed to fetch owner bookings" });
    }
};
exports.getOwnerBookings = getOwnerBookings;
/**
 * ----------------- CUSTOMER: Get Own Bookings -----------------
 */
const getCustomerBookings = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        if (req.user.role !== "customer")
            return res.status(403).json({ message: "Forbidden" });
        const bookings = await Booking_1.default.findAll({
            where: { customerId: req.user.id }, // ✅ only their bookings
            include: [
                { model: Property_1.default },
                { model: User_1.default, as: "customer", attributes: ["id", "name", "email"] },
            ],
            order: [["date", "DESC"]],
        });
        res.json(bookings);
    }
    catch (err) {
        console.error("Error fetching customer bookings:", err);
        res.status(500).json({ message: "Failed to fetch customer bookings" });
    }
};
exports.getCustomerBookings = getCustomerBookings;
