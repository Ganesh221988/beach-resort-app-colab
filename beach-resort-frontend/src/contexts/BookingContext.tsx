// src/contexts/BookingContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Booking } from "../types/booking";

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Simulated API fetch
    const storedBookings: Booking[] = [
      {
        id: "b1",
        propertyId: "p1",
        propertyName: "Sea View Resort",  // ✅ added
        customerId: "c101",
        userId: "c101",                   // ✅ added
        brokerId: "br1",
        status: "pending",
        date: "2025-09-01",
      },
      {
        id: "b2",
        propertyId: "p2",
        propertyName: "Mountain Retreat", // ✅ added
        customerId: "c102",
        userId: "c102",                   // ✅ added
        brokerId: "br2",
        status: "confirmed",
        date: "2025-09-02",
      },
    ];
    setBookings(storedBookings);
  }, []);

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
