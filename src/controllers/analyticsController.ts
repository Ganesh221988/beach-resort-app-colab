import { Request, Response } from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database';
import Booking from '../models/Booking';
import Property from '../models/Property';
import Payment from '../models/Payment';

export const getFinancialReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, propertyId } = req.query;
    const whereClause: any = {};
    
    if (propertyId) {
      whereClause.propertyId = propertyId;
    }
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
      };
    }

    const report = await Payment.findAll({
      where: whereClause,
      include: [{
        model: Booking,
        include: [{ model: Property }]
      }],
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransactions'],
        [sequelize.fn('AVG', sequelize.col('amount')), 'averageTransactionValue']
      ],
      group: ['paymentMethod']
    });

    return res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating financial report:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating financial report'
    });
  }
};

export const getOccupancyReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, propertyId } = req.query;
    const whereClause: any = {};
    
    if (propertyId) {
      whereClause.propertyId = propertyId;
    }

      if (startDate && endDate) {
      whereClause.startDate = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
      };
    }

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [{ model: Property }],
      attributes: [
        'propertyId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalBookings'],
        [sequelize.fn('AVG', 
          sequelize.fn('DATEDIFF', 
            sequelize.col('endDate'), 
            sequelize.col('startDate')
          )
        ), 'averageStayDuration']
      ],
      group: ['propertyId']
    });    // Calculate occupancy rate
    const occupancyRates = await Promise.all(bookings.map(async (booking: any) => {
      const totalDays = Math.ceil(
        (new Date(endDate as string).getTime() - new Date(startDate as string).getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      
      const occupiedDaysCount = await Booking.count({
        where: {
          propertyId: booking.propertyId,
          [Op.and]: [
            {
              [Op.or]: [
                {
                  startDate: {
                    [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
                  }
                },
                {
                  endDate: {
                    [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
                  }
                }
              ]
            },
            {
              status: {
                [Op.notIn]: ['CANCELLED', 'REJECTED']
              }
            }
          ]
        }
      });

      const numOccupiedDays = Number(occupiedDaysCount);
      const numTotalDays = Number(totalDays);
      
      return {
        ...booking.toJSON(),
        occupancyRate: numTotalDays > 0 ? (numOccupiedDays / numTotalDays) * 100 : 0
      };
    }));

    return res.json({
      success: true,
      data: occupancyRates
    });
  } catch (error) {
    console.error('Error generating occupancy report:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating occupancy report'
    });
  }
};

export const getRevenueForecasts = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.query;
    const whereClause: any = {};
    
    if (propertyId) {
      whereClause.propertyId = propertyId;
    }

    // Get historical data
    const historicalData = await Payment.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'revenue']
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')]
    });

    // Simple linear regression for forecasting
    const forecast = calculateRevenueForecasts(historicalData);

    return res.json({
      success: true,
      data: {
        historical: historicalData,
        forecast
      }
    });
  } catch (error) {
    console.error('Error generating revenue forecasts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating revenue forecasts'
    });
  }
};

function calculateRevenueForecasts(historicalData: any[]) {
  // Implementation of linear regression algorithm
  const data = historicalData.map((item, index) => ({
    x: index,
    y: parseFloat(item.revenue)
  }));

  const n = data.length;
  const sumX = data.reduce((acc, val) => acc + val.x, 0);
  const sumY = data.reduce((acc, val) => acc + val.y, 0);
  const sumXY = data.reduce((acc, val) => acc + (val.x * val.y), 0);
  const sumXX = data.reduce((acc, val) => acc + (val.x * val.x), 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Generate forecast for next 6 months
  const forecast = [];
  for (let i = 1; i <= 6; i++) {
    forecast.push({
      month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      predictedRevenue: slope * (n + i) + intercept
    });
  }

  return forecast;
}
