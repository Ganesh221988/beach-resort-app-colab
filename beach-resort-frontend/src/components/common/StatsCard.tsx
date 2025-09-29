// src/components/common/StatsCard.tsx
import { Card, CardContent } from "../ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType; // ✅ fixed
}

export default function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-xl font-bold">{value}</h2>
        </div>
        <Icon className="h-6 w-6 text-blue-600" />
      </CardContent>
    </Card>
  );
}
