// src/routes/admin/bookings.ts
import { Router } from "express";
import { listBookings, getBooking, createBooking, updateBooking, deleteBooking, } from "../../controllers/admin/bookingsController";
import { requireAuth } from "../../middleware/authMiddleware";
const router = Router();
router.get("/", requireAuth, listBookings);
router.get("/:id", requireAuth, getBooking);
router.post("/", requireAuth, createBooking);
router.put("/:id", requireAuth, updateBooking);
router.delete("/:id", requireAuth, deleteBooking);
export default router;
