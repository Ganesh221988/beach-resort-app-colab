import express from 'express';
import { 
  register, 
  login, 
  refreshToken, 
  verifyEmail,
  uploadDocuments 
} from '../controllers/authController';
import { upload } from '../middleware/uploadMiddleware';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/verify/:token', verifyEmail);

// Protected routes
router.post(
  '/upload-documents',
  isAuthenticated,
  upload.fields([
    { name: 'aadharFront', maxCount: 1 },
    { name: 'aadharBack', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'businessProof', maxCount: 1 }
  ]),
  uploadDocuments
);

export default router;
