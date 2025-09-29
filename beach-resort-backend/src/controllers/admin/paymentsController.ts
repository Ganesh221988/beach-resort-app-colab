// src/controllers/admin/paymentsController.ts
import { Request, Response } from "express";
import Razorpay from "razorpay";
import Payment from "../../models/Payment";
import Booking from "../../models/Booking";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// ✅ Create a new payment order
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ message: "Booking ID and amount are required" });
    }

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${bookingId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      bookingId,
      amount,
      status: "pending",
      razorpayOrderId: order.id,
    });

    res.json({ order, payment });
  } catch (err: any) {
    console.error("Error creating payment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Verify payment & update DB
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpayOrderId, status } = req.body;

    const payment = await Payment.findOne({ where: { razorpayOrderId } });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = status; // e.g., "success" / "failed"
    await payment.save();

    res.json({ message: "Payment updated successfully", payment });
  } catch (err: any) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get payments for a booking
export const getPaymentsByBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const payments = await Payment.findAll({ where: { bookingId } });
    res.json(payments);
  } catch (err: any) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
