// src/routes/admin/properties.ts
import { Router } from "express";
import {
  listProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../../controllers/admin/propertiesController";
import { requireAuth } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", requireAuth, listProperties);
router.get("/:id", requireAuth, getProperty);
router.post("/", requireAuth, createProperty);
router.put("/:id", requireAuth, updateProperty);
router.delete("/:id", requireAuth, deleteProperty);

export default router;
