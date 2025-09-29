"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// beach-resort-backend/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
// -------------------- ROUTES --------------------
const auth_1 = __importDefault(require("./src/routes/auth"));
const admin_1 = __importDefault(require("./src/routes/admin"));
const properties_1 = __importDefault(require("./src/routes/properties"));
const bookings_1 = __importDefault(require("./src/routes/bookings"));
const owner_1 = __importDefault(require("./src/routes/owner"));
const customer_1 = __importDefault(require("./src/routes/customer"));
const payments_1 = __importDefault(require("./src/routes/payments"));
const paymentGateway_1 = __importDefault(require("./src/routes/paymentGateway")); // NEW
// -------------------- MIDDLEWARE --------------------
const authMiddleware_1 = require("./src/middleware/authMiddleware");
// Database
const database_1 = __importDefault(require("./src/config/database"));
require("./src/models"); // load all models and associations
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// -------------------- MIDDLEWARES --------------------
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
// -------------------- HEALTH CHECK --------------------
app.get("/", (_req, res) => {
    res.json({ message: "Beach Resort Backend is up" });
});
// -------------------- API ROUTES --------------------
app.use("/api/auth", auth_1.default);
app.use("/api/properties", properties_1.default);
app.use("/api/bookings", bookings_1.default);
app.use("/api/owner", owner_1.default);
app.use("/api/customer", customer_1.default);
app.use("/api/admin", admin_1.default);
app.use("/api/payments", payments_1.default);
app.use("/api/payment-gateway", paymentGateway_1.default); // NEW
// Example protected route for testing JWT and role middleware
app.get("/api/admin/profile", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["admin"]), (req, res) => {
    res.json({ message: "Admin profile access granted ✅", user: req.user });
});
// -------------------- STATIC FILES --------------------
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "public")));
// -------------------- GLOBAL ERROR HANDLER --------------------
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});
// -------------------- START SERVER --------------------
(async () => {
    try {
        await database_1.default.authenticate();
        console.log("✅ Database connected successfully");
        // Optional: sync models in dev — comment out in production
        if (process.env.NODE_ENV !== "production") {
            await database_1.default.sync({ alter: true });
            console.log("✅ Sequelize models synced (alter:true).");
        }
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Unable to connect to the database:", error);
        process.exit(1);
    }
})();
