import axiosClient from "@/api/axiosClient";

interface Property {
  id: string;
  name: string;
}

interface Props {
  property: Property;
  open: boolean;
  onClose: () => void;
}

export default function PropertyDeleteDialog({ property, open, onClose }: Props) {
  if (!open) return null;

  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/admin/properties/${property.id}`);
      onClose();
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Delete Property</h2>
        <p>Are you sure you want to delete <strong>{property.name}</strong>?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
