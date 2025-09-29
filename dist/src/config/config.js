"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DB_NAME = process.env.DB_NAME || "beach_resort";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = Number(process.env.DB_PORT || 3306);
exports.default = {
    development: {
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        host: DB_HOST,
        port: DB_PORT,
        dialect: "mysql"
    },
    test: {
        username: DB_USER,
        password: DB_PASS,
        database: `${DB_NAME}_test`,
        host: DB_HOST,
        port: DB_PORT,
        dialect: "mysql"
    },
    production: {
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        host: DB_HOST,
        port: DB_PORT,
        dialect: "mysql"
    }
};
