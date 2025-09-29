// beach-resort-backend/server.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { Server } from 'socket.io';
import http from 'http';

// Load environment variables
dotenv.config();

// -------------------- ROUTES --------------------
import authRoutes from "./src/routes/auth";
import adminRoutes from "./src/routes/admin";
import propertiesRoutes from "./src/routes/properties";
import bookingsRoutes from "./src/routes/bookings";
import ownerRoutes from "./src/routes/owner";
import customerRoutes from "./src/routes/customer";
import paymentRoutes from "./src/routes/payments";
import paymentGatewayRoutes from "./src/routes/paymentGateway";
import webhookRoutes from "./src/routes/webhooks";
import socialRoutes from "./src/routes/social";
import availabilityRoutes from "./src/routes/availability";

// -------------------- MIDDLEWARE --------------------
import * as middleware from "./src/middleware/authMiddleware";

// Database
import sequelize from "./src/config/database";
import "./src/models"; // load all models and associations

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------- MIDDLEWARES --------------------
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// -------------------- HEALTH CHECK --------------------
app.get("/", (_req, res) => {
  res.json({ message: "Beach Resort Backend is up" });
});

// -------------------- API ROUTES --------------------
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/payment-gateway", middleware.isAuthenticated as express.RequestHandler, middleware.authorize(["admin"]) as express.RequestHandler, paymentGatewayRoutes);

// Webhook routes - no authentication required but protected by gateway-specific signatures
app.use("/api/webhooks", webhookRoutes);

// Example protected route for testing JWT and role middleware
app.get(
  "/api/admin/profile",
  middleware.isAuthenticated as express.RequestHandler,
  middleware.authorize(["admin"]) as express.RequestHandler,
  (req, res) => {
    res.json({ message: "Admin profile access granted ✅", user: (req as any).user });
  }
);

// -------------------- STATIC FILES --------------------
app.use("/public", express.static(path.join(__dirname, "public")));

// -------------------- GLOBAL ERROR HANDLER --------------------
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// -------------------- START SERVER --------------------
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Optional: sync models in dev — comment out in production
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
      console.log("✅ Sequelize models synced (alter:true).");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
})();
