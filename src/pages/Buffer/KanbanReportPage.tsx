// src/pages/KanbanReportPage/KanbanReportPage.tsx

import React, { useState } from "react";
import { Clock, RefreshCw, Send, Settings2, Check } from "lucide-react";

// Type for request status
type RequestStatus = "New" | "Preparing" | "Ready" | "Delivered";

// Updated KanbanRequest type with jobNo and quantity
type KanbanRequest = {
  id: number;
  sewingLine: string;
  jobNo: string; // New field
  poId: string;
  quantity: number; // New field
  requestTime: string;
  status: RequestStatus;
};

// Updated mock data with new fields
const mockRequests: KanbanRequest[] = [
  {
    id: 1,
    sewingLine: "Line 05",
    jobNo: "J-1053",
    poId: "PO-001",
    quantity: 120,
    requestTime: "2024-05-21 08:15",
    status: "New",
  },
  {
    id: 2,
    sewingLine: "Line 02",
    jobNo: "J-1021",
    poId: "PO-003",
    quantity: 85,
    requestTime: "2024-05-21 08:05",
    status: "Preparing",
  },
  {
    id: 3,
    sewingLine: "Line 11",
    jobNo: "J-1189",
    poId: "PO-002",
    quantity: 250,
    requestTime: "2024-05-21 07:50",
    status: "Ready",
  },
  {
    id: 4,
    sewingLine: "Line 05",
    jobNo: "J-1044",
    poId: "PO-004",
    quantity: 150,
    requestTime: "2024-05-20 16:30",
    status: "Delivered",
  },
];

// Configuration object for status icons and colors
const statusConfig: Record<
  RequestStatus,
  { icon: React.ReactNode; color: string }
> = {
  New: {
    icon: <Clock className="w-4 h-4" />,
    color: "bg-blue-100 text-blue-800",
  },
  Preparing: {
    icon: <Settings2 className="w-4 h-4" />,
    color: "bg-yellow-100 text-yellow-800",
  },
  Ready: {
    icon: <Send className="w-4 h-4" />,
    color: "bg-purple-100 text-purple-800",
  },
  Delivered: {
    icon: <Check className="w-4 h-4" />,
    color: "bg-green-100 text-green-800",
  },
};

const KanbanReportPage: React.FC = () => {
  const [requests, setRequests] = useState<KanbanRequest[]>(mockRequests);

  const updateStatus = (id: number, newStatus: RequestStatus) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  const sortedRequests = [...requests].sort(
    (a, b) =>
      new Date(b.requestTime).getTime() - new Date(a.requestTime).getTime()
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Kanban Requests from Sewing Line
        </h1>
        <button className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              {/* Changed table headers to English */}
              <th scope="col" className="px-6 py-3">
                Sewing Line
              </th>
              <th scope="col" className="px-6 py-3">
                Job No
              </th>
              <th scope="col" className="px-6 py-3">
                PO ID
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Request Time
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRequests.map((req) => (
              <tr key={req.id} className="bg-white border-b hover:bg-gray-50">
                <th
                  scope="row"
                  className="px-6 py-4 font-bold text-lg text-gray-900 whitespace-nowrap"
                >
                  {req.sewingLine}
                </th>
                <td className="px-6 py-4 font-medium text-gray-700">
                  {req.jobNo}
                </td>
                <td className="px-6 py-4 text-gray-700">{req.poId}</td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {req.quantity}
                </td>
                <td className="px-6 py-4 text-gray-600">{req.requestTime}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium ${
                      statusConfig[req.status].color
                    }`}
                  >
                    {statusConfig[req.status].icon}
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={req.status}
                    onChange={(e) =>
                      updateStatus(req.id, e.target.value as RequestStatus)
                    }
                    className="p-2 border rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 w-full"
                    disabled={req.status === "Delivered"}
                  >
                    {(Object.keys(statusConfig) as RequestStatus[]).map(
                      (status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      )
                    )}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KanbanReportPage;
