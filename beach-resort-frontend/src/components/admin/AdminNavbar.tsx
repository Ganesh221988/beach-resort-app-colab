import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login"); // Redirect to login page
  };

  // Optional: redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="flex gap-6">
        <Link to="/admin/dashboard" className="hover:text-yellow-400">
          Dashboard
        </Link>
        <Link to="/admin/properties" className="hover:text-yellow-400">
          Properties
        </Link>
        <Link to="/admin/owners" className="hover:text-yellow-400">
          Owners
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;
