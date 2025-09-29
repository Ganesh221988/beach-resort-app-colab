import express from 'express';
import * as propertiesController from '../controllers/propertiesController';
import { isAuthenticated } from '../middleware/authMiddleware';
import { queryOptimizer, indexOptimizer } from '../middleware/queryOptimizer';

const router = express.Router();

// Apply query optimizer middleware to all routes
router.use(queryOptimizer());

// Apply index optimization for commonly filtered fields
router.use(indexOptimizer(['propertyType', 'location', 'status', 'isVerified']));

// Public routes
router.get('/', propertiesController.listProperties);
router.get('/:id', propertiesController.getProperty);

// Protected routes (owner only)
router.post('/', isAuthenticated, propertiesController.createProperty);

export default router;
