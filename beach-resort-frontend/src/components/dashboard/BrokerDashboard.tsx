import React from "react";
import { Card, CardContent } from "../ui/card";
import SetCommission from "../broker/SetCommission";
import BrokerPaymentForm from "../broker/BrokerPaymentForm";
import BrokerSettings from "../broker/BrokerSettings";

const BrokerDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Broker Dashboard</h1>

      {/* Commission Section */}
      <Card className="mb-6 shadow-md">
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Set Commission</h2>
          <SetCommission />
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card className="mb-6 shadow-md">
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Broker Payments</h2>
          <BrokerPaymentForm />
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card className="shadow-md">
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <BrokerSettings />
        </CardContent>
      </Card>
    </div>
  );
};

export default BrokerDashboard;
