import express from 'express';
import { handleWebhook } from '../controllers/webhookController';

const router = express.Router();

// Webhook endpoints for different payment gateways
router.post('/:gateway', handleWebhook);

export default router;
