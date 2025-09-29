// src/config/database.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const DB_NAME = process.env.DB_NAME || "beach_resort";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = Number(process.env.DB_PORT || 3306);

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false,
  define: {
    underscored: true,
    timestamps: true, // ✅ better for createdAt & updatedAt tracking
  },
});

export default sequelize;
