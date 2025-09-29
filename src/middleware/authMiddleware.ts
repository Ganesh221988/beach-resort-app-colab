import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserAttributes } from '../models/User';
import { AuthenticatedRequest } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET as string;

export type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No authentication token provided' });
      return;
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    
    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    (req as AuthenticatedRequest).user = user.toJSON() as UserAttributes;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication token' });
    return;
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'You do not have permission to perform this action' 
      });
    }
    
    next();
  };
};

export const verifyOwnership = (resourceType: 'property' | 'booking') => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id: userId, role } = req.user || {};
      const resourceId = req.params.id;
      
      if (!userId || !resourceId) {
        return res.status(400).json({ error: 'Missing user ID or resource ID' });
      }

      // Admin can access all resources
      if (role === 'admin') {
        return next();
      }

      // Add resource-specific ownership checks
      // Import models
      const models = {
        Property: (await import('../models/Property')).default,
        Booking: (await import('../models/Booking')).default
      };

      switch (resourceType) {
        case 'property':
          const property = await models.Property.findByPk(resourceId);
          if (!property || property.get('ownerId') !== userId) {
            return res.status(403).json({ error: 'You do not own this property' });
          }
          break;

        case 'booking':
          const booking = await models.Booking.findOne({
            where: { id: resourceId },
            include: [{
              model: models.Property,
              as: 'property',
              required: true
            }]
          });

          if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
          }

          const hasAccess = 
            (role === 'customer' && booking.get('customerId') === userId) || 
            (role === 'owner' && booking.property && (booking.property as any).get('ownerId') === userId) ||
            (role === 'broker' && booking.get('brokerId') === userId) ||
            role === 'admin' as UserAttributes['role'];

          if (!hasAccess) {
            return res.status(403).json({ error: 'You do not have access to this booking' });
          }
          break;

        default:
          return res.status(400).json({ error: 'Invalid resource type' });
      }
      
      next();
    } catch (error) {
      console.error('Error verifying resource ownership:', error);
      return res.status(500).json({ error: 'Error verifying resource ownership' });
    }
  };
};
