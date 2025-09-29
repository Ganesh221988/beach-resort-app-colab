export interface AvailabilityUpdate {
  propertyId: string;
  updates: {
    blockedDates: string[];
    availableDates: string[];
  };
}

export interface BookingUpdate {
  propertyId: string;
  booking: {
    id: string;
    checkIn: string;
    checkOut: string;
    guestCount: number;
    status: 'confirmed' | 'pending' | 'cancelled';
  };
}

export interface BookingCancellation {
  propertyId: string;
  bookingId: string;
}
