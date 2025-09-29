<Route
  path="/customer/my-bookings"
  element={user?.role === "customer" ? <MyBookings /> : <UnauthorizedPage />}
/>
