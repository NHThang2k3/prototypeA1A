// Path: src/pages/issue-packaging-form/IssuePackagingFormPage.tsx

import React, { useState, useEffect, useMemo, useCallback } from "react"; // 1. Thêm useCallback
import { Play, ArrowRightCircle, Trash2, PlusCircle } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomTable } from "@/components/ui/custom-table";
import { Separator } from "@/components/ui/separator";

// --- TYPES: Define data structures for the packaging issuance process ---

// Data for a packaging request
interface PackagingRequest {
  ID: string; // Request ID
  JOB: string;
  Style: string;
  PackagingLine: string; // e.g., Packing Line 1, Packing Line 2
  DateRequired: string;
  Status: "Pending" | "In Progress" | "Completed";
  ItemNumber: string; // Packaging item code (e.g., CARTON-M, POLYBAG-S)
  MaterialName: string; // Packaging item name
  Description: string; // e.g., "Size M, Brown", "Self-sealing"
  RequestQuantity: number;
  Unit: string; // e.g., pcs, box, roll
}

// Data for a packaging item in inventory
interface InventoryPackaging {
  QRCode: string;
  PONumber: string;
  ItemNumber: string;
  MaterialName: string;
  Supplier: string;
  Description: string;
  BalanceQty: number; // Remaining quantity
  Unit: string;
  Location: string;
  DateInHouse: string;
  QCStatus: "Passed" | "Failed" | "Pending";
}

// Data for a packaging item selected for issuance
interface SelectedInventoryPackaging extends InventoryPackaging {
  issueQty: number; // Quantity entered by the user for issuance
}

// --- MOCK DATA & API: Mock data and simulated API functions ---

// Mock data for pending packaging requests
const MOCK_PACKAGING_REQUESTS: PackagingRequest[] = [
  {
    ID: "PR-001",
    JOB: "JOB-201",
    Style: "POLO-M-NVY",
    PackagingLine: "Packing Line A",
    DateRequired: "2025-11-01",
    Status: "Pending",
    ItemNumber: "CARTON-M",
    MaterialName: "Carton Box",
    Description: "Size M, Brown",
    RequestQuantity: 500,
    Unit: "pcs",
  },
  {
    ID: "PR-002",
    JOB: "JOB-202",
    Style: "TEE-W-WHT",
    PackagingLine: "Packing Line B",
    DateRequired: "2025-11-02",
    Status: "Pending",
    ItemNumber: "POLYBAG-S",
    MaterialName: "Poly Bag",
    Description: "Size S, Self-sealing",
    RequestQuantity: 1200,
    Unit: "pcs",
  },
  {
    ID: "PR-003",
    JOB: "JOB-202",
    Style: "TEE-W-WHT",
    PackagingLine: "Packing Line B",
    DateRequired: "2025-11-02",
    Status: "Pending",
    ItemNumber: "HANGTAG-STD",
    MaterialName: "Hang Tag",
    Description: "Standard Brand Tag",
    RequestQuantity: 1200,
    Unit: "pcs",
  },
  {
    ID: "PR-004",
    JOB: "JOB-203",
    Style: "HOOD-U-BLK",
    PackagingLine: "Packing Line A",
    DateRequired: "2025-11-03",
    Status: "Pending",
    ItemNumber: "CARTON-L",
    MaterialName: "Carton Box",
    Description: "Size L, Brown",
    RequestQuantity: 300,
    Unit: "pcs", // This will have a shortage
  },
];

// Mock data for packaging inventory
const MOCK_INVENTORY_PACKAGING: InventoryPackaging[] = [
  // Carton Box M (CARTON-M) - Sufficient
  {
    QRCode: "PKG-QR-001",
    PONumber: "PO-P01",
    ItemNumber: "CARTON-M",
    MaterialName: "Carton Box",
    Supplier: "SuppPack",
    Description: "Size M, Brown",
    BalanceQty: 400,
    Unit: "pcs",
    Location: "P1-A1-01",
    DateInHouse: "2025-10-10",
    QCStatus: "Passed",
  },
  {
    QRCode: "PKG-QR-002",
    PONumber: "PO-P01",
    ItemNumber: "CARTON-M",
    MaterialName: "Carton Box",
    Supplier: "SuppPack",
    Description: "Size M, Brown",
    BalanceQty: 350,
    Unit: "pcs",
    Location: "P1-A1-02",
    DateInHouse: "2025-10-10",
    QCStatus: "Passed",
  },
  // Poly Bag S (POLYBAG-S) - Surplus
  {
    QRCode: "PKG-QR-003",
    PONumber: "PO-P02",
    ItemNumber: "POLYBAG-S",
    MaterialName: "Poly Bag",
    Supplier: "SuppPoly",
    Description: "Size S, Self-sealing",
    BalanceQty: 5000,
    Unit: "pcs",
    Location: "P2-B1-01",
    DateInHouse: "2025-10-15",
    QCStatus: "Passed",
  },
  // Hang Tag (HANGTAG-STD) - Sufficient
  {
    QRCode: "PKG-QR-004",
    PONumber: "PO-P03",
    ItemNumber: "HANGTAG-STD",
    MaterialName: "Hang Tag",
    Supplier: "SuppPrint",
    Description: "Standard Brand Tag",
    BalanceQty: 2000,
    Unit: "pcs",
    Location: "P2-C3-05",
    DateInHouse: "2025-10-12",
    QCStatus: "Passed",
  },
  // Carton Box L (CARTON-L) - Insufficient
  {
    QRCode: "PKG-QR-005",
    PONumber: "PO-P04",
    ItemNumber: "CARTON-L",
    MaterialName: "Carton Box",
    Supplier: "SuppPack",
    Description: "Size L, Brown",
    BalanceQty: 250,
    Unit: "pcs",
    Location: "P1-A2-01",
    DateInHouse: "2025-10-20",
    QCStatus: "Passed",
  },
  // Substitute for Carton Box L (same item number, different description)
  {
    QRCode: "PKG-QR-006",
    PONumber: "PO-P05",
    ItemNumber: "CARTON-L",
    MaterialName: "Carton Box",
    Supplier: "SuppPackEco",
    Description: "Size L, White, Recycled",
    BalanceQty: 500,
    Unit: "pcs",
    Location: "P1-A2-02",
    DateInHouse: "2025-10-22",
    QCStatus: "Passed",
  },
];

// Mock API function to get the list of packaging requests
const getPackagingRequests = (): Promise<PackagingRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        MOCK_PACKAGING_REQUESTS.filter((req) => req.Status === "Pending")
      );
    }, 500);
  });
};

// Mock API function to get packaging from inventory by item number
const getPackagingByItemNumber = (
  itemNumber: string
): Promise<InventoryPackaging[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items = MOCK_INVENTORY_PACKAGING.filter(
        (item) =>
          item.ItemNumber === itemNumber &&
          item.BalanceQty > 0 &&
          item.QCStatus === "Passed"
      );
      resolve(items);
    }, 800);
  });
};

// --- MAIN COMPONENT: IssuePackagingFormPage.tsx ---

const IssuePackagingFormPage: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [allRequests, setAllRequests] = useState<PackagingRequest[]>([]);
  const [selectedRequestIds, setSelectedRequestIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedPackaging, setSelectedPackaging] = useState<
    SelectedInventoryPackaging[]
  >([]);
  const [availableInventory, setAvailableInventory] = useState<
    InventoryPackaging[]
  >([]);
  const [shortageInfo, setShortageInfo] = useState<{
    itemNumber: string;
    shortageQty: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // --- DERIVED STATE & CALCULATIONS ---
  const packagingRequirements = useMemo(() => {
    const requirements = new Map<
      string,
      {
        itemNumber: string;
        requiredQty: number;
        unit: string;
      }
    >();
    const selectedRequests = allRequests.filter((req) =>
      selectedRequestIds.has(req.ID)
    );
    selectedRequests.forEach((req) => {
      const key = req.ItemNumber; // Group by ItemNumber only for packaging
      const existing = requirements.get(key) || {
        itemNumber: req.ItemNumber,
        requiredQty: 0,
        unit: req.Unit,
      };
      existing.requiredQty += req.RequestQuantity;
      requirements.set(key, existing);
    });
    return Array.from(requirements.values());
  }, [allRequests, selectedRequestIds]);

  const totalIssuedQty = useMemo(() => {
    return selectedPackaging.reduce(
      (sum, item) => sum + (item.issueQty || 0),
      0
    );
  }, [selectedPackaging]);

  const totalRequiredQty = useMemo(() => {
    return packagingRequirements.reduce((sum, req) => sum + req.requiredQty, 0);
  }, [packagingRequirements]);

  const displayUnit = useMemo(() => {
    return packagingRequirements.length > 0
      ? packagingRequirements[0].unit
      : "";
  }, [packagingRequirements]);

  // --- LOGIC & SIDE EFFECTS ---
  useEffect(() => {
    if (packagingRequirements.length === 0) {
      setSelectedPackaging([]);
      setAvailableInventory([]);
      setShortageInfo(null);
      return;
    }

    const processPackagingRequest = async () => {
      setIsLoading(true);
      setShortageInfo(null);
      const mainRequirement = packagingRequirements[0];
      const { itemNumber, requiredQty } = mainRequirement;

      const allMatchingItems = await getPackagingByItemNumber(itemNumber);
      const sortedItems = [...allMatchingItems].sort((a, b) =>
        a.DateInHouse.localeCompare(b.DateInHouse)
      ); // FIFO logic

      const autoSelected: SelectedInventoryPackaging[] = [];
      let qtyToFulfill = requiredQty;
      for (const item of sortedItems) {
        if (qtyToFulfill <= 0) break;
        const qtyToIssue = Math.min(item.BalanceQty, qtyToFulfill);
        autoSelected.push({ ...item, issueQty: qtyToIssue });
        qtyToFulfill -= qtyToIssue;
      }
      setSelectedPackaging(autoSelected);

      const selectedQRCodes = new Set(autoSelected.map((i) => i.QRCode));
      const availableItems = allMatchingItems.filter(
        (i) => !selectedQRCodes.has(i.QRCode)
      );
      setAvailableInventory(availableItems);

      if (qtyToFulfill > 0) {
        setShortageInfo({ itemNumber, shortageQty: qtyToFulfill });
      }
      setIsLoading(false);
    };

    processPackagingRequest();
  }, [packagingRequirements]);

  // --- HANDLER FUNCTIONS ---
  // 2. Bọc các hàm xử lý sự kiện trong useCallback
  const handleLoadRequests = useCallback(() => {
    setIsLoadingRequests(true);
    setSelectedRequestIds(new Set());
    getPackagingRequests().then((data) => {
      setAllRequests(data);
      setIsLoadingRequests(false);
    });
  }, []);

  const handleRequestSelectionChange = useCallback(
    (selectedItems: PackagingRequest[]) => {
      setSelectedRequestIds(new Set(selectedItems.map((item) => item.ID)));
    },
    []
  );

  const handleIssueQtyChange = useCallback((qrCode: string, newQty: number) => {
    setSelectedPackaging((prevItems) =>
      prevItems.map((item) => {
        if (item.QRCode === qrCode) {
          const validatedQty = Math.max(0, Math.min(newQty, item.BalanceQty));
          return { ...item, issueQty: validatedQty };
        }
        return item;
      })
    );
  }, []);

  const handleAddPackagingFromInventory = useCallback(
    (itemToAdd: InventoryPackaging) => {
      setSelectedPackaging((prev) => [
        ...prev,
        { ...itemToAdd, issueQty: itemToAdd.BalanceQty },
      ]);
      setAvailableInventory((prev) =>
        prev.filter((i) => i.QRCode !== itemToAdd.QRCode)
      );
    },
    []
  );

  const handleRemoveSelectedPackaging = useCallback(
    (itemToRemove: SelectedInventoryPackaging) => {
      setSelectedPackaging((prev) =>
        prev.filter((i) => i.QRCode !== itemToRemove.QRCode)
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { issueQty, ...originalItem } = itemToRemove;
      setAvailableInventory((prev) =>
        [...prev, originalItem].sort((a, b) => a.QRCode.localeCompare(b.QRCode))
      );
    },
    []
  );

  const handleFinishIssuance = useCallback(() => {
    const shortage = totalRequiredQty - totalIssuedQty;
    if (shortage > 0) {
      if (
        !window.confirm(
          `Warning: You are issuing with a shortage of ${shortage.toLocaleString()} ${displayUnit}.\nDo you want to proceed?`
        )
      ) {
        return;
      }
    }
    setIsFinishing(true);
    console.log("--- STARTING PACKAGING ISSUANCE PROCESS ---");
    console.log(
      "Selected Requests:",
      allRequests.filter((r) => selectedRequestIds.has(r.ID))
    );
    console.log("Issued Packaging:", selectedPackaging);
    console.log("Total Required:", totalRequiredQty, displayUnit);
    console.log("Total Issued:", totalIssuedQty, displayUnit);

    setTimeout(() => {
      alert("Packaging issuance completed successfully!");
      setAllRequests([]);
      setSelectedRequestIds(new Set());
      setSelectedPackaging([]);
      setAvailableInventory([]);
      setShortageInfo(null);
      setIsFinishing(false);
    }, 2000);
  }, [
    totalRequiredQty,
    totalIssuedQty,
    displayUnit,
    allRequests,
    selectedRequestIds,
    selectedPackaging,
  ]);

  // 3. Bọc các mảng định nghĩa cột trong useMemo
  const packagingRequestColumns = useMemo<ColumnDef<PackagingRequest>[]>(
    () => [
      { accessorKey: "ID", header: "Request ID" },
      { accessorKey: "JOB", header: "JOB" },
      { accessorKey: "ItemNumber", header: "Item Number" },
      { accessorKey: "Description", header: "Description" },
      {
        accessorKey: "RequestQuantity",
        header: "Required Qty",
        cell: ({ row }) =>
          `${row.original.RequestQuantity.toLocaleString()} ${
            row.original.Unit
          }`,
      },
      { accessorKey: "PackagingLine", header: "Packaging Line" },
    ],
    []
  );

  const selectedPackagingColumns = useMemo<
    ColumnDef<SelectedInventoryPackaging>[]
  >(
    () => [
      { accessorKey: "QRCode", header: "QR Code" },
      { accessorKey: "Description", header: "Description" },
      {
        accessorKey: "BalanceQty",
        header: "Balance Qty",
        cell: ({ row }) =>
          `${row.original.BalanceQty.toLocaleString()} ${row.original.Unit}`,
      },
      {
        accessorKey: "issueQty",
        header: "Issue Qty",
        cell: ({ row }) => (
          <Input
            type="number"
            value={row.original.issueQty}
            onChange={(e) =>
              handleIssueQtyChange(
                row.original.QRCode,
                parseFloat(e.target.value) || 0
              )
            }
            className="w-24"
            max={row.original.BalanceQty}
            step="1"
          />
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveSelectedPackaging(row.original)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [handleIssueQtyChange, handleRemoveSelectedPackaging]
  );

  const availableInventoryColumns = useMemo<ColumnDef<InventoryPackaging>[]>(
    () => [
      { accessorKey: "QRCode", header: "QR Code" },
      {
        accessorKey: "Description",
        header: "Description",
        cell: ({ row }) => (
          <span className="text-orange-600 font-semibold">
            {row.original.Description}
          </span>
        ),
      },
      { accessorKey: "Location", header: "Location" },
      {
        accessorKey: "BalanceQty",
        header: "Available Qty",
        cell: ({ row }) =>
          `${row.original.BalanceQty.toLocaleString()} ${row.original.Unit}`,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAddPackagingFromInventory(row.original)}
            className="text-green-600 hover:text-green-800"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        ),
      },
    ],
    [handleAddPackagingFromInventory]
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">
          Issue Packaging Materials
        </h1>
        <p className="text-gray-600">
          Issue packaging materials (cartons, bags, labels) based on requests.
        </p>
      </header>
      <Separator />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Step 1: Load and Select Requests</CardTitle>
            <CardDescription>
              Load the list of pending requests and select items to issue.
            </CardDescription>
          </div>
          <Button onClick={handleLoadRequests} disabled={isLoadingRequests}>
            <Play className="h-4 w-4 mr-2" />
            {isLoadingRequests ? "Loading..." : "Load Request List"}
          </Button>
        </CardHeader>
        <CardContent>
          {allRequests.length > 0 ? (
            <CustomTable
              columns={packagingRequestColumns}
              data={allRequests}
              onSelectionChange={handleRequestSelectionChange}
              showColumnVisibility={false}
            />
          ) : (
            <p className="text-center text-gray-500 py-4">
              Please load the request list to begin.
            </p>
          )}
        </CardContent>
      </Card>

      {selectedRequestIds.size > 0 && (
        <>
          <Card className="sticky top-4 z-10">
            <CardHeader>
              <CardTitle>Step 2: Review and Issue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <Card>
                  <CardHeader>
                    <p className="text-sm text-blue-800 font-medium">
                      Total Required
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {totalRequiredQty.toLocaleString()} {displayUnit}
                    </p>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <p className="text-sm text-green-800 font-medium">
                      Total Selected
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {totalIssuedQty.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}{" "}
                      {displayUnit}
                    </p>
                  </CardHeader>
                </Card>
                <Card
                  className={
                    totalIssuedQty < totalRequiredQty ? "bg-red-50" : ""
                  }
                >
                  <CardHeader>
                    <p
                      className={`text-sm font-medium ${
                        totalIssuedQty < totalRequiredQty
                          ? "text-red-800"
                          : "text-green-800"
                      }`}
                    >
                      {totalIssuedQty < totalRequiredQty
                        ? "Shortage"
                        : "Surplus"}
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        totalIssuedQty < totalRequiredQty
                          ? "text-red-900"
                          : "text-green-900"
                      }`}
                    >
                      {(totalRequiredQty - totalIssuedQty).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 }
                      )}{" "}
                      {displayUnit}
                    </p>
                  </CardHeader>
                </Card>
              </div>
              {isLoading && (
                <p className="text-center text-blue-600 mt-4">
                  Searching inventory...
                </p>
              )}
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleFinishIssuance}
                  disabled={selectedPackaging.length === 0 || isFinishing}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ArrowRightCircle className="h-5 w-5 mr-2" />
                  {isFinishing ? "Processing..." : "Finish Issuance"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Selected Packaging for Issuance</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomTable
                  columns={selectedPackagingColumns}
                  data={selectedPackaging}
                  showCheckbox={false}
                  showColumnVisibility={false}
                />
              </CardContent>
            </Card>

            <Card
              className={
                shortageInfo ? "border-2 border-dashed border-orange-400" : ""
              }
            >
              <CardHeader>
                <CardTitle
                  className={shortageInfo ? "text-orange-800" : "text-gray-800"}
                >
                  {shortageInfo
                    ? `Shortage! Select Substitute (Item: ${shortageInfo.itemNumber})`
                    : `Available Inventory (Item: ${
                        packagingRequirements[0]?.itemNumber || "N/A"
                      })`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CustomTable
                  columns={availableInventoryColumns}
                  data={availableInventory}
                  showCheckbox={false}
                  showColumnVisibility={false}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default IssuePackagingFormPage;
