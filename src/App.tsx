import React, { useContext } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import { SocialMediaProvider } from "./contexts/SocialMediaContext";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Common Pages
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import AdminOwners from "./pages/admin/AdminOwners";
import AdminBrokers from "./pages/admin/AdminBrokers";
import AdminCustomers from "./pages/admin/AdminCustomers";
import OwnerDashboard from "./pages/OwnerDashboard";

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


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { user, logout } = useContext(AuthContext)!;

  return (
    <ThemeProvider theme={theme}>
      <SocialMediaProvider>
        {/* Navbar */}
        {user && (
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 2 }}>
                Beach Resort
              </Typography>
              
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                
                {user.role === "admin" && (
                  <>
                    <Button color="inherit" component={Link} to="/admin">
                      Dashboard
                    </Button>
                    <Button color="inherit" component={Link} to="/admin/reports">
                      Reports
                    </Button>
                    <Button color="inherit" component={Link} to="/admin/owners">
                      Owners
                    </Button>
                    <Button color="inherit" component={Link} to="/admin/brokers">
                      Brokers
                    </Button>
                    <Button color="inherit" component={Link} to="/admin/customers">
                      Customers
                    </Button>
                  </>
                )}
                
                {user.role === "owner" && (
                  <>
                    <Button color="inherit" component={Link} to="/owner">
                      Dashboard
                    </Button>
                    <Button color="inherit" component={Link} to="/owner/property-form">
                      Add Property
                    </Button>
                    <Button color="inherit" component={Link} to="/owner/bookings">
                      Booking Requests
                    </Button>
                  </>
                )}
                
                {user.role === "customer" && (
                  <>
                    <Button color="inherit" component={Link} to="/customer">
                      Dashboard
                    </Button>
                  </>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2">
                  {user.name} ({user.role})
                </Typography>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
        )}

        {/* Routes */}
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<ReportsAnalytics />} />
            <Route path="/admin/owners" element={<AdminOwners />} />
            <Route path="/admin/brokers" element={<AdminBrokers />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />

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
        </Container>
      </SocialMediaProvider>
    </ThemeProvider>
  );
}

export default App;
