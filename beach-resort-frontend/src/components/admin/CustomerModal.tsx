import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addCustomer, updateCustomer } from "@/api/customerApi";

interface CustomerModalProps {
  customer?: any;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const CustomerModal = ({ customer, open, onClose, onSave }: CustomerModalProps) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (customer) setForm({ name: customer.name, email: customer.email, phone: customer.phone });
    else setForm({ name: "", email: "", phone: "" });
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (customer) await updateCustomer(customer.id, form);
      else await addCustomer(form);
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">{customer ? "Edit" : "Add"} Customer</h2>
        <input
          className="border w-full mb-2 p-2"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="border w-full mb-2 p-2"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="border w-full mb-4 p-2"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{customer ? "Save" : "Add"}</Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
