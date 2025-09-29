import Owner from "../../models/Owner";
import User from "../../models/User";
export async function listOwners(req, res) {
    try {
        const owners = await Owner.findAll({ include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }] });
        res.json(owners);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch owners" });
    }
}
export async function getOwner(req, res) {
    try {
        const o = await Owner.findByPk(req.params.id, { include: [{ model: User, as: "user" }] });
        if (!o)
            return res.status(404).json({ message: "Owner not found" });
        res.json(o);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get owner" });
    }
}
export async function createOwner(req, res) {
    try {
        const { name, email, password, companyName } = req.body;
        const existing = await User.findOne({ where: { email } });
        if (existing)
            return res.status(400).json({ message: "Email already used" });
        const bcrypt = await import("bcryptjs");
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role: "owner" });
        const owner = await Owner.create({ userId: user.id, companyName });
        res.status(201).json(owner);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create owner" });
    }
}
export async function updateOwner(req, res) {
    try {
        const owner = await Owner.findByPk(req.params.id);
        if (!owner)
            return res.status(404).json({ message: "Owner not found" });
        await owner.update(req.body);
        if (req.body.name || req.body.email) {
            const user = await User.findByPk(owner.userId);
            if (user)
                await user.update({ name: req.body.name || user.name, email: req.body.email || user.email });
        }
        res.json(owner);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update owner" });
    }
}
export async function deleteOwner(req, res) {
    try {
        const owner = await Owner.findByPk(req.params.id);
        if (!owner)
            return res.status(404).json({ message: "Owner not found" });
        await User.destroy({ where: { id: owner.userId } });
        await owner.destroy();
        res.json({ message: "Owner deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete owner" });
    }
}
