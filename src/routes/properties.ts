// src/routes/properties.ts
import { Router } from "express";
import {
  createProperty,
  listProperties,
  getProperty
} from "../controllers/propertiesController";
import { isAuthenticated, authorize } from "../middleware/authMiddleware";

const router = Router();

// -------------------- CUSTOMER --------------------
router.get("/", isAuthenticated, authorize(["customer", "owner", "admin"]), listProperties);

// -------------------- OWNER --------------------
router.post("/", isAuthenticated, authorize(["owner"]), createProperty);
// You can add more owner-specific routes here if needed

// -------------------- ADMIN OVERRIDE --------------------
// You can add admin-specific routes here if needed

export default router;
