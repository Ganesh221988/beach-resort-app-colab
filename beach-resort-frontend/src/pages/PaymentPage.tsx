import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBookings } from "../contexts/BookingContext";

declare const Razorpay: any;

const PaymentPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { bookings, owners } = useBookings();

  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return <p>Booking not found!</p>;

  const owner = owners.find((o) => o.id === booking.ownerId);
  if (!owner?.razorpayKeyId) return <p>Owner payment not configured.</p>;

  const handlePayment = () => {
    const options = {
      key: owner.razorpayKeyId,
      amount: booking.amount * 100, // in paise
      currency: "INR",
      name: "Beach Resort Booking",
      description: `Booking by ${booking.customerName}`,
      handler: function (response: any) {
        alert("Payment Successful: " + response.razorpay_payment_id);
        // TODO: Update booking status to 'paid'
      },
      prefill: {
        name: booking.customerName,
        email: booking.customerEmail,
        contact: booking.customerPhone,
      },
      theme: { color: "#3b82f6" },
    };
    const rzp = new Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Pay for Booking</h2>
      <p>Customer: {booking.customerName}</p>
      <p>Amount: ₹{booking.amount}</p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handlePayment}
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
