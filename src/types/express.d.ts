import { Request } from 'express';
import { UserAttributes } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: UserAttributes;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes;
    }
  }
}
