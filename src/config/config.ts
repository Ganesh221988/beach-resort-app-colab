import dotenv from "dotenv";
dotenv.config();

const DB_NAME = process.env.DB_NAME || "beach_resort";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = Number(process.env.DB_PORT || 3306);


export interface SocialMediaConfig {
  facebook: {
    appId: string;
    appSecret: string;
    callbackUrl: string;
  };
  instagram: {
    appId: string;
    appSecret: string;
    callbackUrl: string;
  };
}

export interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: "mysql";
  socialMedia?: SocialMediaConfig;
}

const config: {
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
} = {
  development: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    socialMedia: {
      facebook: {
        appId: process.env.FACEBOOK_APP_ID || "",
        appSecret: process.env.FACEBOOK_APP_SECRET || "",
        callbackUrl: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:3000/api/social/facebook/callback"
      },
      instagram: {
        appId: process.env.INSTAGRAM_APP_ID || "",
        appSecret: process.env.INSTAGRAM_APP_SECRET || "",
        callbackUrl: process.env.INSTAGRAM_CALLBACK_URL || "http://localhost:3000/api/social/instagram/callback"
      }
    }
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
    dialect: "mysql",
    socialMedia: {
      facebook: {
        appId: process.env.PROD_FACEBOOK_APP_ID || "",
        appSecret: process.env.PROD_FACEBOOK_APP_SECRET || "",
        callbackUrl: process.env.PROD_FACEBOOK_CALLBACK_URL || "https://your-domain.com/api/social/facebook/callback"
      },
      instagram: {
        appId: process.env.PROD_INSTAGRAM_APP_ID || "",
        appSecret: process.env.PROD_INSTAGRAM_APP_SECRET || "",
        callbackUrl: process.env.PROD_INSTAGRAM_CALLBACK_URL || "https://your-domain.com/api/social/instagram/callback"
      }
    }
  }
};

export default config;
