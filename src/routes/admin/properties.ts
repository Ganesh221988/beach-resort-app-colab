// src/routes/admin/properties.ts
import { Router } from "express";
import {
  listProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../../controllers/admin/propertiesController";
import { isAuthenticated } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", isAuthenticated, listProperties);
router.get("/:id", isAuthenticated, getProperty);
router.post("/", isAuthenticated, createProperty);
router.put("/:id", isAuthenticated, updateProperty);
router.delete("/:id", isAuthenticated, deleteProperty);

export default router;
