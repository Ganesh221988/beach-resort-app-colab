// src/components/settings/SettingsPage.tsx
import React, { useState } from "react";
import { Save } from "lucide-react";

type RazorpaySettings = {
  razorpayKeyId: string;
  razorpayKeySecret: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<RazorpaySettings>({
    razorpayKeyId: "",
    razorpayKeySecret: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: Replace with API call to save in DB
    localStorage.setItem("razorpaySettings", JSON.stringify(settings));
    alert("Razorpay settings saved successfully!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Payment Settings</h1>

      <div className="space-y-4 bg-white shadow rounded-xl p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Razorpay Key ID
          </label>
          <input
            type="text"
            name="razorpayKeyId"
            value={settings.razorpayKeyId}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your Razorpay Key ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Razorpay Key Secret
          </label>
          <input
            type="password"
            name="razorpayKeySecret"
            value={settings.razorpayKeySecret}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your Razorpay Key Secret"
          />
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl shadow transition"
        >
          <Save size={20} />
          Save Settings
        </button>
      </div>
    </div>
  );
}
