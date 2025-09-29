"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCustomers = listCustomers;
exports.getCustomer = getCustomer;
exports.createCustomer = createCustomer;
exports.updateCustomer = updateCustomer;
exports.deleteCustomer = deleteCustomer;
const Customer_1 = __importDefault(require("../../models/Customer"));
const User_1 = __importDefault(require("../../models/User"));
async function listCustomers(req, res) {
    try {
        const customers = await Customer_1.default.findAll({ include: [{ model: User_1.default, as: "user", attributes: ["id", "name", "email"] }] });
        res.json(customers);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch customers" });
    }
}
async function getCustomer(req, res) {
    try {
        const c = await Customer_1.default.findByPk(req.params.id, { include: [{ model: User_1.default, as: "user" }] });
        if (!c)
            return res.status(404).json({ message: "Customer not found" });
        res.json(c);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get customer" });
    }
}
async function createCustomer(req, res) {
    try {
        const { name, email, password, phone, address } = req.body;
        const existing = await User_1.default.findOne({ where: { email } });
        if (existing)
            return res.status(400).json({ message: "Email already used" });
        // create user record
        const bcrypt = await Promise.resolve().then(() => __importStar(require("bcryptjs")));
        const hashed = await bcrypt.hash(password, 10);
        const user = await User_1.default.create({ name, email, password: hashed, role: "customer" });
        const customer = await Customer_1.default.create({ userId: user.id, phone, address });
        res.status(201).json(customer);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create customer" });
    }
}
async function updateCustomer(req, res) {
    try {
        const customer = await Customer_1.default.findByPk(req.params.id);
        if (!customer)
            return res.status(404).json({ message: "Customer not found" });
        // update allowed fields on customer table
        await customer.update(req.body);
        // optionally update user info if passed
        if (req.body.name || req.body.email) {
            const user = await User_1.default.findByPk(customer.userId);
            if (user) {
                await user.update({ name: req.body.name || user.name, email: req.body.email || user.email });
            }
        }
        res.json(customer);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update customer" });
    }
}
async function deleteCustomer(req, res) {
    try {
        const customer = await Customer_1.default.findByPk(req.params.id);
        if (!customer)
            return res.status(404).json({ message: "Customer not found" });
        // delete associated user as well (optional)
        await User_1.default.destroy({ where: { id: customer.userId } });
        await customer.destroy();
        res.json({ message: "Customer deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete customer" });
    }
}
