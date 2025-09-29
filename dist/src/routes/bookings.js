"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/bookings.ts
const express_1 = require("express");
const bookingsController_1 = require("../controllers/bookingsController");
const authMiddleware_1 = require("../middleware/authMiddleware"); // ✅ named import
const roleMiddleware_1 = require("../middleware/roleMiddleware"); // ✅ new file
const router = (0, express_1.Router)();
/**
 * -------------------- CUSTOMER ROUTES --------------------
 */
router.post("/", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["customer"]), bookingsController_1.createBooking);
router.get("/customer", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["customer"]), bookingsController_1.getCustomerBookings);
/**
 * -------------------- OWNER ROUTES --------------------
 */
router.get("/owner", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["owner"]), bookingsController_1.getOwnerBookings);
/**
 * -------------------- ADMIN ROUTES --------------------
 */
router.get("/", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["admin"]), async (req, res) => {
    const Booking = (await Promise.resolve().then(() => __importStar(require("../models/Booking")))).default;
    const Property = (await Promise.resolve().then(() => __importStar(require("../models/Property")))).default;
    const User = (await Promise.resolve().then(() => __importStar(require("../models/User")))).default;
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: Property },
                { model: User, as: "customer", attributes: ["id", "name", "email"] },
            ],
            order: [["createdAt", "DESC"]],
        });
        res.json(bookings);
    }
    catch (err) {
        console.error("Error fetching all bookings:", err);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});
exports.default = router;
