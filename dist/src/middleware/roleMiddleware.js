"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
function roleMiddleware(allowedRoles) {
    return (req, res, next) => {
        const user = req.user; // from authMiddleware
        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: "Forbidden: insufficient permissions" });
        }
        next();
    };
}
