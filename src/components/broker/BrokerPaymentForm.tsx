// src/components/broker/BrokerPaymentForm.tsx
import React, { useState } from "react";

const BrokerPaymentForm: React.FC<{ onSave: (data: any) => void }> = ({ onSave }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    accountNumber: "",
    ifsc: "",
    qrCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="font-bold mb-2">Broker Payment Details</h2>
      <input name="accountNumber" placeholder="Account Number" className="border p-2 w-full mb-2" onChange={handleChange}/>
      <input name="ifsc" placeholder="IFSC Code" className="border p-2 w-full mb-2" onChange={handleChange}/>
      <input name="qrCode" placeholder="QR Code URL" className="border p-2 w-full mb-2" onChange={handleChange}/>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => onSave(paymentDetails)}>Save</button>
    </div>
  );
};

export default BrokerPaymentForm;
