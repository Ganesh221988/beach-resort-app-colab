"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/customer.ts
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Only accessible by authenticated customer
router.get("/bookings", authMiddleware_1.requireAuth, customerController_1.getMyBookings);
exports.default = router;
