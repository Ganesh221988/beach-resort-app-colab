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
exports.listOwners = listOwners;
exports.getOwner = getOwner;
exports.createOwner = createOwner;
exports.updateOwner = updateOwner;
exports.deleteOwner = deleteOwner;
const Owner_1 = __importDefault(require("../../models/Owner"));
const User_1 = __importDefault(require("../../models/User"));
async function listOwners(req, res) {
    try {
        const owners = await Owner_1.default.findAll({ include: [{ model: User_1.default, as: "user", attributes: ["id", "name", "email"] }] });
        res.json(owners);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch owners" });
    }
}
async function getOwner(req, res) {
    try {
        const o = await Owner_1.default.findByPk(req.params.id, { include: [{ model: User_1.default, as: "user" }] });
        if (!o)
            return res.status(404).json({ message: "Owner not found" });
        res.json(o);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get owner" });
    }
}
async function createOwner(req, res) {
    try {
        const { name, email, password, companyName } = req.body;
        const existing = await User_1.default.findOne({ where: { email } });
        if (existing)
            return res.status(400).json({ message: "Email already used" });
        const bcrypt = await Promise.resolve().then(() => __importStar(require("bcryptjs")));
        const hashed = await bcrypt.hash(password, 10);
        const user = await User_1.default.create({ name, email, password: hashed, role: "owner" });
        const owner = await Owner_1.default.create({ userId: user.id, companyName });
        res.status(201).json(owner);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create owner" });
    }
}
async function updateOwner(req, res) {
    try {
        const owner = await Owner_1.default.findByPk(req.params.id);
        if (!owner)
            return res.status(404).json({ message: "Owner not found" });
        await owner.update(req.body);
        if (req.body.name || req.body.email) {
            const user = await User_1.default.findByPk(owner.userId);
            if (user)
                await user.update({ name: req.body.name || user.name, email: req.body.email || user.email });
        }
        res.json(owner);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update owner" });
    }
}
async function deleteOwner(req, res) {
    try {
        const owner = await Owner_1.default.findByPk(req.params.id);
        if (!owner)
            return res.status(404).json({ message: "Owner not found" });
        await User_1.default.destroy({ where: { id: owner.userId } });
        await owner.destroy();
        res.json({ message: "Owner deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete owner" });
    }
}
