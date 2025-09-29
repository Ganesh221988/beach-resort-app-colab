// src/routes/admin/owners.ts
import { Router } from "express";
import {
  listOwners,
  getOwner,
  createOwner,
  updateOwner,
  deleteOwner,
} from "../../controllers/admin/ownersController";
import { isAuthenticated } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", isAuthenticated, listOwners);
router.get("/:id", isAuthenticated, getOwner);
router.post("/", isAuthenticated, createOwner);
router.put("/:id", isAuthenticated, updateOwner);
router.delete("/:id", isAuthenticated, deleteOwner);

export default router;
