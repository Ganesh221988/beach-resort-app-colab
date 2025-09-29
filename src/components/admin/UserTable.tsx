import { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

interface UserTableProps {
  role: "owners" | "customers" | "brokers";
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
}

export default function UserTable({ role, onEdit, onDelete }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosClient.get(`/admin/${role}`);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [role]);

  if (loading) return <p>Loading {role}...</p>;
  if (users.length === 0) return <p>No {role} found.</p>;

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Phone</th>
          <th className="p-2 border">Joined</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="text-center border">
            <td className="p-2 border">{user.name}</td>
            <td className="p-2 border">{user.email}</td>
            <td className="p-2 border">{user.phone}</td>
            <td className="p-2 border">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="p-2 border flex justify-center gap-2">
              <Button
                onClick={() => onEdit && onEdit(user)}
                className="bg-blue-500 text-white"
              >
                Edit
              </Button>
              <Button
                onClick={() => onDelete && onDelete(user.id)}
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
