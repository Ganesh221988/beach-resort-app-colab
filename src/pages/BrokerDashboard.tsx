import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/axiosClient";
import BrokerHeader from "../components/broker/BrokerHeader";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

interface Commission {
  id: string;
  propertyId: string;
  propertyTitle: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  dueDate: string;
}

const BrokerDashboard: React.FC = () => {
  const auth = useContext(AuthContext);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommissions = async () => {
    if (!auth?.user?.id) return;
    try {
      setLoading(true);
      const res = await apiClient.get(`/brokers/${auth.user.id}/commissions`);
      setCommissions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch commissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      await apiClient.put(`/commissions/${id}/mark-paid`);
      setCommissions(prev => 
        prev.map(comm => 
          comm.id === id ? { ...comm, status: 'PAID' as const } : comm
        )
      );
    } catch (err) {
      console.error("Failed to mark commission as paid:", err);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    if (auth?.user?.id) {
      fetchCommissions();
    }
  }, [auth?.user?.id]);

  if (!auth) return null;

  return (
    <div>
      <BrokerHeader />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">My Commissions</h2>

        {loading ? (
          <p>Loading commissions...</p>
        ) : commissions.length === 0 ? (
          <p>No commissions found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commissions.map((commission) => (
              <Card key={commission.id} className="shadow-md">
                <CardContent>
                  <h3 className="text-lg font-semibold">{commission.propertyTitle}</h3>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(commission.dueDate).toLocaleDateString()}
                  </p>
                  <p className="mt-1 font-medium">₹{commission.amount}</p>
                  <p className={`mt-2 text-sm ${
                    commission.status === 'PAID' 
                      ? 'text-green-600' 
                      : 'text-yellow-600'
                  }`}>
                    Status: {commission.status}
                  </p>

                  {commission.status === 'PENDING' && (
                    <div className="mt-3">
                      <Button
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={() => markAsPaid(commission.id)}
                      >
                        Mark as Paid
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrokerDashboard;
