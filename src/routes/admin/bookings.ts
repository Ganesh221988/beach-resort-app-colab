// src/routes/admin/bookings.ts
import { Router } from "express";
import {
  listBookings,
  getBooking,
  updateBooking,
} from "../../controllers/admin/bookingsController";

const router = Router();

// Admin/Owner view all bookings
router.get("/", listBookings);

// Get single booking
router.get("/:id", getBooking);

// Update booking
router.patch("/:id", updateBooking);

export default router;
