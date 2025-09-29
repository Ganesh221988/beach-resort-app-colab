// Get all booking requests for properties owned by the logged-in owner
import Booking from "../models/Booking";
import Property from "../models/Property";

export const getOwnerBookingRequests = async (req: any, res: any) => {
  try {
    const ownerId = req.user?.id; // logged-in owner
    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    const bookings = await Booking.findAll({
      include: [
        {
          model: Property,
          where: { ownerId },
        },
      ],
    });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching owner bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
