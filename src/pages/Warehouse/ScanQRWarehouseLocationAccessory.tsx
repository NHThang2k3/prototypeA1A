// Path: src/pages/qr-scan/flows/ScanQRWarehouseLocationAccessory.tsx

import React, { useState, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  CheckCircle,
  AlertTriangle,
  Loader,
  Check,
  X,
  Warehouse,
  Camera,
  Trash2,
  ArrowLeft,
} from "lucide-react";

// --- TYPES ---
export type ScanAction = "PUT_AWAY" | "TRANSFER" | "VIEW_DETAIL";
export type PickingListItem = {
  sku: string;
  name: string;
  uom: "Box" | "Piece" | "Set";
  requiredQuantity: number;
  pickedQuantity: number;
  locations: string[];
};
export type IssueRequest = {
  qrCode: string;
  type: "issue_request";
  id: string;
  destination: string;
  status: "new" | "in_progress" | "completed";
  pickingList: PickingListItem[];
};
export type ScannedItem = {
  qrCode: string;
  type: "item";
  sku: string;
  name: string;
  quantity: number;
  uom: string;
  currentLocation: string | null;
  shipmentId: string;
  size: string;
  material: string;
};
export type ScannedLocation = {
  qrCode: string;
  type: "location";
  locationCode: string;
  description: string;
};
export type ScannedData = ScannedItem | ScannedLocation | IssueRequest;
interface PutAwaySuccessDetails {
  type: "PUT_AWAY_SUCCESS";
  items: ScannedItem[];
  location: ScannedLocation;
}

// --- MOCK DATA & API ---
const MOCK_DATA: Record<string, ScannedData> = {
  ITEM_QR_ACC_001: {
    qrCode: "ITEM_QR_ACC_001",
    type: "item",
    sku: "ACC-ZIP-SLV-05",
    name: "Silver Metal Zipper #5",
    quantity: 500,
    uom: "Piece",
    currentLocation: "C-01-A",
    shipmentId: "SH-2023-201",
    size: "5 inch",
    material: "Metal",
  },
  ITEM_QR_ACC_002: {
    qrCode: "ITEM_QR_ACC_002",
    type: "item",
    sku: "ACC-BTN-BLK-15",
    name: "Black Plastic Buttons 15mm",
    quantity: 1000,
    uom: "Piece",
    currentLocation: null,
    shipmentId: "SH-2023-201",
    size: "15mm",
    material: "Plastic",
  },
  ITEM_QR_ACC_003: {
    qrCode: "ITEM_QR_ACC_003",
    type: "item",
    sku: "ACC-LBL-MAIN-M",
    name: "Main Label - Size M",
    quantity: 2500,
    uom: "Piece",
    currentLocation: null,
    shipmentId: "SH-2023-202",
    size: "M",
    material: "Satin",
  },
  LOC_QR_A_01_B: {
    qrCode: "LOC_QR_A_01_B",
    type: "location",
    locationCode: "A-01-B",
    description: "Shelf A, Floor 1, Bin B",
  },
  LOC_QR_C_03_A: {
    qrCode: "LOC_QR_C_03_A",
    type: "location",
    locationCode: "C-03-A",
    description: "Shelf C, Floor 3, Bin A",
  },
};
const fetchScannedData = (qrCode: string): Promise<ScannedData> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = MOCK_DATA[qrCode];
      if (data) resolve(JSON.parse(JSON.stringify(data)));
      else reject(new Error(`Invalid QR Code: ${qrCode}`));
    }, 500);
  });
const submitPutAwayAction = (
  items: ScannedItem[],
  location: ScannedLocation
): Promise<{ success: boolean; message: string }> =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `Putting away ${items.length} accessory items to location ${location.locationCode}`
      );
      resolve({
        success: true,
        message: `Success! Moved ${items.length} accessory items to location ${location.locationCode}.`,
      });
    }, 1000);
  });

// --- UI SUB-COMPONENTS ---

const Scanner: React.FC<{
  onScan: (data: string) => void;
  scanPrompt: string;
}> = ({ onScan, scanPrompt }) => (
  <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center">
    <div className="relative w-full aspect-square bg-gray-900 rounded-lg flex items-center justify-center mb-4 border-4 border-gray-700">
      <Camera className="w-24 h-24 text-gray-600" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 border-4 border-dashed border-green-400 rounded-lg"></div>
    </div>
    <p className="text-lg font-semibold text-center text-gray-700 mb-6">
      {scanPrompt}
    </p>
    <div className="w-full space-y-3 p-4 bg-gray-200 rounded-lg border border-gray-300">
      <h3 className="text-sm font-bold text-center text-gray-600 uppercase">
        Simulate Scan
      </h3>
      <button
        onClick={() => onScan("LOC_QR_A_01_B")}
        className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition"
      >
        Scan Location A-01-B
      </button>
      <button
        onClick={() => onScan("ITEM_QR_ACC_002")}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Scan Buttons (No Location)
      </button>
      <button
        onClick={() => onScan("ITEM_QR_ACC_003")}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Scan Labels (No Location)
      </button>
      <button
        onClick={() => onScan("QR_INVALID")}
        className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
      >
        Scan Invalid QR
      </button>
    </div>
  </div>
);

const ActionFeedback: React.FC<{
  status: "PROCESSING" | "SUCCESS" | "ERROR";
  message: string;
  onClose: () => void;
  details?: PutAwaySuccessDetails;
}> = ({ status, message, onClose, details }) => {
  const renderContent = () => {
    if (status === "SUCCESS" && details?.type === "PUT_AWAY_SUCCESS") {
      const { items, location } = details;
      return (
        <>
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold">Success!</h2>
          <p className="text-gray-600 text-center mb-4">{message}</p>
          <div className="w-full max-w-2xl mt-4 border rounded-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2 font-semibold">SKU</th>
                    <th className="p-2 font-semibold">Quantity</th>
                    <th className="p-2 font-semibold">Put-away Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {items.map((item) => (
                    <tr key={item.qrCode} className="border-t">
                      <td className="p-2 font-mono">{item.sku}</td>
                      <td className="p-2">
                        {item.quantity} {item.uom}
                      </td>
                      <td className="p-2 font-mono bg-gray-50">
                        {location.locationCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-6 bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition"
          >
            Start New Scan
          </button>
        </>
      );
    }
    const iconMap = {
      PROCESSING: (
        <Loader className="w-16 h-16 text-blue-500 animate-spin mb-4" />
      ),
      SUCCESS: <CheckCircle className="w-16 h-16 text-green-500 mb-4" />,
      ERROR: <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />,
    };
    const titleMap = {
      PROCESSING: "Processing...",
      SUCCESS: "Success!",
      ERROR: "An Error Occurred!",
    };
    const buttonTextMap = {
      PROCESSING: "",
      SUCCESS: "Start New Scan",
      ERROR: "Try Again",
    };
    const buttonColorMap = {
      SUCCESS: "bg-green-600 hover:bg-green-700",
      ERROR: "bg-red-600 hover:bg-red-700",
    };
    return (
      <>
        {iconMap[status]}
        <h2 className="text-xl font-semibold">{titleMap[status]}</h2>
        <p className="text-gray-600 text-center">{message}</p>
        {status !== "PROCESSING" && (
          <button
            onClick={onClose}
            className={`mt-6 ${buttonColorMap[status]} text-white font-bold py-2 px-6 rounded-lg transition`}
          >
            {buttonTextMap[status]}
          </button>
        )}
      </>
    );
  };
  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col items-center justify-center text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full flex flex-col items-center">
        {renderContent()}
      </div>
    </div>
  );
};

interface InboundPutAwayProps {
  location: ScannedLocation;
  scannedItemCount: number;
  onScanItem: (qrCode: string) => void;
  onComplete: () => void;
  onCancel: () => void;
}
const InboundPutAway: React.FC<InboundPutAwayProps> = ({
  location,
  scannedItemCount,
  onScanItem,
  onComplete,
  onCancel,
}) => (
  <div className="w-full max-w-lg mx-auto p-4 animate-fade-in">
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="text-center mb-4 border-b pb-4">
        <Warehouse className="mx-auto h-12 w-12 text-blue-500 mb-2" />
        <h2 className="text-xl font-bold text-gray-800">
          Put Away to Warehouse
        </h2>
        <p className="text-sm text-gray-500">Selected location:</p>
        <p className="font-mono text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block mt-1">
          {location.locationCode}
        </p>
      </div>

      <div className="text-center my-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-lg text-gray-800">
          {scannedItemCount}
        </h3>
        <p className="text-sm text-gray-600">Accessory Item(s) Scanned</p>
      </div>

      <div className="mt-4">
        <Scanner
          onScan={onScanItem}
          scanPrompt="Scan QR codes on accessory boxes/items"
        />
      </div>
    </div>
    <div className="mt-6 flex space-x-3">
      <button
        onClick={onCancel}
        className="w-1/3 text-lg bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center shadow-md transition"
      >
        <X className="mr-2" /> Cancel
      </button>
      <button
        onClick={onComplete}
        disabled={scannedItemCount === 0}
        className="w-2/3 text-lg bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center shadow-md disabled:bg-gray-400 transition"
      >
        <Check className="mr-2" /> Review & Complete
      </button>
    </div>
  </div>
);

interface ConfirmationScreenProps {
  location: ScannedLocation;
  items: ScannedItem[];
  onRemoveItem: (qrCode: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}
const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  location,
  items,
  onRemoveItem,
  onSubmit,
  onBack,
}) => (
  <div className="w-full max-w-lg mx-auto p-4 animate-fade-in">
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="text-center mb-4 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Review and Confirm</h2>
        <p className="text-sm text-gray-500">
          Putting away {items.length} item(s) to location:
        </p>
        <p className="font-mono text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block mt-1">
          {location.locationCode}
        </p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Scanned Items:</h3>
        <div className="max-h-64 overflow-y-auto space-y-2 pr-2 border rounded-md p-2">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 italic py-4">
              No items to confirm. Please go back and scan.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.qrCode}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md border text-sm"
              >
                <div>
                  <p className="font-bold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.qrCode)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    <div className="mt-6 flex space-x-3">
      <button
        onClick={onBack}
        className="w-1/3 text-lg bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center shadow-md transition"
      >
        <ArrowLeft className="mr-2" /> Back
      </button>
      <button
        onClick={onSubmit}
        disabled={items.length === 0}
        className="w-2/3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center shadow-md disabled:bg-gray-400 transition"
      >
        <Check className="mr-2" /> Submit
      </button>
    </div>
  </div>
);

// --- MAIN FLOW COMPONENT ---

type State =
  | { name: "AWAITING_LOCATION_SCAN" }
  | { name: "SCANNING_ITEMS"; location: ScannedLocation; items: ScannedItem[] }
  | {
      name: "AWAITING_CONFIRMATION";
      location: ScannedLocation;
      items: ScannedItem[];
    }
  | { name: "PROCESSING"; message: string }
  | {
      name: "FEEDBACK";
      status: "SUCCESS" | "ERROR";
      message: string;
      details?: PutAwaySuccessDetails;
    };

const ScanQRWarehouseLocationAccessory: React.FC = () => {
  const [state, setState] = useState<State>({ name: "AWAITING_LOCATION_SCAN" });

  const resetState = useCallback(
    () => setState({ name: "AWAITING_LOCATION_SCAN" }),
    []
  );

  const handleScan = async (qrCode: string) => {
    if (
      state.name !== "AWAITING_LOCATION_SCAN" &&
      state.name !== "SCANNING_ITEMS"
    )
      return;

    try {
      const data = await fetchScannedData(qrCode);
      if (state.name === "AWAITING_LOCATION_SCAN") {
        if (data.type === "location") {
          setState({ name: "SCANNING_ITEMS", location: data, items: [] });
          toast.success(`Started Put Away at location: ${data.locationCode}`);
        } else {
          toast.error("Please scan a LOCATION QR code to start.");
        }
      } else if (state.name === "SCANNING_ITEMS") {
        if (data.type === "item") {
          if (state.items.some((item) => item.qrCode === data.qrCode)) {
            toast.error("This accessory has already been scanned.");
            return;
          }
          if ((data as ScannedItem).currentLocation) {
            toast.error(
              `Warning: Accessory already has a location (${
                (data as ScannedItem).currentLocation
              }).`
            );
          }
          setState({ ...state, items: [...state.items, data as ScannedItem] });
          toast.success(`Scanned: ${data.sku}`);
        } else {
          toast.error("Please scan an ACCESSORY item QR code.");
        }
      }
    } catch (error) {
      toast.error(`Scan Error: ${(error as Error).message}`);
    }
  };

  const handleProceedToConfirmation = () => {
    if (state.name !== "SCANNING_ITEMS") return;
    setState({
      name: "AWAITING_CONFIRMATION",
      location: state.location,
      items: state.items,
    });
  };

  const handleRemoveItem = (qrCodeToRemove: string) => {
    if (state.name !== "AWAITING_CONFIRMATION") return;
    setState({
      ...state,
      items: state.items.filter((item) => item.qrCode !== qrCodeToRemove),
    });
    toast.success("Item removed.");
  };

  const handleBackToScanning = () => {
    if (state.name !== "AWAITING_CONFIRMATION") return;
    setState({
      name: "SCANNING_ITEMS",
      location: state.location,
      items: state.items,
    });
  };

  const handleFinalSubmit = async () => {
    if (state.name !== "AWAITING_CONFIRMATION" || state.items.length === 0)
      return;
    const { items, location } = state;
    setState({ name: "PROCESSING", message: "Updating warehouse location..." });
    try {
      const result = await submitPutAwayAction(items, location);
      setState({
        name: "FEEDBACK",
        status: result.success ? "SUCCESS" : "ERROR",
        message: result.message,
        details: { type: "PUT_AWAY_SUCCESS", items, location },
      });
    } catch (error) {
      setState({
        name: "FEEDBACK",
        status: "ERROR",
        message: (error as Error).message,
      });
    }
  };

  const renderContent = () => {
    switch (state.name) {
      case "AWAITING_LOCATION_SCAN":
        return (
          <Scanner
            onScan={handleScan}
            scanPrompt="Scan a Warehouse Location QR to start Put Away for Accessories"
          />
        );
      case "SCANNING_ITEMS":
        return (
          <InboundPutAway
            location={state.location}
            scannedItemCount={state.items.length}
            onScanItem={handleScan}
            onComplete={handleProceedToConfirmation}
            onCancel={resetState}
          />
        );
      case "AWAITING_CONFIRMATION":
        return (
          <ConfirmationScreen
            location={state.location}
            items={state.items}
            onRemoveItem={handleRemoveItem}
            onSubmit={handleFinalSubmit}
            onBack={handleBackToScanning}
          />
        );
      case "PROCESSING":
      case "FEEDBACK":
        return (
          <ActionFeedback
            status={state.name === "PROCESSING" ? "PROCESSING" : state.status}
            message={state.message}
            details={
              state.name === "FEEDBACK"
                ? (state.details as PutAwaySuccessDetails)
                : undefined
            }
            onClose={resetState}
          />
        );
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto">{renderContent()}</div>
    </div>
  );
};

export default ScanQRWarehouseLocationAccessory;
