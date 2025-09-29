"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
exports.createCustomer = createCustomer;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Customer_1 = __importDefault(require("../models/Customer"));
const User_1 = __importDefault(require("../models/User"));
const idGenerator_1 = require("../services/idGenerator");
/**
 * GET /api/customer/profile
 */
async function getProfile(req, res) {
    try {
        const auth = req.user;
        if (!auth)
            return res.status(401).json({ message: "Unauthorized" });
        const user = await User_1.default.findByPk(auth.id, {
            attributes: ["id", "name", "email", "role"],
        });
        const customer = await Customer_1.default.findOne({ where: { userId: auth.id } });
        res.json({ user, customer });
    }
    catch (err) {
        console.error("getProfile:", err);
        res.status(500).json({ message: "Failed to fetch profile" });
    }
}
/**
 * POST /api/customers
 */
async function createCustomer(req, res) {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "name, email, password required" });
        const existingUser = await User_1.default.findOne({ where: { email } });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });
        // Step 1: create user (role = customer)
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({
            name,
            email,
            password: hashedPassword,
            role: "customer",
        });
        // Step 2: create customer entry
        const customer = await Customer_1.default.create({
            userId: user.id,
            name,
            email,
            phone,
        });
        // Step 3: generate prefixed customer_id
        const customerId = (0, idGenerator_1.generatePrefixedId)("Cust", 11000, customer.id);
        customer.customer_id = customerId;
        await customer.save();
        res.status(201).json({
            customer_id: customerId,
            name,
            email,
            phone,
        });
    }
    catch (err) {
        console.error("createCustomer:", err);
        res.status(500).json({ message: "Failed to create customer" });
    }
}
