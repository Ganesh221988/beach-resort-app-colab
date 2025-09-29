import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../api/axiosClient";

interface Booking {
  id: string;
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
  };
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
  amenities: string[];
  complimentaryBreakfast?: boolean;
  status: "pending" | "approved" | "rejected";
}

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const res = await apiClient.get(`/customers/${user.id}/bookings`);
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) return <p className="p-6">Loading your bookings...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">📖 My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-600">You haven’t booked any property yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <h3 className="text-lg font-bold">{b.property.title}</h3>
              <p className="text-sm text-gray-600">{b.property.location}</p>
              <p className="text-green-700 font-semibold">
                ₹{b.property.price} / night
              </p>

              <p className="mt-2 text-sm">
                <span className="font-semibold">Check-In:</span>{" "}
                {new Date(b.checkIn).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Check-Out:</span>{" "}
                {new Date(b.checkOut).toLocaleDateString()}
              </p>

              <p className="text-sm mt-1">
                Guests: {b.guests.adults} Adults, {b.guests.children} Children
              </p>

              {b.amenities.length > 0 && (
                <p className="text-sm mt-1">
                  <span className="font-semibold">Amenities:</span>{" "}
                  {b.amenities.join(", ")}
                </p>
              )}

              {b.complimentaryBreakfast && (
                <p className="text-sm text-yellow-700 mt-1">
                  🍳 Complimentary Breakfast Included
                </p>
              )}

              <p
                className={`mt-2 font-semibold ${
                  b.status === "approved"
                    ? "text-green-600"
                    : b.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                Status: {b.status.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
