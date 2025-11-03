// src/pages/KanbanReportPage/KanbanReportPage.tsx

import React, { useState } from "react";
import {
  Clock,
  Send,
  Settings2,
  Check,
  ListChecks,
  QrCode,
} from "lucide-react";

type RequestStatus =
  | "New"
  | "Preparing"
  | "Partially Ready"
  | "Ready"
  | "Delivered";

type KanbanRequest = {
  id: number;
  sewingLine: string;
  jobNo: string;
  poId: string;
  quantity: number;
  requestTime: string;
  status: RequestStatus;
  wipHours: number;
};

const initialRequests = [
  {
    id: 1,
    sewingLine: "Line 05",
    jobNo: "J-1053",
    poId: "PO-001",
    quantity: 120,
    requestTime: "2024-05-21 08:15",
    status: "New" as RequestStatus,
  },
  {
    id: 2,
    sewingLine: "Line 02",
    jobNo: "J-1021",
    poId: "PO-003",
    quantity: 85,
    requestTime: "2024-05-21 08:05",
    status: "Preparing" as RequestStatus,
  },
  {
    id: 5,
    sewingLine: "Line 08",
    jobNo: "J-1099",
    poId: "PO-005",
    quantity: 300,
    requestTime: "2024-05-21 08:00",
    status: "Partially Ready" as RequestStatus,
  },
  {
    id: 3,
    sewingLine: "Line 11",
    jobNo: "J-1189",
    poId: "PO-002",
    quantity: 250,
    requestTime: "2024-05-21 07:50",
    status: "Ready" as RequestStatus,
  },
  {
    id: 4,
    sewingLine: "Line 05",
    jobNo: "J-1044",
    poId: "PO-004",
    quantity: 150,
    requestTime: "2024-05-20 16:30",
    status: "Delivered" as RequestStatus,
  },
  {
    id: 6,
    sewingLine: "Line 01",
    jobNo: "J-1011",
    poId: "PO-006",
    quantity: 50,
    requestTime: "2024-05-21 10:00",
    status: "New" as RequestStatus,
  },
];

const mockRequests: KanbanRequest[] = initialRequests.map((req) => ({
  ...req,
  wipHours: parseFloat((Math.random() * 5).toFixed(1)),
}));

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
  "Partially Ready": {
    icon: <ListChecks className="w-4 h-4" />,
    color: "bg-orange-100 text-orange-800",
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
  const [requests] = useState<KanbanRequest[]>(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "All">(
    "All"
  );
  const [wipFilter, setWipFilter] = useState<"All" | "Low" | "Normal" | "High">(
    "All"
  );

  const filteredRequests = requests
    .filter((req) => {
      const query = searchQuery.toLowerCase();
      if (!query) return true;
      return (
        req.sewingLine.toLowerCase().includes(query) ||
        req.jobNo.toLowerCase().includes(query) ||
        req.poId.toLowerCase().includes(query)
      );
    })
    .filter((req) => {
      if (statusFilter === "All") return true;
      return req.status === statusFilter;
    })
    .filter((req) => {
      if (wipFilter === "All" || req.status === "Delivered") return true;
      switch (wipFilter) {
        case "Low":
          return req.wipHours < 1;
        case "Normal":
          return req.wipHours >= 1 && req.wipHours <= 4;
        case "High":
          return req.wipHours > 4;
        default:
          return true;
      }
    });

  const sortedRequests = [...filteredRequests].sort(
    (a, b) =>
      new Date(b.requestTime).getTime() - new Date(a.requestTime).getTime()
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Kanban Requests from Sewing Line
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Line, Job No, PO ID..."
          // Dòng này đã được thay đổi: sm:max-w-xs -> sm:max-w-md
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:max-w-md"
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as RequestStatus | "All")
          }
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Statuses</option>
          {(Object.keys(statusConfig) as RequestStatus[]).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          value={wipFilter}
          onChange={(e) =>
            setWipFilter(e.target.value as "All" | "Low" | "Normal" | "High")
          }
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All WIP</option>
          <option value="Low">Low (&lt; 1hr)</option>
          <option value="Normal">Normal (1-4hr)</option>
          <option value="High">High (&gt; 4hr)</option>
        </select>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
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
                WIP (Hours)
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRequests.length > 0 ? (
              sortedRequests.map((req) => {
                const isDelivered = req.status === "Delivered";
                const wipText = isDelivered ? "N/A" : req.wipHours.toFixed(1);
                const isLowWip = !isDelivered && req.wipHours < 1;

                return (
                  <tr
                    key={req.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
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
                    <td className="px-6 py-4 text-gray-600">
                      {req.requestTime}
                    </td>
                    <td
                      className={`px-6 py-4 font-bold ${
                        isLowWip ? "text-red-600" : "text-gray-800"
                      }`}
                    >
                      {wipText}
                    </td>
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
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          alert(`Scanning out Job No: ${req.jobNo}`)
                        }
                        disabled={isDelivered}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Scan Out
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  No matching requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KanbanReportPage;
