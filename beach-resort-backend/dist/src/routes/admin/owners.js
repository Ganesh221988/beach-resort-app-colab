"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin/owners.ts
const express_1 = require("express");
const ownersController_1 = require("../../controllers/admin/ownersController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.requireAuth, ownersController_1.listOwners);
router.get("/:id", authMiddleware_1.requireAuth, ownersController_1.getOwner);
router.post("/", authMiddleware_1.requireAuth, ownersController_1.createOwner);
router.put("/:id", authMiddleware_1.requireAuth, ownersController_1.updateOwner);
router.delete("/:id", authMiddleware_1.requireAuth, ownersController_1.deleteOwner);
exports.default = router;
