import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import UserTable from "../../components/admin/UserTable";

type User = {
  id: string;
  role: "owner" | "broker" | "customer";
  name: string;
  email: string;
  phone?: string;
  verified?: boolean;
  approved?: boolean;
};

const UserManagement: React.FC = () => {
  const [owners, setOwners] = useState<User[]>([]);
  const [brokers, setBrokers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const [ownersRes, brokersRes, customersRes] = await Promise.all([
        axiosClient.get("/admin/owners"),
        axiosClient.get("/admin/brokers"),
        axiosClient.get("/admin/customers"),
      ]);

      setOwners(ownersRes.data);
      setBrokers(brokersRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (role: string, id: string) => {
    try {
      await axiosClient.put(`/admin/${role}/${id}/approve`);
      fetchUsers();
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleDelete = async (role: string, id: string) => {
    try {
      await axiosClient.delete(`/admin/${role}/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading users...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Owners</h2>
        <UserTable
          users={owners}
          role="owner"
          onApprove={handleApprove}
          onDelete={handleDelete}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Brokers</h2>
        <UserTable
          users={brokers}
          role="broker"
          onApprove={handleApprove}
          onDelete={handleDelete}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Customers</h2>
        <UserTable
          users={customers}
          role="customer"
          onApprove={handleApprove}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default UserManagement;
