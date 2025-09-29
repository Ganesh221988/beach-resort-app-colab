// src/controllers/paymentsController.ts
import { Request, Response } from "express";
import Razorpay from "razorpay";
import Payment from "../models/Payment";
import Booking from "../models/Booking";
import Property from "../models/Property";
import User from "../models/User";
import PaymentGateway from "../models/PaymentGateway";

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.findAll({
      include: [{
        model: Booking,
        as: 'booking',
        include: [{
          model: Property,
          as: 'property'
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(payments);
  } catch (err) {
    console.error("getAllPayments error:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

// Create Payment Order (Customer → Owner)
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, amount } = req.body;
    const userId = req.user?.id;

    const booking = await Booking.findByPk(bookingId, { include: [Property] });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const property = booking.get("Property") as any;
    if (!property) return res.status(404).json({ message: "Property not found" });

    // ✅ Get owner’s payment gateway
    const owner = await User.findByPk(property.ownerId);
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    const gateway = await PaymentGateway.findOne({ where: { user_id: owner.id } });
    if (!gateway) return res.status(400).json({ message: "Owner has not set up a payment gateway" });

    if (!gateway.credentials?.razorpay) {
      return res.status(400).json({ message: "Owner has not set up Razorpay credentials" });
    }

    const razorpay = new Razorpay({
      key_id: gateway.credentials.razorpay.keyId,
      key_secret: gateway.credentials.razorpay.keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `booking_${bookingId}_${Date.now()}`,
    });

    const payment = await Payment.create({
      bookingId: Number(bookingId),
      amount: Number(amount),
      status: "pending",
      razorpayOrderId: order.id,
      gatewayType: "RAZORPAY",
      gatewayPaymentId: order.id // Using order ID as payment ID initially
    });

    res.json({ order, payment });
  } catch (err) {
    console.error("Error in createPayment:", err);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};

// ✅ Verify Razorpay Payment (Webhook or client)
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpayOrderId, status } = req.body;

    const payment = await Payment.findOne({ where: { razorpayOrderId } });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = status === "captured" ? "success" : "failed";
    await payment.save();

    // ✅ If broker exists, create commission entry as "pending"
    const booking = await Booking.findByPk(payment.bookingId, { include: [Property] });
    if (booking) {
      const property = booking.get("Property") as any;
      if (property?.brokerId) {
        await Payment.create({
          bookingId: Number(booking.id),
          amount: Number(property.commission || 0),
          status: "pending",
          razorpayOrderId: undefined, // owner pays broker manually later
          gatewayType: "RAZORPAY",
          gatewayPaymentId: `COMMISSION_${booking.id}_${Date.now()}`
        });
      }
    }

    res.json({ message: "Payment updated", payment });
  } catch (err) {
    console.error("Error in verifyPayment:", err);
    res.status(500).json({ message: "Failed to verify payment" });
  }
};

// ✅ Get all payments for a booking
export const getPaymentsByBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const payments = await Payment.findAll({
      where: { bookingId },
      include: [{ model: Booking, include: [Property] }],
    });

    res.json(payments);
  } catch (err) {
    console.error("Error in getPaymentsByBooking:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

// ✅ Admin Override - View all payments
export const adminGetAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.findAll({
      include: [{ model: Booking, include: [Property] }],
    });

    res.json(payments);
  } catch (err) {
    console.error("Error in adminGetAllPayments:", err);
    res.status(500).json({ message: "Failed to fetch all payments" });
  }
};
