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
import { ColumnDef } from "@tanstack/react-table";

import { CustomTable } from "@/components/ui/custom-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

const columns: ColumnDef<KanbanRequest>[] = [
  {
    accessorKey: "sewingLine",
    header: "Sewing Line",
    cell: ({ row }) => (
      <div className="font-bold text-lg text-gray-900">
        {row.getValue("sewingLine")}
      </div>
    ),
  },
  {
    accessorKey: "jobNo",
    header: "Job No",
  },
  {
    accessorKey: "poId",
    header: "PO ID",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "requestTime",
    header: "Request Time",
  },
  {
    accessorKey: "wipHours",
    header: "WIP (Hours)",
    cell: ({ row }) => {
      const request = row.original;
      const isDelivered = request.status === "Delivered";
      const wipText = isDelivered ? "N/A" : request.wipHours.toFixed(1);
      const isLowWip = !isDelivered && request.wipHours < 1;
      return (
        <div
          className={`font-bold ${isLowWip ? "text-red-600" : "text-gray-800"}`}
        >
          {wipText}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as RequestStatus;
      const config = statusConfig[status];
      return (
        <Badge
          variant="outline"
          className={`gap-x-1.5 border-none ${config.color}`}
        >
          {config.icon}
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const request = row.original;
      return (
        <div className="text-center">
          <Button
            onClick={() => alert(`Scanning out Job No: ${request.jobNo}`)}
            disabled={request.status === "Delivered"}
            size="sm"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Scan Out
          </Button>
        </div>
      );
    },
  },
];

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
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Line, Job No, PO ID..."
          className="w-full sm:max-w-md"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as RequestStatus | "All")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            {(Object.keys(statusConfig) as RequestStatus[]).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={wipFilter}
          onValueChange={(value) =>
            setWipFilter(value as "All" | "Low" | "Normal" | "High")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All WIP" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All WIP</SelectItem>
            <SelectItem value="Low">Low (&lt; 1hr)</SelectItem>
            <SelectItem value="Normal">Normal (1-4hr)</SelectItem>
            <SelectItem value="High">High (&gt; 4hr)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CustomTable
        columns={columns}
        data={sortedRequests}
        showCheckbox={false}
        showColumnVisibility={false}
      />
    </div>
  );
};

export default KanbanReportPage;
