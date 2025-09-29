import React from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../../components/common/StatsCard";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    { title: "Owners", count: "View", link: "/admin/owners" },
    { title: "Brokers", count: "View", link: "/admin/brokers" },
    { title: "Customers", count: "View", link: "/admin/customers" },
    { title: "Properties", count: "View", link: "/admin/properties" },
    { title: "Bookings", count: "View", link: "/admin/bookings" },
    { title: "Payments", count: "View", link: "/admin/payments" },
    { title: "Reports & Analytics", count: "View", link: "/admin/reports" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.link)}
            className="bg-white shadow rounded p-6 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="text-gray-500 mt-2">{card.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
