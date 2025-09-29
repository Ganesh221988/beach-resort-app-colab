// src/routes/customer.ts
import { Router } from "express";
import { getProfile, getMyBookings } from "../controllers/customerController";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = Router();

// Only accessible by authenticated customer
router.get("/profile", isAuthenticated, getProfile);
router.get("/bookings", isAuthenticated, getMyBookings);

export default router;
