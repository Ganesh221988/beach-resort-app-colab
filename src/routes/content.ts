import { Router } from 'express';
import {
  uploadPropertyImages,
  updatePropertyContent,
  generateSEOMetadata
} from '../controllers/contentController';
import { isAuthenticated } from '../middleware/authMiddleware';
import { isAdmin, isOwner } from '../middleware/roleMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Property content management routes
router.post(
  '/:propertyId/images',
  isAuthenticated,
  isOwner,
  upload.array('images', 10),
  uploadPropertyImages
);

router.put(
  '/:propertyId/content',
  isAuthenticated,
  isOwner,
  updatePropertyContent
);

router.post(
  '/:propertyId/seo',
  isAuthenticated,
  isOwner,
  generateSEOMetadata
);

export default router;
