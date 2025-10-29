// src/pages/ActionPlanPage/ActionPlanPage.tsx

import { PlusCircle, User, Calendar } from "lucide-react";

const actionPlanData = [
  {
    id: "AP-001",
    problem: "High defect rate on STYLE-A01 (Heat Press)",
    cause: "Incorrect machine temperature",
    assignedTo: "John Doe",
    dueDate: "2023-11-05",
    status: "In Progress",
  },
  {
    id: "AP-002",
    problem: "Embroidery machine #5 downtime",
    cause: "Broken needle sensor",
    assignedTo: "Maintenance Team",
    dueDate: "2023-10-30",
    status: "Completed",
  },
  {
    id: "AP-003",
    problem: "Pad-Print ink smudging issue",
    cause: "Incorrect ink viscosity",
    assignedTo: "Jane Smith",
    dueDate: "2023-11-10",
    status: "New",
  },
  {
    id: "AP-004",
    problem: "Delay in accessory delivery to Bonding line",
    cause: "Warehouse process inefficiency",
    assignedTo: "Warehouse Manager",
    dueDate: "2023-11-15",
    status: "New",
  },
  {
    id: "AP-005",
    problem: "Bonding adhesion failure on PO12348",
    cause: "Contamination on fabric surface",
    assignedTo: "QC Team",
    dueDate: "2023-10-28",
    status: "Verified",
  },
];

// --- PHẦN SỬA LỖI ---
// 1. Định nghĩa các trạng thái có thể có để tăng tính an toàn
type ActionStatus = "New" | "In Progress" | "Completed" | "Verified";

// 2. Định nghĩa kiểu dữ liệu cho props của StatusBadge
interface StatusBadgeProps {
  status: ActionStatus;
}
// --- KẾT THÚC PHẦN SỬA LỖI ---

// 3. Áp dụng kiểu dữ liệu đã định nghĩa vào component
const StatusBadge = ({ status }: StatusBadgeProps) => {
  const baseClasses =
    "px-2.5 py-1 text-xs font-medium rounded-full inline-block";
  switch (status) {
    case "In Progress":
      return (
        <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
          {status}
        </span>
      );
    case "New":
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          {status}
        </span>
      );
    case "Completed":
      return (
        <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
          {status}
        </span>
      );
    case "Verified":
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          {status}
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          {status}
        </span>
      );
  }
};

const ActionPlanPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Action Plan Management
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
          <PlusCircle size={16} /> Create Action Plan
        </button>
      </div>

      <div className="p-4 bg-white rounded-lg shadow grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by problem..."
          className="md:col-span-2 w-full p-2 border border-gray-300 rounded-md"
        />
        <select className="w-full p-2 border border-gray-300 rounded-md">
          <option>Filter by Status</option>
          <option>New</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Verified</option>
        </select>
        <select className="w-full p-2 border border-gray-300 rounded-md">
          <option>Filter by Assignee</option>
          <option>John Doe</option>
          <option>Jane Smith</option>
        </select>
      </div>

      <div className="space-y-4">
        {actionPlanData.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <span className="font-bold text-blue-600">{item.id}</span>
                <h2 className="text-lg font-semibold text-gray-800 mt-1">
                  {item.problem}
                </h2>
              </div>
              <div className="mt-2 md:mt-0">
                {/* TypeScript giờ đã biết item.status là một trong các giá trị hợp lệ */}
                <StatusBadge status={item.status as ActionStatus} />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-medium text-gray-600">Root Cause:</span>{" "}
              {item.cause}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400" /> Assigned To:{" "}
                <span className="font-medium">{item.assignedTo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" /> Due Date:{" "}
                <span className="font-medium">{item.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionPlanPage;
