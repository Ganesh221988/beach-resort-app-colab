import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../api/axiosClient";

interface PropertyFormProps {
  onSuccess?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    images: [] as File[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, images: Array.from(e.target.files!) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("location", formData.location);
      data.append("price", formData.price);
      data.append("description", formData.description);
      formData.images.forEach((file) => data.append("images", file));

      await apiClient.post(`/owners/${user?.id}/properties`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Property added successfully ✅");
      setFormData({ title: "", location: "", price: "", description: "", images: [] });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error adding property:", err);
      alert("Failed to add property ❌");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-md">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Property Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price (per night)"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Property Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
          />

          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />

          <Button type="submit" className="w-full">Save Property</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
