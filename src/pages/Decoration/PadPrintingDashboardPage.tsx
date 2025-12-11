// src/pages/Decoration/PadPrintingDashboardPage.tsx

import React from "react";
import {
  BarChart3,
  Zap,
  ShieldAlert,
  Wifi,
  TrendingUp,
  TrendingDown,
  Target,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// --- TYPE DEFINITIONS ---
interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ElementType;
  color: string;
}

// --- UI COMPONENTS ---
const KPICard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
}: KPICardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      <p
        className={`flex items-center text-sm mt-2 text-muted-foreground ${
          changeType === "increase" ? "text-green-600" : "text-red-600"
        }`}
      >
        {changeType === "increase" ? (
          <TrendingUp size={16} className="mr-1" />
        ) : (
          <TrendingDown size={16} className="mr-1" />
        )}
        <span>{change} vs last week</span>
      </p>
    </CardContent>
  </Card>
);

const PadPrintingDashboardPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Pad-Printing Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Output (Today)"
          value="2,460 pcs"
          change="+3.7%"
          changeType="increase"
          icon={BarChart3}
          color="bg-blue-500"
        />
        <KPICard
          title="Printing Efficiency"
          value="89.8%"
          change="+0.9%"
          changeType="increase"
          icon={Zap}
          color="bg-green-500"
        />
        <KPICard
          title="Defect Rate"
          value="1.5%"
          change="-0.5%"
          changeType="decrease"
          icon={ShieldAlert}
          color="bg-red-500"
        />
        <KPICard
          title="Machines Online"
          value="7 / 8"
          change="-1"
          changeType="decrease"
          icon={Wifi}
          color="bg-yellow-500"
        />
      </div>

      {/* Target vs Actual */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Daily Target vs Actual</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Target size={16} /> Overall Target: 15,000 pcs
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Station 1", "Station 2", "Station 3", "Station 4"].map(
            (station) => {
              const percentage = Math.floor(Math.random() * (95 - 70 + 1) + 70); // Random 70-95%
              return (
                <div key={station}>
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span>{station}</span>
                    <span>{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2.5" />
                </div>
              );
            }
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PadPrintingDashboardPage;
