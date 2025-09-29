import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addProperty, updateProperty } from "@/api/propertyApi";

interface PropertyModalProps {
  property?: any;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const PropertyModal = ({ property, open, onClose, onSave }: PropertyModalProps) => {
  const [form, setForm] = useState({ title: "", price: "", owner_id: "" });

  useEffect(() => {
    if (property) setForm({ title: property.title, price: property.price, owner_id: property.owner_id });
    else setForm({ title: "", price: "", owner_id: "" });
  }, [property]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (property) await updateProperty(property.id, form);
      else await addProperty(form);
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
        <h2 className="text-xl font-bold mb-4">{property ? "Edit" : "Add"} Property</h2>
        <input
          className="border w-full mb-2 p-2"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          className="border w-full mb-2 p-2"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />
        <input
          className="border w-full mb-4 p-2"
          name="owner_id"
          placeholder="Owner ID"
          value={form.owner_id}
          onChange={handleChange}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{property ? "Save" : "Add"}</Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
