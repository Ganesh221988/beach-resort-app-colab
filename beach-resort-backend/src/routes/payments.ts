// src/routes/payments.ts
import { Router } from "express";
import { createPayment, verifyPayment, getPaymentsByBooking } from "../controllers/admin/paymentsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// ✅ User initiates payment
router.post("/initiate", authMiddleware, createPayment);

// ✅ Razorpay webhook or client-side verification
router.post("/verify", verifyPayment);

// ✅ Get all payments for a booking
router.get("/booking/:bookingId", authMiddleware, getPaymentsByBooking);

export default router;
