// src/routes/paymentGateway.ts
import { Router } from "express";
import {
  addOrUpdateGateway,
  getGateway,
  deleteGateway,
  listAllGateways,
} from "../controllers/paymentGatewayController";
import { isAuthenticated, authorize } from "../middleware/authMiddleware";

const router = Router();

// -------------------- USER ROUTES (OWNER / BROKER) --------------------
// Add or update gateway
router.post(
  "/",
  isAuthenticated,
  authorize(["owner", "broker"]),
  addOrUpdateGateway
);

// Get own gateway
router.get(
  "/",
  isAuthenticated,
  authorize(["owner", "broker"]),
  getGateway
);

// Delete own gateway
router.delete(
  "/",
  isAuthenticated,
  authorize(["owner", "broker"]),
  deleteGateway
);

// -------------------- ADMIN ROUTES --------------------
// Admin can list all gateways
router.get(
  "/all",
  isAuthenticated,
  authorize(["admin"]),
  listAllGateways
);

export default router;
