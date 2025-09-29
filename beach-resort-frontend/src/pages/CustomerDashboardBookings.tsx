import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axiosClient from "../api/axiosClient";

interface Booking {
  id: number;
  propertyName: string;
  date: string;
  status: string;
  amount: number;
  paymentStatus: string;
}

const CustomerDashboardBookings: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/customer/${user?.id}/bookings`);
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user?.id]);

  if (loading) return <div className="p-4 text-center">Loading your bookings...</div>;

  if (bookings.length === 0)
    return <div className="p-4 text-center">No bookings found. Book a property to get started!</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Bookings & Payments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-4">Booking ID</th>
              <th className="py-2 px-4">Property</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Booking Status</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{b.id}</td>
                <td className="py-2 px-4">{b.propertyName}</td>
                <td className="py-2 px-4">{new Date(b.date).toLocaleDateString()}</td>
                <td className="py-2 px-4">{b.status}</td>
                <td className="py-2 px-4">₹{b.amount}</td>
                <td className="py-2 px-4">{b.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDashboardBookings;
