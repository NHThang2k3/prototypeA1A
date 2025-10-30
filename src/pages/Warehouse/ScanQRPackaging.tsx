// Path: src/pages/qr-scan/flows/ScanQRPackaging.tsx

import React, { useState, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  CheckCircle,
  AlertTriangle,
  Loader,
  Move,
  X,
  Camera,
} from "lucide-react";

// --- TYPES ---

export type ScanAction = "PUT_AWAY" | "TRANSFER" | "VIEW_DETAIL";

export type PickingListItem = {
  sku: string;
  name: string;
  uom: "Roll" | "Carton" | "Meter" | "Piece" | "Box";
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
  dimensions: string; // e.g., "30x20x15 cm"
  material: string; // e.g., "Cardboard"
};

export type ScannedLocation = {
  qrCode: string;
  type: "location";
  locationCode: string;
  description: string;
};

export type ScannedData = ScannedItem | ScannedLocation | IssueRequest;

// --- MOCK DATA & API ---

const MOCK_DATA: Record<string, ScannedData> = {
  ITEM_QR_PKG_001: {
    qrCode: "ITEM_QR_PKG_001",
    type: "item",
    sku: "PKG-BOX-M-BRN",
    name: "Medium Brown Box",
    quantity: 200,
    uom: "Piece",
    currentLocation: "P-01-A",
    shipmentId: "SH-2023-301",
    dimensions: "30x20x15 cm",
    material: "Cardboard",
  },
  ITEM_QR_PKG_002: {
    qrCode: "ITEM_QR_PKG_002",
    type: "item",
    sku: "PKG-POLY-L-CLR",
    name: "Large Clear Polybag",
    quantity: 2500,
    uom: "Piece",
    currentLocation: null,
    shipmentId: "SH-2023-301",
    dimensions: "40x50 cm",
    material: "Plastic",
  },
  LOC_QR_A_01_B: {
    qrCode: "LOC_QR_A_01_B",
    type: "location",
    locationCode: "A-01-B",
    description: "Shelf A, Floor 1, Bin B",
  },
  LOC_QR_P_02_C: {
    qrCode: "LOC_QR_P_02_C",
    type: "location",
    locationCode: "P-02-C",
    description: "Packaging Shelf P, Floor 2, Bin C",
  },
};

const fetchScannedData = (qrCode: string): Promise<ScannedData> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = MOCK_DATA[qrCode];
      if (data) resolve(JSON.parse(JSON.stringify(data)));
      else reject(new Error(`Invalid QR code: ${qrCode}`));
    }, 500);
  });

const submitTransferAction = (
  item: ScannedItem,
  newLocation: ScannedLocation
): Promise<{ success: boolean; message: string }> =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `Transferring ${item.name} from ${item.currentLocation} to ${newLocation.locationCode}`
      );
      resolve({
        success: true,
        message: `Successfully transferred packaging ${item.name} to location ${newLocation.locationCode}.`,
      });
    }, 1000);
  });

// --- UI SUB-COMPONENTS ---

type ScanContext =
  | "INITIAL"
  | "PUT_AWAY_ITEM"
  | "TRANSFER_LOCATION"
  | "ISSUE_ITEM";
const Scanner: React.FC<{
  onScan: (data: string) => void;
  scanPrompt: string;
  context: ScanContext;
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
      <h3 className="text-sm font-bold text-center text-gray-600">
        SIMULATE SCAN
      </h3>
      <button
        onClick={() => onScan("ITEM_QR_PKG_001")}
        className="w-full bg-blue-500 text-white py-2 rounded-md"
      >
        Scan Box (Has Location)
      </button>
      <button
        onClick={() => onScan("ITEM_QR_PKG_002")}
        className="w-full bg-orange-500 text-white py-2 rounded-md"
      >
        Scan Polybag (No Location - Will Error)
      </button>
      <button
        onClick={() => onScan("LOC_QR_P_02_C")}
        className="w-full bg-teal-500 text-white py-2 rounded-md"
      >
        Scan New Location P-02-C
      </button>
      <button
        onClick={() => onScan("QR_INVALID")}
        className="w-full bg-red-500 text-white py-2 rounded-md"
      >
        Scan Invalid QR
      </button>
    </div>
  </div>
);

interface ActionFeedbackProps {
  status: "PROCESSING" | "SUCCESS" | "ERROR";
  message: string;
  onClose: () => void;
}
const ActionFeedback: React.FC<ActionFeedbackProps> = ({
  status,
  message,
  onClose,
}) => {
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
    ERROR: "An error occurred!",
  };
  const buttonTextMap = {
    PROCESSING: "",
    SUCCESS: "Start New Scan",
    ERROR: "Try Again",
  };
  const buttonColorMap = { SUCCESS: "bg-green-600", ERROR: "bg-red-600" };
  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col items-center justify-center text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full flex flex-col items-center">
        {iconMap[status]}
        <h2 className="text-xl font-semibold">{titleMap[status]}</h2>
        <p className="text-gray-600 text-center">{message}</p>
        {status !== "PROCESSING" && (
          <button
            onClick={onClose}
            className={`mt-6 ${buttonColorMap[status]} text-white font-bold py-2 px-6 rounded-lg`}
          >
            {buttonTextMap[status]}
          </button>
        )}
      </div>
    </div>
  );
};

interface TransferItemProps {
  item: ScannedItem;
  onScanLocation: (qrCode: string) => void;
  onCancel: () => void;
}
const TransferItem: React.FC<TransferItemProps> = ({
  item,
  onScanLocation,
  onCancel,
}) => (
  <div className="w-full max-w-lg mx-auto p-4 animate-fade-in">
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="text-center mb-4 border-b pb-4">
        <Move className="mx-auto h-12 w-12 text-blue-500 mb-2" />
        <h2 className="text-xl font-bold text-gray-800">
          Transfer Packaging Location
        </h2>
        <p className="text-sm text-gray-500 mt-2">Selected packaging item:</p>
        <div className="mt-2 text-left bg-gray-50 p-3 rounded-md border">
          <p className="font-bold text-gray-800">{item.name}</p>
          <p className="text-xs text-gray-500">SKU: {item.sku}</p>
          <p className="text-xs text-gray-500 mt-1">
            Current location:{" "}
            <span className="font-mono bg-gray-200 px-1 rounded">
              {item.currentLocation}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-4">
        <Scanner
          onScan={onScanLocation}
          scanPrompt="Scan the QR code of the NEW WAREHOUSE LOCATION"
          context="TRANSFER_LOCATION"
        />
      </div>
    </div>
    <div className="mt-6 flex justify-center">
      <button
        onClick={onCancel}
        className="w-1/2 text-lg bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center shadow-md"
      >
        <X className="mr-2" /> Cancel
      </button>
    </div>
  </div>
);

// --- MAIN FLOW COMPONENT ---

type State =
  | { name: "AWAITING_ITEM_SCAN" }
  | { name: "SCANNING_NEW_LOCATION"; item: ScannedItem }
  | { name: "PROCESSING"; message: string }
  | { name: "FEEDBACK"; status: "SUCCESS" | "ERROR"; message: string };

const ScanQRPackaging: React.FC = () => {
  const [state, setState] = useState<State>({ name: "AWAITING_ITEM_SCAN" });

  const resetState = useCallback(
    () => setState({ name: "AWAITING_ITEM_SCAN" }),
    []
  );

  const handleScan = async (qrCode: string) => {
    try {
      const data = await fetchScannedData(qrCode);
      if (state.name === "AWAITING_ITEM_SCAN") {
        if (data.type === "item") {
          if (!data.currentLocation) {
            toast.error(
              "Packaging has no location, cannot transfer. Please Put Away first."
            );
            return;
          }
          setState({ name: "SCANNING_NEW_LOCATION", item: data });
          toast.success(`Selected packaging: ${data.sku}`);
        } else {
          toast.error("Please scan a PACKAGING QR code to start.");
        }
      } else if (state.name === "SCANNING_NEW_LOCATION") {
        if (data.type === "location") {
          setState({
            name: "PROCESSING",
            message: "Processing location transfer...",
          });
          const result = await submitTransferAction(
            state.item,
            data as ScannedLocation
          );
          setState({
            name: "FEEDBACK",
            status: result.success ? "SUCCESS" : "ERROR",
            message: result.message,
          });
        } else {
          toast.error("Please scan the NEW LOCATION QR code.");
        }
      }
    } catch (error) {
      toast.error(`Scan error: ${(error as Error).message}`);
    }
  };

  const renderContent = () => {
    switch (state.name) {
      case "AWAITING_ITEM_SCAN":
        return (
          <Scanner
            onScan={handleScan}
            scanPrompt="Scan a Packaging QR Code to start a Transfer"
            context="INITIAL"
          />
        );
      case "SCANNING_NEW_LOCATION":
        return (
          <TransferItem
            item={state.item}
            onScanLocation={handleScan}
            onCancel={resetState}
          />
        );
      case "PROCESSING":
      case "FEEDBACK":
        return (
          <ActionFeedback
            status={state.name === "PROCESSING" ? "PROCESSING" : state.status}
            message={state.message}
            onClose={resetState}
          />
        );
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto">{renderContent()}</div>
    </div>
  );
};

export default ScanQRPackaging;
