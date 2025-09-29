import React from "react";
import { useBookings, Booking } from "../contexts/BookingContext";
import { Button } from "../components/ui/button";

const PropertiesPage: React.FC = () => {
  const { bookings, updateBooking } = useBookings();

  const handleBookProperty = (id: string) => {
    updateBooking(id, { status: "requested" });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Properties</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No properties available.</p>
      ) : (
        bookings.map((p: Booking) => (
          <div key={p.id} className="flex justify-between items-center border-b py-3">
            <div>
              <p className="font-medium">{p.customerName}</p>
              <p className="text-sm text-gray-600">Amount: ₹{p.amount}</p>
            </div>
            <Button className="bg-blue-600 text-white" onClick={() => handleBookProperty(p.id)}>
              Book Now
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default PropertiesPage;
