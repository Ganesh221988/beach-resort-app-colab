"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/payments.ts
const express_1 = require("express");
const paymentsController_1 = require("../controllers/paymentsController"); // ✅ moved out of /admin
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// -------------------- CUSTOMER ROUTES --------------------
// ✅ Customer initiates payment for a booking
router.post("/initiate", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["customer"]), paymentsController_1.createPayment);
// ✅ Customer verifies their payment (or Razorpay webhook)
router.post("/verify", paymentsController_1.verifyPayment);
// ✅ Customer can fetch their payments for a booking
router.get("/booking/:bookingId", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["customer"]), paymentsController_1.getPaymentsByBooking);
// -------------------- ADMIN ROUTES --------------------
// ✅ Admin can see all payments
router.get("/all", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["admin"]), paymentsController_1.getAllPayments);
exports.default = router;
