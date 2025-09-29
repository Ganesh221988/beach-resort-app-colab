// src/controllers/admin/customersController.ts
import { Request, Response } from "express";
import Customer from "../../models/Customer";
import User from "../../models/User";

export async function listCustomers(req: Request, res: Response) {
  try {
    const customers = await Customer.findAll({ include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }] });
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
}

export async function getCustomer(req: Request, res: Response) {
  try {
    const c = await Customer.findByPk(req.params.id, { include: [{ model: User, as: "user" }] });
    if (!c) return res.status(404).json({ message: "Customer not found" });
    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get customer" });
  }
}

export async function createCustomer(req: Request, res: Response) {
  try {
    const { name, email, password, phone, address } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already used" });

    // create user record
    const bcrypt = await import("bcryptjs");
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: "customer" });

    const customer = await Customer.create({ userId: user.id, phone, address });
    res.status(201).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create customer" });
  }
}

export async function updateCustomer(req: Request, res: Response) {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // update allowed fields on customer table
    await customer.update(req.body);

    // optionally update user info if passed
    if (req.body.name || req.body.email) {
      const user = await User.findByPk(customer.userId);
      if (user) {
        await user.update({ name: req.body.name || user.name, email: req.body.email || user.email });
      }
    }

    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update customer" });
  }
}

export async function deleteCustomer(req: Request, res: Response) {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // delete associated user as well (optional)
    await User.destroy({ where: { id: customer.userId } });
    await customer.destroy();

    res.json({ message: "Customer deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete customer" });
  }
}
