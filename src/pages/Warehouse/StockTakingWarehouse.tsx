import React, { useState, useMemo } from "react";
import {
  QrCode,
  CheckCircle2,
  XCircle,
  Search,
  History,
  BarChart3,
  User,
  Package,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import ReactECharts from "echarts-for-react";

// Shadcn UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Custom Table Component (Strict Requirement)
import { CustomTable } from "@/components/ui/custom-table";

// --- TypeScript Interfaces ---

interface StockItem {
  id: string;
  name: string;
  systemQty: number;
  unit: string;
}

interface ShelfData {
  id: string;
  location: string;
  items: StockItem[];
}

interface StockLog {
  id: string;
  shelfId: string;
  qcName: string;
  timestamp: string;
  status: "MATCH" | "MISMATCH";
  details: string; // Summary of discrepancies
}

type StockTakingWarehouseProps = Record<string, never>;

// --- Mock Data ---

const MOCK_SHELVES: Record<string, ShelfData> = {
  "SHELF-A01": {
    id: "SHELF-A01",
    location: "Zone A - Row 1",
    items: [
      { id: "FAB-001", name: "Cotton Jersey White", systemQty: 120, unit: "m" },
      { id: "FAB-002", name: "Denim 12oz Blue", systemQty: 50, unit: "m" },
    ],
  },
  "SHELF-B05": {
    id: "SHELF-B05",
    location: "Zone B - Row 5",
    items: [
      { id: "FAB-010", name: "Silk Satin Red", systemQty: 200, unit: "m" },
      { id: "FAB-011", name: "Linen Beige", systemQty: 85, unit: "m" },
      { id: "FAB-012", name: "Velvet Black", systemQty: 30, unit: "m" },
    ],
  },
};

const INITIAL_LOGS: StockLog[] = [
  {
    id: "LOG-001",
    shelfId: "SHELF-A01",
    qcName: "Sarah Connor",
    timestamp: "2023-10-25 09:30",
    status: "MATCH",
    details: "All items correct",
  },
  {
    id: "LOG-002",
    shelfId: "SHELF-C02",
    qcName: "John Doe",
    timestamp: "2023-10-26 14:15",
    status: "MISMATCH",
    details: "FAB-099: -5m variance",
  },
  {
    id: "LOG-003",
    shelfId: "SHELF-B05",
    qcName: "Sarah Connor",
    timestamp: "2023-11-01 10:00",
    status: "MATCH",
    details: "All items correct",
  },
  {
    id: "LOG-004",
    shelfId: "SHELF-A01",
    qcName: "Mike Ross",
    timestamp: "2023-11-05 16:20",
    status: "MISMATCH",
    details: "FAB-001: Missing",
  },
  {
    id: "LOG-005",
    shelfId: "SHELF-D10",
    qcName: "Sarah Connor",
    timestamp: "2023-11-12 11:45",
    status: "MATCH",
    details: "All items correct",
  },
];

// --- Main Component ---

const StockTakingWarehouse: React.FC<StockTakingWarehouseProps> = () => {
  // State
  const [activeTab, setActiveTab] = useState<string>("scan");
  const [scanInput, setScanInput] = useState<string>("");
  const [currentShelf, setCurrentShelf] = useState<ShelfData | null>(null);
  const [physicalCounts, setPhysicalCounts] = useState<Record<string, number>>(
    {}
  );
  const [currentUser, setCurrentUser] = useState<string>("Sarah Connor");
  const [logs, setLogs] = useState<StockLog[]>(INITIAL_LOGS);
  const [resultDialog, setResultDialog] = useState<{
    open: boolean;
    status: "MATCH" | "MISMATCH" | null;
    message: string;
  }>({ open: false, status: null, message: "" });

  // Handle Scan Logic
  const handleScan = () => {
    // Simulate finding shelf
    const shelf = MOCK_SHELVES[scanInput.toUpperCase()];
    if (shelf) {
      setCurrentShelf(shelf);
      // Initialize physical counts with 0 or empty
      const initCounts: Record<string, number> = {};
      shelf.items.forEach((item) => {
        initCounts[item.id] = 0;
      });
      setPhysicalCounts(initCounts);
    } else {
      alert('Shelf not found! Try "SHELF-A01" or "SHELF-B05"');
      setCurrentShelf(null);
    }
  };

  // Handle Input Change for Quantities
  const handleQuantityChange = (itemId: string, val: string) => {
    setPhysicalCounts((prev) => ({
      ...prev,
      [itemId]: parseFloat(val) || 0,
    }));
  };

  // Handle Submission of Stock Take
  const handleSubmitCheck = () => {
    if (!currentShelf) return;

    let isMatch = true;
    const discrepancies: string[] = [];

    currentShelf.items.forEach((item) => {
      const physical = physicalCounts[item.id] || 0;
      if (physical !== item.systemQty) {
        isMatch = false;
        const diff = physical - item.systemQty;
        discrepancies.push(
          `${item.name} (${diff > 0 ? "+" : ""}${diff}${item.unit})`
        );
      }
    });

    const status = isMatch ? "MATCH" : "MISMATCH";
    const logDetails = isMatch
      ? "Inventory accurate"
      : `Discrepancies: ${discrepancies.join(", ")}`;

    // Create Log
    const newLog: StockLog = {
      id: `LOG-${Date.now()}`,
      shelfId: currentShelf.id,
      qcName: currentUser,
      timestamp: new Date().toLocaleString("en-US"),
      status,
      details: logDetails,
    };

    setLogs([newLog, ...logs]);
    setResultDialog({
      open: true,
      status,
      message: logDetails,
    });
  };

  const resetScanner = () => {
    setResultDialog({ open: false, status: null, message: "" });
    setCurrentShelf(null);
    setScanInput("");
    setPhysicalCounts({});
  };

  // --- Reports & Charts Logic ---

  const chartOption = useMemo(() => {
    // Dummy aggregation for the chart
    return {
      title: {
        text: "Stock Taking Accuracy (Last 6 Months)",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Match", "Mismatch"],
        bottom: 0,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Match",
          type: "bar",
          stack: "total",
          color: "#22c55e", // Green
          data: [120, 132, 101, 134, 90, 150],
        },
        {
          name: "Mismatch",
          type: "bar",
          stack: "total",
          color: "#ef4444", // Red
          data: [10, 15, 8, 24, 5, 12],
        },
      ],
    };
  }, []);

  const tableColumns = [
    { header: "Date & Time", accessorKey: "timestamp" },
    { header: "Shelf ID", accessorKey: "shelfId" },
    { header: "QC Personnel", accessorKey: "qcName" },
    { header: "Status", accessorKey: "status" }, // Will render as text, handled visually below if needed or just text
    { header: "Details", accessorKey: "details" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-8 w-8 text-blue-600" />
              Warehouse Stock Taking
            </h1>
            <p className="text-gray-500">QC Verification System</p>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-md">
            <User className="h-5 w-5 text-gray-600" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Current QC</span>
              <Select value={currentUser} onValueChange={setCurrentUser}>
                <SelectTrigger className="h-8 w-[180px] border-0 bg-transparent shadow-none focus:ring-0 p-0 font-medium">
                  <SelectValue placeholder="Select QC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Connor">Sarah Connor</SelectItem>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Mike Ross">Mike Ross</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-6">
            <TabsTrigger value="scan" className="flex gap-2">
              <QrCode className="h-4 w-4" /> Scan & Verify
            </TabsTrigger>
            <TabsTrigger value="report" className="flex gap-2">
              <BarChart3 className="h-4 w-4" /> Reports & History
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: SCANNING INTERFACE */}
          <TabsContent value="scan" className="space-y-6">
            {!currentShelf ? (
              <Card className="w-full max-w-lg mx-auto mt-12 border-dashed border-2">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-blue-100 p-4 rounded-full w-fit mb-4">
                    <QrCode className="h-10 w-10 text-blue-600" />
                  </div>
                  <CardTitle>Scan Shelf QR Code</CardTitle>
                  <CardDescription>
                    Enter the Shelf ID manually or scan the code on the rack.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: SHELF-A01"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleScan()}
                      className="text-lg uppercase"
                    />
                    <Button
                      onClick={handleScan}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Search className="h-4 w-4 mr-2" /> Find
                    </Button>
                  </div>
                  <div className="mt-4 text-xs text-gray-400 text-center">
                    Try entering <strong>SHELF-A01</strong> or{" "}
                    <strong>SHELF-B05</strong>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {/* Left: Shelf Info */}
                <Card className="md:col-span-1 h-fit">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {currentShelf.id}
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        Active
                      </Badge>
                    </CardTitle>
                    <CardDescription>{currentShelf.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <div className="text-sm text-gray-500">
                        Total Items Expected
                      </div>
                      <div className="text-2xl font-bold">
                        {currentShelf.items.length} Rolls
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700"
                      onClick={() => setCurrentShelf(null)}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Cancel Scan
                    </Button>
                  </CardContent>
                </Card>

                {/* Right: Item Verification */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Stock Verification</CardTitle>
                    <CardDescription>
                      Compare physical stock with system records. Enter actual
                      quantities found.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentShelf.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="mb-2 sm:mb-0">
                            <div className="font-semibold text-gray-800">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {item.id}
                            </div>
                            <div className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded w-fit mt-1">
                              System: {item.systemQty} {item.unit}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                              <Label
                                htmlFor={`qty-${item.id}`}
                                className="text-xs text-gray-500 mb-1"
                              >
                                Actual Qty
                              </Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  id={`qty-${item.id}`}
                                  type="number"
                                  className="w-24 text-right font-medium"
                                  placeholder="0"
                                  value={physicalCounts[item.id] || ""}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                />
                                <span className="text-sm text-gray-600 font-medium">
                                  {item.unit}
                                </span>
                              </div>
                            </div>

                            {/* Visual Indicator of Diff */}
                            {physicalCounts[item.id] !== undefined && (
                              <div className="w-6 flex justify-center">
                                {physicalCounts[item.id] === item.systemQty ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 flex justify-end gap-3 p-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentShelf(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitCheck}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Verify & Submit
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* TAB 2: REPORTS & HISTORY */}
          <TabsContent value="report" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Analytics Controls */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Report Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Select defaultValue="month">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="quarter">Quarterly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Warehouse Zone</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="All Zones" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Zones</SelectItem>
                        <SelectItem value="A">Zone A</SelectItem>
                        <SelectItem value="B">Zone B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full mt-4" variant="secondary">
                    <Calendar className="h-4 w-4 mr-2" /> Export Report
                  </Button>
                </CardContent>
              </Card>

              {/* Chart */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts
                    option={chartOption}
                    style={{ height: "300px", width: "100%" }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* History Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" /> Stock Taking Logs
                    </CardTitle>
                    <CardDescription>
                      Recent verification activities.
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{logs.length} Records</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CustomTable columns={tableColumns} data={logs} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Success/Result Dialog */}
        <Dialog
          open={resultDialog.open}
          onOpenChange={(open) => !open && resetScanner()}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle
                className={`flex items-center gap-2 text-xl ${
                  resultDialog.status === "MATCH"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {resultDialog.status === "MATCH" ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <XCircle className="h-6 w-6" />
                )}
                {resultDialog.status === "MATCH"
                  ? "Stock Match"
                  : "Discrepancy Detected"}
              </DialogTitle>
              <DialogDescription>
                Shelf: {currentShelf?.id} <br />
                QC: {currentUser}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded border">
                {resultDialog.message}
              </p>
            </div>
            <DialogFooter>
              <Button onClick={resetScanner} className="w-full">
                Close & Scan Next
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StockTakingWarehouse;
