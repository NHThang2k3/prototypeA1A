// src/pages/BufferReportPage/BufferReportPage.tsx

import React, { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";

type BundleStatus =
  | "At Heat Press"
  | "In Temp WH"
  | "Returned from Embroidery"
  | "At Bonding";

type Bundle = {
  bundleId: string;
  poId: string;
  styleId: string;
  quantity: number;
  color: string;
  status: BundleStatus;
};

const mockBundles: Bundle[] = [
  {
    bundleId: "B-001",
    poId: "PO-001",
    styleId: "T-SHIRT-BLK",
    quantity: 50,
    color: "Black",
    status: "At Heat Press",
  },
  {
    bundleId: "B-002",
    poId: "PO-001",
    styleId: "T-SHIRT-BLK",
    quantity: 75,
    color: "Black",
    status: "In Temp WH",
  },
  {
    bundleId: "B-005",
    poId: "PO-001",
    styleId: "T-SHIRT-BLK",
    quantity: 60,
    color: "Black",
    status: "At Heat Press",
  },
  {
    bundleId: "B-003",
    poId: "PO-002",
    styleId: "HOODIE-RED",
    quantity: 120,
    color: "Red",
    status: "Returned from Embroidery",
  },
  {
    bundleId: "B-004",
    poId: "PO-002",
    styleId: "HOODIE-RED",
    quantity: 80,
    color: "Red",
    status: "At Bonding",
  },
];

const columns: ColumnDef<Bundle>[] = [
  {
    accessorKey: "poId",
    header: "PO ID",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">{row.getValue("poId")}</div>
    ),
  },
  {
    accessorKey: "bundleId",
    header: "Bundle ID",
  },
  {
    accessorKey: "styleId",
    header: "Style ID",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "status",
    header: "Current Status",
  },
];

const BufferReportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredBundles = useMemo(() => {
    return mockBundles.filter(
      (bundle) =>
        (bundle.bundleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bundle.poId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bundle.styleId.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "All" || bundle.status === statusFilter)
    );
  }, [searchTerm, statusFilter]);

  const uniqueStatuses = [
    "All",
    ...Array.from(new Set(mockBundles.map((b) => b.status))),
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Buffer Inventory & Status Report
      </h1>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by Bundle, PO, Style..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full pl-10">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CustomTable
          columns={columns}
          data={filteredBundles}
          showCheckbox={false}
          showColumnVisibility={false}
        />
      </Card>
    </div>
  );
};

export default BufferReportPage;
