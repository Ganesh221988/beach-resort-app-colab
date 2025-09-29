import React, { useEffect, useState } from "react";
import { getUsers } from "@/api/adminApi";

interface UserDetailsModalProps {
  role: "owners" | "brokers" | "customers";
  id: string | null;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ role, id, onClose }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const users = await getUsers(role);
          const found = users.find((u: any) => u.id === id);
          setUser(found);
        } catch (err) {
          console.error("Error fetching user details", err);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, role]);

  if (!id) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] max-w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✖
        </button>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : user ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {role.charAt(0).toUpperCase() + role.slice(1)} Details
            </h2>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
              {role === "owners" && <p><strong>Approved:</strong> {user.approved ? "Yes" : "No"}</p>}
              {role === "brokers" && <p><strong>Commission %:</strong> {user.commission || "Not set"}</p>}
            </div>
          </>
        ) : (
          <p className="text-center text-red-500">User not found</p>
        )}
      </div>
    </div>
  );
};

export default UserDetailsModal;
