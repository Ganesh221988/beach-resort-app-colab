import React, { useEffect, useState } from "react";
import { fetchPayments } from "../../api/adminApi";

interface Payment {
  id: number;
  bookingId: number;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPayments = async () => {
      setLoading(true);
      try {
        const data = await fetchPayments();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };
    getPayments();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading payments...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Payments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Booking ID</th>
              <th className="py-2 px-4">Customer</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{payment.id}</td>
                <td className="py-2 px-4">{payment.bookingId}</td>
                <td className="py-2 px-4">{payment.customer}</td>
                <td className="py-2 px-4">₹{payment.amount}</td>
                <td className="py-2 px-4">{payment.status}</td>
                <td className="py-2 px-4">{new Date(payment.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
