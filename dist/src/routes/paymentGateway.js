"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/paymentGateway.ts
const express_1 = require("express");
const paymentGatewayController_1 = require("../controllers/paymentGatewayController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// -------------------- USER ROUTES (OWNER / BROKER) --------------------
// Add or update gateway
router.post("/", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["owner", "broker"]), paymentGatewayController_1.addOrUpdateGateway);
// Get own gateway
router.get("/", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["owner", "broker"]), paymentGatewayController_1.getGateway);
// Delete own gateway
router.delete("/", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["owner", "broker"]), paymentGatewayController_1.deleteGateway);
// -------------------- ADMIN ROUTES --------------------
// Admin can list all gateways
router.get("/all", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["admin"]), paymentGatewayController_1.listAllGateways);
exports.default = router;
