// src/pages/ToolManagementPage/ToolManagementPage.tsx

import React, { useState, useMemo } from "react";
import { PlusCircle, Search, Trash2, Edit, History } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { CustomTable } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

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

const ToolManagementPage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>(mockTools);
  // State for add/edit modal can be added here
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnDef<Tool>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Tool ID",
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const variant: "default" | "secondary" | "destructive" =
            status === "Active"
              ? "default"
              : status === "Maintenance"
              ? "secondary"
              : "destructive";
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        header: "Usage Performance",
        cell: ({ row }) => {
          const { currentUsage, usageThreshold } = row.original;
          const percentage = (currentUsage / usageThreshold) * 100;
          return (
            <div className="flex items-center gap-2 min-w-[250px]">
              <Progress value={percentage} className="w-[60%]" />
              <span className="font-mono text-xs w-28 text-right">
                {currentUsage.toLocaleString()} /{" "}
                {usageThreshold.toLocaleString()} m
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "lastMaintenance",
        header: "Last Maintenance",
      },
      {
        accessorKey: "assignedTo",
        header: "Assigned To",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const tool = row.original;
          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <History className="mr-2 h-4 w-4" />
                    <span>History</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => {
                      if (confirm(`Delete ${tool.id}?`)) {
                        setTools((prev) =>
                          prev.filter((t) => t.id !== tool.id)
                        );
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tool Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track the lifecycle and performance of cutting knives and blades.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" />
          Register New Tool
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by Tool ID, Type..."
                className="pl-10"
              />
            </div>
            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* The filter functionality is now part of the custom-table actions column */}
          </div>
        </CardContent>
      </Card>

      {/* Tools List Table */}
      <CustomTable columns={columns} data={tools} />
    </div>
  );
};

export default ToolManagementPage;
