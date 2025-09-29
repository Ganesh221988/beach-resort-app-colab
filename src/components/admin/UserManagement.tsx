// src/components/admin/UserManagement.tsx
import React, { useState } from "react";
import UserTable from "./UserTable";

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "owners" | "brokers" | "customers"
  >("owners");

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Management</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("owners")}
          className={`px-4 py-2 rounded ${
            activeTab === "owners"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Owners
        </button>
        <button
          onClick={() => setActiveTab("brokers")}
          className={`px-4 py-2 rounded ${
            activeTab === "brokers"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Brokers
        </button>
        <button
          onClick={() => setActiveTab("customers")}
          className={`px-4 py-2 rounded ${
            activeTab === "customers"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Customers
        </button>
      </div>

      {/* Table */}
      <UserTable role={activeTab} />
    </div>
  );
};

export default UserManagement;
