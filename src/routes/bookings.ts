// src/routes/bookings.ts
import { Router } from "express";
import {
  createBooking,
  getCustomerBookings,
  getOwnerBookings,
} from "../controllers/bookingsController";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = Router();

/**
 * -------------------- CUSTOMER ROUTES --------------------
 */
router.post("/", isAuthenticated, createBooking);

router.get(
  "/customer",
  isAuthenticated,
  getCustomerBookings
);

/**
 * -------------------- OWNER ROUTES --------------------
 */
router.get(
  "/owner",
  isAuthenticated,
  getOwnerBookings
);

/**
 * -------------------- ADMIN ROUTES --------------------
 */
router.get(
  "/",
  isAuthenticated,
  getOwnerBookings // or another admin handler if needed
);

export default router;
