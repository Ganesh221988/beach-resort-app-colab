// src/routes/owner.ts
import { Router } from "express";
import { createPropertyForOwner, listOwnerProperties, getOwnerBookingRequests } from "../controllers/ownerController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// Owner-only endpoints
router.post("/properties", requireAuth, createPropertyForOwner);
router.get("/properties", requireAuth, listOwnerProperties);

// Get booking requests for owner's properties
router.get("/bookings", requireAuth, getOwnerBookingRequests);

export default router;
