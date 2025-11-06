// Path: src/pages/qr-scan/flows/ScanQRIssueRequest.tsx

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

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// --- TYPES (Integrated from types.ts) ---

export type ScanAction = "PUT_AWAY" | "TRANSFER" | "VIEW_DETAIL";

export type PickingListItem = {
  sku: string;
  name: string;
  uom: "Roll" | "Box" | "Meter" | "Piece";
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
  color: string;
  length: number;
  weight: number;
};

export type ScannedLocation = {
  qrCode: string;
  type: "location";
  locationCode: string;
  description: string;
};

export type ScannedData = ScannedItem | ScannedLocation | IssueRequest;

// --- MOCK DATA & API (Integrated from data.ts) ---

const MOCK_DATA: Record<string, ScannedData> = {
  ITEM_QR_FAB_001: {
    qrCode: "ITEM_QR_FAB_001",
    type: "item",
    sku: "FAB-BLUE-01",
    name: "Navy Blue Cotton Fabric",
    quantity: 150,
    uom: "Meter",
    currentLocation: null,
    shipmentId: "SH-2023-101",
    color: "Navy Blue",
    length: 100,
    weight: 25.5,
  },
  ITEM_QR_FAB_002: {
    qrCode: "ITEM_QR_FAB_002",
    type: "item",
    sku: "FAB-RED-02",
    name: "Red Kate Fabric",
    quantity: 120.5,
    uom: "Meter",
    currentLocation: "A-01-B",
    shipmentId: "SH-2023-101",
    color: "Red",
    length: 80,
    weight: 22,
  },
  ITEM_QR_FAB_003: {
    qrCode: "ITEM_QR_FAB_003",
    type: "item",
    sku: "FAB-SILK-03",
    name: "White Silk Fabric",
    quantity: 88,
    uom: "Meter",
    currentLocation: "B-02-C",
    shipmentId: "SH-2023-102",
    color: "White",
    length: 110,
    weight: 15,
  },
  ITEM_QR_FAB_004: {
    qrCode: "ITEM_QR_FAB_004",
    type: "item",
    sku: "FAB-DENIM-04",
    name: "Dark Blue Denim Fabric",
    quantity: 250,
    uom: "Meter",
    currentLocation: null,
    shipmentId: "SH-2023-103",
    color: "Dark Blue",
    length: 150,
    weight: 50,
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
  ISSUE_REQ_001: {
    qrCode: "ISSUE_REQ_001",
    type: "issue_request",
    id: "PXK-2023-088",
    destination: "Cutting Department",
    status: "in_progress",
    pickingList: [
      {
        sku: "FAB-RED-02",
        name: "Red Kate Fabric",
        uom: "Meter",
        requiredQuantity: 200,
        pickedQuantity: 80,
        locations: ["A-01-B", "A-01-C"],
      },
      {
        sku: "FAB-SILK-03",
        name: "White Silk Fabric",
        uom: "Meter",
        requiredQuantity: 88,
        pickedQuantity: 0,
        locations: ["B-02-C"],
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

// --- UI SUB-COMPONENTS (Integrated) ---

// Component: Scanner
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
    <div className="relative w-full aspect-square bg-slate-900 rounded-lg flex items-center justify-center mb-4 border-4 border-slate-700">
      <Camera className="w-24 h-24 text-slate-600" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 border-4 border-dashed border-green-400 rounded-lg"></div>
    </div>
    <p className="text-lg font-semibold text-center text-foreground mb-6">
      {scanPrompt}
    </p>
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-bold text-center text-muted-foreground uppercase tracking-wider">
          Simulate Scan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={() => onScan("ISSUE_REQ_001")}
          className="w-full bg-purple-500 hover:bg-purple-600"
        >
          Scan Issue Request
        </Button>
        <Button onClick={() => onScan("ITEM_QR_FAB_002")} className="w-full">
          Scan Red Fabric (In request)
        </Button>
        <Button onClick={() => onScan("ITEM_QR_FAB_003")} className="w-full">
          Scan Silk Fabric (In request)
        </Button>
        <Button
          onClick={() => onScan("ITEM_QR_FAB_001")}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          Scan Blue Fabric (Not in request - Causes error)
        </Button>
        <Button
          onClick={() => onScan("QR_INVALID")}
          variant="destructive"
          className="w-full"
        >
          Scan Invalid QR
        </Button>
      </CardContent>
    </Card>
  </div>
);

// Component: ActionFeedback
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
  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col items-center justify-center text-center">
      <Card className="p-8 w-full flex flex-col items-center">
        {iconMap[status]}
        <h2 className="text-xl font-semibold">{titleMap[status]}</h2>
        <p className="text-muted-foreground text-center">{message}</p>
        {status === "SUCCESS" && (
          <Button
            onClick={onClose}
            className="mt-6 bg-green-600 hover:bg-green-700"
          >
            Start New Scan
          </Button>
        )}
        {status === "ERROR" && (
          <Button onClick={onClose} variant="destructive" className="mt-6">
            Try Again
          </Button>
        )}
      </Card>
    </div>
  );
};

// Component: PickingList
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
      <Button onClick={onBack} variant="ghost" className="mb-4">
        <ArrowLeft size={20} className="mr-2" /> Go Back
      </Button>
      <Card>
        <CardHeader className="text-center border-b pb-4">
          <CardTitle>Warehouse Issue Request</CardTitle>
          <Badge variant="secondary" className="mt-1 self-center">
            {request.id}
          </Badge>
          <CardDescription className="pt-2">
            Destination: <strong>{request.destination}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {request.pickingList.map((item) => (
            <div key={item.sku} className="p-3 bg-muted rounded-md border">
              <p className="font-bold text-foreground">{item.name}</p>
              <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
              <div className="mt-2">
                <Progress
                  value={Math.min(
                    100,
                    (item.pickedQuantity / item.requiredQuantity) * 100
                  )}
                  className="h-2.5"
                />
                <p className="text-xs text-right mt-1 font-medium text-muted-foreground">
                  Picked: {item.pickedQuantity.toLocaleString()} /{" "}
                  {item.requiredQuantity.toLocaleString()} {item.uom}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          {isCompleted ? (
            <div className="text-center w-full p-4 bg-green-100 text-green-800 rounded-lg">
              <p className="font-bold">Request Completed!</p>
            </div>
          ) : (
            <Button
              onClick={onStartScanning}
              size="lg"
              className="w-full text-lg bg-green-600 hover:bg-green-700"
            >
              <PackageSearch className="mr-3" /> Start Scanning Items
            </Button>
          )}
        </CardFooter>
      </Card>
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

const ScanQRIssueRequest: React.FC = () => {
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
          toast.error("Please scan an ITEM QR code.");
          return;
        }

        const { request } = state;
        const scannedItem = data as ScannedItem;
        const itemInList = request.pickingList.find(
          (p) => p.sku === scannedItem.sku
        );

        if (!itemInList) {
          toast.error(`Item ${scannedItem.sku} is not in the request!`);
          return;
        }
        const remaining =
          itemInList.requiredQuantity - itemInList.pickedQuantity;
        if (remaining <= 0) {
          toast.error(
            `The required quantity for item ${scannedItem.sku} has already been picked.`
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
            scanPrompt="Scan an Issue Request QR code to begin Issuing"
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
            <Button
              onClick={() => setState({ ...state, name: "SHOWING_LIST" })}
              variant="link"
              className="mb-4"
            >
              <ArrowLeft size={16} className="mr-1" /> View Request Details
            </Button>
            <Scanner
              onScan={handleScan}
              scanPrompt={`Request ${state.request.id}: Scan Item QR code`}
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
    <div className="p-4 bg-background min-h-full">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto">{renderContent()}</div>
    </div>
  );
};

export default ScanQRIssueRequest;
