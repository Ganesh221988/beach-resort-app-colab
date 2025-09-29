import axiosClient from "@/api/axiosClient";

interface Broker {
  id: string;
  name: string;
}

interface Props {
  broker: Broker;
  open: boolean;
  onClose: () => void;
}

export default function BrokerDeleteDialog({ broker, open, onClose }: Props) {
  if (!open) return null;

  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/admin/brokers/${broker.id}`);
      onClose();
    } catch (err) {
      console.error("Error deleting broker:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Delete Broker</h2>
        <p>Are you sure you want to delete <strong>{broker.name}</strong>?</p>
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
