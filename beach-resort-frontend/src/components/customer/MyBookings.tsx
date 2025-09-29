// src/components/customer/MyBookings.tsx
import React, { useEffect, useState } from "react";
import { getMyBookings } from "../../services/api";

interface Booking {
  id: number;
  propertyId: number;
  status: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  property?: {
    title: string;
    location: string;
    price: number;
  };
  payment?: {
    amount: number;
    status: string;
  };
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getMyBookings();
        setBookings(response.data); // axios returns .data
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Property</th>
              <th className="p-2 border">Dates</th>
              <th className="p-2 border">Guests</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Payment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="p-2 border">
                  {booking.property?.title} ({booking.property?.location})
                </td>
                <td className="p-2 border">
                  {new Date(booking.checkIn).toLocaleDateString()} →{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </td>
                <td className="p-2 border">{booking.guests}</td>
                <td className="p-2 border">{booking.status}</td>
                <td className="p-2 border">
                  ₹{booking.payment?.amount ?? booking.property?.price} <br />
                  <span className="text-sm text-gray-600">
                    {booking.payment?.status ?? "pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBookings;
