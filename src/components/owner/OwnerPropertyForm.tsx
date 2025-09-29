import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../api/axiosClient";

interface OwnerPropertyFormProps {
  propertyId?: string; // If provided → Edit mode, else Add mode
  onSuccess?: () => void;
}

const OwnerPropertyForm: React.FC<OwnerPropertyFormProps> = ({ propertyId, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    images: [] as File[],
  });

  // Fetch existing property details if editing
  useEffect(() => {
    if (propertyId) {
      const fetchProperty = async () => {
        try {
          const res = await apiClient.get(`/owners/${user?.id}/properties/${propertyId}`);
          const { title, location, price, description } = res.data;
          setFormData((prev) => ({
            ...prev,
            title,
            location,
            price: price.toString(),
            description,
            images: [],
          }));
        } catch (err) {
          console.error("Failed to load property:", err);
        }
      };
      fetchProperty();
    }
  }, [propertyId, user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, images: Array.from(e.target.files) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("location", formData.location);
      data.append("price", formData.price);
      data.append("description", formData.description);
      formData.images.forEach((file) => data.append("images", file));

      if (propertyId) {
        // Edit mode
        await apiClient.put(`/owners/${user.id}/properties/${propertyId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Property updated successfully ✅");
      } else {
        // Add mode
        await apiClient.post(`/owners/${user.id}/properties`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Property added successfully ✅");
      }

      setFormData({ title: "", location: "", price: "", description: "", images: [] });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error saving property:", err);
      alert("Failed to save property ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-md">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">
          {propertyId ? "Edit Property" : "Add New Property"}
        </h2>
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : propertyId ? "Update Property" : "Save Property"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OwnerPropertyForm;
