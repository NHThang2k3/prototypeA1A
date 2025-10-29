import React, { useState, useEffect, useMemo } from "react";
import {
  PlusCircleIcon,
  TrashIcon,
  PlayIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

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
  const handleLoadRequests = () => {
    setIsLoadingRequests(true);
    setSelectedRequestIds(new Set());
    getPackagingRequests().then((data) => {
      setAllRequests(data);
      setIsLoadingRequests(false);
    });
  };

  const handleRequestSelectionChange = (reqId: string, isSelected: boolean) => {
    setSelectedRequestIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) newSet.add(reqId);
      else newSet.delete(reqId);
      return newSet;
    });
  };

  const handleIssueQtyChange = (qrCode: string, newQty: number) => {
    setSelectedPackaging((prevItems) =>
      prevItems.map((item) => {
        if (item.QRCode === qrCode) {
          const validatedQty = Math.max(0, Math.min(newQty, item.BalanceQty));
          return { ...item, issueQty: validatedQty };
        }
        return item;
      })
    );
  };

  const handleAddPackagingFromInventory = (itemToAdd: InventoryPackaging) => {
    setSelectedPackaging((prev) => [
      ...prev,
      { ...itemToAdd, issueQty: itemToAdd.BalanceQty },
    ]);
    setAvailableInventory((prev) =>
      prev.filter((i) => i.QRCode !== itemToAdd.QRCode)
    );
  };

  const handleRemoveSelectedPackaging = (
    itemToRemove: SelectedInventoryPackaging
  ) => {
    setSelectedPackaging((prev) =>
      prev.filter((i) => i.QRCode !== itemToRemove.QRCode)
    );
    const { ...originalItem } = itemToRemove;
    setAvailableInventory((prev) =>
      [...prev, originalItem].sort((a, b) => a.QRCode.localeCompare(b.QRCode))
    );
  };

  const handleFinishIssuance = () => {
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
  };

  // --- RENDER ---
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Issue Packaging Materials
        </h1>
        <p className="text-gray-600">
          Issue packaging materials (cartons, bags, labels) based on requests.
        </p>
      </header>

      {/* Step 1: Load and Select Requests */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Step 1: Load and Select Requests
          </h2>
          <button
            onClick={handleLoadRequests}
            disabled={isLoadingRequests}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
          >
            <PlayIcon className="h-5 w-5" />
            {isLoadingRequests ? "Loading..." : "Load Request List"}
          </button>
        </div>
        {allRequests.length > 0 ? (
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 w-12">Select</th>
                  <th className="px-4 py-3">Request ID</th>
                  <th className="px-4 py-3">JOB</th>
                  <th className="px-4 py-3">Item Number</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Required Qty</th>
                  <th className="px-4 py-3">Packaging Line</th>
                </tr>
              </thead>
              <tbody>
                {allRequests.map((req) => (
                  <tr
                    key={req.ID}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedRequestIds.has(req.ID)}
                        onChange={(e) =>
                          handleRequestSelectionChange(req.ID, e.target.checked)
                        }
                      />
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {req.ID}
                    </td>
                    <td className="px-4 py-2">{req.JOB}</td>
                    <td className="px-4 py-2">{req.ItemNumber}</td>
                    <td className="px-4 py-2">{req.Description}</td>
                    <td className="px-4 py-2 font-semibold">
                      {req.RequestQuantity.toLocaleString()} {req.Unit}
                    </td>
                    <td className="px-4 py-2">{req.PackagingLine}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Please load the request list to begin.
          </p>
        )}
      </div>

      {/* Step 2: Summary & Issuance Section */}
      {selectedRequestIds.size > 0 && (
        <>
          <div className="bg-white p-4 rounded-lg shadow-md mb-8 sticky top-0 z-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Step 2: Review and Issue
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800 font-medium">
                  Total Required
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {totalRequiredQty.toLocaleString()} {displayUnit}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-sm text-green-800 font-medium">
                  Total Selected
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {totalIssuedQty.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  {displayUnit}
                </p>
              </div>
              <div
                className={`p-3 rounded-md ${
                  totalIssuedQty < totalRequiredQty
                    ? "bg-red-50"
                    : "bg-green-50"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    totalIssuedQty < totalRequiredQty
                      ? "text-red-800"
                      : "text-green-800"
                  }`}
                >
                  {totalIssuedQty < totalRequiredQty ? "Shortage" : "Surplus"}
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
              </div>
            </div>
            {isLoading && (
              <p className="text-center text-blue-600 mt-4">
                Searching inventory...
              </p>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleFinishIssuance}
                disabled={selectedPackaging.length === 0 || isFinishing}
                className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowRightCircleIcon className="h-5 w-5" />
                {isFinishing ? "Processing..." : "Finish Issuance"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: SELECTED PACKAGING */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Selected Packaging for Issuance
              </h3>
              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-3 py-3">QR Code</th>
                      <th className="px-3 py-3">Description</th>
                      <th className="px-3 py-3">Balance Qty</th>
                      <th className="px-3 py-3">Issue Qty</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPackaging.map((item) => (
                      <tr
                        key={item.QRCode}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-3 py-2 font-medium">{item.QRCode}</td>
                        <td className="px-3 py-2">{item.Description}</td>
                        <td className="px-3 py-2">
                          {item.BalanceQty.toLocaleString()} {item.Unit}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={item.issueQty}
                            onChange={(e) =>
                              handleIssueQtyChange(
                                item.QRCode,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-24 p-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            max={item.BalanceQty}
                            step="1"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleRemoveSelectedPackaging(item)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {selectedPackaging.length === 0 && !isLoading && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-4 text-gray-500"
                        >
                          No packaging items have been selected.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT COLUMN: AVAILABLE INVENTORY */}
            <div
              className={`bg-white p-6 rounded-lg shadow-md transition-all ${
                shortageInfo ? "border-2 border-dashed border-orange-400" : ""
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  shortageInfo ? "text-orange-800" : "text-gray-800"
                }`}
              >
                {shortageInfo
                  ? `Shortage! Select Substitute (Item: ${shortageInfo.itemNumber})`
                  : `Available Inventory (Item: ${
                      packagingRequirements[0]?.itemNumber || "N/A"
                    })`}
              </h3>
              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead
                    className={`text-xs text-gray-700 uppercase sticky top-0 ${
                      shortageInfo ? "bg-orange-50" : "bg-gray-100"
                    }`}
                  >
                    <tr>
                      <th className="px-3 py-3">QR Code</th>
                      <th className="px-3 py-3">Description</th>
                      <th className="px-3 py-3">Location</th>
                      <th className="px-3 py-3">Available Qty</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableInventory.map((item) => (
                      <tr
                        key={item.QRCode}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-3 py-2 font-medium">{item.QRCode}</td>
                        <td
                          className={`px-3 py-2 text-orange-600 font-semibold`}
                        >
                          {item.Description}
                        </td>
                        <td className="px-3 py-2">{item.Location}</td>
                        <td className="px-3 py-2 font-semibold">
                          {item.BalanceQty.toLocaleString()} {item.Unit}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() =>
                              handleAddPackagingFromInventory(item)
                            }
                            className="text-green-600 hover:text-green-800"
                          >
                            <PlusCircleIcon className="h-6 w-6" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {availableInventory.length === 0 && !isLoading && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-4 text-gray-500"
                        >
                          No other packaging available in inventory.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IssuePackagingFormPage;
