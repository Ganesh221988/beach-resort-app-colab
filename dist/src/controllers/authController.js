"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User")); // Sequelize User model
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
// -------------------- REGISTER --------------------
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }
        // Check if user exists
        const existingUser = await User_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await User_1.default.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        res.status(201).json({ message: "User registered successfully", user: { id: newUser.id, name, email, role } });
    }
    catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.register = register;
// -------------------- LOGIN --------------------
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Email & password required" });
        const user = await User_1.default.findOne({ where: { email } });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ error: "Invalid credentials" });
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
        // Optionally store refresh token in DB or httpOnly cookie
        res.json({ accessToken, refreshToken });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.login = login;
// -------------------- REFRESH TOKEN --------------------
const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token)
            return res.status(401).json({ error: "No token provided" });
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
            if (err)
                return res.status(403).json({ error: "Invalid token" });
            const { id, role } = decoded;
            const newAccessToken = jsonwebtoken_1.default.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
            res.json({ accessToken: newAccessToken });
        });
    }
    catch (error) {
        console.error("Refresh token error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.refreshToken = refreshToken;
