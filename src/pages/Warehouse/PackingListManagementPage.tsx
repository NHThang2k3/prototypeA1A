import { useState, useEffect, useMemo, useCallback, type FC } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Plus,
  QrCode,
  Undo2,
  CheckCircle,
  Printer,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

// --- UI Imports ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomTable } from "@/components/ui/custom-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- IMPORTS ---
// Giả định component này nằm cùng thư mục hoặc chỉnh lại đường dẫn cho đúng
import ImportPackingListFormPage from "./ImportPackingListFormPage";

// --- CONSTANTS ---
const FACTORY_OPTIONS = [
  { value: "Factory A", label: "Factory A" },
  { value: "Factory B", label: "Factory B" },
  { value: "Factory C", label: "Factory C" },
  { value: "Factory D", label: "Factory D" },
];

// --- TYPES ---
export type PrintStatus = "NOT_PRINTED" | "PRINTED";

export interface FabricRollItem {
  id: string;
  poNumber: string;
  itemCode: string;
  factory: string;
  invoiceNo: string;
  supplier: string;
  color: string;
  rollNo: number | string;
  lotNo: string;
  yards: number;
  netWeightKgs: number;
  width: string;
  dateInHouse: string;
  qcCheck: boolean;
  printStatus: PrintStatus;
}

// --- MOCK DATA ---
const mockFabricRolls: FabricRollItem[] = [
  {
    id: uuidv4(),
    poNumber: "PO-1001",
    itemCode: "ITM-001",
    factory: "Factory A",
    invoiceNo: "INV-2023-01",
    supplier: "Sup A",
    color: "Black",
    rollNo: 1,
    lotNo: "LOT-A",
    yards: 50,
    netWeightKgs: 12.5,
    width: '60"',
    dateInHouse: "2023-10-15",
    qcCheck: false,
    printStatus: "NOT_PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "PO-1002",
    itemCode: "ITM-002",
    factory: "Factory B",
    invoiceNo: "INV-2023-02",
    supplier: "Sup B",
    color: "Red",
    rollNo: 2,
    lotNo: "LOT-B",
    yards: 100,
    netWeightKgs: 25.0,
    width: '58"',
    dateInHouse: "2023-10-20",
    qcCheck: true,
    printStatus: "PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "PO-1001",
    itemCode: "ITM-001",
    factory: "Factory A",
    invoiceNo: "INV-2023-01",
    supplier: "Sup A",
    color: "Black",
    rollNo: 3,
    lotNo: "LOT-A",
    yards: 48,
    netWeightKgs: 11.8,
    width: '60"',
    dateInHouse: "2023-10-15",
    qcCheck: false,
    printStatus: "NOT_PRINTED",
  },
];

// --- COMPONENTS ---

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

// --- FILTER COMPONENT ---
interface FilterState {
  invoice: string;
  po: string;
  date: string;
  factory: string;
}

interface PackingListFiltersProps {
  onSearch: (filters: FilterState) => void;
  onReset: () => void;
}

const PackingListFilters: FC<PackingListFiltersProps> = ({
  onSearch,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>({
    invoice: "",
    po: "",
    date: "",
    factory: "all",
  });

  const handleChange = (key: keyof FilterState, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchClick = () => {
    onSearch(localFilters);
  };

  const handleResetClick = () => {
    const resetState = {
      invoice: "",
      po: "",
      date: "",
      factory: "all",
    };
    setLocalFilters(resetState);
    onReset();
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="f-invoice" className="mb-1.5 block">
              Invoice No
            </Label>
            <Input
              id="f-invoice"
              placeholder="Search Invoice..."
              value={localFilters.invoice}
              onChange={(e) => handleChange("invoice", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
            />
          </div>

          <div>
            <Label htmlFor="f-po" className="mb-1.5 block">
              PO Number
            </Label>
            <Input
              id="f-po"
              placeholder="Search PO..."
              value={localFilters.po}
              onChange={(e) => handleChange("po", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
            />
          </div>

          <div>
            <Label htmlFor="f-date" className="mb-1.5 block">
              Date (In House)
            </Label>
            <Input
              id="f-date"
              type="date"
              value={localFilters.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="f-factory" className="mb-1.5 block">
              Factory
            </Label>
            <Select
              value={localFilters.factory}
              onValueChange={(val) => handleChange("factory", val)}
            >
              <SelectTrigger id="f-factory">
                <SelectValue placeholder="All Factories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Factories</SelectItem>
                {FACTORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleResetClick}>
            <Undo2 className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSearchClick}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// --- LOADING SKELETON ---
const TableSkeleton: FC = () => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-48" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[300px] w-full" />
    </CardContent>
  </Card>
);

// --- MAIN COMPONENT ---
const PackingListManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FabricRollItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<FabricRollItem[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [activeFilters, setActiveFilters] = useState<FilterState>({
    invoice: "",
    po: "",
    date: "",
    factory: "all",
  });

  const fetchData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setItems(mockFabricRolls);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleImportSuccess = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  const handleReset = () => {
    setActiveFilters({
      invoice: "",
      po: "",
      date: "",
      factory: "all",
    });
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchInvoice = item.invoiceNo
        .toLowerCase()
        .includes(activeFilters.invoice.toLowerCase());
      const matchPO = item.poNumber
        .toLowerCase()
        .includes(activeFilters.po.toLowerCase());
      const matchDate =
        activeFilters.date === "" || item.dateInHouse === activeFilters.date;
      const matchFactory =
        activeFilters.factory === "all" ||
        item.factory === activeFilters.factory;

      return matchInvoice && matchPO && matchDate && matchFactory;
    });
  }, [items, activeFilters]);

  const handlePrintItems = useCallback((itemIds: Set<string>) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        itemIds.has(item.id) ? { ...item, printStatus: "PRINTED" } : item
      )
    );
    setSelectedItems([]);
  }, []);

  // --- DEFINED COLUMNS WITH CUSTOM SELECT LOGIC ---
  const columns: ColumnDef<FabricRollItem>[] = useMemo(
    () => [
      // 1. Cột Checkbox tuỳ chỉnh
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            // Checkbox Header
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => {
              if (value) {
                // LOGIC: Khi bấm Select All, chỉ tick những dòng "NOT_PRINTED"
                // Những dòng PRINTED sẽ không được tick tự động
                const rows = table.getRowModel().rows;
                rows.forEach((row) => {
                  if (row.original.printStatus === "NOT_PRINTED") {
                    row.toggleSelected(true);
                  }
                });
              } else {
                // Khi bỏ chọn thì reset hết
                table.resetRowSelection();
              }
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            // Checkbox từng dòng
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            // QUAN TRỌNG: Không dùng disabled để cho phép chọn tay kể cả đã in
            // disabled={row.original.printStatus === "PRINTED"}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      // 2. Các cột dữ liệu
      { accessorKey: "poNumber", header: "PO Number" },
      { accessorKey: "invoiceNo", header: "Invoice No" },
      { accessorKey: "factory", header: "Factory" },
      { accessorKey: "itemCode", header: "Item Code" },
      { accessorKey: "color", header: "Color" },
      { accessorKey: "rollNo", header: "Roll No" },
      { accessorKey: "yards", header: "Yards" },
      { accessorKey: "dateInHouse", header: "Date In House" },
      {
        accessorKey: "printStatus",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.printStatus} />,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handlePrintItems(new Set([item.id]))}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Print QR
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handlePrintItems]
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Packing List Management</h1>
        <Button onClick={() => setIsImportModalOpen(true)}>
          <Plus className="mr-2 h-5 w-5" />
          Import Packing List
        </Button>
      </div>

      <PackingListFilters onSearch={handleSearch} onReset={handleReset} />

      {loading ? (
        <TableSkeleton />
      ) : (
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
                Print Selected ({selectedItems.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredItems.length > 0 ? (
              <CustomTable
                data={filteredItems}
                columns={columns}
                onSelectionChange={setSelectedItems}
                showCheckbox={false} // Tắt cột checkbox mặc định của CustomTable vì chúng ta đã define cột custom
              />
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No items found matching filters.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* MODAL IMPORT */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0 gap-0 bg-gray-50/50">
          <DialogHeader className="p-6 border-b bg-background flex-shrink-0">
            <DialogTitle>Import Packing List</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <ImportPackingListFormPage
              onSuccess={() => {
                setIsImportModalOpen(false);
                handleImportSuccess();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackingListManagementPage;
