"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin/bookings.ts
const express_1 = require("express");
const bookingsController_1 = require("../../controllers/bookingsController");
const router = (0, express_1.Router)();
// Admin/Owner view all bookings
router.get("/", bookingsController_1.listBookings);
// Get single booking
router.get("/:id", bookingsController_1.getBooking);
// Update booking status
router.patch("/:id/status", bookingsController_1.updateBookingStatus);
exports.default = router;
