import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

// Common Pages
import LoginPage from "./pages/LoginPage";  // was Login

// Admin Pages
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";  // was ReportAnalytics
import AdminOwners from "./pages/admin/AdminOwners"; // optional replacement
import AdminBrokers from "./pages/admin/AdminBrokers";
import AdminCustomers from "./pages/admin/AdminCustomers";

// Owner Pages
import OwnerPropertyForm from "./components/owner/OwnerPropertyForm";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerPayments from "./pages/owner/OwnerPayments";

// Customer Pages
import CustomerDashboard from "./pages/CustomerDashboard";
import Favorites from "./pages/customer/Favorites";
import MyBookings from "./pages/customer/MyBookings";

// Unauthorized Page
import UnauthorizedPage from "./pages/UnauthorizedPage";


function App() {
  const { user, logout } = useContext(AuthContext)!;

  return (
    <Router>
      <div>
        {/* Navbar */}
        {user && (
          <nav style={{ padding: "10px", background: "#eee" }}>
            <span style={{ marginRight: "15px" }}>
              Logged in as: <b>{user.name}</b> ({user.role})
            </span>
            <Link to="/" style={{ marginRight: "10px" }}>
              Home
            </Link>
            {user.role === "admin" && (
              <>
                <Link to="/admin" style={{ marginRight: "10px" }}>
                  Dashboard
                </Link>
                <Link to="/admin/reports" style={{ marginRight: "10px" }}>
                  Reports
                </Link>
                <Link to="/admin/owners" style={{ marginRight: "10px" }}>
                  Owners
                </Link>
                <Link to="/admin/brokers" style={{ marginRight: "10px" }}>
                  Brokers
                </Link>
                <Link to="/admin/customers" style={{ marginRight: "10px" }}>
                  Customers
                </Link>
              </>
            )}
            {user.role === "owner" && (
              <>
                <Link to="/owner" style={{ marginRight: "10px" }}>
                  Dashboard
                </Link>
                <Link to="/owner/property-form" style={{ marginRight: "10px" }}>
                  Add Property
                </Link>
                <Link to="/owner/bookings" style={{ marginRight: "10px" }}>
                  Booking Requests
                </Link>
                </>
            )}
            {user.role === "customer" && (
              <>
                <Link to="/customer" style={{ marginRight: "10px" }}>
                  Dashboard
                </Link>
              </>
            )}
            <button onClick={logout} style={{ marginLeft: "20px" }}>
              Logout
            </button>
          </nav>
        )}

        {/* Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<ReportAnalytics />} />
          <Route path="/admin/owners" element={<OwnerTable />} />
          <Route path="/admin/brokers" element={<BrokerTable />} />
          <Route path="/admin/customers" element={<CustomerTable />} />

          {/* Owner Routes */}
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/property-form" element={<OwnerPropertyForm />} />
          <Route path="/owner/bookings" element={<OwnerBookings />} />
          <Route path="/owner/payments" element={user?.role === "owner" ? <OwnerPayments /> : <UnauthorizedPage />} />

          {/* Customer Routes */}
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route
            path="/customer/favorites"
            element={user?.role === "customer" ? <Favorites /> : <UnauthorizedPage />}
          />
          <Route
            path="/customer/my-bookings"
            element={user?.role === "customer" ? <MyBookings /> : <UnauthorizedPage />}
          />

          {/* Default Route */}
          <Route path="/" element={user ? <Navigate to={`/${user.role}`} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
