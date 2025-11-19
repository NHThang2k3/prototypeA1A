// Path: src/pages/issue-accessory-form/IssueAccessoryFormPage.tsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Play,
  ArrowRightCircle,
  Search,
  Package,
  AlertCircle,
  CheckSquare,
  Square,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomTable } from "@/components/ui/custom-table";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// --- TYPES ---

interface AccessoryRequest {
  ID: string;
  JOB: string;
  Style: string;
  FactoryLine: string;
  DateRequired: string;
  Status: "Pending" | "In Progress" | "Completed";
  ItemNumber: string;
  MaterialName: string;
  Color: string;
  RequestQuantity: number;
  Unit: string;
}

interface InventoryAccessory {
  QRCode: string;
  PONumber: string;
  ItemNumber: string;
  MaterialName: string;
  Supplier: string;
  Color: string;
  BalanceQty: number; // Current Stock
  Unit: string;
  Location: string; // Warehouse Location
  DateInHouse: string;
  QCStatus: "Passed" | "Failed" | "Pending";
}

interface SelectedInventoryAccessory extends InventoryAccessory {
  issueQty: number; // Calculated quantity to issue
}

interface JobSummary {
  JOB: string;
  Style: string;
  FactoryLine: string;
  DateRequired: string;
  TotalItems: number;
}

// --- MOCK DATA & API ---

const MOCK_ACCESSORY_REQUESTS: AccessoryRequest[] = [
  {
    ID: "AR-001",
    JOB: "JOB-102",
    Style: "JEA-002",
    FactoryLine: "Line 5",
    DateRequired: "2025-10-22",
    Status: "Pending",
    ItemNumber: "BTN-001",
    MaterialName: "Jean Button",
    Color: "Antique Brass",
    RequestQuantity: 5000,
    Unit: "pcs",
  },
  {
    ID: "AR-004",
    JOB: "JOB-102",
    Style: "JEA-002",
    FactoryLine: "Line 5",
    DateRequired: "2025-10-23",
    Status: "Pending",
    ItemNumber: "RIV-003",
    MaterialName: "Rivet",
    Color: "Antique Brass",
    RequestQuantity: 15000,
    Unit: "pcs",
  },
  {
    ID: "AR-002",
    JOB: "JOB-104",
    Style: "SHT-003",
    FactoryLine: "Line 3",
    DateRequired: "2025-10-24",
    Status: "Pending",
    ItemNumber: "ZIP-005",
    MaterialName: "Zipper",
    Color: "White",
    RequestQuantity: 800,
    Unit: "pcs",
  },
  {
    ID: "AR-005",
    JOB: "JOB-105",
    Style: "SHT-003",
    FactoryLine: "Line 3",
    DateRequired: "2025-10-25",
    Status: "Pending",
    ItemNumber: "ZIP-005",
    MaterialName: "Zipper",
    Color: "White",
    RequestQuantity: 200,
    Unit: "pcs",
  },
];

const MOCK_INVENTORY_ACCESSORIES: InventoryAccessory[] = [
  {
    QRCode: "ACC-QR-001",
    PONumber: "PO-A01",
    ItemNumber: "BTN-001",
    MaterialName: "Jean Button",
    Supplier: "SuppA",
    Color: "Antique Brass",
    BalanceQty: 3000,
    Unit: "pcs",
    Location: "K1-A1-01",
    DateInHouse: "2025-09-10",
    QCStatus: "Passed",
  },
  {
    QRCode: "ACC-QR-002",
    PONumber: "PO-A01",
    ItemNumber: "BTN-001",
    MaterialName: "Jean Button",
    Supplier: "SuppA",
    Color: "Antique Brass",
    BalanceQty: 6000,
    Unit: "pcs",
    Location: "K1-A1-02",
    DateInHouse: "2025-09-10",
    QCStatus: "Passed",
  },
  {
    QRCode: "ACC-QR-003",
    PONumber: "PO-B02",
    ItemNumber: "ZIP-005",
    MaterialName: "Zipper",
    Supplier: "SuppB",
    Color: "White",
    BalanceQty: 500,
    Unit: "pcs",
    Location: "K2-B3-05",
    DateInHouse: "2025-09-15",
    QCStatus: "Passed",
  },
  {
    QRCode: "ACC-QR-004",
    PONumber: "PO-B03",
    ItemNumber: "ZIP-005",
    MaterialName: "Zipper",
    Supplier: "SuppB",
    Color: "White",
    BalanceQty: 1000,
    Unit: "pcs",
    Location: "K2-B3-06",
    DateInHouse: "2025-09-20",
    QCStatus: "Passed",
  },
  {
    QRCode: "ACC-QR-006",
    PONumber: "PO-C05",
    ItemNumber: "RIV-003",
    MaterialName: "Rivet",
    Supplier: "SuppA",
    Color: "Antique Brass",
    BalanceQty: 10000,
    Unit: "pcs",
    Location: "K1-A2-01",
    DateInHouse: "2025-10-01",
    QCStatus: "Passed",
  },
  {
    QRCode: "ACC-QR-007",
    PONumber: "PO-C05",
    ItemNumber: "RIV-003",
    MaterialName: "Rivet",
    Supplier: "SuppA",
    Color: "Antique Brass",
    BalanceQty: 8000,
    Unit: "pcs",
    Location: "K1-A2-02",
    DateInHouse: "2025-10-01",
    QCStatus: "Passed",
  },
];

const getAccessoryRequests = (): Promise<AccessoryRequest[]> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_ACCESSORY_REQUESTS), 500)
  );
};

// Simulated API: Get inventory, ensuring we get fresh "BalanceQty" reference
const getInventoryByAccessory = (
  itemNumber: string,
  color: string
): Promise<InventoryAccessory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Deep copy to simulate fetching fresh data so we don't mutate the MOCK directly during calculation in this demo
      const items = JSON.parse(
        JSON.stringify(MOCK_INVENTORY_ACCESSORIES)
      ).filter(
        (item: InventoryAccessory) =>
          item.ItemNumber === itemNumber &&
          item.Color === color &&
          item.BalanceQty > 0 &&
          item.QCStatus === "Passed"
      );
      resolve(items);
    }, 400);
  });
};

// --- MAIN COMPONENT ---

const IssueAccessoryFormPage: React.FC = () => {
  const [allRequests, setAllRequests] = useState<AccessoryRequest[]>([]);

  // Changed: Use Set for Multi-select JOBs
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());

  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const [selectedAccessories, setSelectedAccessories] = useState<
    SelectedInventoryAccessory[]
  >([]);

  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // --- 1. LOGIC: Load & Group JOBs ---
  const handleLoadRequests = useCallback(() => {
    setIsLoadingRequests(true);
    setSelectedJobIds(new Set()); // Clear selection
    getAccessoryRequests().then((data) => {
      setAllRequests(data.filter((req) => req.Status === "Pending"));
      setIsLoadingRequests(false);
    });
  }, []);

  const uniqueJobs = useMemo(() => {
    const jobMap = new Map<string, JobSummary>();
    allRequests.forEach((req) => {
      if (
        jobSearchTerm &&
        !req.JOB.toLowerCase().includes(jobSearchTerm.toLowerCase())
      )
        return;
      if (!jobMap.has(req.JOB)) {
        jobMap.set(req.JOB, {
          JOB: req.JOB,
          Style: req.Style,
          FactoryLine: req.FactoryLine,
          DateRequired: req.DateRequired,
          TotalItems: 0,
        });
      }
      jobMap.get(req.JOB)!.TotalItems += 1;
    });
    return Array.from(jobMap.values());
  }, [allRequests, jobSearchTerm]);

  // Get all requests belonging to ANY of the selected JOBs
  const selectedRequests = useMemo(() => {
    if (selectedJobIds.size === 0) return [];
    return allRequests.filter((req) => selectedJobIds.has(req.JOB));
  }, [allRequests, selectedJobIds]);

  // --- 2. LOGIC: Toggle Selection & Auto Allocate ---

  const toggleJobSelection = useCallback((jobId: string) => {
    setSelectedJobIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  }, []);

  // Main Allocation Logic
  useEffect(() => {
    if (selectedRequests.length === 0) {
      setSelectedAccessories([]);
      return;
    }

    const autoAllocate = async () => {
      setIsLoadingInventory(true);

      // Map to Aggregate usage of the same Inventory Batch (QRCode) across multiple requests
      // Key: QRCode, Value: SelectedInventoryAccessory
      const allocationMap = new Map<string, SelectedInventoryAccessory>();

      // Create a temporary inventory map to track "remaining balance" during this calculation
      // so we don't double-book the same item if multiple JOBs need it.
      const tempInventoryUsage = new Map<string, number>(); // Key: QRCode, Value: UsedQty

      // Process each request
      for (const req of selectedRequests) {
        const { ItemNumber, Color, RequestQuantity } = req;

        // Fetch fresh inventory
        const inventoryItems = await getInventoryByAccessory(ItemNumber, Color);
        const sortedInventory = [...inventoryItems].sort(
          (a, b) => a.BalanceQty - b.BalanceQty
        );

        let remainingReq = RequestQuantity;

        for (const invItem of sortedInventory) {
          if (remainingReq <= 0) break;

          // Calculate effective balance for this session calculation
          const usedSoFar = tempInventoryUsage.get(invItem.QRCode) || 0;
          const effectiveBalance = invItem.BalanceQty - usedSoFar;

          if (effectiveBalance <= 0) continue; // This batch is exhausted in this session

          const qtyToTake = Math.min(effectiveBalance, remainingReq);

          // Update temp usage tracker
          tempInventoryUsage.set(invItem.QRCode, usedSoFar + qtyToTake);

          // Update Final Display Map
          if (allocationMap.has(invItem.QRCode)) {
            const existing = allocationMap.get(invItem.QRCode)!;
            existing.issueQty += qtyToTake; // Add to existing usage
          } else {
            allocationMap.set(invItem.QRCode, {
              ...invItem,
              issueQty: qtyToTake,
            });
          }

          remainingReq -= qtyToTake;
        }
      }

      // Convert Map to Array for Table
      const finalAllocationList = Array.from(allocationMap.values());
      setSelectedAccessories(finalAllocationList);
      setIsLoadingInventory(false);
    };

    const timer = setTimeout(() => {
      autoAllocate();
    }, 500); // Debounce slightly to avoid rapid fires if user clicks checkboxes fast

    return () => clearTimeout(timer);
  }, [selectedRequests]);

  const handleFinishIssuance = useCallback(() => {
    setIsFinishing(true);
    setTimeout(() => {
      const jobsArray = Array.from(selectedJobIds).join(", ");
      alert(`Issuance confirmed for JOBs: ${jobsArray}`);

      // Clean up processed jobs locally
      setAllRequests((prev) =>
        prev.filter((req) => !selectedJobIds.has(req.JOB))
      );
      setSelectedJobIds(new Set());
      setSelectedAccessories([]);
      setIsFinishing(false);
    }, 1000);
  }, [selectedJobIds]);

  // --- 3. TABLE COLUMNS ---

  // Step 1: JOB List with Checkbox
  const jobListColumns = useMemo<ColumnDef<JobSummary>[]>(
    () => [
      {
        id: "select",
        header: "Select",
        cell: ({ row }) => {
          const isSelected = selectedJobIds.has(row.original.JOB);
          return (
            <div
              className="cursor-pointer"
              onClick={() => toggleJobSelection(row.original.JOB)}
            >
              {isSelected ? (
                <CheckSquare className="h-5 w-5 text-blue-600" />
              ) : (
                <Square className="h-5 w-5 text-gray-400" />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "JOB",
        header: "JOB Number",
        cell: ({ row }) => (
          <span className="font-bold">{row.original.JOB}</span>
        ),
      },
      { accessorKey: "Style", header: "Style" },
      { accessorKey: "FactoryLine", header: "Line" },
      {
        accessorKey: "TotalItems",
        header: "Items Req",
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.TotalItems}</Badge>
        ),
      },
      { accessorKey: "DateRequired", header: "Date Required" },
    ],
    [selectedJobIds, toggleJobSelection]
  );

  // Step 2: Allocation Table (Read-only, No Delete)
  const issueTableColumns = useMemo<ColumnDef<SelectedInventoryAccessory>[]>(
    () => [
      {
        accessorKey: "ItemNumber",
        header: "Item Code",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.ItemNumber}</span>
        ),
      },
      {
        accessorKey: "MaterialName",
        header: "Item Name",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span>{row.original.MaterialName}</span>
            <span className="text-xs text-gray-500">{row.original.Color}</span>
          </div>
        ),
      },
      {
        accessorKey: "Location",
        header: "Location",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 text-sm"
          >
            {row.original.Location}
          </Badge>
        ),
      },
      {
        accessorKey: "BalanceQty",
        header: "Balance Qty",
        cell: ({ row }) => (
          <span className="text-gray-500">
            {row.original.BalanceQty.toLocaleString()} {row.original.Unit}
          </span>
        ),
      },
      {
        accessorKey: "issueQty",
        header: "Issue Qty", // Read-only
        cell: ({ row }) => (
          <div className="font-bold text-lg text-green-700">
            {row.original.issueQty.toLocaleString()}{" "}
            <span className="text-sm font-normal text-gray-500">
              {row.original.Unit}
            </span>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">
          Issue Accessories From Request
        </h1>
        <p className="text-gray-600">
          Multi-select JOBs to auto-allocate items from warehouse locations.
        </p>
      </header>
      <Separator />

      {/* STEP 1: SELECT JOBS (MULTI) */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Step 1: Select JOBs</CardTitle>
            <Button
              onClick={handleLoadRequests}
              disabled={isLoadingRequests}
              variant="ghost"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" /> Refresh Data
            </Button>
          </div>
          <div className="flex items-center space-x-2 max-w-md mt-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search JOB Number..."
              value={jobSearchTerm}
              onChange={(e) => setJobSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <CustomTable
            columns={jobListColumns}
            data={uniqueJobs}
            showCheckbox={false} // Custom checkbox inside column
            showColumnVisibility={false}
          />
          {uniqueJobs.length === 0 && !isLoadingRequests && (
            <div className="text-center py-6 text-gray-500">
              No pending requests found. Click Refresh.
            </div>
          )}
        </CardContent>
      </Card>

      {/* STEP 2: CONSOLIDATED ISSUANCE TABLE */}
      {selectedJobIds.size > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="bg-blue-50/50 border-b border-blue-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Package className="h-5 w-5" /> Issuance Plan
                </CardTitle>
                <CardDescription>
                  Allocating for <strong>{selectedJobIds.size}</strong> selected
                  JOB(s).
                </CardDescription>
              </div>
              <Button
                className="bg-green-600 hover:bg-green-700"
                disabled={isFinishing || selectedAccessories.length === 0}
                onClick={handleFinishIssuance}
                size="lg"
              >
                {isFinishing ? "Processing..." : "Confirm & Issue"}{" "}
                <ArrowRightCircle className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              {isLoadingInventory ? (
                <div className="p-10 text-center text-blue-600 flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p>Calculating optimal inventory allocation...</p>
                </div>
              ) : selectedAccessories.length > 0 ? (
                <CustomTable
                  columns={issueTableColumns}
                  data={selectedAccessories}
                  showCheckbox={false}
                />
              ) : (
                <div className="p-10 text-center text-red-500 flex flex-col items-center gap-2">
                  <AlertCircle className="h-8 w-8" />
                  <span className="font-medium">Insufficient Inventory</span>
                  <p className="text-sm text-gray-500">
                    Could not find matching items in stock for the selected
                    JOBs.
                  </p>
                </div>
              )}
            </CardContent>

            {/* Footer Summary */}
            {selectedAccessories.length > 0 && (
              <div className="bg-gray-50 p-4 border-t flex justify-end gap-8 text-sm">
                <div className="text-gray-600">
                  Total Locations:{" "}
                  <span className="font-bold text-gray-900">
                    {selectedAccessories.length}
                  </span>
                </div>
                <div className="text-gray-600">
                  Total Items to Issue:{" "}
                  <span className="font-bold text-green-700 text-lg">
                    {selectedAccessories
                      .reduce((sum, i) => sum + i.issueQty, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default IssueAccessoryFormPage;
