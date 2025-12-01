import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import {
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  RefreshCcw,
  Camera,
  ScanLine,
  Search,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomTable } from "@/components/ui/custom-table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Types & Interfaces ---

interface StockItem {
  id: string;
  barcode: string;
  poNumber: string;
  itemCode: string;
  description: string;
  groupShade: string;
  location: string;
  systemQty: number;
  scannedQty: number;
  unit: string;
  status: "PENDING" | "MATCHED" | "MISMATCH" | "EXTRA";
  remark: string;
  scanTime: string | null;
}

interface FilterState {
  poNumber: string;
  itemCode: string;
  groupShade: string;
  status: string;
  search: string;
}

// --- Dummy Data Generation ---

const generateDummyData = (): StockItem[] => {
  const baseData: StockItem[] = [];
  const poPrefixes = ["PO-8820", "PO-8821", "PO-8822"];
  const items = ["FAB-COTTON-100", "FAB-COTTON-101", "FAB-POLY-200"];
  const shades = ["Shade-G1", "Shade-G2", "Shade-G3"];

  for (let i = 1; i <= 30; i++) {
    const isMatched = Math.random() > 0.4;
    const sysQty = Math.floor(Math.random() * 50) + 10;

    // Deterministic random for consistent dummy data
    const po = poPrefixes[i % 3];
    const item = items[i % 3];
    const shade = shades[i % 3];

    baseData.push({
      id: `ITEM-${i}`,
      barcode: `FAB-2024-${1000 + i}`,
      poNumber: po,
      itemCode: item,
      description:
        i % 2 === 0 ? "Cotton Jersey 100% - White" : "Polyester Mesh - Black",
      groupShade: shade,
      location: `R${Math.floor(i / 5) + 1}-B${i % 5}`,
      systemQty: sysQty,
      scannedQty: isMatched ? sysQty : 0,
      unit: "Yards",
      status: isMatched ? "MATCHED" : "PENDING",
      remark: "",
      scanTime: isMatched
        ? new Date().toISOString().split("T")[0] + " 10:30"
        : null,
    });
  }

  // Inject specific edge cases
  baseData[2].status = "MISMATCH";
  baseData[2].scannedQty = baseData[2].systemQty - 5;
  baseData[2].remark = "Shortage found";

  baseData[5].status = "EXTRA";
  baseData[5].systemQty = 0;
  baseData[5].scannedQty = 20;
  baseData[5].remark = "Unlisted Roll";

  return baseData;
};

// --- Component Definition ---

const StockTaking: React.FC = () => {
  const [data, setData] = useState<StockItem[]>(generateDummyData());
  const [filters, setFilters] = useState<FilterState>({
    poNumber: "ALL",
    itemCode: "ALL",
    groupShade: "ALL",
    status: "ALL",
    search: "",
  });
  const [selectedRemarkItem, setSelectedRemarkItem] =
    useState<StockItem | null>(null);
  const [remarkInput, setRemarkInput] = useState("");

  // State for Camera Scanner Modal
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // --- Handlers ---

  const processScan = (code: string) => {
    if (!code) return;
    const exists = data.find((d) => d.barcode === code);

    setData((prev) =>
      prev.map((item) => {
        if (item.barcode === code) {
          return {
            ...item,
            status: "MATCHED",
            scannedQty: item.systemQty,
            scanTime: new Date().toLocaleString(),
          };
        }
        return item;
      })
    );

    if (!exists) {
      alert(`Barcode ${code} not found. Marked as EXTRA.`);
    }
  };

  const handleUpdateRemark = () => {
    if (selectedRemarkItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedRemarkItem.id
            ? { ...item, remark: remarkInput }
            : item
        )
      );
      setSelectedRemarkItem(null);
      setRemarkInput("");
    }
  };

  const simulateCameraScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const pendingItem = data.find((i) => i.status === "PENDING");
      const codeToScan = pendingItem
        ? pendingItem.barcode
        : `FAB-2024-${Math.floor(Math.random() * 1000)}`;
      processScan(codeToScan);
      setIsScanning(false);
      setIsScanModalOpen(false);
    }, 1500);
  };

  // --- Derived Data & Charts ---

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchPO =
        filters.poNumber === "ALL" || item.poNumber === filters.poNumber;
      const matchItem =
        filters.itemCode === "ALL" || item.itemCode === filters.itemCode;
      const matchShade =
        filters.groupShade === "ALL" || item.groupShade === filters.groupShade;
      const matchStatus =
        filters.status === "ALL" || item.status === filters.status;
      const matchSearch =
        item.barcode.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.location.toLowerCase().includes(filters.search.toLowerCase());
      return matchPO && matchItem && matchShade && matchStatus && matchSearch;
    });
  }, [data, filters]);

  const stats = useMemo(() => {
    const total = data.length;
    const scanned = data.filter((i) => i.status !== "PENDING").length;
    const matched = data.filter((i) => i.status === "MATCHED").length;
    const mismatch = data.filter(
      (i) => i.status === "MISMATCH" || i.status === "EXTRA"
    ).length;
    return { total, scanned, matched, mismatch };
  }, [data]);

  const chartOption = {
    tooltip: { trigger: "item" },
    legend: { bottom: "0%", left: "center", icon: "circle" },
    color: ["#10b981", "#ef4444", "#f59e0b", "#e5e7eb"],
    series: [
      {
        name: "Status",
        type: "pie",
        radius: ["45%", "70%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 5, borderColor: "#fff", borderWidth: 2 },
        label: { show: false, position: "center" },
        emphasis: { label: { show: true, fontSize: 18, fontWeight: "bold" } },
        data: [
          { value: stats.matched, name: "Matched" },
          { value: stats.mismatch, name: "Mismatch" },
          {
            value: data.filter((i) => i.status === "EXTRA").length,
            name: "Extra",
          },
          { value: stats.total - stats.scanned, name: "Pending" },
        ],
      },
    ],
  };

  // --- CustomTable Configuration ---

  const tableColumns = [
    { header: "Barcode", accessorKey: "barcode" },
    { header: "PO #", accessorKey: "poNumber" },
    { header: "Item Code", accessorKey: "itemCode" },
    { header: "Loc", accessorKey: "location" },
    { header: "Sys Qty", accessorKey: "systemQty" },
    { header: "Scan Qty", accessorKey: "scannedQty" },
    {
      header: "Status",
      accessorKey: "status", // Sử dụng key gốc từ data
      // Sử dụng cell renderer để hiển thị Badge
      cell: ({ row }: { row: { original: StockItem } }) => {
        // Hỗ trợ cả 2 trường hợp: row.original (Tanstack) hoặc row trực tiếp
        const status = row.original.status;

        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              status === "MATCHED"
                ? "bg-green-50 text-green-700 ring-green-600/20"
                : status === "MISMATCH"
                ? "bg-red-50 text-red-700 ring-red-600/20"
                : status === "EXTRA"
                ? "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                : "bg-gray-50 text-gray-600 ring-gray-500/10"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    // Đã xóa cột Remark
  ];

  const uniquePOs = Array.from(new Set(data.map((d) => d.poNumber))).sort();
  const uniqueItems = Array.from(new Set(data.map((d) => d.itemCode))).sort();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 p-6 space-y-6 font-sans">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Inventory Check
          </h1>
          <p className="text-muted-foreground">
            Warehouse A • Fabric Division • Q4 2024
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" /> Sync ERP
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button
            onClick={() => setIsScanModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            <Camera className="mr-2 h-4 w-4" /> Start Scanning
          </Button>
        </div>
      </header>

      {/* Dashboard Top Section: Stats & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Stock
                  </p>
                  <h3 className="text-2xl font-bold mt-2">{stats.total}</h3>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Matched
                  </p>
                  <h3 className="text-2xl font-bold mt-2 text-green-600">
                    {stats.matched}
                  </h3>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Discrepancy
                  </p>
                  <h3 className="text-2xl font-bold mt-2 text-red-600">
                    {stats.mismatch}
                  </h3>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending
                  </p>
                  <h3 className="text-2xl font-bold mt-2 text-yellow-600">
                    {stats.total - stats.scanned}
                  </h3>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Bar */}
          <div className="col-span-2 md:col-span-4 mt-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">
                Completion Progress
              </span>
              <span className="text-slate-500">
                {Math.round((stats.scanned / stats.total) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${(stats.scanned / stats.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Chart */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader className="pb-0 pt-4">
            <CardTitle className="text-base font-semibold">
              Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReactECharts
              option={chartOption}
              style={{ height: "180px", width: "100%" }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Filter Bar & Table */}
      <Card className="flex flex-col flex-1 shadow-sm border-slate-200">
        <div className="p-4 border-b flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white rounded-t-lg">
          {/* Filters Area */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1 w-full xl:w-auto">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Barcode / Loc"
                  className="pl-8 h-9 text-sm"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                PO Number
              </Label>
              <Select
                value={filters.poNumber}
                onValueChange={(val) =>
                  setFilters((prev) => ({ ...prev, poNumber: val }))
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All POs</SelectItem>
                  {uniquePOs.map((po) => (
                    <SelectItem key={po} value={po}>
                      {po}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                Item Code
              </Label>
              <Select
                value={filters.itemCode}
                onValueChange={(val) =>
                  setFilters((prev) => ({ ...prev, itemCode: val }))
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Items</SelectItem>
                  {uniqueItems.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                Status
              </Label>
              <Select
                value={filters.status}
                onValueChange={(val) =>
                  setFilters((prev) => ({ ...prev, status: val }))
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="MATCHED">Matched</SelectItem>
                  <SelectItem value="MISMATCH">Mismatch</SelectItem>
                  <SelectItem value="EXTRA">Extra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table Actions */}
          <div className="flex items-center gap-2 w-full xl:w-auto mt-2 xl:mt-0 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Mark Visible as Checked</DropdownMenuItem>
                <DropdownMenuItem>Download Visible CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="text-xs text-muted-foreground bg-slate-100 px-3 py-1 rounded-md whitespace-nowrap">
              Records:{" "}
              <span className="font-semibold text-slate-900">
                {filteredData.length}
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="border-t border-slate-100">
            {/* Sử dụng filteredData trực tiếp, logic hiển thị nằm trong tableColumns */}
            <CustomTable columns={tableColumns} data={filteredData} />
          </div>
        </CardContent>
      </Card>

      {/* --- CAMERA SCAN MODAL --- */}
      <Dialog open={isScanModalOpen} onOpenChange={setIsScanModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScanLine className="h-5 w-5 text-blue-600" />
              Scanner Active
            </DialogTitle>
            <DialogDescription>
              Center the QR code in the frame below.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center space-y-4 py-2">
            <div
              className="relative w-full aspect-square bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center group cursor-pointer"
              onClick={simulateCameraScan}
            >
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <p className="text-white/50 text-xs animate-pulse">
                  Initializing Camera Feed...
                </p>
              </div>

              {/* Overlay Frame */}
              <div className="absolute inset-10 border-2 border-white/30 rounded-lg z-10 flex items-center justify-center">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-sm -mt-0.5 -ml-0.5"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-sm -mt-0.5 -mr-0.5"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-sm -mb-0.5 -ml-0.5"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-sm -mb-0.5 -mr-0.5"></div>
              </div>

              {/* Scan Laser */}
              <div
                className={`absolute w-[80%] h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] z-20 ${
                  isScanModalOpen ? "animate-scan" : ""
                }`}
              />
            </div>

            <Button
              className={`w-full ${
                isScanning ? "bg-green-600" : "bg-blue-600"
              }`}
              onClick={simulateCameraScan}
              disabled={isScanning}
            >
              {isScanning ? "Scanning..." : "Capture"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- EDIT REMARK MODAL --- */}
      <Dialog
        open={!!selectedRemarkItem}
        onOpenChange={(open) => !open && setSelectedRemarkItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              {selectedRemarkItem?.barcode} - {selectedRemarkItem?.itemCode}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={remarkInput}
                onChange={(e) => setRemarkInput(e.target.value)}
                placeholder="E.g. Damaged packaging, Wrong shade..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedRemarkItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRemark}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inline Styles for Animation */}
      <style>{`
        @keyframes scan {
          0% { top: 20%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 80%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default StockTaking;
