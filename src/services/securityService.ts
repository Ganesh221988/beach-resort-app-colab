import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import User from '../models/User';

// Rate limiting middleware
export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  max: number = 100 // limit each IP to 100 requests per windowMs
) => {
  return rateLimit({
    windowMs,
    max,
    message: 'Too many requests from this IP, please try again later'
  });
};

// Two-factor authentication
export class TwoFactorAuth {
  // Generate secret key for user
  static async generateSecret(userId: string) {
    const secret = speakeasy.generateSecret({
      name: 'Beach Resort App'
    });

    await User.update(
      { twoFactorSecret: secret.base32 },
      { where: { id: userId } }
    );

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl
    };
  }

  // Verify 2FA token
  static async verifyToken(userId: string, token: string) {
    const user = await User.findByPk(userId);
    if (!user?.twoFactorSecret) return false;

    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });
  }
}

// Security headers middleware
export const securityHeaders = (_req: Request, res: Response, next: NextFunction) => {
  // HTTP Strict Transport Security
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  next();
};

// Security audit logging
export class SecurityAuditLogger {
  static async logLoginAttempt(userId: string, success: boolean, ip: string) {
    // Implement logging to database or external service
    console.log(`Login attempt - User: ${userId}, Success: ${success}, IP: ${ip}`);
  }

  static async logSensitiveAction(userId: string, action: string, details: any) {
    // Implement logging to database or external service
    console.log(`Sensitive action - User: ${userId}, Action: ${action}`, details);
  }
}
