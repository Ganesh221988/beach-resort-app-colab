import React, { useEffect, useState, useContext } from "react";
import { fetchProperties } from "../../api/adminApi"; // Using adminApi for demo, you can move to a separate customerApi if preferred
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

interface Property {
  id: number;
  name: string;
  location: string;
  price: number;
  owner: string;
  imageUrl?: string;
}

const CustomerDashboard: React.FC = () => {
  const { user } = useContext(AuthContext)!;
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
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop) => (
          <div key={prop.id} className="bg-white shadow rounded p-4">
            <img
              src={prop.imageUrl || "/placeholder.jpg"}
              alt={prop.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-xl font-semibold">{prop.name}</h3>
            <p className="text-gray-600">{prop.location}</p>
            <p className="font-bold mt-1">₹{prop.price}</p>
            <p className="text-gray-500 text-sm">Owner: {prop.owner}</p>
            <Link
              to={`/booking/${prop.id}`}
              className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Book Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
