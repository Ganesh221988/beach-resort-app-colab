import { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";
import { Button } from "@/components/ui/button";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  createdAt: string;
}

interface PropertyTableProps {
  onEdit?: (property: Property) => void;
  onDelete?: (propertyId: string) => void;
}

export default function PropertyTable({ onEdit, onDelete }: PropertyTableProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axiosClient.get("/admin/properties");
        setProperties(res.data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return <p>Loading properties...</p>;
  if (properties.length === 0) return <p>No properties found.</p>;

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Title</th>
          <th className="p-2 border">Location</th>
          <th className="p-2 border">Price</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Created At</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {properties.map((property) => (
          <tr key={property.id} className="text-center border">
            <td className="p-2 border">{property.title}</td>
            <td className="p-2 border">{property.location}</td>
            <td className="p-2 border">₹{property.price.toLocaleString()}</td>
            <td className="p-2 border">{property.status}</td>
            <td className="p-2 border">
              {new Date(property.createdAt).toLocaleDateString()}
            </td>
            <td className="p-2 border flex justify-center gap-2">
              <Button
                onClick={() => onEdit && onEdit(property)}
                className="bg-blue-500 text-white"
              >
                Edit
              </Button>
              <Button
                onClick={() => onDelete && onDelete(property.id)}
                className="bg-red-500 text-white"
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
