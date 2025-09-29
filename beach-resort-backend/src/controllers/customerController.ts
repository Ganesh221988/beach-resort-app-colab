// src/controllers/customerController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Customer from "../models/Customer";
import User from "../models/User";
import { generatePrefixedId } from "../services/idGenerator";

/**
 * GET /api/customer/profile
 */
export async function getProfile(req: Request, res: Response) {
  try {
    const auth = (req as any).user;
    if (!auth) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findByPk(auth.id, {
      attributes: ["id", "name", "email", "role"],
    });
    const customer = await Customer.findOne({ where: { userId: auth.id } });

    res.json({ user, customer });
  } catch (err) {
    console.error("getProfile:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
}

/**
 * POST /api/customers
 */
export async function createCustomer(req: Request, res: Response) {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "name, email, password required" });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Step 1: create user (role = customer)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    });

    // Step 2: create customer entry
    const customer = await Customer.create({
      userId: user.id,
      name,
      email,
      phone,
    });

    // Step 3: generate prefixed customer_id
    const customerId = generatePrefixedId("Cust", 11000, customer.id);
    customer.customer_id = customerId;
    await customer.save();

    res.status(201).json({
      customer_id: customerId,
      name,
      email,
      phone,
    });
  } catch (err) {
    console.error("createCustomer:", err);
    res.status(500).json({ message: "Failed to create customer" });
  }
}
