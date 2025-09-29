import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Property from '../models/Property';
import Booking from '../models/Booking';

export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const {
      startDate: checkIn,
      endDate: checkOut,
      propertyId,
      guests
    } = req.body;

    // Validate input
    if (!checkIn || !checkOut || !propertyId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if property exists and can accommodate guests
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (guests && property.maxGuests < guests) {
      return res.status(400).json({
        success: false,
        message: 'Property cannot accommodate specified number of guests'
      });
    }

    // Check for existing bookings in the date range
    const existingBookings = await Booking.findAll({
      where: {
        propertyId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [new Date(checkIn), new Date(checkOut)]
            }
          },
          {
            endDate: {
              [Op.between]: [new Date(checkIn), new Date(checkOut)]
            }
          }
        ]
      }
    });

    if (existingBookings.length > 0) {
      return res.json({
        success: true,
        available: false,
        conflictingDates: existingBookings.map(booking => ({
          checkIn: booking.startDate,
          checkOut: booking.endDate
        }))
      });
    }

    // Calculate price for the stay
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = property.pricePerNight * nights;

    return res.json({
      success: true,
      available: true,
      property: {
        id: property.id,
        name: property.name,
        pricePerNight: property.pricePerNight,
        totalPrice,
        nights
      }
    });

  } catch (error) {
    console.error('Error checking availability:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking availability'
    });
  }
};

export const getAvailabilityCalendar = async (req: Request, res: Response) => {
  try {
    const { propertyId, month, year } = req.params;

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const bookings = await Booking.findAll({
      where: {
        propertyId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate]
            }
          }
        ]
      }
    });

    // Create availability calendar
    const calendar = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const isBooked = bookings.some(booking => 
        currentDate >= new Date(booking.startDate) && 
        currentDate <= new Date(booking.endDate)
      );

      calendar.push({
        date: new Date(currentDate),
        available: !isBooked
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return res.json({
      success: true,
      calendar
    });

  } catch (error) {
    console.error('Error getting availability calendar:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting availability calendar'
    });
  }
};

export const updatePropertyAvailability = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;
    const { blockedDates } = req.body;

    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Update blocked dates in property settings
    await property.update({
      blockedDates: blockedDates
    });

    return res.json({
      success: true,
      message: 'Property availability updated successfully'
    });

  } catch (error) {
    console.error('Error updating property availability:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating property availability'
    });
  }
};
