// Path: src/pages/qr-scan/flows/ScanQRIssueRequestPackaging.tsx

import React, { useState, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  CheckCircle,
  AlertTriangle,
  Loader,
  PackageSearch,
  ArrowLeft,
  Camera,
} from "lucide-react";

// --- TYPES ---

export type ScanAction = "PUT_AWAY" | "TRANSFER" | "VIEW_DETAIL";

export type PickingListItem = {
  sku: string;
  name: string;
  uom: "Box" | "Piece" | "Set" | "Roll";
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
  dimensions: string;
  material: string;
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
    currentLocation: "P-01-B",
    shipmentId: "SH-2023-301",
    dimensions: "40x50 cm",
    material: "Plastic",
  },
  ITEM_QR_PKG_003: {
    qrCode: "ITEM_QR_PKG_003",
    type: "item",
    sku: "PKG-TAPE-BRN-50",
    name: "Brown Packing Tape 50m",
    quantity: 50,
    uom: "Roll",
    currentLocation: "P-01-C",
    shipmentId: "SH-2023-302",
    dimensions: "48mm x 50m",
    material: "Plastic",
  },
  ISSUE_REQ_PKG_001: {
    qrCode: "ISSUE_REQ_PKG_001",
    type: "issue_request",
    id: "PXK-PKG-2023-028",
    destination: "Packing Station 3",
    status: "in_progress",
    pickingList: [
      {
        sku: "PKG-BOX-M-BRN",
        name: "Medium Brown Box",
        uom: "Piece",
        requiredQuantity: 500,
        pickedQuantity: 150,
        locations: ["P-01-A"],
      },
      {
        sku: "PKG-POLY-L-CLR",
        name: "Large Clear Polybag",
        uom: "Piece",
        requiredQuantity: 2000,
        pickedQuantity: 0,
        locations: ["P-01-B", "P-01-D"],
      },
    ],
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

const submitIssueAction = (
  request: IssueRequest,
  item: ScannedItem,
  quantity: number
): Promise<{
  success: boolean;
  message: string;
  updatedRequest: IssueRequest;
}> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const originalRequest = MOCK_DATA[request.qrCode] as IssueRequest;
      if (originalRequest) {
        const pickingItem = originalRequest.pickingList.find(
          (p) => p.sku === item.sku
        );
        if (pickingItem) pickingItem.pickedQuantity += quantity;
      }
      const updatedRequest = MOCK_DATA[request.qrCode] as IssueRequest;
      resolve({
        success: true,
        message: `Issued ${quantity.toLocaleString()} ${item.uom} of ${
          item.name
        }.`,
        updatedRequest: JSON.parse(JSON.stringify(updatedRequest)),
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
        onClick={() => onScan("ISSUE_REQ_PKG_001")}
        className="w-full bg-purple-500 text-white py-2 rounded-md"
      >
        Scan Packaging Issue Request
      </button>
      <button
        onClick={() => onScan("ITEM_QR_PKG_001")}
        className="w-full bg-blue-500 text-white py-2 rounded-md"
      >
        Scan Box (In request)
      </button>
      <button
        onClick={() => onScan("ITEM_QR_PKG_002")}
        className="w-full bg-blue-500 text-white py-2 rounded-md"
      >
        Scan Polybag (In request)
      </button>
      <button
        onClick={() => onScan("ITEM_QR_PKG_003")}
        className="w-full bg-orange-500 text-white py-2 rounded-md"
      >
        Scan Tape (Not in request - Causes error)
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
    ERROR: "An Error Occurred!",
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

interface PickingListProps {
  request: IssueRequest;
  onStartScanning: () => void;
  onBack: () => void;
}
const PickingList: React.FC<PickingListProps> = ({
  request,
  onStartScanning,
  onBack,
}) => {
  const isCompleted = request.pickingList.every(
    (item) => item.pickedQuantity >= item.requiredQuantity
  );
  return (
    <div className="w-full max-w-lg mx-auto p-4 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-4"
      >
        <ArrowLeft size={20} className="mr-2" /> Go Back
      </button>
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="text-center mb-4 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Packaging Issue Request
          </h2>
          <p className="font-mono text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block mt-1">
            {request.id}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Destination: <strong>{request.destination}</strong>
          </p>
        </div>
        <div className="space-y-4">
          {request.pickingList.map((item) => (
            <div key={item.sku} className="p-3 bg-gray-50 rounded-md border">
              <p className="font-bold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (item.pickedQuantity / item.requiredQuantity) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-right mt-1 font-medium">
                  Picked: {item.pickedQuantity.toLocaleString()} /{" "}
                  {item.requiredQuantity.toLocaleString()} {item.uom}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        {isCompleted ? (
          <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
            <p className="font-bold">Request Completed!</p>
          </div>
        ) : (
          <button
            onClick={onStartScanning}
            className="w-full text-lg bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center shadow-md"
          >
            <PackageSearch className="mr-3" /> Start Scanning Items
          </button>
        )}
      </div>
    </div>
  );
};

// --- MAIN FLOW COMPONENT ---

type State =
  | { name: "AWAITING_REQUEST_SCAN" }
  | { name: "SHOWING_LIST"; request: IssueRequest }
  | { name: "SCANNING_ITEM"; request: IssueRequest }
  | { name: "PROCESSING"; message: string; request: IssueRequest }
  | { name: "FEEDBACK"; status: "SUCCESS" | "ERROR"; message: string };

const isRequestCompleted = (request: IssueRequest): boolean =>
  request.pickingList.every(
    (item) => item.pickedQuantity >= item.requiredQuantity
  );

const ScanQRIssueRequestPackaging: React.FC = () => {
  const [state, setState] = useState<State>({ name: "AWAITING_REQUEST_SCAN" });

  const resetState = useCallback(
    () => setState({ name: "AWAITING_REQUEST_SCAN" }),
    []
  );

  const handleScan = async (qrCode: string) => {
    try {
      const data = await fetchScannedData(qrCode);
      if (state.name === "AWAITING_REQUEST_SCAN") {
        if (data.type === "issue_request") {
          setState({ name: "SHOWING_LIST", request: data });
          toast.success(`Opened issue request: ${data.id}`);
        } else {
          toast.error("Please scan an ISSUE REQUEST QR code to start.");
        }
      } else if (state.name === "SCANNING_ITEM") {
        if (data.type !== "item") {
          toast.error("Please scan a PACKAGING QR code.");
          return;
        }

        const { request } = state;
        const scannedItem = data as ScannedItem;
        const itemInList = request.pickingList.find(
          (p) => p.sku === scannedItem.sku
        );

        if (!itemInList) {
          toast.error(
            `Packaging item ${scannedItem.sku} is not in the request!`
          );
          return;
        }
        const remaining =
          itemInList.requiredQuantity - itemInList.pickedQuantity;
        if (remaining <= 0) {
          toast.error(
            `The required quantity for packaging item ${scannedItem.sku} has already been picked.`
          );
          return;
        }

        const quantityToIssue = Math.min(scannedItem.quantity, remaining);
        setState({
          name: "PROCESSING",
          message: `Recording issue of ${quantityToIssue} ${scannedItem.uom}...`,
          request,
        });

        const result = await submitIssueAction(
          request,
          scannedItem,
          quantityToIssue
        );
        toast.success(result.message);

        if (isRequestCompleted(result.updatedRequest)) {
          setState({
            name: "FEEDBACK",
            status: "SUCCESS",
            message: `Finished picking items for request ${result.updatedRequest.id}!`,
          });
        } else {
          setState({ name: "SCANNING_ITEM", request: result.updatedRequest });
        }
      }
    } catch (error) {
      toast.error(`Scan error: ${(error as Error).message}`);
      if (state.name === "PROCESSING")
        setState({ name: "SCANNING_ITEM", request: state.request });
    }
  };

  const renderContent = () => {
    switch (state.name) {
      case "AWAITING_REQUEST_SCAN":
        return (
          <Scanner
            onScan={handleScan}
            scanPrompt="Scan a Packaging Issue Request QR code to begin Issuing"
            context="INITIAL"
          />
        );
      case "SHOWING_LIST":
        return (
          <PickingList
            request={state.request}
            onStartScanning={() =>
              setState({ ...state, name: "SCANNING_ITEM" })
            }
            onBack={resetState}
          />
        );
      case "SCANNING_ITEM":
        return (
          <>
            <button
              onClick={() => setState({ ...state, name: "SHOWING_LIST" })}
              className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={16} className="mr-1" /> View Request Details
            </button>
            <Scanner
              onScan={handleScan}
              scanPrompt={`Request ${state.request.id}: Scan Packaging QR code`}
              context="ISSUE_ITEM"
            />
          </>
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

export default ScanQRIssueRequestPackaging;
