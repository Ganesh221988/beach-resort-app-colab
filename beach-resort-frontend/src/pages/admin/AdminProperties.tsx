import React, { useEffect, useState } from "react";
import { fetchProperties } from "../../api/adminApi";

interface Property {
  id: number;
  name: string;
  owner: string;
  location: string;
  price: number;
}

const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProperties = async () => {
      setLoading(true);
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    getProperties();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading properties...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Properties</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Owner</th>
              <th className="py-2 px-4">Location</th>
              <th className="py-2 px-4">Price</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{property.id}</td>
                <td className="py-2 px-4">{property.name}</td>
                <td className="py-2 px-4">{property.owner}</td>
                <td className="py-2 px-4">{property.location}</td>
                <td className="py-2 px-4">₹{property.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProperties;
