"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin/index.ts
const express_1 = require("express");
const customers_1 = __importDefault(require("./customers"));
const owners_1 = __importDefault(require("./owners"));
const properties_1 = __importDefault(require("./properties"));
const bookings_1 = __importDefault(require("./bookings"));
const router = (0, express_1.Router)();
// all admin routes mounted at /api/admin/*
router.use("/customers", customers_1.default);
router.use("/owners", owners_1.default);
router.use("/properties", properties_1.default);
router.use("/bookings", bookings_1.default);
exports.default = router;
