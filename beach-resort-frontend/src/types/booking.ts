// src/types/booking.ts
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  propertyId: string;       // reference to Property
  propertyName?: string;    // ✅ added for display
  customerId: string;       // reference to User
  userId?: string;          // ✅ alias for dashboards
  brokerId?: string;
  status: BookingStatus;
  date: string;
}
