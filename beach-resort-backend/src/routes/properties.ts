// src/routes/properties.ts
import { Router } from "express";
import { listProperties, getProperty, createProperty } from "../controllers/propertiesController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// Public: list & detail
router.get("/", listProperties);
router.get("/:id", getProperty);

// Owner-only: create property (protected)
router.post("/", requireAuth, createProperty);

export default router;
