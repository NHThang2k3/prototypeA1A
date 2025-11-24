// path: src/pages/packing-list-management/PackingListManagementPage.tsx

import { useState, useEffect, useMemo, useCallback, type FC } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Plus,
  Search,
  QrCode,
  Undo2,
  CheckCircle,
  Printer,
  MoreHorizontal,
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
// Thêm vào phần UI Imports
import { Checkbox } from "@/components/ui/checkbox";

// --- UI Imports ---
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomTable } from "@/components/ui/custom-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- START OF TYPES (from types.ts) ---

export type PrintStatus = "NOT_PRINTED" | "PRINTED";
export type QCStatus = "Passed" | "Failed" | "Pending";

export interface FabricRollItem {
  id: string;
  poNumber: string;
  itemCode: string;
  factory: string;
  supplier: string;
  invoiceNo: string;
  colorCode: string;
  color: string;
  description: string;
  rollNo: number;
  lotNo: string;
  yards: number;
  netWeightKgs: number;
  grossWeightKgs: number;
  width: string;
  location: string;
  qrCode: string;
  dateInHouse: string;
  qcCheck: boolean;
  qcDate: string;
  qcBy: string;
  comment: string;
  printStatus: PrintStatus;
}

export interface PackingListItem {
  id: string;
}

// --- END OF TYPES ---

// --- START OF MOCK DATA ---
const mockFabricRolls: FabricRollItem[] = [
  {
    id: uuidv4(),
    poNumber: "POPU0018235",
    itemCode: "CK-126-04-00277",
    factory: "Factory C",
    supplier: "Supplier Z",
    invoiceNo: "INV-005",
    colorCode: "CC-002",
    color: "Puma Black",
    description: "Polyester Blend",
    rollNo: 1,
    lotNo: "225628091",
    yards: 45,
    netWeightKgs: 17.4,
    grossWeightKgs: 17.8,
    width: '68"',
    location: "F2-03-05",
    qrCode: "QR-76433",
    dateInHouse: "2/18/203",
    qcCheck: false,
    qcDate: "4/29/2023",
    qcBy: "John Doe",
    comment: "Minor defect on edge",
    printStatus: "PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "PSPU0002986",
    itemCode: "WO-413-04-00361",
    factory: "Factory B",
    supplier: "Supplier X",
    invoiceNo: "INV-006",
    colorCode: "CC-004",
    color: "PUMA BLACK",
    description: "Silk Blend",
    rollNo: 1,
    lotNo: "225628091",
    yards: 22,
    netWeightKgs: 4.5,
    grossWeightKgs: 4.8,
    width: '57"',
    location: "F2-03-06",
    qrCode: "QR-93641",
    dateInHouse: "3/16/2023",
    qcCheck: true,
    qcDate: "8/5/2023",
    qcBy: "Jane Smith",
    comment: "No issues found",
    printStatus: "NOT_PRINTED",
  },
  // Thêm dữ liệu mẫu để test filter
  {
    id: uuidv4(),
    poNumber: "TEST-001",
    itemCode: "TEST-CODE-1",
    factory: "Factory A",
    supplier: "Supplier Y",
    invoiceNo: "INV-007",
    colorCode: "CC-005",
    color: "Red",
    description: "Cotton",
    rollNo: 2,
    lotNo: "12345",
    yards: 10,
    netWeightKgs: 2.5,
    grossWeightKgs: 2.6,
    width: '60"',
    location: "F1-01",
    qrCode: "QR-111",
    dateInHouse: "1/1/2024",
    qcCheck: true,
    qcDate: "1/2/2024",
    qcBy: "Admin",
    comment: "",
    printStatus: "PRINTED",
  },
];
// --- END OF MOCK DATA ---

// --- START OF COMPONENTS ---

interface StatusBadgeProps {
  status: PrintStatus;
}
const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  if (status === "PRINTED") {
    return (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-800 border-green-200"
      >
        <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
        Printed
      </Badge>
    );
  }
  return (
    <Badge variant="secondary">
      <Printer className="w-3.5 h-3.5 mr-1.5" />
      Not Printed
    </Badge>
  );
};

interface PageHeaderProps {
  onImportClick: () => void;
}
const PageHeader: FC<PageHeaderProps> = ({ onImportClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Packing List Management</h1>
      <Button onClick={onImportClick}>
        <Plus className="mr-2 h-5 w-5" />
        Import Packing List
      </Button>
    </div>
  );
};

// 1. UPDATE: Định nghĩa Props cho Filter Component
interface PackingListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  printStatus: string;
  onPrintStatusChange: (value: string) => void;
  qcStatus: string;
  onQcStatusChange: (value: string) => void;
}

// 2. UPDATE: Nhận props và gắn vào các input/select
const PackingListFilters: FC<PackingListFiltersProps> = ({
  searchTerm,
  onSearchChange,
  printStatus,
  onPrintStatusChange,
  qcStatus,
  onQcStatusChange,
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <Label htmlFor="item-search" className="mb-1.5 block">
              Search Item
            </Label>
            <div className="relative">
              <Input
                id="item-search"
                placeholder="Enter PO, Item Code, Color, Lot..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <Label htmlFor="print-status-filter" className="mb-1.5 block">
              Print Status
            </Label>
            <Select value={printStatus} onValueChange={onPrintStatusChange}>
              <SelectTrigger id="print-status-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="NOT_PRINTED">Not Printed</SelectItem>
                <SelectItem value="PRINTED">Printed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="qc-check-filter" className="mb-1.5 block">
              QC Check
            </Label>
            <Select value={qcStatus} onValueChange={onQcStatusChange}>
              <SelectTrigger id="qc-check-filter">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="checked">Yes</SelectItem>
                <SelectItem value="not-checked">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Button Search có thể dùng để trigger force reload nếu cần, ở đây ta dùng reactive filter nên nút này mang tính trang trí hoặc clear filter */}
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onSearchChange("");
              onPrintStatusChange("all");
              onQcStatusChange("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const TableSkeleton: FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Skeleton className="h-5 w-5" />
                </TableHead>
                {Array.from({ length: 7 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-5 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-5" />
                  </TableCell>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <Skeleton className="h-5 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-40" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Placeholder Modal Imports ---
const ImportPackingListFormPage: FC<{
  items: PackingListItem[];
  onItemsChange: (items: PackingListItem[]) => void;
}> = ({ onItemsChange }) => (
  <div className="text-center p-10 border-2 border-dashed rounded-lg">
    <p className="text-muted-foreground">Import Packing List Form UI</p>
    <Button
      variant="outline"
      size="sm"
      className="mt-4"
      onClick={() => onItemsChange([{ id: "sample-1" }, { id: "sample-2" }])}
    >
      Simulate File Upload
    </Button>
  </div>
);

interface ImportPackingListModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
const ImportPackingListModal: FC<ImportPackingListModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [items, setItems] = useState<PackingListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Import Packing List</DialogTitle>
        </DialogHeader>
        <ImportPackingListFormPage items={items} onItemsChange={setItems} />
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- MAIN PAGE COMPONENT: PackingListManagementPage ---

const PackingListManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FabricRollItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<FabricRollItem[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // 3. UPDATE: Thêm state cho Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [printStatusFilter, setPrintStatusFilter] = useState("all");
  const [qcStatusFilter, setQcStatusFilter] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(mockFabricRolls);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 4. UPDATE: Logic lọc dữ liệu (useMemo)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Lọc theo Search Term (tìm trong PO, Code, Color, Lot)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        item.poNumber.toLowerCase().includes(searchLower) ||
        item.itemCode.toLowerCase().includes(searchLower) ||
        item.color.toLowerCase().includes(searchLower) ||
        item.lotNo.toLowerCase().includes(searchLower);

      // Lọc theo Print Status
      const matchesPrintStatus =
        printStatusFilter === "all" || item.printStatus === printStatusFilter;

      // Lọc theo QC Status
      let matchesQC = true;
      if (qcStatusFilter === "checked") matchesQC = item.qcCheck === true;
      if (qcStatusFilter === "not-checked") matchesQC = item.qcCheck === false;

      return matchesSearch && matchesPrintStatus && matchesQC;
    });
  }, [items, searchTerm, printStatusFilter, qcStatusFilter]);

  const handlePrintItems = useCallback((itemIds: Set<string>) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        itemIds.has(item.id) ? { ...item, printStatus: "PRINTED" } : item
      )
    );
    setSelectedItems([]);
    // alert("Printed selected items");
  }, []);

  const columns: ColumnDef<FabricRollItem>[] = useMemo(
    () => [
      // --- THÊM CỘT SELECTION VỚI LOGIC TÙY CHỈNH ---
      {
        id: "select",
        header: ({ table }) => {
          // 1. Lấy tất cả các dòng đang hiển thị (đã qua filter search/status)
          const allRows = table.getRowModel().rows;

          // 2. Lọc ra những dòng có thể chọn (Chỉ chọn dòng NOT_PRINTED)
          const selectableRows = allRows.filter(
            (row) => row.original.printStatus === "NOT_PRINTED"
          );

          // 3. Tính toán trạng thái hiển thị của checkbox header
          // Checked nếu: Có dòng để chọn VÀ tất cả các dòng đó đã được chọn
          const isAllSelectableSelected =
            selectableRows.length > 0 &&
            selectableRows.every((row) => row.getIsSelected());

          // Indeterminate (gạch ngang) nếu: Có một số dòng được chọn nhưng chưa hết
          const isSomeSelected =
            selectableRows.some((row) => row.getIsSelected()) &&
            !isAllSelectableSelected;

          return (
            <Checkbox
              checked={
                isAllSelectableSelected
                  ? true
                  : isSomeSelected
                  ? "indeterminate"
                  : false
              }
              onCheckedChange={(value) => {
                if (value) {
                  // LOGIC CHÍNH: Nếu check -> Tạo object selection chỉ chứa ID của các dòng NOT_PRINTED
                  const newSelection = selectableRows.reduce((acc, row) => {
                    acc[row.id] = true;
                    return acc;
                  }, {} as Record<string, boolean>);

                  table.setRowSelection(newSelection);
                } else {
                  // Nếu uncheck -> Bỏ chọn tất cả
                  table.resetRowSelection();
                }
              }}
              aria-label="Select all eligible rows"
            />
          );
        },
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      // --- KẾT THÚC CỘT SELECTION ---

      { accessorKey: "poNumber", header: "PO Number" },
      { accessorKey: "itemCode", header: "Item Code" },
      { accessorKey: "color", header: "Color" },
      // ... Giữ nguyên các cột khác của bạn
      { accessorKey: "rollNo", header: "Roll No" },
      { accessorKey: "lotNo", header: "Lot No" },
      { accessorKey: "yards", header: "Yards" },
      { accessorKey: "netWeightKgs", header: "Net Weight (Kgs)" },
      { accessorKey: "width", header: "Width" },
      {
        accessorKey: "qcCheck",
        header: "QC Check",
        cell: ({ row }) => (row.original.qcCheck ? "Yes" : "No"),
      },
      {
        accessorKey: "printStatus",
        header: "Print Status",
        cell: ({ row }) => <StatusBadge status={row.original.printStatus} />,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          // ... Giữ nguyên logic actions
          const item = row.original;
          const handlePrintSingle = () => handlePrintItems(new Set([item.id]));

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {item.printStatus === "PRINTED" ? (
                  <DropdownMenuItem onClick={handlePrintSingle}>
                    <Undo2 className="w-4 h-4 mr-2" />
                    Reprint
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handlePrintSingle}>
                    <QrCode className="w-4 h-4 mr-2" />
                    Print
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handlePrintItems]
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-full">
      <PageHeader onImportClick={() => setIsImportModalOpen(true)} />

      {/* 5. UPDATE: Truyền props vào Filters */}
      <PackingListFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        printStatus={printStatusFilter}
        onPrintStatusChange={setPrintStatusFilter}
        qcStatus={qcStatusFilter}
        onQcStatusChange={setQcStatusFilter}
      />

      {loading ? (
        <TableSkeleton />
      ) : filteredItems.length > 0 ? ( // Sử dụng filteredItems để kiểm tra độ dài
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Item List ({filteredItems.length})</CardTitle>
              <Button
                onClick={() =>
                  handlePrintItems(new Set(selectedItems.map((i) => i.id)))
                }
                disabled={selectedItems.length === 0}
              >
                <QrCode className="w-4 h-4 mr-2" />
                Print QR for Selected ({selectedItems.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* 6. UPDATE: Truyền filteredItems vào Table */}
            <CustomTable
              data={filteredItems}
              columns={columns}
              showCheckbox={false}
              onSelectionChange={setSelectedItems}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center p-10">
          <p>No items found matching your filters.</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchTerm("");
              setPrintStatusFilter("all");
              setQcStatusFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}

      <ImportPackingListModal
        isOpen={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
      />
    </div>
  );
};

export default PackingListManagementPage;
