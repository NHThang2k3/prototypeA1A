// src/pages/ToolManagementPage/ToolManagementPage.tsx

import React, { useState } from "react";
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  Trash2,
  Edit,
  History,
} from "lucide-react";

// Define the data type for a tool
type Tool = {
  id: string;
  type: "Round Knife" | "Straight Knife" | "Blade";
  status: "Active" | "Maintenance" | "Decommissioned";
  currentUsage: number; // unit: meters
  usageThreshold: number; // unit: meters
  lastMaintenance: string;
  assignedTo: string;
};

// Mock data
const mockTools: Tool[] = [
  {
    id: "KNIFE-001",
    type: "Straight Knife",
    status: "Active",
    currentUsage: 7500,
    usageThreshold: 10000,
    lastMaintenance: "2023-10-15",
    assignedTo: "Cutting Table 1",
  },
  {
    id: "KNIFE-002",
    type: "Straight Knife",
    status: "Maintenance",
    currentUsage: 9800,
    usageThreshold: 10000,
    lastMaintenance: "2023-10-10",
    assignedTo: "Cutting Table 2",
  },
  {
    id: "BLADE-05A",
    type: "Blade",
    status: "Active",
    currentUsage: 450,
    usageThreshold: 500,
    lastMaintenance: "N/A",
    assignedTo: "Knife 1",
  },
  {
    id: "KNIFE-003",
    type: "Round Knife",
    status: "Decommissioned",
    currentUsage: 12000,
    usageThreshold: 12000,
    lastMaintenance: "2023-09-01",
    assignedTo: "Warehouse",
  },
  {
    id: "BLADE-05B",
    type: "Blade",
    status: "Active",
    currentUsage: 120,
    usageThreshold: 500,
    lastMaintenance: "N/A",
    assignedTo: "Knife 3",
  },
];

// Utility function to get status badge classes
const getStatusBadgeClass = (status: Tool["status"]) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Maintenance":
      return "bg-yellow-100 text-yellow-800";
    case "Decommissioned":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Utility function to get usage progress bar classes
const getUsageBarClass = (usage: number, threshold: number) => {
  const percentage = (usage / threshold) * 100;
  if (percentage >= 90) return "bg-red-500";
  if (percentage >= 75) return "bg-yellow-500";
  return "bg-blue-500";
};

const ToolManagementPage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>(mockTools);
  // State for add/edit modal can be added here
  // const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tool Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track the lifecycle and performance of cutting knives and blades.
          </p>
        </div>
        <button
          // onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Register New Tool</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Tool ID, Type..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Decommissioned">Decommissioned</option>
            </select>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Tools List Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tool ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Usage Performance
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Maintenance
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assigned To
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tools.map((tool) => (
              <tr key={tool.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {tool.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tool.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                      tool.status
                    )}`}
                  >
                    {tool.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getUsageBarClass(
                          tool.currentUsage,
                          tool.usageThreshold
                        )}`}
                        style={{
                          width: `${
                            (tool.currentUsage / tool.usageThreshold) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-mono text-xs w-28 text-right">
                      {tool.currentUsage.toLocaleString()} /{" "}
                      {tool.usageThreshold.toLocaleString()} m
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tool.lastMaintenance}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tool.assignedTo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="History"
                    >
                      <History className="w-5 h-5" />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                      onClick={() => {
                        if (confirm(`Delete ${tool.id}?`)) {
                          setTools((prev) =>
                            prev.filter((t) => t.id !== tool.id)
                          );
                        }
                      }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToolManagementPage;
