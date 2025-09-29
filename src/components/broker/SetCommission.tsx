// src/components/broker/SetCommission.tsx
import React, { useState } from "react";

const SetCommission: React.FC<{ onSave: (commission: any) => void }> = ({ onSave }) => {
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState("");

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="font-bold mb-2">Set Commission</h2>
      <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 w-full mb-2">
        <option value="percentage">Percentage</option>
        <option value="flat">Flat Rate</option>
      </select>
      <input
        type="number"
        placeholder="Enter value"
        className="border p-2 w-full mb-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => onSave({ type, value: Number(value) })}
      >
        Save Commission
      </button>
    </div>
  );
};

export default SetCommission;
