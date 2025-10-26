import React, { useState } from "react";
import { Clock, RefreshCw, Send, Settings2, Check } from "lucide-react";

// Translated type for request status
type RequestStatus = "New" | "Preparing" | "Ready" | "Delivered";

type KanbanRequest = {
  id: number;
  sewingLine: string;
  poId: string;
  requestTime: string;
  status: RequestStatus;
};

// Translated mock data
const mockRequests: KanbanRequest[] = [
  {
    id: 1,
    sewingLine: "Line 05",
    poId: "PO-001",
    requestTime: "2024-05-21 08:15",
    status: "New",
  },
  {
    id: 2,
    sewingLine: "Line 02",
    poId: "PO-003",
    requestTime: "2024-05-21 08:05",
    status: "Preparing",
  },
  {
    id: 3,
    sewingLine: "Line 11",
    poId: "PO-002",
    requestTime: "2024-05-21 07:50",
    status: "Ready",
  },
  {
    id: 4,
    sewingLine: "Line 05",
    poId: "PO-004",
    requestTime: "2024-05-20 16:30",
    status: "Delivered",
  },
];

// Configuration object with translated keys
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        {/* Translated title */}
        <h1 className="text-3xl font-bold text-gray-800">
          Kanban Requests from Sewing Line
        </h1>
        {/* Translated button text */}
        <button className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="space-y-4">
        {sortedRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-4 rounded-xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Translated labels */}
              <div>
                <p className="text-xs text-gray-500">Sewing Line</p>
                <p className="font-bold text-lg text-gray-800">
                  {req.sewingLine}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">PO ID</p>
                <p className="font-semibold text-gray-700">{req.poId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Request Time</p>
                <p className="text-sm text-gray-600">{req.requestTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium ${
                    statusConfig[req.status].color
                  }`}
                >
                  {statusConfig[req.status].icon}
                  {req.status}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <select
                value={req.status}
                onChange={(e) =>
                  updateStatus(req.id, e.target.value as RequestStatus)
                }
                className="p-2 border rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                // Updated disabled check to use the English status
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanReportPage;
