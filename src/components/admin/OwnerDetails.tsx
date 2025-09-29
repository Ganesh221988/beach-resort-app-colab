import { useEffect, useState } from "react";
import OwnerEditForm from "./OwnerEditForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PropertyDeleteDialog from "./PropertyDeleteDialog";
import { fetchOwners, deleteOwner } from "@/api/adminApi";

interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function OwnerDetails() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingOwner, setDeletingOwner] = useState<Owner | null>(null);

  const loadOwners = async () => {
    try {
      const res = await fetchOwners();
      // in your api file you already return res.data, 
      // so just check if res.data or res directly:
      setOwners(res.data || res);
    } catch (err) {
      console.error("Error fetching owners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  const handleSaved = () => {
    loadOwners();
    setEditingOwner(null);
    setCreating(false);
  };

  const handleDelete = async () => {
    if (deletingOwner) {
      try {
        await deleteOwner(deletingOwner.id);
        setOwners(owners.filter(o => o.id !== deletingOwner.id));
      } catch (err) {
        console.error("Error deleting owner:", err);
      }
      setDeletingOwner(null);
    }
  };

  if (loading) return <p className="p-4">Loading owners...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Owner Management</h2>
        <Button onClick={() => setCreating(true)}>+ Add Owner</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {owners.map((owner) => (
          <Card key={owner.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{owner.name}</p>
              <p className="text-sm text-gray-500">{owner.email}</p>
              <p className="text-sm text-gray-500">{owner.phone}</p>
            </div>
            <div className="space-x-2">
              <Button size="sm" onClick={() => setEditingOwner(owner)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => setDeletingOwner(owner)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Owner */}
      {creating && (
        <OwnerEditForm open={creating} onClose={() => setCreating(false)} onSaved={handleSaved} />
      )}

      {/* Edit Owner */}
      {editingOwner && (
        <OwnerEditForm
          owner={editingOwner}
          open={!!editingOwner}
          onClose={() => setEditingOwner(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete Owner */}
      {deletingOwner && (
        <PropertyDeleteDialog
          isOpen={!!deletingOwner}
          title="Delete Owner"
          description={`Are you sure you want to delete ${deletingOwner.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingOwner(null)}
        />
      )}
    </div>
  );
}
