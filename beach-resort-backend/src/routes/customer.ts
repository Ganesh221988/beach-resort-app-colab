// src/routes/customer.ts
import { Router } from "express";
import { getMyBookings } from "../controllers/customerController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// Only accessible by authenticated customer
router.get("/bookings", requireAuth, getMyBookings);

export default router;
