// src/routes/admin/bookings.ts
import { Router } from "express";
import {
  listBookings,
  getBooking,
  updateBookingStatus,
} from "../../controllers/bookingsController";

const router = Router();

// Admin/Owner view all bookings
router.get("/", listBookings);

// Get single booking
router.get("/:id", getBooking);

// Update booking status
router.patch("/:id/status", updateBookingStatus);

export default router;
