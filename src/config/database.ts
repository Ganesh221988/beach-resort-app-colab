// src/config/database.ts
import { Sequelize } from "sequelize";
import config from "./config";

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment as keyof typeof config];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: process.env.NODE_ENV !== 'production' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
