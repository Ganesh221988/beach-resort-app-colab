import { Router } from 'express';
import { socialMediaController } from '../controllers/socialMediaController';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Temporary auth middleware stub
const auth = (req: Request, res: Response, next: NextFunction): void => { next(); };

// OAuth routes
router.get('/facebook/auth', auth, socialMediaController.initiateFacebookAuth);
router.post('/facebook/callback', auth, socialMediaController.handleFacebookCallback);
router.get('/instagram/auth', auth, socialMediaController.initiateInstagramAuth);
router.post('/instagram/callback', auth, socialMediaController.handleInstagramCallback);

// Account management routes
router.get('/accounts', auth, socialMediaController.getConnectedAccounts);
router.delete('/facebook', auth, socialMediaController.disconnectFacebook);
router.delete('/instagram', auth, socialMediaController.disconnectInstagram);
router.post('/facebook/refresh', auth, socialMediaController.refreshFacebookToken);

export default router;
