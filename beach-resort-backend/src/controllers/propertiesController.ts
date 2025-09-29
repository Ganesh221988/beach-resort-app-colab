import { Request, Response } from "express";
import Property from "../models/Property";
import Owner from "../models/Owner";

// Create property
export const createProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Failed to create property" });
  }
};

// Get all properties
export const getAllProperties = async (_req: Request, res: Response) => {
  try {
    const properties = await Property.findAll({ include: [Owner] });
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// Get property by ID
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const propertyId = Number(req.params.id); // ✅ Fix: convert string → number
    const property = await Property.findByPk(propertyId, { include: [Owner] });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Failed to fetch property" });
  }
};
