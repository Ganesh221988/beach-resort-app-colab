"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./src/routes/auth"));
const admin_1 = __importDefault(require("./src/routes/admin")); // picks index.ts automatically
const database_1 = __importDefault(require("./src/config/database"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/admin", admin_1.default);
app.get("/", (req, res) => {
    res.send("🌴 Beach Resort API is running 🚀");
});
// Connect DB & Start Server
const PORT = process.env.PORT || 5000;
(async () => {
    try {
        await database_1.default.authenticate();
        console.log("✅ Database connected successfully");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Unable to connect to the database:", error);
        process.exit(1);
    }
})();
