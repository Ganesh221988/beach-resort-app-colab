import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axiosClient from "../../api/axiosClient";
import { Link } from "react-router-dom";

interface Property {
  id: number;
  name: string;
  location: string;
  price: number;
  imageUrl?: string;
}

interface Booking {
  id: number;
  propertyId: number;
  customerName: string;
  date: string;
  status: string;
}

const OwnerDashboard: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerData = async () => {
      setLoading(true);
      try {
        // Fetch owner's properties
        const propRes = await axiosClient.get(`/owner/${user?.id}/properties`);
        setProperties(propRes.data);

        // Fetch booking requests for owner's properties
        const bookingRes = await axiosClient.get(`/owner/${user?.id}/bookings`);
        setBookings(bookingRes.data);
      } catch (err) {
        console.error("Error fetching owner data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerData();
  }, [user?.id]);

  const handleBookingAction = async (bookingId: number, action: "approve" | "cancel") => {
    try {
      await axiosClient.put(`/owner/bookings/${bookingId}`, { action });
      alert(`Booking ${action}d successfully!`);
      // Refresh bookings
      const bookingRes = await axiosClient.get(`/owner/${user?.id}/bookings`);
      setBookings(bookingRes.data);
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Failed to update booking.");
    }
  };

  if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>

      {/* Properties */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">My Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-white shadow rounded p-4">
              <img
                src={prop.imageUrl || "/placeholder.jpg"}
                alt={prop.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h4 className="text-lg font-semibold">{prop.name}</h4>
              <p className="text-gray-600">{prop.location}</p>
              <p className="font-bold mt-1">₹{prop.price}</p>
              <Link
                to={`/owner/properties/${prop.id}`}
                className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View / Edit
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Requests */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Booking Requests</h3>
        {bookings.length === 0 ? (
          <p>No booking requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-2 px-4">Booking ID</th>
                  <th className="py-2 px-4">Property</th>
                  <th className="py-2 px-4">Customer</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4">{b.id}</td>
                    <td className="py-2 px-4">{properties.find(p => p.id === b.propertyId)?.name || "Unknown"}</td>
                    <td className="py-2 px-4">{b.customerName}</td>
                    <td className="py-2 px-4">{new Date(b.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{b.status}</td>
                    <td className="py-2 px-4 space-x-2">
                      {b.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleBookingAction(b.id, "approve")}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleBookingAction(b.id, "cancel")}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {b.status !== "pending" && <span className="text-gray-500">No actions</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
