// path: src/pages/packing-list-management/PackingListManagementPagePackaging.tsx

import { useState, useMemo, type FC } from "react";
import { v4 as uuidv4 } from "uuid";
import {
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomTable } from "@/components/ui/custom-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- TYPES ---

export type PrintStatus = "NOT_PRINTED" | "PRINTED";

export interface PackagingItem {
  id: string;
  poNumber: string;
  itemCode: string;
  supplier: string;
  invoiceNo: string;
  description: string;
  boxNo: number;
  lotNo: string;
  quantity: number;
  unit: string;
  netWeightKgs: number;
  grossWeightKgs: number;
  dimensions: string; // e.g. "30x20x15 cm"
  location: string;
  qrCode: string;
  dateInHouse: string;
  qcCheck: boolean;
  printStatus: PrintStatus;
}

// --- MOCK DATA ---

const mockPackagingItems: PackagingItem[] = [
  {
    id: uuidv4(),
    poNumber: "POPKG001",
    itemCode: "PKG-BOX-M-BRN",
    supplier: "Box Corp",
    invoiceNo: "INV-PKG-101",
    description: "Medium Brown Box",
    boxNo: 1,
    lotNo: "LOT-BOX-2023",
    quantity: 200,
    unit: "PCS",
    netWeightKgs: 15.2,
    grossWeightKgs: 15.8,
    dimensions: "30x20x15 cm",
    location: "P-01-A",
    qrCode: "QR-PKG-001",
    dateInHouse: "10/20/2023",
    qcCheck: true,
    printStatus: "PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "POPKG002",
    itemCode: "PKG-POLY-L-CLR",
    supplier: "Plastic Bags Inc.",
    invoiceNo: "INV-PKG-102",
    description: "Large Clear Polybag",
    boxNo: 1,
    lotNo: "LOT-POLY-2023",
    quantity: 2500,
    unit: "PCS",
    netWeightKgs: 8.1,
    grossWeightKgs: 8.4,
    dimensions: "40x50 cm",
    location: "P-01-B",
    qrCode: "QR-PKG-002",
    dateInHouse: "10/21/2023",
    qcCheck: false,
    printStatus: "NOT_PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "POPKG002",
    itemCode: "PKG-POLY-L-CLR",
    supplier: "Plastic Bags Inc.",
    invoiceNo: "INV-PKG-102",
    description: "Large Clear Polybag",
    boxNo: 2,
    lotNo: "LOT-POLY-2023",
    quantity: 2500,
    unit: "PCS",
    netWeightKgs: 8.1,
    grossWeightKgs: 8.4,
    dimensions: "40x50 cm",
    location: "P-01-B",
    qrCode: "QR-PKG-003",
    dateInHouse: "10/21/2023",
    qcCheck: false,
    printStatus: "NOT_PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "POPKG003",
    itemCode: "PKG-TAPE-BRN-50",
    supplier: "Adhesives Co.",
    invoiceNo: "INV-PKG-103",
    description: "Brown Packing Tape 50m",
    boxNo: 1,
    lotNo: "LOT-TAPE-2023",
    quantity: 50,
    unit: "ROLL",
    netWeightKgs: 4.5,
    grossWeightKgs: 4.7,
    dimensions: "48mm x 50m",
    location: "P-01-C",
    qrCode: "QR-PKG-004",
    dateInHouse: "10/22/2023",
    qcCheck: true,
    printStatus: "PRINTED",
  },
];

// --- SUB-COMPONENTS ---

const StatusBadge: FC<{ status: PrintStatus }> = ({ status }) => {
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

const PageHeader: FC = () => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">Packaging Management</h1>
  </div>
);

const PackingListFilters: FC = () => (
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
              placeholder="Enter PO, Item Code, Lot..."
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

// --- MAIN PAGE COMPONENT ---

const PackingListManagementPagePackaging = () => {
  const [items, setItems] = useState<PackagingItem[]>(mockPackagingItems);
  const [selectedItems, setSelectedItems] = useState<PackagingItem[]>([]);

  const handlePrintItems = (itemIds: Set<string>) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        itemIds.has(item.id) ? { ...item, printStatus: "PRINTED" } : item
      )
    );
    alert(`Print command sent for ${itemIds.size} packaging items.`);
    setSelectedItems([]);
  };

  const columns: ColumnDef<PackagingItem>[] = useMemo(
    () => [
      { accessorKey: "poNumber", header: "PO Number" },
      { accessorKey: "itemCode", header: "Item Code" },
      { accessorKey: "description", header: "Description" },
      { accessorKey: "boxNo", header: "Box No" },
      { accessorKey: "lotNo", header: "Lot No" },
      { accessorKey: "quantity", header: "Quantity" },
      { accessorKey: "unit", header: "Unit" },
      { accessorKey: "dimensions", header: "Dimensions" },
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
    []
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-full">
      <PageHeader />
      <PackingListFilters />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Packaging List</CardTitle>
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
    </div>
  );
};

export default PackingListManagementPagePackaging;
