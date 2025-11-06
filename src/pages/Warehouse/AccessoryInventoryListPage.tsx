import React, { useState, useEffect, useMemo, type FC } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  FileDown,
  Printer,
  MoreHorizontal,
  Move,
  PackageMinus,
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Custom Standardized Table
import { CustomTable } from "@/components/ui/custom-table";

// ============================================================================
// --- TYPES & DATA (Unchanged) ---
// ============================================================================

export type AccessoryStatus = "In Stock" | "Out of Stock" | "Low Stock";

export interface AccessoryItem {
  id: string; // Using ItemNumber as a unique ID
  qrCode: string;
  itemNumber: string;
  itemCategory: string;
  materialName: string;
  color: string;
  size: string;
  quantity: number;
  unit: string;
  location: string;
  requiredQuantity: number;
  status: AccessoryStatus;
  batchNumber: string;
  dateReceived: string;
  supplier: string;
  poNumber: string;
  reorderPoint: number;
  lastModifiedDate: string;
  lastModifiedBy: string;
  description: string;
}

const DUMMY_ACCESSORY_DATA: AccessoryItem[] = [
  // ... (dummy data remains the same)
  {
    id: "ACC-LBL-001-MLT",
    qrCode: "ACC-LBL-001-MLT",
    itemNumber: "LBL-001",
    itemCategory: "LBL",
    materialName: "Nhãn dệt logo",
    color: "Nhiều màu",
    size: "2cm x 5cm",
    quantity: 0,
    unit: "Cái",
    location: "Kệ D-05-02",
    requiredQuantity: 1000,
    status: "Out of Stock",
    batchNumber: "L20230701",
    dateReceived: "2023-07-01",
    supplier: "Nhãn mác An Phát",
    poNumber: "PO23-050",
    reorderPoint: 500,
    lastModifiedDate: "2023-10-20",
    lastModifiedBy: "Nguyễn Văn An",
    description: "Nhãn dệt chính cho áo T-shirt.",
  },
  {
    id: "ACC-ELS-001-WHT",
    qrCode: "ACC-ELS-001-WHT",
    itemNumber: "ELS-001",
    itemCategory: "ELS",
    materialName: "Thun dệt kim",
    color: "Trắng",
    size: "2.5cm",
    quantity: 2500,
    unit: "Mét",
    location: "Kệ C-04-08",
    requiredQuantity: 800,
    status: "In Stock",
    batchNumber: "E20230928",
    dateReceived: "2023-09-28",
    supplier: "Phụ liệu Phong Phú",
    poNumber: "PO23-109",
    reorderPoint: 500,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Lê Minh Tuấn",
    description: "Thun luồn lưng quần thể thao.",
  },
  {
    id: "ACC-INT-001-WHT",
    qrCode: "ACC-INT-001-WHT",
    itemNumber: "INT-001",
    itemCategory: "INT",
    materialName: "Keo giấy dựng cổ",
    color: "Trắng",
    size: "90cm",
    quantity: 800,
    unit: "Mét",
    location: "Kệ B-01-03",
    requiredQuantity: 150,
    status: "In Stock",
    batchNumber: "I20230905",
    dateReceived: "2023-09-05",
    supplier: "Dệt may Thành Công",
    poNumber: "PO23-088",
    reorderPoint: 150,
    lastModifiedDate: "2023-10-22",
    lastModifiedBy: "Nguyễn Văn An",
    description: "Keo ủi dùng cho cổ và nẹp áo sơ mi.",
  },
  {
    id: "ACC-ZIP-002-RED",
    qrCode: "ACC-ZIP-002-RED",
    itemNumber: "ZIP-002",
    itemCategory: "ZIP",
    materialName: "Khóa kéo giọt nước",
    color: "Đỏ",
    size: "20cm",
    quantity: 320,
    unit: "Cái",
    location: "Kệ B-03-09",
    requiredQuantity: 100,
    status: "In Stock",
    batchNumber: "Z20231005",
    dateReceived: "2023-10-05",
    supplier: "Phụ liệu Sài Gòn",
    poNumber: "PO23-118",
    reorderPoint: 100,
    lastModifiedDate: "2023-10-25",
    lastModifiedBy: "Trần Thị Bích",
    description: "Khóa kéo giấu, dùng cho đầm nữ.",
  },
  {
    id: "ACC-THR-002-NVY",
    qrCode: "ACC-THR-002-NVY",
    itemNumber: "THR-002",
    itemCategory: "THR",
    materialName: "Chỉ may cotton",
    color: "Xanh Navy",
    size: "50/3",
    quantity: 45,
    unit: "Cuộn",
    location: "Kệ C-02-12",
    requiredQuantity: 60,
    status: "Low Stock",
    batchNumber: "T20230815",
    dateReceived: "2023-08-15",
    supplier: "Sợi Việt Thắng",
    poNumber: "PO23-070",
    reorderPoint: 50,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Lê Minh Tuấn",
    description: "Chỉ cotton chần cho quần kaki.",
  },
  {
    id: "ACC-LBL-002-WHT",
    qrCode: "ACC-LBL-002-WHT",
    itemNumber: "LBL-002",
    itemCategory: "LBL",
    materialName: "Nhãn satin in HDSD",
    color: "Trắng",
    size: "3cm x 6cm",
    quantity: 4500,
    unit: "Cái",
    location: "Kệ D-05-03",
    requiredQuantity: 0,
    status: "In Stock",
    batchNumber: "L20231012",
    dateReceived: "2023-10-12",
    supplier: "Nhãn mác An Phát",
    poNumber: "PO23-124",
    reorderPoint: 1000,
    lastModifiedDate: "2023-10-23",
    lastModifiedBy: "Nguyễn Văn An",
    description: "Nhãn sườn in hướng dẫn sử dụng.",
  },
];

// ============================================================================
// --- REFACTORED & HELPER COMPONENTS (Unchanged) ---
// ============================================================================

const PageSkeleton: FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-8 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6 space-y-2">
        <div className="flex bg-gray-50 p-4 rounded-t-lg">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-1 h-6 bg-gray-200 rounded mx-2"></div>
          ))}
        </div>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center p-4">
            {[...Array(8)].map((_, j) => (
              <div
                key={j}
                className="flex-1 h-6 bg-gray-200 rounded mx-2"
              ></div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

const StatusBadge: FC<{ status: AccessoryStatus }> = ({ status }) => {
  const statusMap: Record<
    AccessoryStatus,
    { text: string; variant: "default" | "destructive" | "outline" }
  > = {
    "In Stock": { text: "In Stock", variant: "default" },
    "Low Stock": { text: "Low Stock", variant: "outline" },
    "Out of Stock": { text: "Out of Stock", variant: "destructive" },
  };

  const { text, variant } = statusMap[status] || {
    text: "Unknown",
    variant: "default",
  };

  // Add custom colors for variants
  const variantClasses = {
    default: "bg-green-100 text-green-800 border-green-200",
    outline: "bg-yellow-100 text-yellow-800 border-yellow-200",
    destructive: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Badge variant={variant} className={variantClasses[variant]}>
      {text}
    </Badge>
  );
};

const AccessoryInventoryFilters: FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CardContent className="p-6">
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between text-lg font-semibold">
              <span className="flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-3" />
                Search
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <form className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <Label htmlFor="itemNumber">Item Number</Label>
                  <Input id="itemNumber" placeholder="e.g., BTN-001" />
                </div>
                <div>
                  <Label htmlFor="poNumber">PO Number</Label>
                  <Input id="poNumber" placeholder="e.g., PO23-115" />
                </div>
                <div>
                  <Label htmlFor="materialName">Material Name</Label>
                  <Input id="materialName" placeholder="e.g., Cúc nhựa" />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" placeholder="e.g., Đen" />
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" placeholder="e.g., Phụ liệu Phong Phú" />
                </div>
                <div>
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input id="batchNumber" placeholder="e.g., B20231001" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t flex items-center justify-end space-x-3">
                <Button type="button" variant="outline">
                  Clear
                </Button>
                <Button type="submit" onClick={(e) => e.preventDefault()}>
                  <Search className="w-5 h-5 mr-2 -ml-1" />
                  Search
                </Button>
              </div>
            </form>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
};

interface AccessoryInventoryHeaderProps {
  selectedRowCount: number;
  onPrintMultiple: () => void;
  onExportExcel: () => void;
}

const AccessoryInventoryHeader: FC<AccessoryInventoryHeaderProps> = ({
  selectedRowCount,
  onPrintMultiple,
  onExportExcel,
}) => {
  const hasSelection = selectedRowCount > 0;

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center">
      <div>
        <h1 className="text-3xl font-bold">Accessory Inventory Management</h1>
        {hasSelection && (
          <p className="text-sm text-muted-foreground mt-1">
            {selectedRowCount} item(s) selected.
          </p>
        )}
      </div>
      <div className="flex space-x-2 mt-4 md:mt-0">
        <Button
          variant="outline"
          onClick={onPrintMultiple}
          disabled={!hasSelection}
        >
          <Printer className="w-5 h-5 mr-2" />
          Reprint QR
        </Button>
        <Button onClick={onExportExcel} disabled={!hasSelection}>
          <FileDown className="w-5 h-5 mr-2" />
          Export Excel
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// --- NEW: MODAL COMPONENTS ---
// ============================================================================
interface TransferLocationDialogProps {
  item: AccessoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (item: AccessoryItem, newLocation: string) => void;
}

const TransferLocationDialog: FC<TransferLocationDialogProps> = ({
  item,
  open,
  onOpenChange,
  onConfirm,
}) => {
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    // Reset input when dialog is closed
    if (!open) {
      setNewLocation("");
    }
  }, [open]);

  if (!item) return null;

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onConfirm(item, newLocation);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Location for {item.itemNumber}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="py-4 space-y-4">
            <p>
              Current location:{" "}
              <span className="font-semibold">{item.location}</span>
            </p>
            <div>
              <Label htmlFor="new-location">New location</Label>
              <Input
                id="new-location"
                name="new-location"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g., Kệ Z-99-99"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Confirm Transfer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface IssueAccessoryDialogProps {
  item: AccessoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (item: AccessoryItem, quantity: number) => void;
}

const IssueAccessoryDialog: FC<IssueAccessoryDialogProps> = ({
  item,
  open,
  onOpenChange,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState<number | string>("");

  useEffect(() => {
    // Reset input when dialog is closed or item changes
    if (!open) {
      setQuantity("");
    }
  }, [open, item]);

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue Accessory: {item.itemNumber}</DialogTitle>
          <DialogDescription>
            {item.materialName} - {item.color}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p>
            Current quantity: <span className="font-bold">{item.quantity}</span>{" "}
            {item.unit}
          </p>
          <div>
            <Label htmlFor="quantity-issue">Quantity to issue</Label>
            <Input
              type="number"
              id="quantity-issue"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 100"
              min="1"
              max={item.quantity}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => onConfirm(item, Number(quantity))}
            disabled={
              !quantity ||
              Number(quantity) <= 0 ||
              Number(quantity) > item.quantity
            }
          >
            Confirm Issue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// --- MAIN PAGE COMPONENT (MODIFIED) ---
// ============================================================================

const AccessoryInventoryListPage: FC = () => {
  // --- Data & State ---
  const [accessoryItems, setAccessoryItems] = useState<AccessoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<AccessoryItem[]>([]);

  type ModalType = "transfer" | "issue";
  const [modalState, setModalState] = useState<{
    type: ModalType | null;
    data: AccessoryItem | null;
  }>({ type: null, data: null });

  // --- Effects ---
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setAccessoryItems(DUMMY_ACCESSORY_DATA);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---
  const handlePrintQr = (item: AccessoryItem) =>
    alert(`Printing QR Code for: ${item.qrCode}`);

  const handlePrintMultipleQr = () => {
    if (selectedRows.length === 0) return alert("No rows selected to print.");
    const ids = selectedRows.map((r) => r.id).join(", ");
    alert(`Printing QR Codes for: ${ids}`);
  };

  const handleExportExcel = () => {
    if (selectedRows.length === 0) return alert("No rows selected to export.");
    const ids = selectedRows.map((r) => r.id).join(", ");
    alert(`Exporting data for: ${ids}`);
  };

  const handleExecuteIssue = (
    itemToUpdate: AccessoryItem,
    quantityToIssue: number
  ) => {
    if (
      !quantityToIssue ||
      quantityToIssue <= 0 ||
      quantityToIssue > itemToUpdate.quantity
    )
      return alert("Invalid quantity to issue.");

    setAccessoryItems((prev) =>
      prev.map((item) => {
        if (item.id === itemToUpdate.id) {
          const newQuantity = item.quantity - quantityToIssue;
          const newStatus: AccessoryStatus =
            newQuantity <= 0
              ? "Out of Stock"
              : newQuantity <= item.reorderPoint
              ? "Low Stock"
              : "In Stock";
          return {
            ...item,
            quantity: newQuantity,
            status: newStatus,
            lastModifiedDate: new Date().toISOString().split("T")[0],
            lastModifiedBy: "Admin User",
          };
        }
        return item;
      })
    );
    setModalState({ type: null, data: null }); // Close modal
    alert(
      `Issued ${quantityToIssue} ${itemToUpdate.unit} of ${itemToUpdate.itemNumber}.`
    );
  };

  const handleTransferLocation = (
    itemToUpdate: AccessoryItem,
    newLocation: string
  ) => {
    if (!newLocation.trim()) return alert("New location cannot be empty.");

    setAccessoryItems((prev) =>
      prev.map((item) =>
        item.id === itemToUpdate.id
          ? {
              ...item,
              location: newLocation,
              lastModifiedDate: new Date().toISOString().split("T")[0],
              lastModifiedBy: "Admin User",
            }
          : item
      )
    );
    setModalState({ type: null, data: null }); // Close modal
    alert(
      `Transferred ${itemToUpdate.itemNumber} to new location: ${newLocation}`
    );
  };

  // --- Table Column Definitions ---
  const columns = useMemo<ColumnDef<AccessoryItem>[]>(
    () => [
      {
        accessorKey: "qrCode",
        header: "QR Code",
        cell: ({ row }) => (
          <div className="font-medium text-blue-600">
            {row.getValue("qrCode")}
          </div>
        ),
      },
      { accessorKey: "itemNumber", header: "Item Number" },
      { accessorKey: "materialName", header: "Material Name" },
      { accessorKey: "color", header: "Color" },
      { accessorKey: "quantity", header: "Quantity" },
      { accessorKey: "unit", header: "Unit" },
      { accessorKey: "location", header: "Location" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
      },
      { accessorKey: "supplier", header: "Supplier" },
      {
        id: "actions",
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
                <DropdownMenuItem onClick={() => handlePrintQr(item)}>
                  <Printer className="mr-2 h-4 w-4" />
                  Reprint QR Code
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setModalState({ type: "issue", data: item })}
                >
                  <PackageMinus className="mr-2 h-4 w-4" />
                  Issue for Production
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setModalState({ type: "transfer", data: item })
                  }
                >
                  <Move className="mr-2 h-4 w-4" />
                  Transfer Location
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* --- NEW: RENDER DIALOG COMPONENTS --- */}
      <TransferLocationDialog
        item={modalState.data}
        open={modalState.type === "transfer"}
        onOpenChange={() => setModalState({ type: null, data: null })}
        onConfirm={handleTransferLocation}
      />
      <IssueAccessoryDialog
        item={modalState.data}
        open={modalState.type === "issue"}
        onOpenChange={() => setModalState({ type: null, data: null })}
        onConfirm={handleExecuteIssue}
      />

      {isLoading ? (
        <PageSkeleton />
      ) : (
        <>
          <AccessoryInventoryHeader
            selectedRowCount={selectedRows.length}
            onPrintMultiple={handlePrintMultipleQr}
            onExportExcel={handleExportExcel}
          />
          <AccessoryInventoryFilters />
          {accessoryItems.length > 0 ? (
            <CustomTable
              columns={columns}
              data={accessoryItems}
              onSelectionChange={setSelectedRows}
            />
          ) : (
            <Card>
              <CardContent className="text-center p-12">
                <h3 className="text-xl font-medium">No items found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No items match the current filters.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AccessoryInventoryListPage;
