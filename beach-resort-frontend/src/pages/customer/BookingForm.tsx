import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/axiosClient";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";

interface Property {
  id: string;
  title: string;
  amenities: string[];
  complimentaryBreakfast?: boolean;
}

const BookingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // propertyId
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    amenities: [] as string[],
    breakfast: false,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await apiClient.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Error fetching property:", err);
      }
    };
    fetchProperty();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => {
      if (prev.amenities.includes(amenity)) {
        return { ...prev, amenities: prev.amenities.filter((a) => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiClient.post(`/properties/${id}/bookings`, {
        customerId: user?.id,
        ...formData,
      });

      alert("Booking request sent ✅");
      navigate("/customer/my-bookings");
    } catch (err) {
      console.error("Error booking property:", err);
      alert("Failed to book ❌");
    }
  };

  if (!property) return <p>Loading booking form...</p>;

  return (
    <div className="max-w-lg mx-auto mt-6 border rounded p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Book {property.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          name="checkIn"
          value={formData.checkIn}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          name="checkOut"
          value={formData.checkOut}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <div className="flex gap-3">
          <input
            type="number"
            name="adults"
            min="1"
            value={formData.adults}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            placeholder="Adults"
            required
          />
          <input
            type="number"
            name="children"
            min="0"
            value={formData.children}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            placeholder="Children"
          />
        </div>

        {/* Amenities */}
        <div>
          <h3 className="font-semibold mb-2">Select Amenities</h3>
          {property.amenities.length === 0 ? (
            <p className="text-sm text-gray-500">No extra amenities available.</p>
          ) : (
            <div className="space-y-2">
              {property.amenities.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Complimentary Breakfast */}
        {property.complimentaryBreakfast && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="breakfast"
              checked={formData.breakfast}
              onChange={handleChange}
            />
            Complimentary Breakfast
          </label>
        )}

        <Button type="submit" className="w-full">
          Submit Booking
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;
