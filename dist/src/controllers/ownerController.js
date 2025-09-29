"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerBookingRequests = void 0;
// Get all booking requests for properties owned by the logged-in owner
const Booking_1 = __importDefault(require("../models/Booking"));
const Property_1 = __importDefault(require("../models/Property"));
const getOwnerBookingRequests = async (req, res) => {
    try {
        const ownerId = req.user?.id; // logged-in owner
        if (!ownerId)
            return res.status(401).json({ message: "Unauthorized" });
        const bookings = await Booking_1.default.findAll({
            include: [
                {
                    model: Property_1.default,
                    where: { ownerId },
                },
            ],
        });
        res.json(bookings);
    }
    catch (err) {
        console.error("Error fetching owner bookings:", err);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};
exports.getOwnerBookingRequests = getOwnerBookingRequests;
