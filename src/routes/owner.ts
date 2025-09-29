// src/routes/owner.ts
import { Router } from "express";
import { getOwnerBookingRequests } from "../controllers/ownerController";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = Router();

// Get booking requests for owner's properties
router.get("/bookings", isAuthenticated, getOwnerBookingRequests);

export default router;
