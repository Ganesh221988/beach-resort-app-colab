import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { AuthContext } from "../../contexts/AuthContext";

interface Property {
  id: number;
  name: string;
  location: string;
  price: number;
  owner: string;
}

const BookingFlow: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getProperty = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/properties/${propertyId}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };
    getProperty();
  }, [propertyId]);

  const handleBooking = async () => {
    if (!bookingDate) {
      setError("Please select a booking date.");
      return;
    }

    try {
      await axiosClient.post("/customer/bookings", {
        propertyId,
        customerId: user?.id,
        date: bookingDate,
      });
      alert("Booking successful!");
      navigate("/customer");
    } catch (err) {
      console.error("Booking error:", err);
      setError("Failed to book property. Try again.");
    }
  };

  if (loading) return <div className="p-4 text-center">Loading property...</div>;
  if (!property) return <div className="p-4 text-center">Property not found</div>;

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{property.name}</h2>
      <p className="text-gray-600 mb-2">Location: {property.location}</p>
      <p className="font-bold mb-2">Price: ₹{property.price}</p>
      <p className="text-gray-500 mb-4">Owner: {property.owner}</p>

      <label className="block mb-2 font-semibold">Select Booking Date:</label>
      <input
        type="date"
        value={bookingDate}
        onChange={(e) => setBookingDate(e.target.value)}
        className="border p-2 w-full rounded mb-4"
      />
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        onClick={handleBooking}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingFlow;
