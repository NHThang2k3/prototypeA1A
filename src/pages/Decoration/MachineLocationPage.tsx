// src/pages/MachineLocationPage/MachineLocationPage.tsx

import { useState } from "react";
import { List, Map, Circle } from "lucide-react";

const machines = [
  {
    id: "HP-01",
    type: "Heat Press",
    location: "Zone A, Row 1",
    status: "Running",
    lastMaint: "2023-09-15",
    nextMaint: "2023-12-15",
  },
  {
    id: "EMB-05",
    type: "Embroidery",
    location: "Zone B, Row 3",
    status: "Idle",
    lastMaint: "2023-08-20",
    nextMaint: "2023-11-20",
  },
  {
    id: "BND-02",
    type: "Bonding",
    location: "Zone A, Row 2",
    status: "Maintenance",
    lastMaint: "2023-10-25",
    nextMaint: "2024-01-25",
  },
  {
    id: "PP-03",
    type: "Pad-Print",
    location: "Zone C, Row 1",
    status: "Running",
    lastMaint: "2023-10-01",
    nextMaint: "2024-01-01",
  },
];

// --- PHẦN SỬA LỖI ---
// 1. Định nghĩa các trạng thái máy có thể có để tăng tính an toàn
type MachineStatus = "Running" | "Idle" | "Maintenance";

// 2. Định nghĩa kiểu dữ liệu cho props của component StatusIndicator
interface StatusIndicatorProps {
  status: MachineStatus;
}
// --- KẾT THÚC PHẦN SỬA LỖI ---

// 3. Áp dụng kiểu dữ liệu đã định nghĩa vào component
const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  let colorClass = "";
  switch (status) {
    case "Running":
      colorClass = "text-green-500";
      break;
    case "Idle":
      colorClass = "text-yellow-500";
      break;
    case "Maintenance":
      colorClass = "text-red-500";
      break;
    default:
      colorClass = "text-gray-400";
  }
  return (
    <div className="flex items-center gap-2">
      <Circle size={10} className={`${colorClass} fill-current`} />
      {status}
    </div>
  );
};

const FloorPlanView = () => (
  <div className="bg-white p-6 rounded-lg shadow-md relative h-[60vh]">
    <h3 className="text-lg font-bold mb-4">Floor Plan - Decoration Area</h3>
    <div className="absolute inset-0 bg-grid-gray-200/50 bg-center"></div>
    {/* Mock machine placements */}
    <div className="absolute top-[15%] left-[10%] text-center cursor-pointer group">
      <div className="p-2 bg-green-500 rounded-full text-white text-xs font-bold">
        HP-01
      </div>
      <div className="hidden group-hover:block absolute -top-16 left-1/2 -translate-x-1/2 w-40 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10">
        Running
        <br />
        Zone A, Row 1
      </div>
    </div>
    <div className="absolute top-[40%] left-[30%] text-center cursor-pointer group">
      <div className="p-2 bg-yellow-500 rounded-full text-white text-xs font-bold">
        EMB-05
      </div>
      <div className="hidden group-hover:block absolute -top-16 left-1/2 -translate-x-1/2 w-40 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10">
        Idle
        <br />
        Zone B, Row 3
      </div>
    </div>
    <div className="absolute top-[65%] left-[55%] text-center cursor-pointer group">
      <div className="p-2 bg-red-500 rounded-full text-white text-xs font-bold">
        BND-02
      </div>
      <div className="hidden group-hover:block absolute -top-16 left-1/2 -translate-x-1/2 w-40 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10">
        Maintenance
        <br />
        Zone A, Row 2
      </div>
    </div>
  </div>
);

const ListView = () => (
  <div className="bg-white rounded-lg shadow overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-600">
      <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
        <tr>
          <th className="px-6 py-3">Machine ID</th>
          <th className="px-6 py-3">Type</th>
          <th className="px-6 py-3">Location</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Last Maintenance</th>
          <th className="px-6 py-3">Next Maintenance</th>
        </tr>
      </thead>
      <tbody>
        {machines.map((m) => (
          <tr key={m.id} className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4 font-medium text-gray-900">{m.id}</td>
            <td className="px-6 py-4">{m.type}</td>
            <td className="px-6 py-4">{m.location}</td>
            <td className="px-6 py-4">
              <StatusIndicator status={m.status as MachineStatus} />
            </td>
            <td className="px-6 py-4">{m.lastMaint}</td>
            <td className="px-6 py-4">{m.nextMaint}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MachineLocationPage = () => {
  const [view, setView] = useState("list"); // 'list' or 'plan'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Machine Management</h1>
        <div className="flex items-center p-1 bg-gray-200 rounded-lg">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md ${
              view === "list" ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            <List size={16} /> List View
          </button>
          <button
            onClick={() => setView("plan")}
            className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md ${
              view === "plan" ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            <Map size={16} /> Floor Plan
          </button>
        </div>
      </div>

      {view === "list" ? <ListView /> : <FloorPlanView />}
    </div>
  );
};

export default MachineLocationPage;
