"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyBookings = void 0;
// src/models/Customer.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class Customer extends sequelize_1.Model {
}
Customer.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    customer_id: { type: sequelize_1.DataTypes.STRING, allowNull: true, unique: true },
    userId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    phone: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, {
    sequelize: database_1.default,
    tableName: "customers",
    timestamps: true,
});
const Booking_1 = __importDefault(require("../models/Booking"));
const Property_1 = __importDefault(require("../models/Property"));
// Get bookings for logged-in customer
const getMyBookings = async (req, res) => {
    try {
        const customerId = req.user?.id; // comes from requireAuth middleware
        if (!customerId)
            return res.status(401).json({ message: "Unauthorized" });
        const bookings = await Booking_1.default.findAll({
            where: { customerId },
            include: [{ model: Property_1.default }]
        });
        res.json(bookings);
    }
    catch (err) {
        console.error("Error fetching customer bookings:", err);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};
exports.getMyBookings = getMyBookings;
// Associations
Customer.belongsTo(User_1.default, { foreignKey: "userId", as: "user" });
exports.default = Customer;
