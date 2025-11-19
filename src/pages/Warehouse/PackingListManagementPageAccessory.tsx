// path: src/pages/packing-list-management/PackingListManagementPageAccessory.tsx

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

export interface AccessoryItem {
  id: string;
  poNumber: string;
  itemCode: string;
  supplier: string;
  invoiceNo: string;
  color: string;
  description: string;
  boxNo: number;
  lotNo: string;
  quantity: number;
  unit: string;
  netWeightKgs: number;
  grossWeightKgs: number;
  size: string;
  location: string;
  qrCode: string;
  dateInHouse: string;
  qcCheck: boolean;
  printStatus: PrintStatus;
}

// --- MOCK DATA ---

const mockAccessoryItems: AccessoryItem[] = [
  {
    id: uuidv4(),
    poNumber: "POACC001",
    itemCode: "ACC-ZIP-SLV-05",
    supplier: "Zipper Co.",
    invoiceNo: "INV-ACC-101",
    color: "Silver",
    description: "Metal Zipper #5",
    boxNo: 1,
    lotNo: "LOT-ZIP-2023",
    quantity: 500,
    unit: "PCS",
    netWeightKgs: 5.2,
    grossWeightKgs: 5.5,
    size: '5"',
    location: "C-01-A",
    qrCode: "QR-ACC-001",
    dateInHouse: "10/15/2023",
    qcCheck: true,
    printStatus: "PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "POACC002",
    itemCode: "ACC-BTN-BLK-15",
    supplier: "Button World",
    invoiceNo: "INV-ACC-102",
    color: "Black",
    description: "Plastic Buttons 15mm",
    boxNo: 1,
    lotNo: "LOT-BTN-2023",
    quantity: 1000,
    unit: "PCS",
    netWeightKgs: 2.1,
    grossWeightKgs: 2.3,
    size: "15mm",
    location: "C-01-B",
    qrCode: "QR-ACC-002",
    dateInHouse: "10/16/2023",
    qcCheck: false,
    printStatus: "NOT_PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "POACC002",
    itemCode: "ACC-BTN-BLK-15",
    supplier: "Button World",
    invoiceNo: "INV-ACC-102",
    color: "Black",
    description: "Plastic Buttons 15mm",
    boxNo: 2,
    lotNo: "LOT-BTN-2023",
    quantity: 1000,
    unit: "PCS",
    netWeightKgs: 2.1,
    grossWeightKgs: 2.3,
    size: "15mm",
    location: "C-01-B",
    qrCode: "QR-ACC-003",
    dateInHouse: "10/16/2023",
    qcCheck: false,
    printStatus: "NOT_PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "POACC003",
    itemCode: "ACC-LBL-MAIN-M",
    supplier: "Label Pro",
    invoiceNo: "INV-ACC-103",
    color: "White",
    description: "Main Label - Size M",
    boxNo: 1,
    lotNo: "LOT-LBL-2023",
    quantity: 2500,
    unit: "PCS",
    netWeightKgs: 1.5,
    grossWeightKgs: 1.7,
    size: "M",
    location: "C-01-C",
    qrCode: "QR-ACC-004",
    dateInHouse: "10/18/2023",
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
    <h1 className="text-3xl font-bold">Accessory Management</h1>
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

// --- MAIN PAGE COMPONENT ---

const PackingListManagementPageAccessory = () => {
  const [items, setItems] = useState<AccessoryItem[]>(mockAccessoryItems);
  const [selectedItems, setSelectedItems] = useState<AccessoryItem[]>([]);

  const handlePrintItems = (itemIds: Set<string>) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        itemIds.has(item.id) ? { ...item, printStatus: "PRINTED" } : item
      )
    );
    alert(`Print command sent for ${itemIds.size} accessory items.`);
    setSelectedItems([]);
  };

  const columns: ColumnDef<AccessoryItem>[] = useMemo(
    () => [
      { accessorKey: "poNumber", header: "PO Number" },
      { accessorKey: "itemCode", header: "Item Code" },
      { accessorKey: "description", header: "Description" },
      { accessorKey: "color", header: "Color" },
      { accessorKey: "boxNo", header: "Box No" },
      { accessorKey: "lotNo", header: "Lot No" },
      { accessorKey: "quantity", header: "Quantity" },
      { accessorKey: "unit", header: "Unit" },
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
            <CardTitle>Accessory List</CardTitle>
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

export default PackingListManagementPageAccessory;
