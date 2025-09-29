"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProperties = listProperties;
exports.getProperty = getProperty;
exports.createProperty = createProperty;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;
const Property_1 = __importDefault(require("../../models/Property"));
const Owner_1 = __importDefault(require("../../models/Owner"));
const User_1 = __importDefault(require("../../models/User"));
async function listProperties(req, res) {
    try {
        const properties = await Property_1.default.findAll({
            include: [{ model: Owner_1.default, as: "owner", include: [{ model: User_1.default, as: "user", attributes: ["id", "name", "email"] }] }],
        });
        res.json(properties);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch properties" });
    }
}
async function getProperty(req, res) {
    try {
        const prop = await Property_1.default.findByPk(req.params.id, {
            include: [{ model: Owner_1.default, as: "owner", include: [{ model: User_1.default, as: "user" }] }],
        });
        if (!prop)
            return res.status(404).json({ message: "Property not found" });
        res.json(prop);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get property" });
    }
}
async function createProperty(req, res) {
    try {
        // expected: ownerId, title, location, price, description
        const data = req.body;
        const prop = await Property_1.default.create(data);
        res.status(201).json(prop);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create property" });
    }
}
async function updateProperty(req, res) {
    try {
        const prop = await Property_1.default.findByPk(req.params.id);
        if (!prop)
            return res.status(404).json({ message: "Property not found" });
        await prop.update(req.body);
        res.json(prop);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update property" });
    }
}
async function deleteProperty(req, res) {
    try {
        const prop = await Property_1.default.findByPk(req.params.id);
        if (!prop)
            return res.status(404).json({ message: "Property not found" });
        await prop.destroy();
        res.json({ message: "Property deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete property" });
    }
}
