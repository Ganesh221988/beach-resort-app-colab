import React, { useEffect, useState } from "react";
import apiClient from "../../api/axiosClient";
import { Button } from "../../components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  amenities: string[];
  complimentaryBreakfast?: boolean;
}

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await apiClient.get("/properties");
        setProperties(res.data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };

    const fetchFavorites = async () => {
      if (user) {
        try {
          const res = await apiClient.get(`/customers/${user.id}/favorites`);
          setFavorites(res.data.map((f: any) => f.propertyId));
        } catch (err) {
          console.error("Error fetching favorites:", err);
        }
      }
    };

    fetchProperties();
    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (propertyId: string) => {
    if (!user) return alert("Login required");

    try {
      if (favorites.includes(propertyId)) {
        await apiClient.delete(`/customers/${user.id}/favorites/${propertyId}`);
        setFavorites((prev) => prev.filter((id) => id !== propertyId));
      } else {
        await apiClient.post(`/customers/${user.id}/favorites`, { propertyId });
        setFavorites((prev) => [...prev, propertyId]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Available Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 shadow-md relative">
            <button
              onClick={() => toggleFavorite(p.id)}
              className="absolute top-2 right-2"
            >
              <Heart
                size={22}
                className={favorites.includes(p.id) ? "fill-red-500 text-red-500" : "text-gray-500"}
              />
            </button>
            <h3 className="text-lg font-bold">{p.title}</h3>
            <p>{p.location}</p>
            <p className="text-green-700">₹{p.price} / night</p>
            <p className="text-sm text-gray-600">{p.description}</p>
            {p.complimentaryBreakfast && (
              <p className="text-sm text-yellow-700 font-semibold mt-1">
                🍳 Complimentary Breakfast
              </p>
            )}
            <Button
              className="mt-3 w-full"
              onClick={() => (window.location.href = `/customer/book/${p.id}`)}
            >
              Book Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
