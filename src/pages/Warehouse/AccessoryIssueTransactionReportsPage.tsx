import React, { useState, useMemo } from "react";
import { Download, Search } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Custom Standardized Table
import { CustomTable } from "@/components/ui/custom-table";

// ============================================================================
// --- TYPES & DATA ---
// ============================================================================

type AccessoryStatus = "Complete" | "Partially" | "Pending";

interface Accessory {
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
  status: AccessoryStatus;
  remark: string | null;
}

interface AccessoryFilters {
  query?: string;
  supplier?: string;
  status?: AccessoryStatus | "";
  dateFrom?: string;
  dateTo?: string;
}

const mockAccessories: Accessory[] = [
  {
    qrCode: "ACC-BTN-001-BLK",
    itemNumber: "BTN-001",
    itemCategory: "BTN",
    materialName: "Cúc nhựa 4 lỗ",
    color: "Đen",
    size: "15mm",
    quantity: 5000,
    unit: "Cái",
    location: "Kệ A-01-05",
    batchNumber: "B20231001",
    dateReceived: "2023-10-01",
    supplier: "Phụ liệu Phong Phú",
    poNumber: "PO23-115",
    reorderPoint: 1000,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Nguyễn Văn An",
    description: "Cúc nhựa thông dụng cho áo sơ mi nam.",
    job: "JOB2310-SM01",
    issuedQuantity: 2000,
    issuedDate: "2023-10-25",
    issuedBy: "Nguyễn Văn An",
    destination: "Chuyền may 1",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "ACC-ZIP-001-BRS",
    itemNumber: "ZIP-001",
    itemCategory: "ZIP",
    materialName: "Khóa kéo kim loại",
    color: "Đồng",
    size: "50cm",
    quantity: 850,
    unit: "Cái",
    location: "Kệ B-03-01",
    batchNumber: "Z20230915",
    dateReceived: "2023-09-15",
    supplier: "Dệt may Thành Công",
    poNumber: "PO23-098",
    reorderPoint: 200,
    lastModifiedDate: "2023-10-25",
    lastModifiedBy: "Trần Thị Bích",
    description: "Dùng cho áo khoác jean, loại răng 5.",
    job: "JOB2310-JK02",
    issuedQuantity: 350,
    issuedDate: "2023-10-24",
    issuedBy: "Trần Thị Bích",
    destination: "Xưởng may 2",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "ACC-THR-001-WHT",
    itemNumber: "THR-001",
    itemCategory: "THR",
    materialName: "Chỉ may polyester",
    color: "Trắng",
    size: "40/2",
    quantity: 150,
    unit: "Cuộn",
    location: "Kệ C-02-11",
    batchNumber: "T20231010",
    dateReceived: "2023-10-10",
    supplier: "Sợi Việt Thắng",
    poNumber: "PO23-121",
    reorderPoint: 50,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Lê Minh Tuấn",
    description: "Chỉ may vắt sổ, độ bền cao.",
    job: "JOB2310-SM01",
    issuedQuantity: 50,
    issuedDate: "2023-10-25",
    issuedBy: "Lê Minh Tuấn",
    destination: "Chuyền may 1",
    status: "Complete",
    remark: null,
  },
];

// ============================================================================
// --- HELPER COMPONENTS ---
// ============================================================================

const StatusBadge: React.FC<{ status: AccessoryStatus }> = ({ status }) => {
  const statusStyles: Record<
    AccessoryStatus,
    { text: string; variant: "default" | "secondary" | "outline" }
  > = {
    Complete: { text: "Complete", variant: "default" },
    Partially: { text: "Partially", variant: "outline" },
    Pending: { text: "Pending", variant: "secondary" },
  };
  const { text, variant } = statusStyles[status];

  const variantClasses = {
    default: "bg-green-100 text-green-800 border-green-200",
    outline: "bg-yellow-100 text-yellow-800 border-yellow-200",
    secondary: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <Badge variant={variant} className={variantClasses[variant]}>
      {text}
    </Badge>
  );
};

interface ReportFiltersProps {
  onFilterChange: (filters: AccessoryFilters) => void;
}
const ReportFilters: React.FC<ReportFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<AccessoryFilters>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof AccessoryFilters;
    const updatedFilters = { ...filters, [key]: value } as AccessoryFilters;
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSelectChange = (value: string) => {
    const newStatus = (value === "all" ? "" : (value as AccessoryStatus)) as
      | AccessoryStatus
      | "";
    const updatedFilters: AccessoryFilters = { ...filters, status: newStatus };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div className="lg:col-span-2">
            <Label htmlFor="query">Search Item No / PO</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="query"
                name="query"
                type="text"
                placeholder="e.g., BTN-001 or PO23-115"
                value={filters.query || ""}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              value={filters.status === "" ? "all" : filters.status || "all"}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Partially">Partially</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Issued Date (From - To)</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                name="dateFrom"
                value={filters.dateFrom || ""}
                onChange={handleChange}
              />
              <span className="text-gray-500">-</span>
              <Input
                type="date"
                name="dateTo"
                value={filters.dateTo || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- MODAL CHI TIẾT ---
const AccessoryDetailsModal = ({
  data,
  isOpen,
  onClose,
}: {
  data: Accessory | null;
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
            Accessory Details -{" "}
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
                value={new Date(data.issuedDate).toLocaleDateString()}
              />
              <DetailItem label="Issued By" value={data.issuedBy} />
              <DetailItem label="Location" value={data.location} />
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
// --- MAIN PAGE COMPONENT ---
// ============================================================================

const AccessoryIssueTransactionReportsPage = () => {
  const [filters, setFilters] = useState<AccessoryFilters>({});
  const [selectedRows, setSelectedRows] = useState<Accessory[]>([]);
  const [viewingAccessory, setViewingAccessory] = useState<Accessory | null>(
    null
  );

  const isLoading = false;
  const data = mockAccessories;

  const filteredAccessories = useMemo(() => {
    return data.filter((acc) => {
      const { query, supplier, status, dateFrom, dateTo } = filters;
      const queryMatch =
        !query ||
        acc.itemNumber.toLowerCase().includes(query.toLowerCase()) ||
        acc.poNumber.toLowerCase().includes(query.toLowerCase());
      const supplierMatch = !supplier || acc.supplier === supplier;
      const statusMatch = !status || acc.status === status;
      const issuedDate = new Date(acc.issuedDate);
      const fromDateMatch = !dateFrom || issuedDate >= new Date(dateFrom);
      const toDateMatch = !dateTo || issuedDate <= new Date(dateTo);
      return (
        queryMatch &&
        supplierMatch &&
        statusMatch &&
        fromDateMatch &&
        toDateMatch
      );
    });
  }, [data, filters]);

  const handleExport = () => {
    if (selectedRows.length === 0) {
      alert("No rows selected for export.");
      return;
    }
    alert(
      `Exporting ${selectedRows.length} selected items. See console for data.`
    );
    console.log("Data to export:", selectedRows);
  };

  const columns = useMemo<ColumnDef<Accessory>[]>(
    () => [
      {
        accessorKey: "qrCode",
        header: "QR Code",
        cell: ({ row }) => (
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => setViewingAccessory(row.original)}
          >
            <span className="font-medium text-blue-600 group-hover:underline group-hover:text-blue-800 transition-colors">
              {row.original.qrCode}
            </span>
          </div>
        ),
      },
      { accessorKey: "itemNumber", header: "Item Number" },
      { accessorKey: "materialName", header: "Material Name" },
      { accessorKey: "supplier", header: "Supplier" },
      { accessorKey: "poNumber", header: "PO Number" },
      { accessorKey: "job", header: "JOB" },
      { accessorKey: "issuedQuantity", header: "Issued Qty" },
      {
        accessorKey: "issuedDate",
        header: "Issued Date",
        cell: ({ row }) =>
          new Date(row.getValue("issuedDate")).toLocaleDateString(),
      },
      { accessorKey: "issuedBy", header: "Issued By" },
      { accessorKey: "destination", header: "Destination" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
      },
      { accessorKey: "remark", header: "Remark" },
    ],
    []
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Accessory Issue Report</h1>
          <p className="text-sm text-muted-foreground">
            View, filter, and export accessory transaction history.
          </p>
        </div>
        <Button onClick={handleExport} disabled={selectedRows.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export to Excel{" "}
          {selectedRows.length > 0 && `(${selectedRows.length})`}
        </Button>
      </div>

      <ReportFilters onFilterChange={setFilters} />

      {isLoading ? (
        <Card>
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-10 w-full" />
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : (
        <CustomTable
          columns={columns}
          data={filteredAccessories}
          onSelectionChange={setSelectedRows}
        />
      )}

      {/* Modal Chi Tiết */}
      <AccessoryDetailsModal
        data={viewingAccessory}
        isOpen={!!viewingAccessory}
        onClose={() => setViewingAccessory(null)}
      />
    </div>
  );
};

export default AccessoryIssueTransactionReportsPage;
