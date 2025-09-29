// server.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth";
import adminRoutes from "./src/routes/admin";
import propertiesRoutes from "./src/routes/properties";
import bookingsRoutes from "./src/routes/bookings";
import ownerRoutes from "./src/routes/owner";
import customerRoutes from "./src/routes/customer";
import paymentRoutes from "./routes/payments";

import sequelize from "./src/config/database";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

// public / customer / owner routes
app.use("/api/properties", propertiesRoutes); // GET / POST (if needed)
app.use("/api/bookings", bookingsRoutes);     // POST booking, GET booking(s)
app.use("/api/owner", ownerRoutes);           // owner-specific actions (protected)
app.use("/api/customer", customerRoutes);     // customer-specific actions (protected)

app.get("/", (req, res) => {
  res.send("🌴 Beach Resort API is running 🚀");
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
})();
