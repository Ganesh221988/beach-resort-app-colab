// src/routes/admin/owners.ts
import { Router } from "express";
import {
  listOwners,
  getOwner,
  createOwner,
  updateOwner,
  deleteOwner,
} from "../../controllers/admin/ownersController";
import { requireAuth } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", requireAuth, listOwners);
router.get("/:id", requireAuth, getOwner);
router.post("/", requireAuth, createOwner);
router.put("/:id", requireAuth, updateOwner);
router.delete("/:id", requireAuth, deleteOwner);

export default router;
