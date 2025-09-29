import React, { useEffect, useState } from "react";
import apiClient from "../../api/axiosClient";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

/**
 * OwnerPayments
 * Shows payments for the logged-in owner, allows:
 * - view payments (bookingId, property, amount, status, date)
 * - request payout for available balance
 * - mark payout as paid (owner confirms or admin confirms — implement per your business rules)
 *
 * Backend endpoints used (see below "Backend Contract" for details)
 */

interface Payment {
  id: string;
  bookingId: string;
  propertyId: string;
  propertyTitle: string;
  amount: number;
  currency?: string;
  status: "pending" | "paid" | "refunded";
  paidOut?: boolean; // if owner was paid out for this booking
  createdAt: string;
}

const OwnerPayments: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    fetchPayments();
  }, [user?.id]);

  const fetchPayments = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // backend should return payments and computed owner balance
      const res = await apiClient.get(`/owners/${user.id}/payments`);
      // expected res.data = { payments: Payment[], balance: number }
      setPayments(res.data.payments || []);
      setBalance(res.data.balance ?? 0);
    } catch (err) {
      console.error("Failed to fetch owner payments:", err);
      alert("Failed to load payments. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const requestPayout = async () => {
    if (!user?.id) return;
    if (balance <= 0) return alert("No available balance for payout.");
    if (!confirm(`Request payout of ₹${balance.toFixed(2)}?`)) return;

    try {
      setProcessingId("REQUEST_PAYOUT");
      const res = await apiClient.post(`/owners/${user.id}/payouts`, { amount: balance });
      // backend should return updated payments/balance
      alert("Payout request submitted.");
      await fetchPayments();
    } catch (err) {
      console.error("Payout request failed:", err);
      alert("Payout request failed. See console.");
    } finally {
      setProcessingId(null);
    }
  };

  const markAsPaidOut = async (paymentId: string) => {
    if (!user?.id) return;
    if (!confirm("Mark this payment as paid out?")) return;

    try {
      setProcessingId(paymentId);
      // toggle or set paidOut to true for a specific payment
      await apiClient.post(`/owners/${user.id}/payments/${paymentId}/mark-paid`);
      await fetchPayments();
    } catch (err) {
      console.error("Mark-paid failed:", err);
      alert("Action failed. See console.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-4">Loading payments...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Payments & Payouts</h2>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Available balance</p>
          <p className="text-2xl font-bold">₹{balance.toFixed(2)}</p>
        </div>

        <div>
          <Button
            onClick={requestPayout}
            disabled={processingId !== null || balance <= 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {processingId === "REQUEST_PAYOUT" ? "Requesting..." : "Request Payout"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {payments.length === 0 ? (
          <p>No payments found yet.</p>
        ) : (
          payments.map((p) => (
            <Card key={p.id} className="shadow">
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{p.propertyTitle}</p>
                    <p className="text-sm text-gray-600">Booking: {p.bookingId}</p>
                    <p className="text-sm">Amount: ₹{p.amount.toFixed(2)} {p.currency ?? ""}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(p.createdAt).toLocaleString()}</p>
                    <p className="mt-1">
                      Status:{" "}
                      <span
                        className={
                          p.status === "paid"
                            ? "text-green-600 font-semibold"
                            : p.status === "refunded"
                            ? "text-red-600 font-semibold"
                            : "text-yellow-600 font-semibold"
                        }
                      >
                        {p.status.toUpperCase()}
                      </span>
                    </p>
                    <p className="text-sm mt-1">Payout: {p.paidOut ? "Paid Out" : "Not Paid"}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!p.paidOut && p.status === "paid" && (
                      <Button
                        onClick={() => markAsPaidOut(p.id)}
                        disabled={processingId !== null}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processingId === p.id ? "Processing..." : "Mark as Paid Out"}
                      </Button>
                    )}
                    {p.paidOut && <div className="text-sm text-gray-600">Payout completed</div>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OwnerPayments;
