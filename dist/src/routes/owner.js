"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/owner.ts
const express_1 = require("express");
const ownerController_1 = require("../controllers/ownerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Owner-only endpoints
router.post("/properties", authMiddleware_1.requireAuth, ownerController_1.createPropertyForOwner);
router.get("/properties", authMiddleware_1.requireAuth, ownerController_1.listOwnerProperties);
// Get booking requests for owner's properties
router.get("/bookings", authMiddleware_1.requireAuth, ownerController_1.getOwnerBookingRequests);
exports.default = router;
