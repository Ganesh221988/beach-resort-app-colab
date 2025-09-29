import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosClient from "@/api/axiosClient";

interface EditOwnerProps {
  owner: any;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void; // refresh callback
}

export default function EditOwner({ owner, open, onClose, onUpdated }: EditOwnerProps) {
  const [form, setForm] = useState(owner);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await axiosClient.put(`/admin/owners/${owner.id}`, form);
    onUpdated();
    onClose();
  };

  if (!owner) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Owner</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 w-full" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border p-2 w-full" />
          <Button onClick={handleSave} className="w-full">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
