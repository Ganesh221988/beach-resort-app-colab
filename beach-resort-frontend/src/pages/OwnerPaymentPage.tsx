// src/pages/OwnerPaymentPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { mockProperties, mockBookings } from "../data/mockData";
import { loadScript } from "../utils/loadScript"; // small helper to load razorpay script dynamically

export default function OwnerPaymentPage() {
  const params = useParams();
  const ownerId = params.ownerId as string;

  // find owner paymentDetails from your owner store/mock - for demo we read from mock data property owner match
  // Replace with real owner lookup
  const ownerProperties = mockProperties.filter(p => p.owner_id === ownerId);
  const ownerEmail = "owner@example.com";
  const keyId = "rzp_test_yourKeyHere"; // replace with owner.paymentDetails.razorpayKeyId in real app

  const handlePayDemo = async () => {
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    const options: any = {
      key: keyId,
      amount: 50000, // amount in paise - demo
      currency: "INR",
      name: "Payment to owner",
      description: "Demo payment",
      prefill: { email: ownerEmail, contact: "" },
      handler: function (response: any) {
        alert("Payment success. Response: " + JSON.stringify(response));
        // send response to backend to verify payment and record transaction
      },
      theme: { color: "#F97316" },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Owner Payments / Links</h1>
      <p className="mb-4">Owner ID: {ownerId}</p>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Create Payment Link (demo)</h3>
        <p className="text-sm text-gray-600 mb-4">This opens Razorpay checkout (test)</p>
        <button onClick={handlePayDemo} className="px-4 py-2 bg-orange-500 text-white rounded">Pay Demo ₹500</button>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Owner Properties ({ownerProperties.length})</h3>
        <ul className="list-disc ml-6">
          {ownerProperties.map(p => <li key={p.id}>{p.title || p.name || p.address}</li>)}
        </ul>
      </div>
    </div>
  );
}
