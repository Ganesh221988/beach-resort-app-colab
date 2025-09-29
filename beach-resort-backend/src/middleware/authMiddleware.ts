// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwt";

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing Authorization header" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid Authorization header" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded; // contains id and role (we sign them in auth)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
