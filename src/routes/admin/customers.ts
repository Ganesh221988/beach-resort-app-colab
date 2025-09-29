// src/routes/admin/customers.ts
import { Router } from "express";
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../controllers/admin/customersController";
import { isAuthenticated } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", isAuthenticated, listCustomers);
router.get("/:id", isAuthenticated, getCustomer);
router.post("/", isAuthenticated, createCustomer);
router.put("/:id", isAuthenticated, updateCustomer);
router.delete("/:id", isAuthenticated, deleteCustomer);

export default router;
