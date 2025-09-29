import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createOwner, updateOwner } from "@/services/api";

interface OwnerEditFormProps {
  owner?: any;          // optional, if provided = edit, if not = create
  open: boolean;
  onClose: () => void;
  onSaved: () => void;  // callback to refresh list
}

export default function OwnerEditForm({ owner, open, onClose, onSaved }: OwnerEditFormProps) {
  const [formData, setFormData] = useState<any>({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (owner) {
      setFormData(owner);
    } else {
      setFormData({ name: "", email: "", phone: "" });
    }
  }, [owner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (owner) {
        await updateOwner(owner.id, formData);
      } else {
        await createOwner(formData);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving owner:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{owner ? "Edit Owner" : "Add Owner"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 w-full rounded"
          />
          <input
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 w-full rounded"
          />
          <input
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="Phone"
            className="border p-2 w-full rounded"
          />
          <Button onClick={handleSubmit}>
            {owner ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
