// src/routes/admin/index.ts
import { Router } from "express";
import customersRoutes from "./customers";
import ownersRoutes from "./owners";
import propertiesRoutes from "./properties";
import bookingsRoutes from "./bookings";
const router = Router();
// all admin routes mounted at /api/admin/*
router.use("/customers", customersRoutes);
router.use("/owners", ownersRoutes);
router.use("/properties", propertiesRoutes);
router.use("/bookings", bookingsRoutes);
export default router;
