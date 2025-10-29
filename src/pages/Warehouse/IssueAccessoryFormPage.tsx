import React, { useState, useEffect, useMemo } from "react";
import {
  PlusCircleIcon,
  TrashIcon,
  PlayIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

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

  const handleLoadRequests = () => {
    setIsLoadingRequests(true);
    setSelectedRequestIds(new Set());
    getAccessoryRequests().then((data) => {
      setAllRequests(data.filter((req) => req.Status === "Pending"));
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
    setSelectedAccessories((prevItems) =>
      prevItems.map((item) => {
        if (item.QRCode === qrCode) {
          const validatedQty = Math.max(0, Math.min(newQty, item.BalanceQty));
          return { ...item, issueQty: validatedQty };
        }
        return item;
      })
    );
  };

  const handleAddAccessoryFromInventory = (itemToAdd: InventoryAccessory) => {
    setSelectedAccessories((prev) => [
      ...prev,
      { ...itemToAdd, issueQty: itemToAdd.BalanceQty },
    ]);
    setAvailableInventory((prev) =>
      prev.filter((i) => i.QRCode !== itemToAdd.QRCode)
    );
  };

  const handleRemoveSelectedAccessory = (
    itemToRemove: SelectedInventoryAccessory
  ) => {
    setSelectedAccessories((prev) =>
      prev.filter((i) => i.QRCode !== itemToRemove.QRCode)
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { issueQty, ...originalItem } = itemToRemove;
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
  };

  // --- RENDER ---

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Issue Accessories From Request
        </h1>
        <p className="text-gray-600">
          Issue accessories based on requests from sewing lines.
        </p>
      </header>

      {/* Step 1: Upload and Requests Table Section */}
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
                  <th className="px-4 py-3">Color</th>
                  <th className="px-4 py-3">Required Qty</th>
                  <th className="px-4 py-3">Factory Line</th>
                  <th className="px-4 py-3">Date Required</th>
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
                    <td className="px-4 py-2">{req.Color}</td>
                    <td className="px-4 py-2 font-semibold">
                      {req.RequestQuantity.toLocaleString()} {req.Unit}
                    </td>
                    <td className="px-4 py-2">{req.FactoryLine}</td>
                    <td className="px-4 py-2">{req.DateRequired}</td>
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

      {/* Step 2: Summary & Accessories Tables Section */}
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
                disabled={selectedAccessories.length === 0 || isFinishing}
                className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowRightCircleIcon className="h-5 w-5" />
                {isFinishing ? "Processing..." : "Finish Issuance"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: SELECTED ACCESSORIES */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Selected Accessories for Issuance
              </h3>
              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-3 py-3">QR Code</th>
                      <th className="px-3 py-3">Material Name</th>
                      <th className="px-3 py-3">Color</th>
                      <th className="px-3 py-3">Balance Qty</th>
                      <th className="px-3 py-3">Issue Qty</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAccessories.map((item) => (
                      <tr
                        key={item.QRCode}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-3 py-2 font-medium">{item.QRCode}</td>
                        <td className="px-3 py-2">{item.MaterialName}</td>
                        <td className="px-3 py-2">{item.Color}</td>
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
                            onClick={() => handleRemoveSelectedAccessory(item)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {selectedAccessories.length === 0 && !isLoading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-500"
                        >
                          No accessories have been selected.
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
                      accessoryRequirements[0]?.itemNumber || "N/A"
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
                      <th className="px-3 py-3">Color</th>
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
                          className={`px-3 py-2 ${
                            item.Color !== accessoryRequirements[0]?.color
                              ? "text-orange-600 font-semibold"
                              : ""
                          }`}
                        >
                          {item.Color}
                        </td>
                        <td className="px-3 py-2">{item.Location}</td>
                        <td className="px-3 py-2 font-semibold">
                          {item.BalanceQty.toLocaleString()} {item.Unit}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() =>
                              handleAddAccessoryFromInventory(item)
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
                          No other accessories available in inventory.
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

export default IssueAccessoryFormPage;
