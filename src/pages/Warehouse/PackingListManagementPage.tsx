// path: src/pages/packing-list-management/PackingListManagementPage.tsx

import { useState, useEffect, useMemo, type FC } from "react";
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
  // DialogTrigger, // <-- FIX: Removed unused import
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

// Type for items in the import modal
export interface PackingListItem {
  id: string;
  // Add other properties as needed from the import process
  // [key: string]: any;
}

// --- END OF TYPES ---

// --- START OF MOCK DATA (from data.ts) ---

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
  // ... other mock data ...
];

// --- END OF MOCK DATA ---

// --- START OF COMPONENT: StatusBadge.tsx ---

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
// --- END OF COMPONENT: StatusBadge.tsx ---

// --- START OF COMPONENT: PageHeader.tsx ---

interface PageHeaderProps {
  onImportClick: () => void;
}
const PageHeader: FC<PageHeaderProps> = ({ onImportClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Packing List Management</h1>
      {/* <-- FIX: Removed the incorrect DialogTrigger wrapper. The button's onClick is handled by the parent. --> */}
      <Button onClick={onImportClick}>
        <Plus className="mr-2 h-5 w-5" />
        Import Packing List
      </Button>
    </div>
  );
};
// --- END OF COMPONENT: PageHeader.tsx ---

// --- START OF COMPONENT: PackingListFilters.tsx ---

const PackingListFilters: FC = () => {
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
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <Label htmlFor="print-status-filter" className="mb-1.5 block">
              Print Status
            </Label>
            <Select>
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
            <Select>
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
        <div className="mt-4 flex justify-end">
          <Button>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
// --- END OF COMPONENT: PackingListFilters.tsx ---

// --- START OF COMPONENT: TableSkeleton.tsx ---

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
// --- END OF COMPONENT: TableSkeleton.tsx ---

// --- START OF COMPONENT: ImportPackingListModal.tsx ---

// Placeholder for missing components
const ImportPackingListFormPage: FC<{
  items: PackingListItem[];
  onItemsChange: (items: PackingListItem[]) => void;
}> = ({ onItemsChange }) => (
  <div className="text-center p-10 border-2 border-dashed rounded-lg">
    <p className="text-muted-foreground">
      Import Packing List Form UI would be here.
    </p>
    <p className="text-sm text-muted-foreground/80">
      This is a placeholder component.
    </p>
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
const ActionToolbar: FC<{ onSubmit: () => void; isSubmitting: boolean }> = ({
  onSubmit,
  isSubmitting,
}) => (
  <div className="flex justify-end">
    <Button onClick={onSubmit} disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : "Submit Inbound Shipment"}
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
    if (items.length === 0) {
      alert("Please upload and process a file before submitting.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newShipmentId = `PNK-${Date.now()}`;
      alert(`Successfully created inbound shipment ${newShipmentId}!`);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-full max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Packing List</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0 overflow-y-auto flex-grow">
          <ImportPackingListFormPage items={items} onItemsChange={setItems} />
        </div>
        <DialogFooter>
          <ActionToolbar onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
// --- END OF COMPONENT: ImportPackingListModal.tsx ---

// --- MAIN PAGE COMPONENT: PackingListManagementPage ---

const PackingListManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FabricRollItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<FabricRollItem[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(mockFabricRolls);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePrintItems = (itemIds: Set<string>) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        itemIds.has(item.id) ? { ...item, printStatus: "PRINTED" } : item
      )
    );
    const printedItemCodes = items
      .filter((item) => itemIds.has(item.id))
      .map((item) => `${item.itemCode} (Roll: ${item.rollNo})`)
      .join(", ");
    alert(
      `Print command sent for items: ${printedItemCodes}\n(This would trigger a printing API).`
    );
    setSelectedItems([]);
  };

  const columns: ColumnDef<FabricRollItem>[] = useMemo(
    () => [
      { accessorKey: "poNumber", header: "PO Number" },
      { accessorKey: "itemCode", header: "Item Code" },
      { accessorKey: "color", header: "Color" },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items] // Add dependency to re-render actions when print status changes
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-full">
      <PageHeader onImportClick={() => setIsImportModalOpen(true)} />
      <PackingListFilters />

      {loading ? (
        <TableSkeleton />
      ) : items.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Item List</CardTitle>
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
            <CustomTable
              data={items}
              columns={columns}
              onSelectionChange={setSelectedItems}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center p-10">
          <p>No items found.</p>
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
