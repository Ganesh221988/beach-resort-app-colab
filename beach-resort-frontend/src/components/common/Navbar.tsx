import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear auth context
    navigate("/login"); // Redirect to login
  };

  if (!user) return null; // hide navbar if not logged in

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="font-bold text-xl">🏖️ Beach Resort</div>

      <ul className="flex space-x-6">
        {user.role === "admin" && (
          <>
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => isActive ? "underline" : ""}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => isActive ? "underline" : ""}
              >
                Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/properties"
                className={({ isActive }) => isActive ? "underline" : ""}
              >
                Properties
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/reports"
                className={({ isActive }) => isActive ? "underline" : ""}
              >
                Reports & Analytics
              </NavLink>
            </li>
          </>
        )}

        {user.role === "owner" && (
          <>
            <li><NavLink to="/owner/bookings">Bookings</NavLink></li>
            <li><NavLink to="/owner/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/owner/properties">My Properties</NavLink></li>
            <li><NavLink to="/owner/bookings">Bookings</NavLink></li>
            <li><NavLink to="/owner/bookings">Booking Requests</NavLink></li>
          </>
        )}

        {user.role === "customer" && (
          <>
           <li><NavLink to="/customer/dashboard">Dashboard</NavLink></li>
    <li><NavLink to="/properties">Browse</NavLink></li>
    <li><NavLink to="/customer/favorites">Favorites</NavLink></li>
    <li><NavLink to="/customer/my-bookings">My Bookings</NavLink></li>
          </>
        )}

        {user.role === "broker" && (
          <>
            <li><NavLink to="/broker/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/broker/commissions">Commissions</NavLink></li>
            <li><NavLink to="/broker/payments">Payments</NavLink></li>
          </>
        )}
      </ul>

      <div className="flex items-center">
        <span className="mr-4">{user.name} ({user.role})</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
