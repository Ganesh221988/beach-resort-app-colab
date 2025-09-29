import React, { useState } from "react";
import { usePropertyContext } from "../contexts/PropertyContext";
import { useLocation } from "react-router-dom";

const BookingPage: React.FC = () => {
  const { properties } = usePropertyContext();
  const [selectedType, setSelectedType] = useState<string>("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const propertyId = params.get("propertyId");

  let filteredProperties = properties;

  // If coming from a property card, show only that property
  if (propertyId) {
    filteredProperties = properties.filter((p) => p.id === propertyId);
  } else if (selectedType) {
    filteredProperties = properties.filter((p) => p.property_type === selectedType);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book a Property</h1>

      {/* Show filter only if not coming from single property */}
      {!propertyId && (
        <div className="mb-6">
          <label className="mr-2 font-semibold">Filter by Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="">All Types</option>
            <option value="Full Villa">Full Villa</option>
            <option value="Rooms">Rooms</option>
            <option value="Both">Both</option>
          </select>
        </div>
      )}

      {filteredProperties.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={property.images[0] || "https://via.placeholder.com/300"}
                alt={property.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-bold">{property.title}</h3>
              <p className="text-gray-600 mb-2">{property.description}</p>
              <p className="text-sm">📍 {property.city}, {property.state}</p>
              <p className="text-sm font-semibold">🏡 Type: {property.property_type}</p>
              <p className="text-sm">🕑 Check-in: {property.check_in_time}</p>
              <p className="text-sm">🕑 Check-out: {property.check_out_time}</p>

              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={() => alert(`Booking started for ${property.title}`)}
              >
                Confirm Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingPage;
