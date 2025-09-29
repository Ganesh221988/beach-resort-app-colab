import Booking from "../../models/Booking";
export async function listBookings(req, res) {
    try {
        const bookings = await Booking.findAll();
        res.json(bookings);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
}
export async function getBooking(req, res) {
    try {
        const b = await Booking.findByPk(req.params.id);
        if (!b)
            return res.status(404).json({ message: "Booking not found" });
        res.json(b);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get booking" });
    }
}
export async function createBooking(req, res) {
    try {
        const booking = await Booking.create(req.body);
        res.status(201).json(booking);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create booking" });
    }
}
export async function updateBooking(req, res) {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });
        await booking.update(req.body);
        res.json(booking);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update booking" });
    }
}
export async function deleteBooking(req, res) {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });
        await booking.destroy();
        res.json({ message: "Booking deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete booking" });
    }
}
