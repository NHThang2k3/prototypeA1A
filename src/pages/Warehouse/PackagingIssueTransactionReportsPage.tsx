import React, { useState, useMemo } from "react";
import { Download, Search } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { CustomTable } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ============================================================================
// TYPES, CONSTANTS, AND MOCK DATA
// ============================================================================

type PackagingStatus = "Complete" | "Partially" | "Pending";

interface Packaging {
  qrCode: string;
  itemNumber: string;
  itemCategory: string;
  materialName: string;
  color: string;
  size: string;
  quantity: number;
  unit: string;
  location: string;
  batchNumber: string;
  dateReceived: string;
  supplier: string;
  poNumber: string;
  reorderPoint: number;
  lastModifiedDate: string;
  lastModifiedBy: string;
  description: string;
  job: string;
  issuedQuantity: number;
  issuedDate: string;
  issuedBy: string;
  destination: string;
  status: PackagingStatus;
  remark: string | null;
}

interface PackagingFilters {
  query?: string;
  status?: PackagingStatus | "" | "all";
  dateFrom?: string;
  dateTo?: string;
}

const mockPackagings: Packaging[] = [
  {
    qrCode: "PKG-BOX-001-BRN",
    itemNumber: "BOX-001",
    itemCategory: "BOX",
    materialName: "Thùng carton 5 lớp",
    color: "Nâu",
    size: "60x40x40 cm",
    quantity: 1200,
    unit: "Thùng",
    location: "Khu C-01-02",
    batchNumber: "B20231005",
    dateReceived: "2023-10-05",
    supplier: "Bao bì Toàn Quốc",
    poNumber: "PO23-118",
    reorderPoint: 200,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Phạm Thị Mai",
    description: "Thùng carton đựng sản phẩm áo jacket.",
    job: "JOB2310-JK02",
    issuedQuantity: 500,
    issuedDate: "2023-10-26",
    issuedBy: "Phạm Thị Mai",
    destination: "Xưởng đóng gói",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "PKG-BAG-002-CLR",
    itemNumber: "BAG-002",
    itemCategory: "BAG",
    materialName: "Túi poly trong",
    color: "Trong suốt",
    size: "30x45 cm",
    quantity: 8000,
    unit: "Túi",
    location: "Khu C-02-05",
    batchNumber: "T20230920",
    dateReceived: "2023-09-20",
    supplier: "Bao bì Việt Hưng",
    poNumber: "PO23-101",
    reorderPoint: 1500,
    lastModifiedDate: "2023-10-25",
    lastModifiedBy: "Hoàng Văn Nam",
    description: "Túi poly đựng áo sơ mi đã ủi.",
    job: "JOB2310-SM01",
    issuedQuantity: 3000,
    issuedDate: "2023-10-25",
    issuedBy: "Hoàng Văn Nam",
    destination: "Xưởng đóng gói",
    status: "Partially",
    remark: "Còn lại 5000 túi",
  },
  {
    qrCode: "PKG-TP-001-CLR",
    itemNumber: "TP-001",
    itemCategory: "TAPE",
    materialName: "Băng keo trong",
    color: "Trong suốt",
    size: "4.8cm x 100m",
    quantity: 300,
    unit: "Cuộn",
    location: "Khu C-01-08",
    batchNumber: "K20231015",
    dateReceived: "2023-10-15",
    supplier: "Băng keo Minh Long",
    poNumber: "PO23-125",
    reorderPoint: 50,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Phạm Thị Mai",
    description: "Băng keo dán thùng carton.",
    job: "JOB2310-JK02",
    issuedQuantity: 100,
    issuedDate: "2023-10-26",
    issuedBy: "Phạm Thị Mai",
    destination: "Xưởng đóng gói",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "PKG-LBL-005-WHT",
    itemNumber: "LBL-005",
    itemCategory: "LABEL",
    materialName: "Nhãn dán thùng",
    color: "Trắng",
    size: "10x15 cm",
    quantity: 2500,
    unit: "Nhãn",
    location: "Khu D-01-01",
    batchNumber: "L20231002",
    dateReceived: "2023-10-02",
    supplier: "In ấn An An",
    poNumber: "PO23-116",
    reorderPoint: 500,
    lastModifiedDate: "2023-10-25",
    lastModifiedBy: "Hoàng Văn Nam",
    description: "Nhãn thông tin sản phẩm dán ngoài thùng.",
    job: "JOB2310-SM01",
    issuedQuantity: 1000,
    issuedDate: "2023-10-25",
    issuedBy: "Hoàng Văn Nam",
    destination: "Xưởng đóng gói",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "PKG-PAP-003-WHT",
    itemNumber: "PAP-003",
    itemCategory: "PAPER",
    materialName: "Giấy nến",
    color: "Trắng",
    size: "75x100 cm",
    quantity: 1500,
    unit: "Tờ",
    location: "Khu C-03-04",
    batchNumber: "P20230925",
    dateReceived: "2023-09-25",
    supplier: "Giấy Hải Tiến",
    poNumber: "PO23-105",
    reorderPoint: 300,
    lastModifiedDate: "2023-10-24",
    lastModifiedBy: "Phạm Thị Mai",
    description: "Giấy lót giữa các lớp áo trong thùng.",
    job: "JOB2310-SM02",
    issuedQuantity: 500,
    issuedDate: "2023-10-24",
    issuedBy: "Phạm Thị Mai",
    destination: "Xưởng đóng gói",
    status: "Pending",
    remark: "Chưa xuất kho",
  },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const StatusBadge: React.FC<{ status: PackagingStatus }> = ({ status }) => {
  const statusStyles: Record<PackagingStatus, string> = {
    Complete: "bg-green-100 text-green-800 border-green-200",
    Partially: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Pending: "bg-blue-100 text-blue-800 border-blue-200",
  };
  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {status}
    </Badge>
  );
};

// --- MODAL CHI TIẾT ---
const PackagingDetailsModal = ({
  data,
  isOpen,
  onClose,
}: {
  data: Packaging | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!data) return null;

  const DetailItem = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-800 break-words">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Packaging Details -{" "}
            <span className="text-primary">{data.itemNumber}</span>
          </DialogTitle>
          <DialogDescription>QR Code: {data.qrCode}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {/* General Info */}
          <div className="col-span-full pb-2 border-b">
            <h3 className="font-bold text-gray-900 mb-3">
              General Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailItem label="Material Name" value={data.materialName} />
              <DetailItem label="Category" value={data.itemCategory} />
              <DetailItem label="Supplier" value={data.supplier} />
              <DetailItem label="PO Number" value={data.poNumber} />
              <DetailItem label="Job" value={data.job} />
              <DetailItem label="Description" value={data.description} />
            </div>
          </div>

          {/* Specifications */}
          <div className="col-span-full pb-2 border-b">
            <h3 className="font-bold text-gray-900 mb-3">Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DetailItem label="Color" value={data.color} />
              <DetailItem label="Size" value={data.size} />
              <DetailItem label="Unit" value={data.unit} />
              <DetailItem label="Total Qty" value={data.quantity} />
              <DetailItem label="Reorder Point" value={data.reorderPoint} />
              <DetailItem label="Batch Number" value={data.batchNumber} />
            </div>
          </div>

          {/* Transaction Info */}
          <div className="col-span-full">
            <h3 className="font-bold text-gray-900 mb-3">
              Transaction Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-3 rounded-md">
              <DetailItem
                label="Status"
                value={<StatusBadge status={data.status} />}
              />
              <DetailItem label="Issued Quantity" value={data.issuedQuantity} />
              <DetailItem label="Destination" value={data.destination} />
              <DetailItem
                label="Issued Date"
                value={new Date(data.issuedDate).toLocaleDateString("en-GB")}
              />
              <DetailItem label="Issued By" value={data.issuedBy} />
              <DetailItem label="Location" value={data.location} />
              <DetailItem
                label="Last Modified"
                value={new Date(data.lastModifiedDate).toLocaleDateString(
                  "en-GB"
                )}
              />
              <DetailItem label="Remark" value={data.remark} />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const PackagingIssueTransactionReportsPage = () => {
  const [filters, setFilters] = useState<PackagingFilters>({});
  const [selectedPackagings, setSelectedPackagings] = useState<Packaging[]>([]);
  const [viewingPackaging, setViewingPackaging] = useState<Packaging | null>(
    null
  );

  const filteredPackagings = useMemo(() => {
    return mockPackagings.filter((pkg) => {
      const { query, status, dateFrom, dateTo } = filters;
      const queryMatch =
        !query ||
        pkg.itemNumber.toLowerCase().includes(query.toLowerCase()) ||
        pkg.poNumber.toLowerCase().includes(query.toLowerCase());

      const statusMatch = !status || status === "all" || pkg.status === status;

      const issuedDate = new Date(pkg.issuedDate);
      const fromDateMatch = !dateFrom || issuedDate >= new Date(dateFrom);
      const toDateMatch = !dateTo || issuedDate <= new Date(dateTo);
      return queryMatch && statusMatch && fromDateMatch && toDateMatch;
    });
  }, [filters]);

  // MOVE COLUMNS INSIDE COMPONENT TO ACCESS STATE
  const tableColumns = useMemo<ColumnDef<Packaging>[]>(
    () => [
      {
        accessorKey: "qrCode",
        header: "QR Code",
        cell: ({ row }) => (
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => setViewingPackaging(row.original)}
          >
            <span className="font-medium text-blue-600 group-hover:underline group-hover:text-blue-800 transition-colors">
              {row.original.qrCode}
            </span>
          </div>
        ),
      },
      { accessorKey: "itemNumber", header: "Item Number" },
      { accessorKey: "itemCategory", header: "Item Category" },
      { accessorKey: "materialName", header: "Material Name" },
      { accessorKey: "color", header: "Color" },
      { accessorKey: "size", header: "Size" },
      { accessorKey: "quantity", header: "Quantity" },
      { accessorKey: "unit", header: "Unit" },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "batchNumber", header: "Batch Number" },
      {
        accessorKey: "dateReceived",
        header: "Date Received",
        cell: ({ row }) =>
          new Date(row.original.dateReceived).toLocaleDateString("en-GB"),
      },
      { accessorKey: "supplier", header: "Supplier" },
      { accessorKey: "poNumber", header: "PO Number" },
      { accessorKey: "reorderPoint", header: "Reorder Point" },
      {
        accessorKey: "lastModifiedDate",
        header: "Last Modified Date",
        cell: ({ row }) =>
          new Date(row.original.lastModifiedDate).toLocaleDateString("en-GB"),
      },
      { accessorKey: "lastModifiedBy", header: "Last Modified By" },
      { accessorKey: "description", header: "Description" },
      { accessorKey: "job", header: "JOB" },
      { accessorKey: "issuedQuantity", header: "Issued Quantity" },
      {
        accessorKey: "issuedDate",
        header: "Issued Date",
        cell: ({ row }) =>
          new Date(row.original.issuedDate).toLocaleDateString("en-GB"),
      },
      { accessorKey: "issuedBy", header: "Issued By" },
      { accessorKey: "destination", header: "Destination" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      { accessorKey: "remark", header: "Remark" },
      {
        id: "actions",
        header: "",
        cell: () => null,
      },
    ],
    []
  );

  const handleFilterChange = (
    key: keyof PackagingFilters,
    value: string | PackagingStatus
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    alert(
      `Exporting ${selectedPackagings.length} selected items. See console for data.`
    );
    console.log("Data to export:", selectedPackagings);
  };

  const hasSelection = selectedPackagings.length > 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Packaging Issue Report
          </h1>
          <p className="text-sm text-gray-500">
            View, filter, and export packaging transaction history.
          </p>
        </div>
        <Button onClick={handleExport} disabled={!hasSelection}>
          <Download className="w-4 h-4 mr-2" />
          Export to Excel {hasSelection && `(${selectedPackagings.length})`}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="relative md:col-span-12 lg:col-span-4">
              <Label htmlFor="query" className="mb-1">
                Search Item No / PO
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="query"
                  type="text"
                  placeholder="e.g., BTN-001 or PO23-115"
                  value={filters.query || ""}
                  onChange={(e) => handleFilterChange("query", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:col-span-4 lg:col-span-2">
              <Label htmlFor="status" className="mb-1">
                Status
              </Label>
              <Select
                value={filters.status || ""}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Partially">Partially</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-8 lg:col-span-4">
              <Label className="mb-1">Issued Date (From - To)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                />
                <span className="text-gray-500">-</span>
                <Input
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            A list of all packaging issue transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomTable
            columns={tableColumns}
            data={filteredPackagings}
            onSelectionChange={setSelectedPackagings}
            showCheckbox={true}
            showColumnVisibility={true}
          />
        </CardContent>
      </Card>

      {/* Modal Chi Tiết */}
      <PackagingDetailsModal
        data={viewingPackaging}
        isOpen={!!viewingPackaging}
        onClose={() => setViewingPackaging(null)}
      />
    </div>
  );
};

export default PackagingIssueTransactionReportsPage;
