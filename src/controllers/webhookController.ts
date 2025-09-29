import { Request, Response } from 'express';
import crypto from 'crypto';
import PaymentGateway from '../models/PaymentGateway';
import Payment from '../models/Payment';

// Webhook handlers for different payment gateways
const webhookHandlers = {
  razorpay: async (payload: any, signature: string, gateway: PaymentGateway) => {
    const webhookSecret = gateway.credentials.razorpay?.webhookSecret;
    if (!webhookSecret) throw new Error('Webhook secret not configured');

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    // Handle different event types
    switch (payload.event) {
      case 'payment.captured':
        await handleRazorpayPaymentSuccess(payload.payload.payment.entity);
        break;
      case 'payment.failed':
        await handleRazorpayPaymentFailure(payload.payload.payment.entity);
        break;
    }
  },

  paypal: async (payload: any, signature: string, gateway: PaymentGateway) => {
    // PayPal webhook verification and handling
    // To be implemented based on PayPal's webhook format
  }
};

// Payment success/failure handlers
const handleRazorpayPaymentSuccess = async (paymentEntity: any) => {
  await Payment.update(
    {
      status: 'COMPLETED',
      gatewayResponse: JSON.stringify(paymentEntity)
    },
    {
      where: {
        gatewayPaymentId: paymentEntity.id,
        gatewayType: 'RAZORPAY'
      }
    }
  );
};

const handleRazorpayPaymentFailure = async (paymentEntity: any) => {
  await Payment.update(
    {
      status: 'FAILED',
      gatewayResponse: JSON.stringify(paymentEntity),
      error: paymentEntity.error_description
    },
    {
      where: {
        gatewayPaymentId: paymentEntity.id,
        gatewayType: 'RAZORPAY'
      }
    }
  );
};

// Webhook endpoint handler
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const gatewayType = req.params.gateway?.toUpperCase();
    const signature = (req.headers['x-razorpay-signature'] || 
                     req.headers['paypal-signature']) as string;

    if (!gatewayType || !signature) {
      return res.status(400).json({ error: 'Missing gateway type or signature' });
    }

    if (!['RAZORPAY', 'PAYPAL'].includes(gatewayType)) {
      return res.status(400).json({ error: 'Invalid gateway type' });
    }

    // Get active gateway configuration
    const gateway = await PaymentGateway.findOne({
      where: {
        gateway_type: gatewayType,
        is_active: true
      }
    });

    if (!gateway) {
      return res.status(404).json({ error: 'Payment gateway configuration not found' });
    }

    // Handle webhook based on gateway type
    const handler = webhookHandlers[gatewayType.toLowerCase() as keyof typeof webhookHandlers];
    await handler(
      gatewayType === 'STRIPE' ? req.body : JSON.parse(req.body),
      signature,
      gateway
    );

    // Update last webhook received timestamp
    await gateway.update({
      last_webhook_received: new Date(),
      metadata: {
        ...gateway.metadata,
        lastWebhookType: req.headers['x-razorpay-event'] || req.headers['stripe-event'] || 'webhook'
      }
    });

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
