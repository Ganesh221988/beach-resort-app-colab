import React, { useEffect, useState } from "react";
import { getAllBookings } from "../../api/adminApi";

interface Booking {
  id: number;
  property: string;
  customer: string;
  status: string;
  amount: number;
  date: string;
}

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await getAllBookings();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading bookings...</div>;
  if (!bookings.length) return <div className="p-4 text-center">No bookings found.</div>;

  const statusColors: Record<string, string> = {
    pending: "text-yellow-600",
    approved: "text-green-600",
    rejected: "text-red-600",
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Property</th>
              <th className="py-2 px-4">Customer</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{booking.id}</td>
                <td className="py-2 px-4">{booking.property}</td>
                <td className="py-2 px-4">{booking.customer}</td>
                <td className={`py-2 px-4 font-semibold ${statusColors[booking.status] || ""}`}>
                  {booking.status}
                </td>
                <td className="py-2 px-4">₹{booking.amount}</td>
                <td className="py-2 px-4">
                  {new Date(booking.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
