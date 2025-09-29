import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { Op } from 'sequelize';
import Commission from '../models/Commission';
import Broker from '../models/Broker';
import Property from '../models/Property';

export const getCommissions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { brokerId, status, startDate, endDate } = req.query;
    
    const whereClause: any = {};
    
    if (brokerId) {
      whereClause.brokerId = brokerId;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (startDate && endDate) {
      whereClause.dueDate = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
      };
    }

    const commissions = await Commission.findAll({
      where: whereClause,
      include: [
        {
          model: Broker,
          as: 'broker',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'name', 'location', 'type']
        }
      ],
      order: [['dueDate', 'DESC']]
    });

    res.json(commissions);
  } catch (error) {
    console.error('Error fetching commissions:', error);
    res.status(500).json({ message: 'Error fetching commissions' });
  }
};

export const getCommissionById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const commission = await Commission.findByPk(id, {
      include: [
        {
          model: Broker,
          as: 'broker',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'name', 'location', 'type']
        }
      ]
    });

    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    res.json(commission);
  } catch (error) {
    console.error('Error fetching commission:', error);
    res.status(500).json({ message: 'Error fetching commission' });
  }
};

export const createCommission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      propertyId,
      brokerId,
      amount,
      rate,
      dueDate,
      paymentGatewayId,
      notes
    } = req.body;

    // Validate required fields
    if (!propertyId || !brokerId || !amount || !rate || !dueDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const commission = await Commission.create({
      propertyId,
      brokerId,
      amount,
      rate,
      dueDate: new Date(dueDate),
      paymentGatewayId,
      notes,
      status: 'PENDING'
    });

    res.status(201).json(commission);
  } catch (error) {
    console.error('Error creating commission:', error);
    res.status(500).json({ message: 'Error creating commission' });
  }
};

export const updateCommission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      amount,
      rate,
      status,
      dueDate,
      paymentGatewayId,
      paymentDetails,
      notes
    } = req.body;

    const commission = await Commission.findByPk(id);

    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    await commission.update({
      amount,
      rate,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      paymentGatewayId,
      paymentDetails,
      notes
    });

    res.json(commission);
  } catch (error) {
    console.error('Error updating commission:', error);
    res.status(500).json({ message: 'Error updating commission' });
  }
};

export const deleteCommission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const commission = await Commission.findByPk(id);

    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    await commission.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting commission:', error);
    res.status(500).json({ message: 'Error deleting commission' });
  }
};

export const getCommissionsByBroker = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { brokerId } = req.params;
    const { status, startDate, endDate } = req.query;

    const whereClause: any = {
      brokerId
    };

    if (status) {
      whereClause.status = status;
    }

    if (startDate && endDate) {
      whereClause.dueDate = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
      };
    }

    const commissions = await Commission.findAll({
      where: whereClause,
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'name', 'location', 'type']
        }
      ],
      order: [['dueDate', 'DESC']]
    });

    res.json(commissions);
  } catch (error) {
    console.error('Error fetching broker commissions:', error);
    res.status(500).json({ message: 'Error fetching broker commissions' });
  }
};

export const getCommissionStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { brokerId, startDate, endDate } = req.query;

    const whereClause: any = {};

    if (brokerId) {
      whereClause.brokerId = brokerId;
    }

    if (startDate && endDate) {
      whereClause.dueDate = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
      };
    }

    const [totalCommissions, pendingCommissions, paidCommissions] = await Promise.all([
      Commission.sum('amount', { where: whereClause }),
      Commission.sum('amount', { where: { ...whereClause, status: 'PENDING' } }),
      Commission.sum('amount', { where: { ...whereClause, status: 'PAID' } })
    ]);

    res.json({
      totalCommissions: totalCommissions || 0,
      pendingCommissions: pendingCommissions || 0,
      paidCommissions: paidCommissions || 0
    });
  } catch (error) {
    console.error('Error fetching commission stats:', error);
    res.status(500).json({ message: 'Error fetching commission stats' });
  }
};

export const getOwnerCommissions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: ownerId } = (req as any).user;
    
    const ownerProperties = await Property.findAll({
      where: { ownerId },
      attributes: ['id']
    });

    const propertyIds = ownerProperties.map(prop => prop.id);

    const commissions = await Commission.findAll({
      where: {
        propertyId: {
          [Op.in]: propertyIds
        }
      },
      include: [
        { 
          model: Broker,
          as: 'broker',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'name', 'location']
        }
      ],
      order: [['dueDate', 'DESC']]
    });

    res.json(commissions);
  } catch (err) {
    console.error('Error fetching owner commissions:', err);
    res.status(500).json({ error: 'Failed to fetch commissions' });
  }
};

export const markCommissionPaid = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: ownerId } = (req as any).user;
    const { commissionId } = req.params;
    const { paymentGatewayId, paymentDetails } = req.body;

    const foundCommission = await Commission.findByPk(commissionId, {
      include: [{ 
        model: Property,
        as: 'property',
      }]
    });

    if (!foundCommission) {
      return res.status(404).json({ error: 'Commission not found' });
    }

    if (!foundCommission.property || foundCommission.property.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Forbidden: You can only pay commissions for your own properties' });
    }

    if (foundCommission.status === 'PAID') {
      return res.status(400).json({ error: 'Commission has already been paid' });
    }

    try {
      await foundCommission.update({
        status: 'PAID',
        paymentGatewayId,
        paymentDetails,
        updatedAt: new Date()
      });

      res.json({
        message: 'Commission marked as paid successfully',
        commission: foundCommission
      });
    } catch (updateError) {
      console.error('Error updating commission payment status:', updateError);
      res.status(500).json({ error: 'Failed to update commission payment status' });
    }
  } catch (error) {
    console.error('Error in markCommissionPaid:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
