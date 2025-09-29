"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/properties.ts
const express_1 = require("express");
const propertiesController_1 = require("../controllers/propertiesController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// -------------------- CUSTOMER --------------------
router.get("/", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["customer", "owner", "admin"]), propertiesController_1.getAllProperties);
// -------------------- OWNER --------------------
router.post("/", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["owner"]), propertiesController_1.createProperty);
router.get("/owner", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["owner"]), propertiesController_1.getOwnerProperties);
router.put("/:id", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["owner"]), propertiesController_1.updateProperty);
router.delete("/:id", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["owner"]), propertiesController_1.deleteProperty);
// -------------------- ADMIN OVERRIDE --------------------
// Admin can update ANY property
router.put("/admin/:id", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["admin"]), propertiesController_1.updateProperty);
// Admin can delete ANY property
router.delete("/admin/:id", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["admin"]), propertiesController_1.deleteProperty);
exports.default = router;
