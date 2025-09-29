import { Router, Request, Response, NextFunction } from 'express';
import { isAuthenticated } from '../middleware/authMiddleware';
import {
  getCommissions,
  getCommissionById,
  createCommission,
  updateCommission,
  deleteCommission,
  getCommissionsByBroker,
  getCommissionStats,
  getOwnerCommissions,
  markCommissionPaid
} from '../controllers/commissionController';
import { isAdmin, isOwner, isBroker } from '../middleware/roleMiddleware';
import { AuthenticatedRequest } from '../types/express';

const router = Router();

// Admin routes
router.get('/stats', isAuthenticated, isAdmin, getCommissionStats);
router.get('/admin', isAuthenticated, isAdmin, getCommissions);
router.post('/', isAuthenticated, isAdmin, createCommission);
router.get('/admin/:id', isAuthenticated, isAdmin, getCommissionById);
router.put('/admin/:id', isAuthenticated, isAdmin, updateCommission);
router.delete('/admin/:id', isAuthenticated, isAdmin, deleteCommission);

// Broker routes
router.get('/broker/:brokerId', isAuthenticated, isBroker, getCommissionsByBroker);
router.get('/broker/:brokerId/stats', isAuthenticated, isBroker, getCommissionStats);

// Owner routes
router.get('/owner', isAuthenticated, isOwner, getOwnerCommissions);
router.put('/owner/:commissionId/pay', isAuthenticated, isOwner, markCommissionPaid);

export default router;
