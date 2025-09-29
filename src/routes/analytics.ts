import { Router } from 'express';
import {
  getFinancialReport,
  getOccupancyReport,
  getRevenueForecasts
} from '../controllers/analyticsController';
import { isAuthenticated } from '../middleware/authMiddleware';
import { isAdmin, isOwner } from '../middleware/roleMiddleware';

const router = Router();

// Admin routes
router.get('/financial', isAuthenticated, isAdmin, getFinancialReport);
router.get('/occupancy', isAuthenticated, (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.role === 'owner') {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
}, getOccupancyReport);
router.get('/forecast', isAuthenticated, isAdmin, getRevenueForecasts);

export default router;
