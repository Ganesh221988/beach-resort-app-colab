// src/controllers/admin/propertiesController.ts
import { Request, Response } from "express";
import Property from "../../models/Property";
import Owner from "../../models/Owner";
import User from "../../models/User";

export async function listProperties(req: Request, res: Response) {
  try {
    const properties = await Property.findAll({
      include: [{ model: Owner, as: "owner", include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }] }],
    });
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
}

export async function getProperty(req: Request, res: Response) {
  try {
    const prop = await Property.findByPk(req.params.id, {
      include: [{ model: Owner, as: "owner", include: [{ model: User, as: "user" }] }],
    });
    if (!prop) return res.status(404).json({ message: "Property not found" });
    res.json(prop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get property" });
  }
}

export async function createProperty(req: Request, res: Response) {
  try {
    // expected: ownerId, title, location, price, description
    const data = req.body;
    const prop = await Property.create(data);
    res.status(201).json(prop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create property" });
  }
}

export async function updateProperty(req: Request, res: Response) {
  try {
    const prop = await Property.findByPk(req.params.id);
    if (!prop) return res.status(404).json({ message: "Property not found" });
    await prop.update(req.body);
    res.json(prop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update property" });
  }
}

export async function deleteProperty(req: Request, res: Response) {
  try {
    const prop = await Property.findByPk(req.params.id);
    if (!prop) return res.status(404).json({ message: "Property not found" });
    await prop.destroy();
    res.json({ message: "Property deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete property" });
  }
}
