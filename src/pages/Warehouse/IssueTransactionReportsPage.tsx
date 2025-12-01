// Path: src/pages/issue-transaction-reports/IssueTransactionReportsPage.tsx

import React, { useState, useMemo } from "react";
import { Download, Search } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { CustomTable } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// =================================================================================
// --- START OF FILE: types.ts ---
// =================================================================================

// Định nghĩa trạng thái QC
type QcStatus = "Passed" | "Failed" | "Pending";

// Định nghĩa cấu trúc dữ liệu cho một cuộn vải
interface FabricRoll {
  poNumber: string;
  itemCode: string;
  factory: string;
  supplier: string;
  invoiceNo: string;
  colorCode: string;
  color: string;
  rollNo: number;
  lotNo: string;
  yards: number;
  netWeightKgs: number;
  grossWeightKgs: number;
  width: string;
  location: string;
  qrCode: string; // Sử dụng làm ID duy nhất
  dateInHouse: string;
  description: string;
  qcStatus: QcStatus;
  qcDate: string;
  qcBy: string;
  comment: string;
  printed: boolean;
  balanceYards: number;
  hourStandard: number;
  hourRelax: number;
  relaxDate: string;
  relaxTime: string;
  relaxBy: string;
  job: string;
  issuedDate: string;
  issuedBy: string;
  destination: string;
  parentQrCode: string | null;
}

// Cập nhật định nghĩa Filters để phù hợp với dữ liệu mới
interface FabricRollFilters {
  query?: string; // Dùng để tìm kiếm PO Number hoặc Item Code
  supplier?: string;
  qcStatus?: QcStatus | "" | "all"; // Updated type to include 'all'
  dateFrom?: string; // Date In House from
  dateTo?: string; // Date In House to
}

// =================================================================================
// --- START OF FILE: data.ts ---
// =================================================================================

// Dữ liệu mẫu mới dựa trên bảng bạn cung cấp
const mockFabricRolls: FabricRoll[] = [
  {
    poNumber: "POPU0018251",
    itemCode: "CK-101-04-00332",
    factory: "Factory A",
    supplier: "Supplier Y",
    invoiceNo: "INV-001",
    colorCode: "CC-003",
    color: "Light Gold",
    rollNo: 1,
    lotNo: "225628091",
    yards: 65,
    netWeightKgs: 16.5,
    grossWeightKgs: 16.9,
    width: '60"',
    location: "F1-01-01",
    qrCode: "QR-43468",
    dateInHouse: "2023-06-08",
    description: "Denim Material",
    qcStatus: "Passed",
    qcDate: "2023-12-23",
    qcBy: "John Doe",
    comment: "No issues found",
    printed: true,
    balanceYards: 46,
    hourStandard: 24,
    hourRelax: 24,
    relaxDate: "2023-12-25",
    relaxTime: "10:30",
    relaxBy: "Alice",
    job: "JOB-B5",
    issuedDate: "2023-08-26",
    issuedBy: "David",
    destination: "Warehouse A",
    parentQrCode: null,
  },
  {
    poNumber: "POPU0018251",
    itemCode: "CK-101-04-00332",
    factory: "Factory B",
    supplier: "Supplier Z",
    invoiceNo: "INV-002",
    colorCode: "CC-004",
    color: "Royal Sapphire",
    rollNo: 2,
    lotNo: "225628091",
    yards: 82,
    netWeightKgs: 20.1,
    grossWeightKgs: 20.5,
    width: '60"',
    location: "F1-01-02",
    qrCode: "QR-33961",
    dateInHouse: "2023-08-10",
    description: "Silk Blend",
    qcStatus: "Passed",
    qcDate: "2023-10-22",
    qcBy: "John Doe",
    comment: "Approved for production",
    printed: false,
    balanceYards: 39,
    hourStandard: 24,
    hourRelax: 24,
    relaxDate: "2023-09-28",
    relaxTime: "14:00",
    relaxBy: "Bob",
    job: "JOB-A2",
    issuedDate: "2023-03-15",
    issuedBy: "Eve",
    destination: "Store B",
    parentQrCode: null,
  },
  {
    poNumber: "PSPU0002932",
    itemCode: "CK-101-04-00483",
    factory: "Factory B",
    supplier: "Supplier Z",
    invoiceNo: "INV-003",
    colorCode: "CC-003",
    color: "Puma Black",
    rollNo: 1,
    lotNo: "225628091",
    yards: 82,
    netWeightKgs: 17.7,
    grossWeightKgs: 18.1,
    width: '60"',
    location: "F1-01-03",
    qrCode: "QR-81808",
    dateInHouse: "2023-10-14",
    description: "Polyester Blend",
    qcStatus: "Passed",
    qcDate: "2023-09-19",
    qcBy: "Peter Jones",
    comment: "Approved for production",
    printed: true,
    balanceYards: 22,
    hourStandard: 36,
    hourRelax: 36,
    relaxDate: "2023-01-20",
    relaxTime: "9:00",
    relaxBy: "Charlie",
    job: "JOB-B2",
    issuedDate: "2023-10-05",
    issuedBy: "Frank",
    destination: "Store B",
    parentQrCode: null,
  },
  {
    poNumber: "POPU0018238",
    itemCode: "CK-102-05-00049",
    factory: "Factory B",
    supplier: "Supplier Y",
    invoiceNo: "INV-004",
    colorCode: "CC-002",
    color: "Puma Black",
    rollNo: 1,
    lotNo: "225628091",
    yards: 55,
    netWeightKgs: 17.5,
    grossWeightKgs: 18,
    width: '53"',
    location: "F1-01-04",
    qrCode: "QR-35149",
    dateInHouse: "2023-04-21",
    description: "Polyester Blend",
    qcStatus: "Passed",
    qcDate: "2023-03-05",
    qcBy: "John Doe",
    comment: "No issues found",
    printed: true,
    balanceYards: 34,
    hourStandard: 36,
    hourRelax: 36,
    relaxDate: "2023-08-01",
    relaxTime: "10:30",
    relaxBy: "Bob",
    job: "JOB-A5",
    issuedDate: "2023-04-29",
    issuedBy: "David",
    destination: "Warehouse A",
    parentQrCode: null,
  },
  {
    poNumber: "POPU0018235",
    itemCode: "CK-126-04-00277",
    factory: "Factory C",
    supplier: "Supplier Z",
    invoiceNo: "INV-005",
    colorCode: "CC-002",
    color: "Puma Black",
    rollNo: 1,
    lotNo: "225628091",
    yards: 45,
    netWeightKgs: 17.4,
    grossWeightKgs: 17.8,
    width: '68"',
    location: "F2-03-05",
    qrCode: "QR-76433",
    dateInHouse: "2023-02-18",
    description: "Polyester Blend",
    qcStatus: "Passed",
    qcDate: "2023-04-29",
    qcBy: "John Doe",
    comment: "Minor defect on edge",
    printed: true,
    balanceYards: 37,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-01-17",
    relaxTime: "9:00",
    relaxBy: "Alice",
    job: "JOB-C4",
    issuedDate: "2023-09-22",
    issuedBy: "Eve",
    destination: "Store B",
    parentQrCode: null,
  },
  {
    poNumber: "PSPU0002986",
    itemCode: "WO-413-04-00361",
    factory: "Factory B",
    supplier: "Supplier X",
    invoiceNo: "INV-006",
    colorCode: "CC-004",
    color: "PUMA BLACK",
    rollNo: 1,
    lotNo: "225628091",
    yards: 22,
    netWeightKgs: 4.5,
    grossWeightKgs: 4.8,
    width: '57"',
    location: "F2-03-06",
    qrCode: "QR-93641",
    dateInHouse: "2023-03-16",
    description: "Silk Blend",
    qcStatus: "Passed",
    qcDate: "2023-08-05",
    qcBy: "Jane Smith",
    comment: "No issues found",
    printed: false,
    balanceYards: 13,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-05-10",
    relaxTime: "15:45",
    relaxBy: "Bob",
    job: "JOB-A9",
    issuedDate: "2023-02-12",
    issuedBy: "Eve",
    destination: "Distribution Center C",
    parentQrCode: null,
  },
  {
    poNumber: "PSPU0002986",
    itemCode: "WO-413-04-00361",
    factory: "Factory B",
    supplier: "Supplier X",
    invoiceNo: "INV-007",
    colorCode: "CC-003",
    color: "PUMA WHITE",
    rollNo: 2,
    lotNo: "225628091",
    yards: 119,
    netWeightKgs: 24.6,
    grossWeightKgs: 24.7,
    width: '57"',
    location: "F2-03-07",
    qrCode: "QR-89437",
    dateInHouse: "2023-11-22",
    description: "Polyester Blend",
    qcStatus: "Failed",
    qcDate: "2023-03-18",
    qcBy: "Peter Jones",
    comment: "Approved for production",
    printed: true,
    balanceYards: 26,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-05-25",
    relaxTime: "15:45",
    relaxBy: "Bob",
    job: "JOB-B6",
    issuedDate: "2023-10-30",
    issuedBy: "Eve",
    destination: "Distribution Center C",
    parentQrCode: null,
  },
  {
    poNumber: "SPPU0004476",
    itemCode: "CK-105-05-00062",
    factory: "Factory C",
    supplier: "Supplier Y",
    invoiceNo: "INV-008",
    colorCode: "CC-003",
    color: "PUMA WHITE",
    rollNo: 1,
    lotNo: "225628091",
    yards: 4,
    netWeightKgs: 1,
    grossWeightKgs: 1.4,
    width: '61"',
    location: "F2-03-08",
    qrCode: "QR-22682",
    dateInHouse: "2023-12-08",
    description: "Cotton Fabric",
    qcStatus: "Passed",
    qcDate: "2023-02-27",
    qcBy: "John Doe",
    comment: "No issues found",
    printed: false,
    balanceYards: 32,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-03-06",
    relaxTime: "10:30",
    relaxBy: "Charlie",
    job: "JOB-C8",
    issuedDate: "2023-06-02",
    issuedBy: "Frank",
    destination: "Distribution Center C",
    parentQrCode: null,
  },
  {
    poNumber: "SSPU0002939",
    itemCode: "CK-105-04-00325",
    factory: "Factory C",
    supplier: "Supplier Y",
    invoiceNo: "INV-009",
    colorCode: "CC-002",
    color: "PUMA WHITE",
    rollNo: 1,
    lotNo: "225628091",
    yards: 90,
    netWeightKgs: 24,
    grossWeightKgs: 24.4,
    width: '63"',
    location: "F2-03-09",
    qrCode: "QR-16812",
    dateInHouse: "2023-05-05",
    description: "Denim Material",
    qcStatus: "Pending",
    qcDate: "2023-03-12",
    qcBy: "Peter Jones",
    comment: "Rework required",
    printed: true,
    balanceYards: 26,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-02-24",
    relaxTime: "15:45",
    relaxBy: "Alice",
    job: "JOB-A8",
    issuedDate: "2023-04-26",
    issuedBy: "David",
    destination: "Warehouse A",
    parentQrCode: null,
  },
];

interface PageHeaderProps {
  selectedCount: number;
  onExport: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ selectedCount, onExport }) => {
  const hasSelection = selectedCount > 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Issue Fabric Report</CardTitle>
            <p className="text-sm text-muted-foreground pt-1">
              View, filter, and export fabric roll transaction history.
            </p>
          </div>
          <Button onClick={onExport} disabled={!hasSelection}>
            <Download className="w-4 h-4 mr-2" />
            Export to Excel {hasSelection && `(${selectedCount})`}
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

interface ReportFiltersProps {
  onFilterChange: (filters: FabricRollFilters) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState<FabricRollFilters>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSelectChange = (name: string, value: string) => {
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-12 lg:col-span-4 space-y-2">
            <Label htmlFor="query">Search PO / Item Code</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="query"
                name="query"
                placeholder="e.g., POPU0018251"
                value={filters.query || ""}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-3 space-y-2">
            <Label htmlFor="qcStatus">QC Status</Label>
            <Select
              name="qcStatus"
              value={filters.qcStatus || ""}
              onValueChange={(value) => handleSelectChange("qcStatus", value)}
            >
              <SelectTrigger id="qcStatus">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {/* FIX: Changed value from "" to "all" */}
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Passed">Passed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-12 lg:col-span-5 space-y-2">
            <Label>Issued Date (From - To)</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                name="dateFrom"
                value={filters.dateFrom || ""}
                onChange={handleInputChange}
              />
              <span className="text-gray-500">-</span>
              <Input
                type="date"
                name="dateTo"
                value={filters.dateTo || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TableSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-12 w-full" />
    {[...Array(9)].map((_, i) => (
      <Skeleton key={i} className="h-10 w-full" />
    ))}
  </div>
);

const columns: ColumnDef<FabricRoll>[] = [
  { accessorKey: "poNumber", header: "PO Number" },
  { accessorKey: "itemCode", header: "Item Code" },
  { accessorKey: "factory", header: "Factory" },
  { accessorKey: "supplier", header: "Supplier" },
  { accessorKey: "invoiceNo", header: "Invoice No" },
  { accessorKey: "colorCode", header: "Color Code" },
  { accessorKey: "color", header: "Color" },
  { accessorKey: "rollNo", header: "Roll No" },
  { accessorKey: "lotNo", header: "Lot No" },
  { accessorKey: "yards", header: "Yards" },
  { accessorKey: "netWeightKgs", header: "Net Weight (Kgs)" },
  { accessorKey: "grossWeightKgs", header: "Gross Weight (Kgs)" },
  { accessorKey: "width", header: "Width" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "qrCode", header: "QR Code" },
  {
    accessorKey: "dateInHouse",
    header: "Date In House",
    cell: ({ row }) =>
      new Date(row.original.dateInHouse).toLocaleDateString("en-GB"),
  },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "qcStatus",
    header: "QC Status",
    cell: ({ row }) => {
      const status = row.original.qcStatus;
      const variant: "default" | "secondary" | "destructive" =
        status === "Passed"
          ? "default"
          : status === "Failed"
          ? "destructive"
          : "secondary";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "qcDate",
    header: "QC Date",
    cell: ({ row }) =>
      new Date(row.original.qcDate).toLocaleDateString("en-GB"),
  },
  { accessorKey: "qcBy", header: "QC By" },
  { accessorKey: "comment", header: "Comment" },
  {
    accessorKey: "printed",
    header: "Printed",
    cell: ({ row }) => String(row.original.printed).toUpperCase(),
  },
  { accessorKey: "balanceYards", header: "Balance Yards" },
  { accessorKey: "hourStandard", header: "Hour Standard" },
  { accessorKey: "hourRelax", header: "Hour Relax" },
  {
    accessorKey: "relaxDate",
    header: "Relax Date",
    cell: ({ row }) =>
      new Date(row.original.relaxDate).toLocaleDateString("en-GB"),
  },
  { accessorKey: "relaxTime", header: "Relax Time" },
  { accessorKey: "relaxBy", header: "Relax By" },
  { accessorKey: "job", header: "JOB" },
  {
    accessorKey: "issuedDate",
    header: "Issued Date",
    cell: ({ row }) =>
      new Date(row.original.issuedDate).toLocaleDateString("en-GB"),
  },
  { accessorKey: "issuedBy", header: "Issued By" },
  { accessorKey: "destination", header: "Destination" },

  // Special column for the visibility toggler, required by custom-table component
  {
    id: "actions",
    header: () => null,
    cell: () => null,
  },
];

const IssueTransactionReportsPage = () => {
  const isLoading = false;
  const [filters, setFilters] = useState<FabricRollFilters>({});
  const [selectedRolls, setSelectedRolls] = useState<FabricRoll[]>([]);

  const filteredRolls = useMemo(() => {
    return mockFabricRolls.filter((roll) => {
      const { query, supplier, qcStatus, dateFrom, dateTo } = filters;

      const queryMatch =
        !query ||
        roll.poNumber.toLowerCase().includes(query.toLowerCase()) ||
        roll.itemCode.toLowerCase().includes(query.toLowerCase());

      const supplierMatch = !supplier || roll.supplier === supplier;

      // FIX: Updated filtering logic to handle "all" value
      const qcStatusMatch =
        !qcStatus || qcStatus === "all" || roll.qcStatus === qcStatus;

      const dateInHouse = new Date(roll.dateInHouse);
      const fromDateMatch = !dateFrom || dateInHouse >= new Date(dateFrom);
      const toDateMatch = !dateTo || dateInHouse <= new Date(dateTo);

      return (
        queryMatch &&
        supplierMatch &&
        qcStatusMatch &&
        fromDateMatch &&
        toDateMatch
      );
    });
  }, [filters]);

  const handleFilterChange = (newFilters: FabricRollFilters) => {
    setFilters(newFilters);
  };

  const handleExport = () => {
    alert(
      `Exporting ${selectedRolls.length} selected rolls. See console for data.`
    );
    console.log("Data to export:", selectedRolls);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader
        selectedCount={selectedRolls.length}
        onExport={handleExport}
      />

      <ReportFilters onFilterChange={handleFilterChange} />

      <div className="mt-6">
        <Card>
          <CardContent className="p-4">
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <CustomTable
                columns={columns}
                data={filteredRolls}
                onSelectionChange={setSelectedRolls}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IssueTransactionReportsPage;
