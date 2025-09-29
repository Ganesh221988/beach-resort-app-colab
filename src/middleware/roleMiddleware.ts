import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';

export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};

export const isOwner = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user || user.role !== 'owner') {
    return res.status(403).json({ error: 'Forbidden: Owner access required' });
  }
  next();
};

export const isBroker = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user || user.role !== 'broker') {
    return res.status(403).json({ error: 'Forbidden: Broker access required' });
  }
  next();
};
