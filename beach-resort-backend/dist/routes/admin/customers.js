// src/routes/admin/customers.ts
import { Router } from "express";
import { listCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer, } from "../../controllers/admin/customersController";
import { requireAuth } from "../../middleware/authMiddleware";
const router = Router();
router.get("/", requireAuth, listCustomers);
router.get("/:id", requireAuth, getCustomer);
router.post("/", requireAuth, createCustomer);
router.put("/:id", requireAuth, updateCustomer);
router.delete("/:id", requireAuth, deleteCustomer);
export default router;
