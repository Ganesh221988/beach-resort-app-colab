import React, { useEffect, useState } from "react";
import { fetchBrokers } from "../../api/adminApi";

interface Broker {
  id: number;
  name: string;
  email: string;
  phone: string;
  commissionRate: number;
}

const AdminBrokers: React.FC = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBrokers = async () => {
      setLoading(true);
      try {
        const data = await fetchBrokers();
        setBrokers(data);
      } catch (error) {
        console.error("Error fetching brokers:", error);
      } finally {
        setLoading(false);
      }
    };
    getBrokers();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading brokers...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Brokers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Commission Rate</th>
            </tr>
          </thead>
          <tbody>
            {brokers.map((broker) => (
              <tr key={broker.id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{broker.id}</td>
                <td className="py-2 px-4">{broker.name}</td>
                <td className="py-2 px-4">{broker.email}</td>
                <td className="py-2 px-4">{broker.phone}</td>
                <td className="py-2 px-4">{broker.commissionRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBrokers;
