import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { fetchRevenue, fetchBookings, fetchCommissions } from "../../api/adminApi";

interface RevenueData {
  month: string;
  revenue: number;
}

interface BookingData {
  status: string;
  count: number;
}

interface CommissionData {
  broker: string;
  commission: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ReportsAnalytics: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [commissionData, setCommissionData] = useState<CommissionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [revenue, bookings, commissions] = await Promise.all([
          fetchRevenue(),
          fetchBookings(),
          fetchCommissions(),
        ]);
        setRevenueData(revenue);
        setBookingData(bookings);
        setCommissionData(commissions);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-lg font-semibold">Loading Reports & Analytics...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Overview */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-4">Bookings Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {bookingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Broker Commissions */}
        <div className="bg-white shadow rounded p-4 md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Broker Commissions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={commissionData}>
              <XAxis dataKey="broker" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="commission" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
