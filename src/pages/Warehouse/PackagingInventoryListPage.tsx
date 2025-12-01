import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  type FC,
} from "react";
import {
  FileDown,
  Printer,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Move,
  PackageMinus,
  Eye, // --- NEW: Import Eye Icon
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { CustomTable } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator, // --- NEW: Import Separator
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// ============================================================================
// TYPES, CONSTANTS, AND MOCK DATA (Unchanged)
// ============================================================================

type PackagingStatus = "In Stock" | "Out of Stock" | "Low Stock";

interface PackagingItem {
  id: string;
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
  status: PackagingStatus;
  batchNumber: string;
  dateReceived: string;
  supplier: string;
  poNumber: string;
  reorderPoint: number;
  lastModifiedDate: string;
  lastModifiedBy: string;
  description: string;
}

const DUMMY_PACKAGING_DATA: PackagingItem[] = [
  {
    id: "PKG-CTN-001-L",
    qrCode: "PKG-CTN-001-L",
    itemNumber: "CTN-001",
    itemCategory: "Thùng Carton",
    materialName: "Thùng carton 5 lớp",
    color: "Nâu",
    size: "60x40x40 cm",
    quantity: 1200,
    unit: "Thùng",
    location: "Kệ P-01-A",
    requiredQuantity: 200,
    status: "In Stock",
    batchNumber: "CTN231001",
    dateReceived: "2023-10-01",
    supplier: "Bao bì Toàn Quốc",
    poNumber: "PO-PKG-081",
    reorderPoint: 300,
    lastModifiedDate: "2023-10-25",
    lastModifiedBy: "Khoa Nguyễn",
    description: "Thùng carton lớn để đóng gói áo khoác.",
  },
  {
    id: "PKG-POLY-002-M",
    qrCode: "PKG-POLY-002-M",
    itemNumber: "POLY-002",
    itemCategory: "Túi Poly",
    materialName: "Túi poly có khóa zip",
    color: "Trong suốt",
    size: "30x40 cm",
    quantity: 4500,
    unit: "Túi",
    location: "Kệ P-02-B",
    requiredQuantity: 1000,
    status: "In Stock",
    batchNumber: "POLY230925",
    dateReceived: "2023-09-25",
    supplier: "Nhựa Rạng Đông",
    poNumber: "PO-PKG-075",
    reorderPoint: 1000,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Linh Trần",
    description: "Túi poly để đóng gói áo thun, có lỗ thoát hơi.",
  },
  {
    id: "PKG-TAPE-001",
    qrCode: "PKG-TAPE-001",
    itemNumber: "TAPE-001",
    itemCategory: "Băng keo",
    materialName: "Băng keo trong",
    color: "Trong suốt",
    size: "4.8cm x 100m",
    quantity: 85,
    unit: "Cuộn",
    location: "Kệ P-05-C",
    requiredQuantity: 20,
    status: "Low Stock",
    batchNumber: "TAPE230901",
    dateReceived: "2023-09-01",
    supplier: "Băng keo Hùng Vương",
    poNumber: "PO-PKG-068",
    reorderPoint: 100,
    lastModifiedDate: "2023-10-24",
    lastModifiedBy: "Khoa Nguyễn",
    description: "Băng keo dán thùng carton, độ dính cao.",
  },
  {
    id: "PKG-LBL-003",
    qrCode: "PKG-LBL-003",
    itemNumber: "LBL-003",
    itemCategory: "Nhãn",
    materialName: "Nhãn vận chuyển",
    color: "Trắng",
    size: "10x15 cm",
    quantity: 0,
    unit: "Cái",
    location: "Kệ P-03-A",
    requiredQuantity: 2000,
    status: "Out of Stock",
    batchNumber: "LBL230815",
    dateReceived: "2023-08-15",
    supplier: "Giấy in An Lộc",
    poNumber: "PO-PKG-052",
    reorderPoint: 500,
    lastModifiedDate: "2023-10-15",
    lastModifiedBy: "Linh Trần",
    description: "Nhãn in thông tin vận chuyển, có keo dán sẵn.",
  },
  {
    id: "PKG-PAP-001",
    qrCode: "PKG-PAP-001",
    itemNumber: "PAP-001",
    itemCategory: "Giấy lót",
    materialName: "Giấy nến lót",
    color: "Trắng",
    size: "40x60 cm",
    quantity: 15000,
    unit: "Tờ",
    location: "Kệ P-04-D",
    requiredQuantity: 3000,
    status: "In Stock",
    batchNumber: "PAP231010",
    dateReceived: "2023-10-10",
    supplier: "Giấy Vĩnh Phú",
    poNumber: "PO-PKG-085",
    reorderPoint: 2000,
    lastModifiedDate: "2023-10-22",
    lastModifiedBy: "Khoa Nguyễn",
    description: "Giấy lót giữa các lớp áo để chống nhăn.",
  },
  {
    id: "PKG-CTN-002-S",
    qrCode: "PKG-CTN-002-S",
    itemNumber: "CTN-002",
    itemCategory: "Thùng Carton",
    materialName: "Thùng carton 3 lớp",
    color: "Nâu",
    size: "30x20x15 cm",
    quantity: 2500,
    unit: "Thùng",
    location: "Kệ P-01-B",
    requiredQuantity: 500,
    status: "In Stock",
    batchNumber: "CTN231005",
    dateReceived: "2023-10-05",
    supplier: "Bao bì Toàn Quốc",
    poNumber: "PO-PKG-083",
    reorderPoint: 500,
    lastModifiedDate: "2023-10-25",
    lastModifiedBy: "Linh Trần",
    description: "Thùng carton nhỏ cho phụ kiện hoặc đơn hàng nhỏ.",
  },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const StatusBadge: FC<{ status: PackagingStatus }> = ({ status }) => {
  const statusMap: Record<
    PackagingStatus,
    { text: string; className: string }
  > = {
    "In Stock": {
      text: "In Stock",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    "Low Stock": {
      text: "Low Stock",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    "Out of Stock": {
      text: "Out of Stock",
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };
  const { text, className } = statusMap[status];
  return (
    <Badge variant="outline" className={className}>
      {text}
    </Badge>
  );
};

const PageSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-4 w-60" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
    <Card>
      <CardContent className="p-6">
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
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  </div>
);

// --- 1. NEW: PACKAGING DETAIL MODAL ---
interface PackagingDetailModalProps {
  item: PackagingItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PackagingDetailModal: FC<PackagingDetailModalProps> = ({
  item,
  open,
  onOpenChange,
}) => {
  if (!item) return null;

  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b last:border-0 border-gray-100">
      <span className="font-medium text-muted-foreground col-span-1">
        {label}
      </span>
      <span className="col-span-2 text-foreground font-medium break-words">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Packaging Details: {item.itemNumber}</DialogTitle>
          <DialogDescription>{item.materialName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* General Info */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-primary">
              General Information
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border">
              <DetailRow label="QR Code" value={item.qrCode} />
              <DetailRow label="Category" value={item.itemCategory} />
              <DetailRow label="Description" value={item.description} />
              <DetailRow label="Material Name" value={item.materialName} />
              <DetailRow label="Color" value={item.color} />
              <DetailRow label="Size" value={item.size} />
            </div>
          </div>

          {/* Inventory Status */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-primary">
              Inventory Status
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border">
              <DetailRow
                label="Current Quantity"
                value={`${item.quantity.toLocaleString()} ${item.unit}`}
              />
              <DetailRow
                label="Required Quantity"
                value={`${item.requiredQuantity.toLocaleString()} ${item.unit}`}
              />
              <DetailRow
                label="Reorder Point"
                value={`${item.reorderPoint.toLocaleString()} ${item.unit}`}
              />
              <DetailRow
                label="Status"
                value={<StatusBadge status={item.status} />}
              />
              <DetailRow label="Location" value={item.location} />
            </div>
          </div>

          {/* Supply Chain Info */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-primary">
              Supply Chain
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border">
              <DetailRow label="Supplier" value={item.supplier} />
              <DetailRow label="PO Number" value={item.poNumber} />
              <DetailRow label="Batch Number" value={item.batchNumber} />
              <DetailRow label="Date Received" value={item.dateReceived} />
            </div>
          </div>

          {/* System Info */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-primary">
              System Info
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border">
              <DetailRow
                label="Last Modified Date"
                value={item.lastModifiedDate}
              />
              <DetailRow label="Last Modified By" value={item.lastModifiedBy} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const IssueModal: FC<{
  item: PackagingItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (quantity: number) => void;
}> = ({ item, open, onOpenChange, onSubmit }) => {
  const [quantity, setQuantity] = useState<number | string>("");

  useEffect(() => {
    if (open) setQuantity("");
  }, [open]);

  const handleSubmit = () => {
    onSubmit(Number(quantity));
  };

  const isInvalid =
    !quantity || Number(quantity) <= 0 || Number(quantity) > item.quantity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue Packaging: {item.itemNumber}</DialogTitle>
          <DialogDescription>
            {item.materialName} - {item.color}
          </DialogDescription>
        </DialogHeader>
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Current quantity: <span className="font-bold">{item.quantity}</span>{" "}
            {item.unit}
          </p>
          <div className="space-y-2">
            <Label htmlFor="quantity-issue">Quantity to issue</Label>
            <Input
              id="quantity-issue"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 100"
              min="1"
              max={item.quantity}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isInvalid}>
            Confirm Issue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TransferModal: FC<{
  item: PackagingItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (newLocation: string) => void;
}> = ({ item, open, onOpenChange, onSubmit }) => {
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    if (open) setNewLocation("");
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newLocation);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Location for {item.itemNumber}</DialogTitle>
          <DialogDescription>
            Current location: {item.location}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="new-location">New location</Label>
            <Input
              id="new-location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="e.g., Kệ Z-99-99"
              required
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!newLocation.trim()}>
              Confirm Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const PackagingInventoryListPage = () => {
  const [packagingItems, setPackagingItems] = useState<PackagingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<PackagingItem[]>([]);

  // --- UPDATED: Added 'detail' to ModalType
  type ModalType = "transfer" | "issue" | "detail";
  const [modalState, setModalState] = useState<{
    type: ModalType | null;
    data: PackagingItem | null;
  }>({ type: null, data: null });

  const openModal = useCallback(
    (type: ModalType, data: PackagingItem) => {
      setModalState({ type, data });
    },
    [setModalState]
  );
  const closeModal = () => setModalState({ type: null, data: null });

  const columns: ColumnDef<PackagingItem>[] = useMemo(
    () => [
      {
        accessorKey: "qrCode",
        header: "QR Code",
      },
      { accessorKey: "itemNumber", header: "Item Number" },
      { accessorKey: "materialName", header: "Material Name" },
      { accessorKey: "color", header: "Color" },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => row.original.quantity.toLocaleString(),
      },
      { accessorKey: "unit", header: "Unit" },
      { accessorKey: "location", header: "Location" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      { accessorKey: "supplier", header: "Supplier" },
      { accessorKey: "poNumber", header: "PO Number" },
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
                {/* --- NEW: View Details Action --- */}
                <DropdownMenuItem onClick={() => openModal("detail", item)}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View Details</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => alert(`Printing QR for ${item.qrCode}`)}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  <span>Reprint QR Code</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openModal("issue", item)}>
                  <PackageMinus className="mr-2 h-4 w-4" />
                  <span>Issue for Production</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openModal("transfer", item)}>
                  <Move className="mr-2 h-4 w-4" />
                  <span>Transfer Location</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [openModal]
  );

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setPackagingItems(DUMMY_PACKAGING_DATA);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handlePrintMultipleQr = () => {
    if (selectedRows.length === 0) return alert("No rows selected to print.");
    const selectedIds = selectedRows.map((item) => item.qrCode).join(", ");
    alert(`Printing QR Codes for: ${selectedIds}`);
    setSelectedRows([]);
  };

  const handleExportExcel = () => {
    if (selectedRows.length === 0) return alert("No rows selected to export.");
    alert(`Exporting data for ${selectedRows.length} items.`);
    console.log("Exporting:", selectedRows);
    setSelectedRows([]);
  };

  const handleExecuteIssue = (quantityToIssue: number) => {
    const itemToUpdate = modalState.data;
    if (!itemToUpdate) return;

    setPackagingItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemToUpdate.id) {
          const newQuantity = item.quantity - quantityToIssue;
          let newStatus: PackagingStatus = "In Stock";
          if (newQuantity <= 0) newStatus = "Out of Stock";
          else if (newQuantity <= item.reorderPoint) newStatus = "Low Stock";
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
    closeModal();
    alert(
      `Issued ${quantityToIssue} ${itemToUpdate.unit} of ${itemToUpdate.itemNumber}.`
    );
  };

  const handleTransferLocation = (newLocation: string) => {
    const itemToUpdate = modalState.data;
    if (!itemToUpdate) return;

    setPackagingItems((prevItems) =>
      prevItems.map((item) =>
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
    closeModal();
    alert(
      `Transferred ${itemToUpdate.itemNumber} to new location: ${newLocation}`
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {modalState.data && (
        <>
          {/* 1. Detail Modal */}
          <PackagingDetailModal
            item={modalState.data}
            open={modalState.type === "detail"}
            onOpenChange={(open) => !open && closeModal()}
          />

          {/* 2. Issue Modal */}
          <IssueModal
            item={modalState.data}
            open={modalState.type === "issue"}
            onOpenChange={(open) => !open && closeModal()}
            onSubmit={handleExecuteIssue}
          />

          {/* 3. Transfer Modal */}
          <TransferModal
            item={modalState.data}
            open={modalState.type === "transfer"}
            onOpenChange={(open) => !open && closeModal()}
            onSubmit={handleTransferLocation}
          />
        </>
      )}

      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Packaging Inventory Management
          </h1>
          {selectedRows.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {selectedRows.length} item(s) selected.
            </p>
          )}
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={handlePrintMultipleQr}
            disabled={selectedRows.length === 0}
          >
            <Printer className="w-5 h-5 mr-2" />
            Reprint QR
          </Button>
          <Button
            onClick={handleExportExcel}
            disabled={selectedRows.length === 0}
          >
            <FileDown className="w-5 h-5 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Collapsible defaultOpen={true}>
        <Card>
          <CollapsibleTrigger asChild>
            <div className="p-6 cursor-pointer flex items-center justify-between">
              <h3 className="flex items-center text-lg font-semibold">
                <SlidersHorizontal className="w-5 h-5 mr-3 text-gray-500" />
                Search Filters
              </h3>
              <Button variant="ghost" size="sm">
                Toggle
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
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
              </form>
              <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
                <Button variant="outline">Clear</Button>
                <Button type="submit" onClick={(e) => e.preventDefault()}>
                  <Search className="w-5 h-5 mr-2 -ml-1" />
                  Search
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Card>
        <CardContent className="pt-6">
          <CustomTable
            columns={columns}
            data={packagingItems}
            onSelectionChange={setSelectedRows}
            showCheckbox={true}
            showColumnVisibility={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PackagingInventoryListPage;
