"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'No token provided' });
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = decoded;
        next();
    });
};
exports.authMiddleware = authMiddleware;
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        if (!roles.includes(req.user.role))
            return res.status(403).json({ error: 'Access denied' });
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
