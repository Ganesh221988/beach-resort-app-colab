import React, { useState } from "react";
import { useEvents } from "../../contexts/EventContext";

const EventForm: React.FC = () => {
  const { addEvent } = useEvents();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return alert("Please fill in all fields!");

    addEvent({ id: Date.now(), name, date, description }); // ✅ FIXED (using name)
    setName("");
    setDate("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded-xl">
      <h2 className="text-lg font-bold">Add New Event</h2>
      <input
        type="text"
        placeholder="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Event
      </button>
    </form>
  );
};

export default EventForm;
