// src/pages/PackingPlanReportPage.tsx

import { Search, Filter, RefreshCw } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

import { CustomTable } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Data type definition
type PackingPlan = {
  id: string;
  customer: string;
  style: string;
  totalQty: number;
  packedQty: number;
  status: "Completed" | "In Progress" | "New";
  date: string;
};

// Mock data
const packingPlans: PackingPlan[] = [
  {
    id: "PO77881",
    customer: "Adidas",
    style: "A-STYLE-01",
    totalQty: 5000,
    packedQty: 5000,
    status: "Completed",
    date: "2023-10-26",
  },
  {
    id: "PO77882",
    customer: "Puma",
    style: "P-STYLE-02",
    totalQty: 8000,
    packedQty: 6500,
    status: "In Progress",
    date: "2023-10-25",
  },
  {
    id: "PO77883",
    customer: "Nike",
    style: "N-STYLE-03",
    totalQty: 3200,
    packedQty: 0,
    status: "New",
    date: "2023-10-25",
  },
  {
    id: "PO77884",
    customer: "Adidas",
    style: "A-STYLE-04",
    totalQty: 12000,
    packedQty: 11500,
    status: "In Progress",
    date: "2023-10-24",
  },
  {
    id: "PO77885",
    customer: "New Balance",
    style: "NB-STYLE-05",
    totalQty: 7500,
    packedQty: 7500,
    status: "Completed",
    date: "2023-10-23",
  },
];

const getStatusBadgeClass = (status: PackingPlan["status"]) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "In Progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "New":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const columns: ColumnDef<PackingPlan>[] = [
  { accessorKey: "id", header: "PO Number" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "style", header: "Style" },
  {
    accessorKey: "totalQty",
    header: "Total Qty",
    cell: ({ row }) => (
      <div className="text-right">{row.original.totalQty.toLocaleString()}</div>
    ),
  },
  {
    accessorKey: "packedQty",
    header: "Packed Qty",
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.packedQty.toLocaleString()}
      </div>
    ),
  },
  {
    id: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const { totalQty, packedQty } = row.original;
      const progress = totalQty > 0 ? (packedQty / totalQty) * 100 : 0;
      return (
        <div className="flex flex-col items-center">
          <Progress value={progress} className="w-full h-2.5" />
          <p className="text-xs text-center mt-1 text-muted-foreground">
            {progress.toFixed(0)}%
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={getStatusBadgeClass(row.original.status)}>
        {row.original.status}
      </Badge>
    ),
  },
  { accessorKey: "date", header: "Creation Date" },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <Button variant="link" className="p-0 h-auto">
        View Details
      </Button>
    ),
  },
];

const PackingPlanReportPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Packing Plan Report</h1>
        <Button>Create Final Plan Load</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by PO..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="adidas">Adidas</SelectItem>
                <SelectItem value="puma">Puma</SelectItem>
                <SelectItem value="nike">Nike</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button className="flex-1 flex items-center justify-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Apply</span>
              </Button>
              <Button
                variant="secondary"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Clear</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <CustomTable
            columns={columns}
            data={packingPlans}
            showCheckbox={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PackingPlanReportPage;
