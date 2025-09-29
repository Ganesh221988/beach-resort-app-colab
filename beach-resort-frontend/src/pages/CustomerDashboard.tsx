import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function CustomerDashboard() {
  const { user, logout } = useContext(AuthContext)!;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Dashboard</h1>
      <p>Welcome, {user?.name} ({user?.email})</p>

      <ul>
        <li>Browse Properties</li>
        <li>My Bookings</li>
        <li>Payments</li>
      </ul>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default CustomerDashboard;
