import { Router } from 'express';
import {
  checkAvailability,
  getAvailabilityCalendar,
  updatePropertyAvailability
} from '../controllers/availabilityController';
import { isAuthenticated } from '../middleware/authMiddleware';
import { isOwner } from '../middleware/roleMiddleware';

const router = Router();

// Public routes
router.post('/check', checkAvailability);
router.get('/:propertyId/:year/:month', getAvailabilityCalendar);

// Protected routes - only property owners can block dates
router.put('/:propertyId', isAuthenticated, isOwner, updatePropertyAvailability);

export default router;
