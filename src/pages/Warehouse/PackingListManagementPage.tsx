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

import ImportPackingListFormPage from "./ImportPackingListFormPage";

const FACTORY_OPTIONS = [
  { value: "Factory A", label: "Factory A" },
  { value: "Factory B", label: "Factory B" },
  { value: "Factory C", label: "Factory C" },
  { value: "Factory D", label: "Factory D" },
];

export type PrintStatus = "NOT_PRINTED" | "PRINTED";

// --- INTERFACE (Cập nhật đủ cột) ---
export interface FabricRollItem {
  id: string;
  factory: string;     // Cột Factory thêm vào
  p: string;           // p
  invoiceNo: string;   // INVOICE
  supplier: string;    // SUP
  poNumber: string;    // Po
  itemCode: string;    // Item
  color: string;       // Color
  lotNo: string;       // Batch
  rollNo: string;      // ROLL
  yards: number;       // YDS
  netWeight: number;   // N.W
  width: string;       // Width Sticker
  foc: string;         // FOC
  qc: string;          // QC
  netWeight2: number;  // N.W2
  grossWeight: number; // G.W
  dateInHouse: string; // Date
  printStatus: PrintStatus;
}

// --- MOCK DATA ---
const mockFabricRolls: FabricRollItem[] = [
  {
    id: uuidv4(),
    factory: "Factory A",
    p: "",
    invoiceNo: "A2507403",
    supplier: "LITTLE",
    poNumber: "POAD000068764",
    itemCode: "70029659-64",
    color: "ADFE TEAM LIGHT GREY",
    lotNo: "NO.003",
    rollNo: "KQ0001",
    yards: 55,
    netWeight: 18.6,
    width: '64"',
    foc: "",
    qc: "",
    netWeight2: 18.6,
    grossWeight: 18.8,
    dateInHouse: "2023-12-10",
    printStatus: "NOT_PRINTED",
  },
  {
    id: uuidv4(),
    factory: "Factory B",
    p: "",
    invoiceNo: "A2507403",
    supplier: "LITTLE",
    poNumber: "POAD000068764",
    itemCode: "70029659-64",
    color: "ADFE TEAM LIGHT GREY",
    lotNo: "NO.003",
    rollNo: "KQ0002",
    yards: 51,
    netWeight: 17.2,
    width: '64"',
    foc: "",
    qc: "",
    netWeight2: 17.2,
    grossWeight: 17.4,
    dateInHouse: "2023-12-10",
    printStatus: "PRINTED",
  },
];

// --- BADGE STATUS ---
const StatusBadge: FC<{ status: PrintStatus }> = ({ status }) => {
  return status === "PRINTED" ? (
    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
      <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Printed
    </Badge>
  ) : (
    <Badge variant="secondary">
      <Printer className="w-3.5 h-3.5 mr-1.5" /> Not Printed
    </Badge>
  );
};

// --- FILTERS ---
interface FilterState {
  invoice: string;
  po: string;
  // batch: string;
  date: string;
  factory: string;
}

const PackingListFilters: FC<{
  onSearch: (f: FilterState) => void;
  onReset: () => void;
}> = ({ onSearch, onReset }) => {
  const [local, setLocal] = useState<FilterState>({
    invoice: "",
    po: "",
    // batch: "",
    date: "",
    factory: "all",
  });

  const handleChange = (k: keyof FilterState, v: string) =>
    setLocal((p) => ({ ...p, [k]: v }));

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label className="mb-1.5 block">Invoice No</Label>
            <Input
              placeholder="Search Invoice..."
              value={local.invoice}
              onChange={(e) => handleChange("invoice", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1.5 block">PO Number</Label>
            <Input
              placeholder="Search PO..."
              value={local.po}
              onChange={(e) => handleChange("po", e.target.value)}
            />
          </div>
          {/* <div>
            <Label className="mb-1.5 block">Batch</Label>
            <Input
              placeholder="Search Batch..."
              value={local.batch}
              onChange={(e) => handleChange("batch", e.target.value)}
            />
          </div> */}
          <div>
            <Label className="mb-1.5 block">Date</Label>
            <Input
              type="date"
              value={local.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1.5 block">Factory</Label>
            <Select
              value={local.factory}
              onValueChange={(v) => handleChange("factory", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Factories</SelectItem>
                {FACTORY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => {
              const reset = { invoice: "", po: "", batch: "", date: "", factory: "all" };
              setLocal(reset);
              onReset();
          }}>
            <Undo2 className="w-4 h-4 mr-2" /> Reset
          </Button>
          <Button onClick={() => onSearch(local)}>
            <Search className="w-4 h-4 mr-2" /> Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// --- MAIN PAGE ---
const PackingListManagementPage = () => {
  const [items, setItems] = useState<FabricRollItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<FabricRollItem[]>([]);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    invoice: "", po: "", date: "", factory: "all",
  });

  const fetchData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setItems(mockFabricRolls);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      const mInv = i.invoiceNo.toLowerCase().includes(filters.invoice.toLowerCase());
      const mPo = i.poNumber.toLowerCase().includes(filters.po.toLowerCase());
      // const mBatch = i.lotNo.toLowerCase().includes(filters.batch.toLowerCase());
      const mDate = filters.date === "" || i.dateInHouse === filters.date;
      const mFac = filters.factory === "all" || i.factory === filters.factory;
      return mInv && mPo  && mDate && mFac;
    });
  }, [items, filters]);

  // --- COLUMN DEFINITION (Updated Order + Factory) ---
  const columns: ColumnDef<FabricRollItem>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(val) => {
              if (val) {
                  table.getRowModel().rows.forEach(row => {
                      if (row.original.printStatus === "NOT_PRINTED") row.toggleSelected(true);
                  });
              } else table.resetRowSelection();
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(val) => row.toggleSelected(!!val)}
          />
        ),
      },
      // Order: p -> Factory -> Invoice -> ...
      { accessorKey: "p", header: "p" },
      { accessorKey: "factory", header: "Factory" }, // ADDED FACTORY
      { accessorKey: "invoiceNo", header: "INVOICE" },
      { accessorKey: "supplier", header: "SUP" },
      { accessorKey: "poNumber", header: "Po" },
      { accessorKey: "itemCode", header: "Item" },
      { accessorKey: "color", header: "Color" },
      { accessorKey: "lotNo", header: "Batch" },
      { accessorKey: "rollNo", header: "ROLL" },
      { accessorKey: "yards", header: "YDS", cell: ({row}) => row.original.yards.toFixed(2) },
      { accessorKey: "netWeight", header: "N.W", cell: ({row}) => row.original.netWeight.toFixed(2) },
      { accessorKey: "width", header: "Width Sticker" },
      { accessorKey: "foc", header: "FOC" },
      { accessorKey: "qc", header: "QC" },
      { accessorKey: "netWeight2", header: "N.W2", cell: ({row}) => row.original.netWeight2.toFixed(2) },
      { accessorKey: "grossWeight", header: "G.W", cell: ({row}) => row.original.grossWeight.toFixed(2) },
      { accessorKey: "dateInHouse", header: "Date" },
      {
        accessorKey: "printStatus",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.printStatus} />,
      },
      {
        id: "actions",
        header: "Action",
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <QrCode className="w-4 h-4 mr-2" /> Print QR
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Packing List Management</h1>
        <Button onClick={() => setIsImportOpen(true)}>
          <Plus className="mr-2 h-5 w-5" /> Import Packing List
        </Button>
      </div>

      <PackingListFilters onSearch={setFilters} onReset={() => fetchData()} />

      {loading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <Card>
          <CardHeader>
             <div className="flex justify-between items-center">
                <CardTitle>Item List ({filteredItems.length})</CardTitle>
                <Button disabled={selectedItems.length === 0}>
                  <QrCode className="w-4 h-4 mr-2" /> Print Selected
                </Button>
             </div>
          </CardHeader>
          <CardContent>
            <CustomTable 
                data={filteredItems} 
                columns={columns} 
                onSelectionChange={setSelectedItems} 
                showCheckbox={false} 
                initialColumnVisibility={{
                  p: false,
                  supplier: false,
                  lotNo: false,
                  netWeight: false,
                  width: false,
                  foc: false,
                  qc: false,
                  netWeight2: false,
                  grossWeight: false,
                }}
            />
          </CardContent>
        </Card>
      )}

      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle>Import Packing List</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <ImportPackingListFormPage onSuccess={() => { setIsImportOpen(false); fetchData(); }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackingListManagementPage;