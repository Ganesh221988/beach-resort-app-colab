"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin/customers.ts
const express_1 = require("express");
const customersController_1 = require("../../controllers/admin/customersController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.requireAuth, customersController_1.listCustomers);
router.get("/:id", authMiddleware_1.requireAuth, customersController_1.getCustomer);
router.post("/", authMiddleware_1.requireAuth, customersController_1.createCustomer);
router.put("/:id", authMiddleware_1.requireAuth, customersController_1.updateCustomer);
router.delete("/:id", authMiddleware_1.requireAuth, customersController_1.deleteCustomer);
exports.default = router;
