"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllGateways = exports.deleteGateway = exports.getGateway = exports.addOrUpdateGateway = void 0;
const PaymentGateway_1 = __importDefault(require("../models/PaymentGateway"));
// -------------------- ADD / UPDATE PAYMENT GATEWAY --------------------
const addOrUpdateGateway = async (req, res) => {
    try {
        const { razorpayKeyId, razorpayKeySecret } = req.body;
        const userId = req.user?.id;
        const role = req.user?.role;
        if (!razorpayKeyId || !razorpayKeySecret) {
            return res.status(400).json({ error: "Both keyId and keySecret are required" });
        }
        // check if exists
        let gateway = await PaymentGateway_1.default.findOne({ where: { userId, role } });
        if (gateway) {
            gateway.razorpayKeyId = razorpayKeyId;
            gateway.razorpayKeySecret = razorpayKeySecret;
            await gateway.save();
            return res.json({ message: "Payment gateway updated successfully", gateway });
        }
        // create new
        gateway = await PaymentGateway_1.default.create({ userId, role, razorpayKeyId, razorpayKeySecret });
        res.status(201).json({ message: "Payment gateway added successfully", gateway });
    }
    catch (err) {
        console.error("Error in addOrUpdateGateway:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.addOrUpdateGateway = addOrUpdateGateway;
// -------------------- GET PAYMENT GATEWAY --------------------
const getGateway = async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        const gateway = await PaymentGateway_1.default.findOne({ where: { userId, role } });
        if (!gateway)
            return res.status(404).json({ error: "Payment gateway not found" });
        res.json({ gateway });
    }
    catch (err) {
        console.error("Error in getGateway:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getGateway = getGateway;
// -------------------- DELETE PAYMENT GATEWAY --------------------
const deleteGateway = async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        const gateway = await PaymentGateway_1.default.findOne({ where: { userId, role } });
        if (!gateway)
            return res.status(404).json({ error: "Payment gateway not found" });
        await gateway.destroy();
        res.json({ message: "Payment gateway deleted successfully" });
    }
    catch (err) {
        console.error("Error in deleteGateway:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.deleteGateway = deleteGateway;
// -------------------- LIST ALL GATEWAYS (ADMIN ONLY) --------------------
const listAllGateways = async (_req, res) => {
    try {
        const gateways = await PaymentGateway_1.default.findAll();
        res.json({ gateways });
    }
    catch (err) {
        console.error("Error in listAllGateways:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.listAllGateways = listAllGateways;
