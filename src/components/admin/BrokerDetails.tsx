import { useEffect, useState } from "react";
import BrokerEditForm from "./BrokerEditForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PropertyDeleteDialog from "./PropertyDeleteDialog";
import { fetchBrokers, updateBroker, deleteBroker } from "@/api/adminApi";

interface Broker {
  id: string;
  name: string;
  email: string;
  commissionRate: number;
}

export default function BrokerDetails() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBroker, setEditingBroker] = useState<Broker | null>(null);
  const [deletingBroker, setDeletingBroker] = useState<Broker | null>(null);

  useEffect(() => {
    const loadBrokers = async () => {
      try {
        const res = await fetchBrokers();
        setBrokers(res.data);
      } catch (err) {
        console.error("Error fetching brokers:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBrokers();
  }, []);

  const handleSave = async (updatedBroker: Broker) => {
    try {
      await updateBroker(updatedBroker.id, updatedBroker);
      setBrokers(brokers.map(b => (b.id === updatedBroker.id ? updatedBroker : b)));
    } catch (err) {
      console.error("Error updating broker:", err);
    }
    setEditingBroker(null);
  };

  const handleDelete = async () => {
    if (deletingBroker) {
      try {
        await deleteBroker(deletingBroker.id);
        setBrokers(brokers.filter(b => b.id !== deletingBroker.id));
      } catch (err) {
        console.error("Error deleting broker:", err);
      }
      setDeletingBroker(null);
    }
  };

  if (loading) return <p className="p-4">Loading brokers...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Broker Management</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {brokers.map((broker) => (
          <Card key={broker.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{broker.name}</p>
              <p className="text-sm text-gray-500">{broker.email}</p>
              <p className="text-sm text-gray-500">Commission: {broker.commissionRate}%</p>
            </div>
            <div className="space-x-2">
              <Button size="sm" onClick={() => setEditingBroker(broker)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => setDeletingBroker(broker)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      {editingBroker && (
        <BrokerEditForm broker={editingBroker} onSave={handleSave} onCancel={() => setEditingBroker(null)} />
      )}

      {deletingBroker && (
        <PropertyDeleteDialog
          isOpen={!!deletingBroker}
          title="Delete Broker"
          description={`Are you sure you want to delete ${deletingBroker.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingBroker(null)}
        />
      )}
    </div>
  );
}
