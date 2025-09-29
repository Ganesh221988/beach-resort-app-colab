"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProperty = exports.getProperty = exports.listProperties = void 0;
const Property_1 = __importDefault(require("../models/Property"));
/**
 * ----------------- PUBLIC: List All Properties -----------------
 */
const listProperties = async (_req, res) => {
    try {
        const properties = await Property_1.default.findAll({
            order: [["createdAt", "DESC"]],
        });
        res.json(properties);
    }
    catch (err) {
        console.error("Error fetching properties:", err);
        res.status(500).json({ message: "Failed to fetch properties" });
    }
};
exports.listProperties = listProperties;
/**
 * ----------------- PUBLIC: Get Single Property -----------------
 */
const getProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property_1.default.findByPk(id);
        if (!property)
            return res.status(404).json({ message: "Property not found" });
        res.json(property);
    }
    catch (err) {
        console.error("Error fetching property:", err);
        res.status(500).json({ message: "Failed to fetch property" });
    }
};
exports.getProperty = getProperty;
/**
 * ----------------- OWNER: Create Property -----------------
 */
const createProperty = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        if (req.user.role !== "owner")
            return res.status(403).json({ message: "Forbidden: Owners only" });
        const { title, description, price, location } = req.body;
        if (!title || !price || !location) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const property = await Property_1.default.create({
            title,
            description,
            price,
            location,
            ownerId: req.user.id, // ✅ enforce ownership
        });
        res.status(201).json({ message: "Property created", property });
    }
    catch (err) {
        console.error("Error creating property:", err);
        res.status(500).json({ message: "Failed to create property" });
    }
};
exports.createProperty = createProperty;
