import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosClient from "@/api/axiosClient";

interface EditBrokerProps {
  broker: any;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditBroker({ broker, open, onClose, onUpdated }: EditBrokerProps) {
  const [form, setForm] = useState(broker);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await axiosClient.put(`/admin/brokers/${broker.id}`, form);
    onUpdated();
    onClose();
  };

  if (!broker) return null;

  return (
    <Dialog open={open} onOpenChange={on
