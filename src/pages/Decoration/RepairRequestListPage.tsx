// src/pages/damaged-goods-repair/RepairRequestListPage.tsx

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  PlusCircle,
  Download,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import type { RepairRequest, RequestStatus } from "./types";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomTable } from "@/components/ui/custom-table";

// --- Mock Data ---
const mockRequests: RepairRequest[] = [
  {
    id: "RR-001",
    creationDate: "2023-10-26",
    poCode: "PO-12345",
    productCode: "STY-ABC-01",
    process: "Embroidery",
    defectType: "Thêu sai chỉ",
    defectQty: 15,
    assignee: "Nguyễn Văn A",
    creator: "Trần Thị B",
    status: "In Progress",
  },
  {
    id: "RR-002",
    creationDate: "2023-10-26",
    poCode: "PO-12346",
    productCode: "STY-XYZ-02",
    process: "Heat Press",
    defectType: "Ép bong tróc",
    defectQty: 8,
    creator: "Lê Văn C",
    status: "Pending Approval",
  },
  {
    id: "RR-003",
    creationDate: "2023-10-25",
    poCode: "PO-12345",
    productCode: "STY-ABC-01",
    process: "Bonding",
    defectType: "Keo dán tràn",
    defectQty: 22,
    assignee: "Phạm Dũng",
    creator: "Trần Thị B",
    status: "Completed",
    successfullyRepairedQty: 22,
    unrepairableQty: 0,
  },
  {
    id: "RR-004",
    creationDate: "2023-10-24",
    poCode: "PO-12347",
    productCode: "STY-QWE-03",
    process: "Printing",
    defectType: "In lem màu",
    defectQty: 5,
    creator: "Lê Văn C",
    status: "Rejected",
    rejectionReason: "Chi phí sửa cao hơn giá trị SP.",
  },
  {
    id: "RR-005",
    creationDate: "2023-10-27",
    poCode: "PO-12348",
    productCode: "STY-RTY-04",
    process: "Embroidery",
    defectType: "Thêu lệch vị trí",
    defectQty: 12,
    creator: "Trần Thị B",
    status: "Approved",
    assignee: "Nguyễn Thị D",
  },
];

// --- Helper Components ---
const StatusBadge = ({ status }: { status: RequestStatus }) => {
  const statusVariants: Record<
    RequestStatus,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    "Pending Approval": "secondary",
    Approved: "default",
    "In Progress": "default",
    Completed: "outline",
    Rejected: "destructive",
  };

  const statusColors: Record<RequestStatus, string> = {
    "Pending Approval": "bg-yellow-500 hover:bg-yellow-500/80",
    Approved: "bg-blue-600 hover:bg-blue-600/80",
    "In Progress": "bg-indigo-600 hover:bg-indigo-600/80",
    Completed: "bg-green-600 text-white hover:bg-green-600/80",
    Rejected: "bg-red-600 hover:bg-red-600/80",
  };

  return (
    <Badge
      variant={statusVariants[status]}
      className={
        statusVariants[status] !== "outline" ? statusColors[status] : undefined
      }
    >
      {status}
    </Badge>
  );
};

const RepairRequestListPage = () => {
  const [requests, setRequests] = useState<RepairRequest[]>(mockRequests);
  const [filters, setFilters] = useState({
    dateRange: "",
    status: "All",
    poCode: "",
    process: "All",
    creator: "",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Shadcn Select components
  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const handleProcessChange = (value: string) => {
    setFilters((prev) => ({ ...prev, process: value }));
  };

  const handleCancelRequest = (requestId: string) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this request? This action cannot be undone."
      )
    ) {
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(
      (req) =>
        (filters.status === "All" || req.status === filters.status) &&
        (filters.process === "All" || req.process === filters.process) &&
        req.poCode.toLowerCase().includes(filters.poCode.toLowerCase())
    );
  }, [requests, filters]);

  const columns: ColumnDef<RepairRequest>[] = [
    { accessorKey: "id", header: "Request ID" },
    { accessorKey: "creationDate", header: "Creation Date" },
    { accessorKey: "poCode", header: "PO / Job" },
    { accessorKey: "productCode", header: "Product Code" },
    { accessorKey: "process", header: "Process" },
    { accessorKey: "defectType", header: "Defect Type" },
    {
      accessorKey: "defectQty",
      header: () => <div className="text-center">Defect Qty</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.defectQty}</div>
      ),
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      cell: ({ row }) => row.original.assignee || "N/A",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const request = row.original;
        return (
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to={`/decoration/productivity/approve-data`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View/Approve
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to={`/decoration/productivity/record-result-information`}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit/Record
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => handleCancelRequest(request.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Repair Request List</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
          <Button asChild>
            <Link to="/decoration/productivity/create-data-entry">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create New Request
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              type="date"
              name="dateRange"
              placeholder="Date Range"
              onChange={handleFilterChange}
            />
            <Select onValueChange={handleStatusChange} defaultValue="All">
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending Approval">
                  Pending Approval
                </SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                name="poCode"
                placeholder="Search by PO / Job Code..."
                className="pl-10"
                onChange={handleFilterChange}
              />
            </div>
            <Select onValueChange={handleProcessChange} defaultValue="All">
              <SelectTrigger>
                <SelectValue placeholder="All Processes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Processes</SelectItem>
                <SelectItem value="Bonding">Bonding</SelectItem>
                <SelectItem value="Embroidery">Embroidery</SelectItem>
                <SelectItem value="Heat Press">Heat Press</SelectItem>
                <SelectItem value="Printing">Printing</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              name="creator"
              placeholder="Creator"
              onChange={handleFilterChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <CustomTable
            columns={columns}
            data={filteredRequests}
            showColumnVisibility={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RepairRequestListPage;
