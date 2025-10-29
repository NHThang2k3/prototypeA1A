// src/pages/DecorationDashboardPage/DecorationDashboardPage.tsx

import React from "react"; // Quan trọng: Cần import React để dùng React.ElementType
import {
  BarChart3,
  Zap,
  ShieldAlert,
  Wifi,
  TrendingUp,
  TrendingDown,
  Target,
} from "lucide-react";

// --- PHẦN SỬA LỖI ---
// 1. Định nghĩa một interface để mô tả các props cho KPICard
interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ElementType; // Kiểu dữ liệu cho một component
  color: string;
}
// --- KẾT THÚC PHẦN SỬA LỖI ---

// 2. Áp dụng interface đã định nghĩa vào component
const KPICard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon, // bạn vẫn có thể đổi tên prop 'icon' thành 'Icon' để dùng trong component
  color,
}: KPICardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      <div
        className={`flex items-center text-sm mt-2 ${
          changeType === "increase" ? "text-green-600" : "text-red-600"
        }`}
      >
        {changeType === "increase" ? (
          <TrendingUp size={16} className="mr-1" />
        ) : (
          <TrendingDown size={16} className="mr-1" />
        )}
        <span>{change} vs last week</span>
      </div>
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
  </div>
);

// Giả lập component biểu đồ
const MockBarChart = () => (
  <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
    <p className="text-gray-500">Bar Chart Placeholder</p>
  </div>
);
const MockPieChart = () => (
  <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
    <p className="text-gray-500">Pie Chart Placeholder</p>
  </div>
);

const DecorationDashboardPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Decoration Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Output (Today)"
          value="15,430 pcs"
          change="+5.2%"
          changeType="increase"
          icon={BarChart3}
          color="bg-blue-500"
        />
        <KPICard
          title="Overall Efficiency"
          value="92.1%"
          change="+1.5%"
          changeType="increase"
          icon={Zap}
          color="bg-green-500"
        />
        <KPICard
          title="Defect Rate"
          value="1.8%"
          change="-0.3%"
          changeType="decrease"
          icon={ShieldAlert}
          color="bg-red-500"
        />
        <KPICard
          title="Machines Online"
          value="38 / 40"
          change="-1"
          changeType="decrease"
          icon={Wifi}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main charts */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Output by Process (Today)
          </h2>
          <MockBarChart />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Machine Status
          </h2>
          <MockPieChart />
        </div>
      </div>

      {/* Target vs Actual */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Daily Target vs Actual
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target size={16} /> Overall Target: 85,000 pcs
          </div>
        </div>
        <div className="space-y-4">
          {["Heat Press", "Embroidery", "Pad-Print", "Bonding"].map(
            (process) => {
              const percentage = Math.floor(Math.random() * (95 - 70 + 1) + 70); // Random 70-95%
              return (
                <div key={process}>
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span>{process}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default DecorationDashboardPage;
