"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin/bookings.ts
const express_1 = require("express");
const bookingsController_1 = require("../../controllers/admin/bookingsController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.requireAuth, bookingsController_1.listBookings);
router.get("/:id", authMiddleware_1.requireAuth, bookingsController_1.getBooking);
router.post("/", authMiddleware_1.requireAuth, bookingsController_1.createBooking);
router.put("/:id", authMiddleware_1.requireAuth, bookingsController_1.updateBooking);
router.delete("/:id", authMiddleware_1.requireAuth, bookingsController_1.deleteBooking);
exports.default = router;
