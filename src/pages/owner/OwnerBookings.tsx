import React, { useEffect, useState } from "react";
import apiClient from "../../api/axiosClient";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface Booking {
  id: string;
  customerName: string;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  status: "pending" | "approved" | "rejected";
}

const OwnerBookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        const res = await apiClient.get(`/owners/${user.id}/bookings`);
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleAction = async (bookingId: string, action: "approve" | "reject") => {
    try {
      await apiClient.post(`/owners/bookings/${bookingId}/${action}`);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: action === "approve" ? "approved" : "rejected" } : b
        )
      );
    } catch (err) {
      console.error(`Failed to ${action} booking`, err);
      alert(`Failed to ${action} booking ❌`);
    }
  };

  if (loading) return <p className="p-4">Loading bookings...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Booking Requests</h2>

      {bookings.length === 0 ? (
        <p>No booking requests yet.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="shadow">
              <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center p-4">
                <div>
                  <p className="font-semibold">{booking.propertyTitle}</p>
                  <p className="text-sm">Customer: {booking.customerName}</p>
                  <p className="text-sm">
                    {booking.checkIn} → {booking.checkOut}
                  </p>
                  <p className="text-sm">
                    Status:{" "}
                    <span
                      className={
                        booking.status === "approved"
                          ? "text-green-600"
                          : booking.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }
                    >
                      {booking.status}
                    </span>
                  </p>
                </div>

                {booking.status === "pending" && (
                  <div className="flex space-x-2 mt-2 md:mt-0">
                    <Button
                      onClick={() => handleAction(booking.id, "approve")}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleAction(booking.id, "reject")}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
