import axiosClient from "./axiosClient";

export const getCustomers = () => axiosClient.get("/customers");
export const getCustomer = (id: number) => axiosClient.get(`/customers/${id}`);
export const createCustomer = (data: any) => axiosClient.post("/customers", data);
export const updateCustomer = (id: number, data: any) => axiosClient.put(`/customers/${id}`, data);
export const deleteCustomer = (id: number) => axiosClient.delete(`/customers/${id}`);
