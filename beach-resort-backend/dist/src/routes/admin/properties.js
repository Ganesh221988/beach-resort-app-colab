"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin/properties.ts
const express_1 = require("express");
const propertiesController_1 = require("../../controllers/admin/propertiesController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.requireAuth, propertiesController_1.listProperties);
router.get("/:id", authMiddleware_1.requireAuth, propertiesController_1.getProperty);
router.post("/", authMiddleware_1.requireAuth, propertiesController_1.createProperty);
router.put("/:id", authMiddleware_1.requireAuth, propertiesController_1.updateProperty);
router.delete("/:id", authMiddleware_1.requireAuth, propertiesController_1.deleteProperty);
exports.default = router;
