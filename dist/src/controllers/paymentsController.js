"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGetAllPayments = exports.getPaymentsByBooking = exports.verifyPayment = exports.createPayment = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const payment_1 = __importDefault(require("../../models/payment"));
const Booking_1 = __importDefault(require("../../models/Booking"));
const Property_1 = __importDefault(require("../../models/Property"));
const User_1 = __importDefault(require("../../models/User"));
const PaymentGateway_1 = __importDefault(require("../../models/PaymentGateway"));
// ✅ Create Payment Order (Customer → Owner)
const createPayment = async (req, res) => {
    try {
        const { bookingId, amount } = req.body;
        const userId = req.user?.id;
        const booking = await Booking_1.default.findByPk(bookingId, { include: [Property_1.default] });
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });
        const property = booking.get("Property");
        if (!property)
            return res.status(404).json({ message: "Property not found" });
        // ✅ Get owner’s payment gateway
        const owner = await User_1.default.findByPk(property.ownerId);
        if (!owner)
            return res.status(404).json({ message: "Owner not found" });
        const gateway = await PaymentGateway_1.default.findOne({ where: { userId: owner.id } });
        if (!gateway)
            return res.status(400).json({ message: "Owner has not set up a payment gateway" });
        const razorpay = new razorpay_1.default({
            key_id: gateway.razorpayKeyId,
            key_secret: gateway.razorpayKeySecret,
        });
        const order = await razorpay.orders.create({
            amount: amount * 100, // Razorpay works in paise
            currency: "INR",
            receipt: `booking_${bookingId}_${Date.now()}`,
        });
        const payment = await payment_1.default.create({
            bookingId,
            amount,
            status: "pending",
            razorpayOrderId: order.id,
        });
        res.json({ order, payment });
    }
    catch (err) {
        console.error("Error in createPayment:", err);
        res.status(500).json({ message: "Failed to initiate payment" });
    }
};
exports.createPayment = createPayment;
// ✅ Verify Razorpay Payment (Webhook or client)
const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, status } = req.body;
        const payment = await payment_1.default.findOne({ where: { razorpayOrderId } });
        if (!payment)
            return res.status(404).json({ message: "Payment not found" });
        payment.status = status === "captured" ? "success" : "failed";
        await payment.save();
        // ✅ If broker exists, create commission entry as "pending"
        const booking = await Booking_1.default.findByPk(payment.bookingId, { include: [Property_1.default] });
        if (booking) {
            const property = booking.get("Property");
            if (property?.brokerId) {
                await payment_1.default.create({
                    bookingId: booking.id,
                    amount: property.commission || 0,
                    status: "pending",
                    razorpayOrderId: null, // owner pays broker manually later
                });
            }
        }
        res.json({ message: "Payment updated", payment });
    }
    catch (err) {
        console.error("Error in verifyPayment:", err);
        res.status(500).json({ message: "Failed to verify payment" });
    }
};
exports.verifyPayment = verifyPayment;
// ✅ Get all payments for a booking
const getPaymentsByBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const payments = await payment_1.default.findAll({
            where: { bookingId },
            include: [{ model: Booking_1.default, include: [Property_1.default] }],
        });
        res.json(payments);
    }
    catch (err) {
        console.error("Error in getPaymentsByBooking:", err);
        res.status(500).json({ message: "Failed to fetch payments" });
    }
};
exports.getPaymentsByBooking = getPaymentsByBooking;
// ✅ Admin Override - View all payments
const adminGetAllPayments = async (req, res) => {
    try {
        const payments = await payment_1.default.findAll({
            include: [{ model: Booking_1.default, include: [Property_1.default] }],
        });
        res.json(payments);
    }
    catch (err) {
        console.error("Error in adminGetAllPayments:", err);
        res.status(500).json({ message: "Failed to fetch all payments" });
    }
};
exports.adminGetAllPayments = adminGetAllPayments;
