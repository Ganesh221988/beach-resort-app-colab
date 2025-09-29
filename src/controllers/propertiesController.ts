// src/controllers/propertiesController.ts
import { Request, Response } from "express";
import Property from "../models/Property";
import { AuthenticatedRequest } from "../types/express";
import { buildQuery } from "../middleware/queryOptimizer";
import { v4 as uuidv4 } from 'uuid';

// Property Type Enum
type PropertyType = 'FULL_VILLA' | 'ROOMS' | 'BOTH';

// Property Status Enum
type PropertyStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REJECTED';

/**
 * ----------------- PUBLIC: List All Properties -----------------
 */
export const listProperties = async (req: Request, res: Response) => {
  try {
    const queryOptions = (req as any).queryOptions || {};
    const query = buildQuery(queryOptions);

    // Add default ordering if no sort specified
    if (!query.order) {
      query.order = [["createdAt", "DESC"]];
    }

    const properties = await Property.findAll(query);
    res.json(properties);
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

/**
 * ----------------- PUBLIC: Get Single Property -----------------
 */
export const getProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const queryOptions = (req as any).queryOptions || {};
    const query = buildQuery(queryOptions);

    const property = await Property.findByPk(id, query);

    if (!property) return res.status(404).json({ message: "Property not found" });

    res.json(property);
  } catch (err) {
    console.error("Error fetching property:", err);
    res.status(500).json({ message: "Failed to fetch property" });
  }
};

/**
 * ----------------- OWNER: Create Property -----------------
 */
export const createProperty = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "owner")
      return res.status(403).json({ message: "Forbidden: Owners only" });

    const { 
      name, 
      description, 
      location,
      propertyType,
      basePrice,
      hourlyRate,
      maxGuests,
      totalRooms,
      confirmBeforeBooking,
      amenities,
      eventTypes,
      photos,
      videoUrl
    } = req.body;

    if (!name || !basePrice || !location || !propertyType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const property = await Property.create({
      id: uuidv4(),
      propertyId: uuidv4(),
      name,
      description: description || '',
      location,
      latitude: 0, // To be updated with geocoding service
      longitude: 0, // To be updated with geocoding service
      propertyType: propertyType as 'FULL_VILLA' | 'ROOMS' | 'BOTH',
      basePrice: Number(basePrice),
      hourlyRate: hourlyRate ? Number(hourlyRate) : null,
      maxGuests: Number(maxGuests) || 1,
      totalRooms: Number(totalRooms) || 1,
      confirmBeforeBooking: Boolean(confirmBeforeBooking),
      ownerId: req.user.id || '',
      amenities: amenities || [],
      eventTypes: eventTypes || [],
      photos: photos || [],
      videoUrl: videoUrl || null,
      rating: 0,
      status: 'PENDING',
      isVerified: false,
      isPremium: false,
      // Added missing required properties with default values
      images: [],
      imageBlurHashes: [],
      title: name,
      pricePerNight: Number(basePrice),
      keywords: [],
      seoMetadata: {
        title: '',
        description: '',
        keywords: [],
        ogImage: '',
        structuredData: null,
      },
      blockedDates: [],
      // 'area' property removed as it is not part of PropertyAttributes
    });

    res.status(201).json(property);
  } catch (err) {
    console.error("Error creating property:", err);
    res.status(500).json({ message: "Failed to create property" });
  }
};
