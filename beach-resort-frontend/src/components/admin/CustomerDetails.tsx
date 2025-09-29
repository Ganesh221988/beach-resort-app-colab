import { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";
import { Card } from "@/components/ui/card";
import CustomerDeleteDialog from "./CustomerDeleteDialog";
import CustomerEditForm from "./CustomerEditForm";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function CustomerDetails() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await axiosClient.get("/admin/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) return <p className="p-4">Loading customers...</p>;
  if (customers.length === 0) return <p className="p-4">No customers found.</p>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => (
        <Card key={customer.id} className="p-4 shadow rounded">
          <h2 className="text-lg font-semibold">{customer.name}</h2>
          <p className="text-sm text-gray-600">{customer.email}</p>
          <p className="text-sm">{customer.phone}</p>
          <p className="text-xs text-gray-500">
            Joined: {new Date(customer.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              className="bg-blue-600 text-white px-2 py-1 rounded"
              onClick={() => { setSelectedCustomer(customer); setEditOpen(true); }}
            >
              Edit
            </button>
            <button
              className="bg-red-600 text-white px-2 py-1 rounded"
              onClick={() => { setSelectedCustomer(customer); setDeleteOpen(true); }}
            >
              Delete
            </button>
          </div>
        </Card>
      ))}

      {selectedCustomer && (
        <CustomerDeleteDialog
          customer={selectedCustomer}
          open={deleteOpen}
          onClose={() => { setDeleteOpen(false); fetchCustomers(); }}
        />
      )}

      {selectedCustomer && (
        <CustomerEditForm
          customer={selectedCustomer}
          open={editOpen}
          onClose={() => { setEditOpen(false); fetchCustomers(); }}
        />
      )}
    </div>
  );
}
