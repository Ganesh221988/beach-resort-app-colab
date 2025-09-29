import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/axiosClient";
import OwnerPropertyForm from "../components/owner/OwnerPropertyForm";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  images?: string[];
}

function OwnerDashboard() {
  const { user, logout } = useContext(AuthContext)!;
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPropertyId, setEditPropertyId] = useState<string | null>(null);

  const fetchProperties = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await apiClient.get(`/owners/${user.id}/properties`);
      setProperties(res.data || []);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await apiClient.delete(`/owners/${user?.id}/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      alert("Property deleted ✅");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete ❌");
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user?.id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Owner Dashboard</h1>
      <p className="mb-4">
        Welcome, {user?.name} ({user?.email})
      </p>

      <div className="flex justify-between mb-4">
        <Button onClick={() => { setEditPropertyId(null); setShowForm(!showForm); }}>
          {showForm ? "Close Form" : "Add New Property"}
        </Button>
        <Button variant="destructive" onClick={logout}>Logout</Button>
      </div>

      {showForm && (
        <OwnerPropertyForm
          propertyId={editPropertyId || undefined}
          onSuccess={() => {
            fetchProperties();
            setShowForm(false);
            setEditPropertyId(null);
          }}
        />
      )}

      <h2 className="text-xl font-semibold mt-6 mb-3">My Properties</h2>

      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <p>No properties added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((property) => (
            <Card key={property.id} className="shadow-md">
              <CardContent>
                <h3 className="text-lg font-semibold">{property.title}</h3>
                <p className="text-sm text-gray-600">{property.location}</p>
                <p className="mt-1">₹{property.price} / night</p>
                <p className="text-sm mt-2">{property.description}</p>

                {property.images && property.images.length > 0 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto">
                    {property.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={property.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditPropertyId(property.id);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(property.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;
