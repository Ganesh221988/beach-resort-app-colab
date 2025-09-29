import { useState } from "react";
import axiosClient from "@/api/axiosClient";

interface Broker {
  id: string;
  name: string;
  email: string;
  phone: string;
  commissionRate: number;
}

interface Props {
  broker: Broker;
  open: boolean;
  onClose: () => void;
}

export default function BrokerEditForm({ broker, open, onClose }: Props) {
  const [formData, setFormData] = useState({
    name: broker.name,
    email: broker.email,
    phone: broker.phone,
    commissionRate: broker.commissionRate,
  });

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/admin/brokers/${broker.id}`, formData);
      onClose();
    } catch (err) {
      console.error("Error updating broker:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Broker</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Broker Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Phone"
          />
          <input
            type="number"
            name="commissionRate"
            value={formData.commissionRate}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Commission %"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
