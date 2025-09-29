import axiosClient from "./axiosClient";

// --------------------- Owners ---------------------
export const fetchOwners = async () => {
  try {
    const res = await axiosClient.get("/admin/owners");
    return res.data;
  } catch (error) {
    console.error("Error fetching owners:", error);
    return [];
  }
};

export const createOwner = async (owner: any) => {
  try {
    const res = await axiosClient.post("/admin/owners", owner);
    return res.data;
  } catch (error) {
    console.error("Error creating owner:", error);
    throw error;
  }
};

export const updateOwner = async (id: number, owner: any) => {
  try {
    const res = await axiosClient.put(`/admin/owners/${id}`, owner);
    return res.data;
  } catch (error) {
    console.error("Error updating owner:", error);
    throw error;
  }
};

export const deleteOwner = async (id: number) => {
  try {
    const res = await axiosClient.delete(`/admin/owners/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting owner:", error);
    throw error;
  }
};

// --------------------- Brokers ---------------------
export const fetchBrokers = async () => {
  try {
    const res = await axiosClient.get("/admin/brokers");
    return res.data;
  } catch (error) {
    console.error("Error fetching brokers:", error);
    return [];
  }
};

export const createBroker = async (broker: any) => {
  try {
    const res = await axiosClient.post("/admin/brokers", broker);
    return res.data;
  } catch (error) {
    console.error("Error creating broker:", error);
    throw error;
  }
};

export const updateBroker = async (id: number, broker: any) => {
  try {
    const res = await axiosClient.put(`/admin/brokers/${id}`, broker);
    return res.data;
  } catch (error) {
    console.error("Error updating broker:", error);
    throw error;
  }
};

export const deleteBroker = async (id: number) => {
  try {
    const res = await axiosClient.delete(`/admin/brokers/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting broker:", error);
    throw error;
  }
};

// --------------------- Customers ---------------------
export const fetchCustomers = async () => {
  try {
    const res = await axiosClient.get("/admin/customers");
    return res.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

export const createCustomer = async (customer: any) => {
  try {
    const res = await axiosClient.post("/admin/customers", customer);
    return res.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const updateCustomer = async (id: number, customer: any) => {
  try {
    const res = await axiosClient.put(`/admin/customers/${id}`, customer);
    return res.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const deleteCustomer = async (id: number) => {
  try {
    const res = await axiosClient.delete(`/admin/customers/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

// --------------------- Properties ---------------------
export const fetchProperties = async () => {
  try {
    const res = await axiosClient.get("/admin/properties");
    return res.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
};

export const createProperty = async (property: any) => {
  try {
    const res = await axiosClient.post("/admin/properties", property);
    return res.data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const updateProperty = async (id: number, property: any) => {
  try {
    const res = await axiosClient.put(`/admin/properties/${id}`, property);
    return res.data;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};

export const deleteProperty = async (id: number) => {
  try {
    const res = await axiosClient.delete(`/admin/properties/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

// --------------------- Bookings ---------------------
export const fetchBookings = async () => {
  try {
    const res = await axiosClient.get("/admin/bookings");
    return res.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

// --------------------- Payments ---------------------
export const fetchPayments = async () => {
  try {
    const res = await axiosClient.get("/admin/payments");
    return res.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
};

// --------------------- Reports ---------------------
export const fetchRevenue = async () => {
  try {
    const res = await axiosClient.get("/admin/revenue");
    return res.data;
  } catch (error) {
    console.error("Error fetching revenue:", error);
    return [];
  }
};

export const fetchCommissions = async () => {
  try {
    const res = await axiosClient.get("/admin/commissions");
    return res.data;
  } catch (error) {
    console.error("Error fetching commissions:", error);
    return [];
  }
};
