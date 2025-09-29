import { useEffect, useState } from "react";
import PropertyEditForm from "./PropertyEditForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PropertyDeleteDialog from "./PropertyDeleteDialog";
import { fetchProperties, updateProperty, deleteProperty } from "@/api/adminApi";

interface Property {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
}

export default function PropertyDetails() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const res = await fetchProperties();
        setProperties(res.data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  const handleSave = async (updatedProperty: Property) => {
    try {
      await updateProperty(updatedProperty.id, updatedProperty);
      setProperties(properties.map(p => (p.id === updatedProperty.id ? updatedProperty : p)));
    } catch (err) {
      console.error("Error updating property:", err);
    }
    setEditingProperty(null);
  };

  const handleDelete = async () => {
    if (deletingProperty) {
      try {
        await deleteProperty(deletingProperty.id);
        setProperties(properties.filter(p => p.id !== deletingProperty.id));
      } catch (err) {
        console.error("Error deleting property:", err);
      }
      setDeletingProperty(null);
    }
  };

  if (loading) return <p className="p-4">Loading properties...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Property Management</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {properties.map((property) => (
          <Card key={property.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{property.name}</p>
              <p className="text-sm text-gray-500">{property.location}</p>
              <p className="text-sm text-gray-500">₹{property.pricePerNight}/night</p>
            </div>
            <div className="space-x-2">
              <Button size="sm" onClick={() => setEditingProperty(property)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => setDeletingProperty(property)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      {editingProperty && (
        <PropertyEditForm property={editingProperty} onSave={handleSave} onCancel={() => setEditingProperty(null)} />
      )}

      {deletingProperty && (
        <PropertyDeleteDialog
          isOpen={!!deletingProperty}
          title="Delete Property"
          description={`Are you sure you want to delete ${deletingProperty.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingProperty(null)}
        />
      )}
    </div>
  );
}
