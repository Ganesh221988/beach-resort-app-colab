// src/components/owner/BookingRequests.tsx
import React, { useEffect, useState } from "react";
import { getOwnerBookings } from "../../services/api";

interface Booking {
  id: number;
  propertyId: number;
  customerId: number;
  startDate: string;
  endDate: string;
  status: string;
  property?: {
    name: string;
    location: string;
  };
  customer?: {
    name: string;
    email: string;
  };
}

const BookingRequests: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getOwnerBookings();
        setBookings(response);
      } catch (err) {
        console.error("Error fetching owner bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Booking Requests</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Property</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Dates</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="p-2 border">
                  {booking.property?.name} ({booking.property?.location})
                </td>
                <td className="p-2 border">
                  {booking.customer?.name} <br />
                  <span className="text-sm text-gray-600">{booking.customer?.email}</span>
                </td>
                <td className="p-2 border">
                  {new Date(booking.startDate).toLocaleDateString()} →{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </td>
                <td className="p-2 border">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingRequests;
