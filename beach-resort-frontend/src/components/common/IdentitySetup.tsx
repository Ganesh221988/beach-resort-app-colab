// src/components/common/IdentitySetup.tsx
import React, { useState, useEffect } from "react";

interface Props {
  identityId: string; // owner_id or broker_id
  role: "owner" | "broker";
  initial?: any; // optional initial values (from backend or mock)
  onSave: (payload: any) => void;
  onCancel?: () => void;
}

export default function IdentitySetup({ identityId, role, initial = {}, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    name: initial.name || "",
    contactNumber: initial.contactNumber || "",
    whatsappNumber: initial.whatsappNumber || "",
    email: initial.email || "",
    businessName: initial.businessName || "",
    location: initial.location || "",
    // payment
    upiId: (initial.paymentDetails && initial.paymentDetails.upiId) || "",
    bankAccountName: (initial.paymentDetails && initial.paymentDetails.bankAccount?.accountName) || "",
    bankAccountNumber: (initial.paymentDetails && initial.paymentDetails.bankAccount?.accountNumber) || "",
    bankIfsc: (initial.paymentDetails && initial.paymentDetails.bankAccount?.ifsc) || "",
    paymentQrImage: initial.paymentDetails?.paymentQrImage || "",
    razorpayKeyId: initial.paymentDetails?.razorpayKeyId || "",
  });

  const [aadharFront, setAadharFront] = useState<string | null>(initial.aadharFrontUrl || null);
  const [aadharBack, setAadharBack] = useState<string | null>(initial.aadharBackUrl || null);

  const readFileAsDataURL = (file: File) => new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result));
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string | null) => void) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl = await readFileAsDataURL(f);
    setter(dataUrl);
  };

  const handleSave = () => {
    const payload = {
      id: identityId,
      role,
      name: form.name,
      contactNumber: form.contactNumber,
      whatsappNumber: form.whatsappNumber,
      email: form.email,
      businessName: form.businessName,
      location: form.location,
      aadharFrontUrl: aadharFront,
      aadharBackUrl: aadharBack,
      paymentDetails: {
        upiId: form.upiId,
        bankAccount: {
          accountName: form.bankAccountName,
          accountNumber: form.bankAccountNumber,
          ifsc: form.bankIfsc,
        },
        paymentQrImage: form.paymentQrImage,
        razorpayKeyId: form.razorpayKeyId,
      },
      created_at: new Date().toISOString(),
      verified: false,
    };
    onSave(payload);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{role === "owner" ? "Owner" : "Broker"} - Setup Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input value={form.name} onChange={(e) => setForm(s => ({...s, name: e.target.value}))} placeholder="Full name" className="p-2 border rounded" />
        <input value={form.contactNumber} onChange={(e) => setForm(s => ({...s, contactNumber: e.target.value}))} placeholder="Contact number" className="p-2 border rounded" />
        <input value={form.whatsappNumber} onChange={(e) => setForm(s => ({...s, whatsappNumber: e.target.value}))} placeholder="WhatsApp number" className="p-2 border rounded" />
        <input value={form.email} onChange={(e) => setForm(s => ({...s, email: e.target.value}))} placeholder="Email ID" className="p-2 border rounded" />
        <input value={form.businessName} onChange={(e) => setForm(s => ({...s, businessName: e.target.value}))} placeholder="Business name" className="p-2 border rounded" />
        <input value={form.location} onChange={(e) => setForm(s => ({...s, location: e.target.value}))} placeholder="Location" className="p-2 border rounded" />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium">Upload Aadhar (front)</label>
        <input type="file" accept="image/*" onChange={(e) => handleFile(e, setAadharFront)} />
        {aadharFront && <img src={aadharFront} alt="Aadhar front" className="w-48 mt-2 rounded" />}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium">Upload Aadhar (back)</label>
        <input type="file" accept="image/*" onChange={(e) => handleFile(e, setAadharBack)} />
        {aadharBack && <img src={aadharBack} alt="Aadhar back" className="w-48 mt-2 rounded" />}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={form.upiId} onChange={(e) => setForm(s => ({...s, upiId: e.target.value}))} placeholder="UPI ID (eg: name@upi)" className="p-2 border rounded" />
        <input value={form.paymentQrImage} onChange={(e)=>setForm(s=>({...s, paymentQrImage: e.target.value}))} placeholder="Payment QR image URL (or paste base64)" className="p-2 border rounded" />
        <input value={form.bankAccountName} onChange={(e)=>setForm(s=>({...s, bankAccountName: e.target.value}))} placeholder="Bank account name" className="p-2 border rounded col-span-2 md:col-auto" />
        <input value={form.bankAccountNumber} onChange={(e)=>setForm(s=>({...s, bankAccountNumber: e.target.value}))} placeholder="Account number" className="p-2 border rounded" />
        <input value={form.bankIfsc} onChange={(e)=>setForm(s=>({...s, bankIfsc: e.target.value}))} placeholder="IFSC" className="p-2 border rounded" />
        <input value={form.razorpayKeyId} onChange={(e)=>setForm(s=>({...s, razorpayKeyId: e.target.value}))} placeholder="Razorpay Key ID (test)" className="p-2 border rounded" />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        {onCancel && <button onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>}
        <button onClick={handleSave} className="px-4 py-2 bg-orange-500 text-white rounded">Save & Continue</button>
      </div>
    </div>
  );
}
