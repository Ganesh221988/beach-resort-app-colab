"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markCommissionPaid = exports.getOwnerCommissions = void 0;
const Commission_1 = __importDefault(require("../models/Commission"));
const User_1 = __importDefault(require("../models/User"));
const getOwnerCommissions = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const commissions = await Commission_1.default.findAll({
            where: { ownerId },
            include: [{ model: User_1.default, as: "broker", attributes: ["id", "name", "email"] }],
        });
        res.json(commissions);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch commissions" });
    }
};
exports.getOwnerCommissions = getOwnerCommissions;
const markCommissionPaid = async (req, res) => {
    try {
        const { commissionId } = req.params;
        const commission = await Commission_1.default.findByPk(commissionId);
        if (!commission)
            return res.status(404).json({ error: "Commission not found" });
        commission.status = "paid";
        await commission.save();
        res.json({ message: "Commission marked as paid", commission });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update commission" });
    }
};
exports.markCommissionPaid = markCommissionPaid;
