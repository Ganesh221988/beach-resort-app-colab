import React, { useEffect, useState } from "react";
import { fetchOwners } from "../../api/adminApi";

interface Owner {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const AdminOwners: React.FC = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOwners = async () => {
      setLoading(true);
      try {
        const data = await fetchOwners();
        setOwners(data);
      } catch (error) {
        console.error("Error fetching owners:", error);
      } finally {
        setLoading(false);
      }
    };
    getOwners();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading owners...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Owners</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((owner) => (
              <tr key={owner.id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{owner.id}</td>
                <td className="py-2 px-4">{owner.name}</td>
                <td className="py-2 px-4">{owner.email}</td>
                <td className="py-2 px-4">{owner.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOwners;
