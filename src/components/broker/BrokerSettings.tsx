import React, { useState } from "react";

export default function BrokerSettings({ initial = {}, onSave }: any) {
  const [mode, setMode] = useState(initial.commissionMode || "percentage");
  const [value, setValue] = useState(initial.commissionValue || 10);

  return (
    <div className="p-4 bg-white rounded shadow max-w-md">
      <h3 className="font-semibold mb-3">Broker Commission</h3>
      <div className="flex items-center gap-3 mb-3">
        <label className="flex items-center gap-2">
          <input type="radio" checked={mode === "percentage"} onChange={() => setMode("percentage")} />
          Percentage
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" checked={mode === "flat"} onChange={() => setMode("flat")} />
          Flat
        </label>
      </div>

      <div className="mb-4">
        <input type="number" value={value} onChange={(e)=>setValue(Number(e.target.value))} className="p-2 border rounded w-full" />
      </div>

      <div className="flex justify-end">
        <button onClick={() => onSave({ commissionMode: mode, commissionValue: value })} className="px-4 py-2 bg-orange-500 text-white rounded">Save</button>
      </div>
    </div>
  );
}
