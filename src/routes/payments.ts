// src/routes/payments.ts
import { Router } from "express";
import {
  createPayment,
  verifyPayment,
  getPaymentsByBooking,
  getAllPayments
} from "../controllers/paymentsController";
import { isAuthenticated, authorize } from "../middleware/authMiddleware";

const router = Router();

// -------------------- CUSTOMER ROUTES --------------------
// Customer initiates payment for a booking
router.post(
  "/initiate",
  isAuthenticated,
  authorize(["customer"]),
  createPayment
);

// Customer verifies their payment (or Razorpay webhook)
router.post("/verify", verifyPayment);

// Customer can fetch their payments for a booking
router.get(
  "/booking/:bookingId",
  isAuthenticated,
  authorize(["customer"]),
  getPaymentsByBooking
);

// -------------------- ADMIN ROUTES --------------------
// Admin can see all payments
router.get(
  "/all",
  isAuthenticated,
  authorize(["admin"]),
  getAllPayments
);

export default router;
