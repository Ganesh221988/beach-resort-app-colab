"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentsByBooking = exports.verifyPayment = exports.createPayment = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const Payment_1 = __importDefault(require("../../models/Payment"));
const Booking_1 = __importDefault(require("../../models/Booking"));
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});
// ✅ Create a new payment order
const createPayment = async (req, res) => {
    try {
        const { bookingId, amount } = req.body;
        if (!bookingId || !amount) {
            return res.status(400).json({ message: "Booking ID and amount are required" });
        }
        const booking = await Booking_1.default.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        const options = {
            amount: amount * 100, // amount in paise
            currency: "INR",
            receipt: `receipt_${bookingId}_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        const payment = await Payment_1.default.create({
            bookingId,
            amount,
            status: "pending",
            razorpayOrderId: order.id,
        });
        res.json({ order, payment });
    }
    catch (err) {
        console.error("Error creating payment:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.createPayment = createPayment;
// ✅ Verify payment & update DB
const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, status } = req.body;
        const payment = await Payment_1.default.findOne({ where: { razorpayOrderId } });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        payment.status = status; // e.g., "success" / "failed"
        await payment.save();
        res.json({ message: "Payment updated successfully", payment });
    }
    catch (err) {
        console.error("Error verifying payment:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.verifyPayment = verifyPayment;
// ✅ Get payments for a booking
const getPaymentsByBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const payments = await Payment_1.default.findAll({ where: { bookingId } });
        res.json(payments);
    }
    catch (err) {
        console.error("Error fetching payments:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.getPaymentsByBooking = getPaymentsByBooking;
