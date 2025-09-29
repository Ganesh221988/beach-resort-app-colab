"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBookings = listBookings;
exports.getBooking = getBooking;
exports.createBooking = createBooking;
exports.updateBooking = updateBooking;
exports.deleteBooking = deleteBooking;
const Booking_1 = __importDefault(require("../../models/Booking"));
async function listBookings(req, res) {
    try {
        const bookings = await Booking_1.default.findAll();
        res.json(bookings);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
}
async function getBooking(req, res) {
    try {
        const b = await Booking_1.default.findByPk(req.params.id);
        if (!b)
            return res.status(404).json({ message: "Booking not found" });
        res.json(b);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get booking" });
    }
}
async function createBooking(req, res) {
    try {
        const booking = await Booking_1.default.create(req.body);
        res.status(201).json(booking);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create booking" });
    }
}
async function updateBooking(req, res) {
    try {
        const booking = await Booking_1.default.findByPk(req.params.id);
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });
        await booking.update(req.body);
        res.json(booking);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update booking" });
    }
}
async function deleteBooking(req, res) {
    try {
        const booking = await Booking_1.default.findByPk(req.params.id);
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });
        await booking.destroy();
        res.json({ message: "Booking deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete booking" });
    }
}
