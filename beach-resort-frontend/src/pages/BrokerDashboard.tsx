import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function BrokerDashboard() {
  const { user, logout } = useContext(AuthContext)!;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Broker Dashboard</h1>
      <p>Welcome, {user?.name} ({user?.email})</p>

      <ul>
        <li>Set Commission</li>
        <li>View Deals</li>
        <li>Payments</li>
      </ul>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default BrokerDashboard;
