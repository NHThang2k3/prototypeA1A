// Path: src/pages/issue-accessory-form/IssueAccessoryFormPage.tsx

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

// --- TYPES: Define data structures for the accessory issuance process ---

// Data for an accessory request from a sewing line
interface AccessoryRequest {
  ID: string; // Request ID
  JOB: string;
  Style: string;
  FactoryLine: string;
  DateRequired: string;
  Status: "Pending" | "In Progress" | "Completed";
  ItemNumber: string; // Accessory item code
  MaterialName: string; // Accessory name
  Color: string;
  RequestQuantity: number;
  Unit: string; // e.g., pcs, set, kg...
}

// Data for an accessory batch/item in inventory
interface InventoryAccessory {
  QRCode: string;
  PONumber: string;
  ItemNumber: string;
  MaterialName: string;
  Supplier: string;
  Color: string;
  BalanceQty: number; // Remaining quantity
  Unit: string;
  Location: string;
  DateInHouse: string;
  QCStatus: "Passed" | "Failed" | "Pending";
}

// Data for an accessory batch/item selected for issuance
interface SelectedInventoryAccessory extends InventoryAccessory {
  issueQty: number; // Quantity entered by the user for issuance
}

// --- MOCK DATA & API: Mock data and simulated API functions ---

// Mock data for pending accessory requests
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
    ID: "AR-003",
    JOB: "JOB-101",
    Style: "TSH-001",
    FactoryLine: "Line 1",
    DateRequired: "2025-10-21",
    Status: "In Progress",
    ItemNumber: "LBL-002",
    MaterialName: "Neck Label",
    Color: "N/A",
    RequestQuantity: 1200,
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
];

// Mock data for accessory inventory
const MOCK_INVENTORY_ACCESSORIES: InventoryAccessory[] = [
  // Jean Buttons (BTN-001, Antique Brass) - Sufficient quantity
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
    BalanceQty: 2500,
    Unit: "pcs",
    Location: "K1-A1-02",
    DateInHouse: "2025-09-10",
    QCStatus: "Passed",
  },
  // Zippers (ZIP-005, White) - Insufficient quantity
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
  // Zippers (ZIP-005) but in different colors for substitution
  {
    QRCode: "ACC-QR-004",
    PONumber: "PO-B03",
    ItemNumber: "ZIP-005",
    MaterialName: "Zipper",
    Supplier: "SuppB",
    Color: "Black",
    BalanceQty: 1000,
    Unit: "pcs",
    Location: "K2-B3-06",
    DateInHouse: "2025-09-20",
    QCStatus: "Passed",
  },
  {
    QRCode: "ACC-QR-005",
    PONumber: "PO-B04",
    ItemNumber: "ZIP-005",
    MaterialName: "Zipper",
    Supplier: "SuppB",
    Color: "Navy Blue",
    BalanceQty: 750,
    Unit: "pcs",
    Location: "K2-B4-01",
    DateInHouse: "2025-09-21",
    QCStatus: "Passed",
  },
  // Rivets (RIV-003, Antique Brass)
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

// Mock API function to get the list of accessory requests
const getAccessoryRequests = (): Promise<AccessoryRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ACCESSORY_REQUESTS);
    }, 500);
  });
};

// Mock API function to get accessories from inventory by item number and color
const getInventoryByAccessory = (
  itemNumber: string,
  color: string
): Promise<InventoryAccessory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items = MOCK_INVENTORY_ACCESSORIES.filter(
        (item) =>
          item.ItemNumber === itemNumber &&
          item.Color === color &&
          item.BalanceQty > 0 &&
          item.QCStatus === "Passed"
      );
      resolve(items);
    }, 800);
  });
};

// Mock API function to get accessories from inventory by item number (regardless of color)
const getInventoryByItemNumber = (
  itemNumber: string
): Promise<InventoryAccessory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items = MOCK_INVENTORY_ACCESSORIES.filter(
        (item) =>
          item.ItemNumber === itemNumber &&
          item.BalanceQty > 0 &&
          item.QCStatus === "Passed"
      );
      resolve(items);
    }, 800);
  });
};

// --- MAIN COMPONENT: IssueAccessoryFormPage.tsx ---

const IssueAccessoryFormPage: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [allRequests, setAllRequests] = useState<AccessoryRequest[]>([]);
  const [selectedRequestIds, setSelectedRequestIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedAccessories, setSelectedAccessories] = useState<
    SelectedInventoryAccessory[]
  >([]);
  const [availableInventory, setAvailableInventory] = useState<
    InventoryAccessory[]
  >([]);
  const [shortageInfo, setShortageInfo] = useState<{
    itemNumber: string;
    color: string;
    shortageQty: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // --- DERIVED STATE & CALCULATIONS (useMemo for optimization) ---

  const selectedRequests = useMemo(() => {
    return allRequests.filter((req) => selectedRequestIds.has(req.ID));
  }, [allRequests, selectedRequestIds]);

  const accessoryRequirements = useMemo(() => {
    const requirements = new Map<
      string,
      {
        itemNumber: string;
        color: string;
        requiredQty: number;
        unit: string;
      }
    >();
    selectedRequests.forEach((req) => {
      const key = `${req.ItemNumber}-${req.Color}`;
      const existing = requirements.get(key) || {
        itemNumber: req.ItemNumber,
        color: req.Color,
        requiredQty: 0,
        unit: req.Unit,
      };
      existing.requiredQty += req.RequestQuantity;
      requirements.set(key, existing);
    });
    return Array.from(requirements.values());
  }, [selectedRequests]);

  const totalIssuedQty = useMemo(() => {
    return selectedAccessories.reduce(
      (sum, acc) => sum + (acc.issueQty || 0),
      0
    );
  }, [selectedAccessories]);

  const totalRequiredQty = useMemo(() => {
    return accessoryRequirements.reduce((sum, req) => sum + req.requiredQty, 0);
  }, [accessoryRequirements]);

  const displayUnit = useMemo(() => {
    return accessoryRequirements.length > 0
      ? accessoryRequirements[0].unit
      : "";
  }, [accessoryRequirements]);

  // --- LOGIC & SIDE EFFECTS (useEffect) ---

  useEffect(() => {
    if (accessoryRequirements.length === 0) {
      setSelectedAccessories([]);
      setAvailableInventory([]);
      setShortageInfo(null);
      return;
    }

    const processAccessoryRequest = async () => {
      setIsLoading(true);
      setShortageInfo(null);

      const mainRequirement = accessoryRequirements[0];
      if (!mainRequirement) {
        setIsLoading(false);
        return;
      }

      const { itemNumber, color, requiredQty } = mainRequirement;
      const allMatchingItems = await getInventoryByAccessory(itemNumber, color);
      const sortedItems = [...allMatchingItems].sort(
        (a, b) => a.BalanceQty - b.BalanceQty
      );

      const autoSelected: SelectedInventoryAccessory[] = [];
      let qtyToFulfill = requiredQty;
      for (const item of sortedItems) {
        if (qtyToFulfill <= 0) break;
        const qtyToIssue = Math.min(item.BalanceQty, qtyToFulfill);
        autoSelected.push({ ...item, issueQty: qtyToIssue });
        qtyToFulfill -= qtyToIssue;
      }
      setSelectedAccessories(autoSelected);

      const selectedQRCodes = new Set(autoSelected.map((i) => i.QRCode));
      let availableItems = allMatchingItems.filter(
        (i) => !selectedQRCodes.has(i.QRCode)
      );

      if (qtyToFulfill > 0) {
        setShortageInfo({ itemNumber, color, shortageQty: qtyToFulfill });
        const allItemInventory = await getInventoryByItemNumber(itemNumber);
        const currentQRCodes = new Set(allMatchingItems.map((i) => i.QRCode));
        const substituteItems = allItemInventory.filter(
          (i) => !currentQRCodes.has(i.QRCode)
        );
        availableItems = [...availableItems, ...substituteItems];
      }

      setAvailableInventory(availableItems);
      setIsLoading(false);
    };

    processAccessoryRequest();
  }, [accessoryRequirements]);

  // --- HANDLER FUNCTIONS ---
  // 2. Bọc các hàm xử lý sự kiện trong useCallback
  const handleLoadRequests = useCallback(() => {
    setIsLoadingRequests(true);
    setSelectedRequestIds(new Set());
    getAccessoryRequests().then((data) => {
      setAllRequests(data.filter((req) => req.Status === "Pending"));
      setIsLoadingRequests(false);
    });
  }, []);

  const handleRequestSelectionChange = useCallback(
    (selectedItems: AccessoryRequest[]) => {
      setSelectedRequestIds(new Set(selectedItems.map((item) => item.ID)));
    },
    []
  );

  const handleIssueQtyChange = useCallback((qrCode: string, newQty: number) => {
    setSelectedAccessories((prevItems) =>
      prevItems.map((item) => {
        if (item.QRCode === qrCode) {
          const validatedQty = Math.max(0, Math.min(newQty, item.BalanceQty));
          return { ...item, issueQty: validatedQty };
        }
        return item;
      })
    );
  }, []);

  const handleAddAccessoryFromInventory = useCallback(
    (itemToAdd: InventoryAccessory) => {
      setSelectedAccessories((prev) => [
        ...prev,
        { ...itemToAdd, issueQty: itemToAdd.BalanceQty },
      ]);
      setAvailableInventory((prev) =>
        prev.filter((i) => i.QRCode !== itemToAdd.QRCode)
      );
    },
    []
  );

  const handleRemoveSelectedAccessory = useCallback(
    (itemToRemove: SelectedInventoryAccessory) => {
      setSelectedAccessories((prev) =>
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
    console.log("--- STARTING ACCESSORY ISSUANCE PROCESS ---");
    console.log("Selected Requests:", selectedRequests);
    console.log("Issued Accessories:", selectedAccessories);
    console.log("Total Required:", totalRequiredQty, displayUnit);
    console.log("Total Issued:", totalIssuedQty, displayUnit);

    setTimeout(() => {
      alert("Accessory issuance completed successfully!");
      setAllRequests([]);
      setSelectedRequestIds(new Set());
      setSelectedAccessories([]);
      setAvailableInventory([]);
      setShortageInfo(null);
      setIsFinishing(false);
    }, 2000);
  }, [
    totalRequiredQty,
    totalIssuedQty,
    displayUnit,
    selectedRequests,
    selectedAccessories,
  ]);

  // 3. Bọc các mảng định nghĩa cột trong useMemo
  const accessoryRequestColumns = useMemo<ColumnDef<AccessoryRequest>[]>(
    () => [
      { accessorKey: "ID", header: "Request ID" },
      { accessorKey: "JOB", header: "JOB" },
      { accessorKey: "ItemNumber", header: "Item Number" },
      { accessorKey: "Color", header: "Color" },
      {
        accessorKey: "RequestQuantity",
        header: "Required Qty",
        cell: ({ row }) =>
          `${row.original.RequestQuantity.toLocaleString()} ${
            row.original.Unit
          }`,
      },
      { accessorKey: "FactoryLine", header: "Factory Line" },
      { accessorKey: "DateRequired", header: "Date Required" },
    ],
    []
  );

  const selectedAccessoriesColumns = useMemo<
    ColumnDef<SelectedInventoryAccessory>[]
  >(
    () => [
      { accessorKey: "QRCode", header: "QR Code" },
      { accessorKey: "MaterialName", header: "Material Name" },
      { accessorKey: "Color", header: "Color" },
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
            onClick={() => handleRemoveSelectedAccessory(row.original)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [handleIssueQtyChange, handleRemoveSelectedAccessory]
  );

  const availableInventoryColumns = useMemo<ColumnDef<InventoryAccessory>[]>(
    () => [
      { accessorKey: "QRCode", header: "QR Code" },
      {
        accessorKey: "Color",
        header: "Color",
        cell: ({ row }) => (
          <span
            className={
              row.original.Color !== accessoryRequirements[0]?.color
                ? "text-orange-600 font-semibold"
                : ""
            }
          >
            {row.original.Color}
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
            onClick={() => handleAddAccessoryFromInventory(row.original)}
            className="text-green-600 hover:text-green-800"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        ),
      },
    ],
    [accessoryRequirements, handleAddAccessoryFromInventory]
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">
          Issue Accessories From Request
        </h1>
        <p className="text-gray-600">
          Issue accessories based on requests from sewing lines.
        </p>
      </header>
      <Separator />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Step 1: Load and Select Requests</CardTitle>
            <CardDescription>
              Load the list of pending accessory requests.
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
              columns={accessoryRequestColumns}
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
                  disabled={selectedAccessories.length === 0 || isFinishing}
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
                <CardTitle>Selected Accessories for Issuance</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomTable
                  columns={selectedAccessoriesColumns}
                  data={selectedAccessories}
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
                        accessoryRequirements[0]?.itemNumber || "N/A"
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

export default IssueAccessoryFormPage;
