// src/controllers/paymentGatewayController.ts
import { Request, Response } from "express";
import PaymentGateway from "../models/PaymentGateway";
import { AuthenticatedRequest } from "../types/express";
import { Op } from "sequelize";

// Validate gateway credentials based on gateway type
const validateGatewayCredentials = (
  gatewayType: string,
  credentials: any
): boolean => {
  switch (gatewayType) {
    case 'RAZORPAY':
      return !!(
        credentials.razorpay?.keyId &&
        credentials.razorpay?.keySecret &&
        credentials.razorpay?.webhookSecret
      );
    
    case 'STRIPE':
      return !!(
        credentials.stripe?.publishableKey &&
        credentials.stripe?.secretKey &&
        credentials.stripe?.webhookSecret
      );
    
    case 'PAYPAL':
      return !!(
        credentials.paypal?.clientId &&
        credentials.paypal?.clientSecret &&
        credentials.paypal?.environment &&
        ['sandbox', 'production'].includes(credentials.paypal?.environment)
      );
    
    default:
      return false;
  }
};

// Remove sensitive data before sending response
const sanitizeGateway = (gateway: PaymentGateway) => {
  const sanitized = gateway.toJSON();
  const safeGateway = {
    ...sanitized,
    credentials: {
      ...(sanitized.credentials.razorpay && {
        razorpay: {
          keyId: sanitized.credentials.razorpay.keyId
        }
      }),
      ...(sanitized.credentials.stripe && {
        stripe: {
          publishableKey: sanitized.credentials.stripe.publishableKey
        }
      }),
      ...(sanitized.credentials.paypal && {
        paypal: {
          clientId: sanitized.credentials.paypal.clientId,
          environment: sanitized.credentials.paypal.environment
        }
      })
    }
  };
  return safeGateway;
};

// -------------------- ADD / UPDATE PAYMENT GATEWAY --------------------
export const addOrUpdateGateway = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      gatewayType,
      credentials,
      isDefault = false,
      commissionRate = 0
    } = req.body;

    const userId = req.user?.id;
    const role = req.user?.role;

    if (!gatewayType || !credentials || !userId || !role || !['admin', 'owner'].includes(role)) {
      return res.status(400).json({ error: "Invalid or missing required fields" });
    }

    // Validate credentials based on gateway type
    if (!validateGatewayCredentials(gatewayType, credentials)) {
      return res.status(400).json({ error: "Invalid credentials format for selected gateway" });
    }

    // Check if exists
    let gateway = await PaymentGateway.findOne({ 
      where: { 
        user_id: userId, 
        user_role: role,
        gateway_type: gatewayType 
      } 
    });

    // If setting as default, unset other defaults
    if (isDefault) {
      await PaymentGateway.update(
        { is_default: false },
        { where: { user_id: userId, user_role: role } }
      );
    }

    if (gateway) {
      await gateway.update({ 
        credentials,
        is_default: isDefault,
        commission_rate: commissionRate,
        metadata: {
          ...gateway.metadata,
          lastUpdated: new Date()
        }
      });
      return res.json({ 
        message: "Payment gateway updated successfully", 
        gateway: sanitizeGateway(gateway) 
      });
    }

    // Create new
    gateway = await PaymentGateway.create({ 
      user_id: userId, 
      user_role: role as 'admin' | 'owner', 
      gateway_type: gatewayType,
      credentials,
      is_default: isDefault,
      is_active: true,
      commission_rate: commissionRate,
      metadata: {
        createdAt: new Date(),
        lastUpdated: new Date()
      }
    });

    res.status(201).json({ 
      message: "Payment gateway added successfully", 
      gateway: sanitizeGateway(gateway) 
    });
  } catch (err) {
    console.error("Error in addOrUpdateGateway:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// -------------------- GET PAYMENT GATEWAYS --------------------
export const getGateways = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    const gateways = await PaymentGateway.findAll({ 
      where: { 
        user_id: userId,
        user_role: role,
        is_active: true
      },
      order: [
        ['is_default', 'DESC'],
        ['created_at', 'DESC']
      ]
    });

    if (!gateways.length) {
      return res.status(404).json({ error: "No payment gateways found" });
    }

    res.json({ 
      gateways: gateways.map(gateway => sanitizeGateway(gateway)) 
    });
  } catch (err) {
    console.error("Error in getGateways:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// -------------------- GET SPECIFIC GATEWAY --------------------
export const getGateway = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const { gatewayType } = req.params;

    const gateway = await PaymentGateway.findOne({ 
      where: { 
        user_id: userId, 
        user_role: role,
        gateway_type: gatewayType,
        is_active: true
      } 
    });

    if (!gateway) return res.status(404).json({ error: "Payment gateway not found" });

    res.json({ gateway });
  } catch (err) {
    console.error("Error in getGateway:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// -------------------- DELETE PAYMENT GATEWAY --------------------
export const deleteGateway = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const { gatewayType } = req.params;

    const gateway = await PaymentGateway.findOne({ 
      where: { 
        user_id: userId, 
        user_role: role as 'admin' | 'owner',
        gateway_type: gatewayType,
        is_active: true
      } 
    });

    if (!gateway) return res.status(404).json({ error: "Payment gateway not found" });

    await gateway.destroy();
    res.json({ message: "Payment gateway deleted successfully" });
  } catch (err) {
    console.error("Error in deleteGateway:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// -------------------- LIST ALL GATEWAYS (ADMIN ONLY) --------------------
export const listAllGateways = async (_req: Request, res: Response) => {
  try {
    const gateways = await PaymentGateway.findAll();
    res.json({ gateways });
  } catch (err) {
    console.error("Error in listAllGateways:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
