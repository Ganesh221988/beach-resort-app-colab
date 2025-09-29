"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commissionController_1 = require("../controllers/commissionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["owner"]), commissionController_1.getOwnerCommissions);
router.put("/:commissionId/pay", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["owner"]), commissionController_1.markCommissionPaid);
exports.default = router;
