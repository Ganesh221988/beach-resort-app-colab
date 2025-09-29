import CustomerDetails from "@/components/admin/CustomerDetails";
import PropertyDetails from "@/components/admin/PropertyDetails";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">Customers</h2>
      <CustomerDetails />
      <h2 className="text-xl font-semibold mt-8 mb-4">Properties</h2>
      <PropertyDetails />
    </div>
  );
}
