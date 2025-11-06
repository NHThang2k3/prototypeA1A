// Path: src/pages/qr-scan/flows/ScanQRAccessory.tsx

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
        message: `Successfully transferred accessory ${item.name} to location ${newLocation.locationCode}.`,
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
        <Button onClick={() => onScan("ITEM_QR_ACC_001")} className="w-full">
          Scan Zipper (Has Location)
        </Button>
        <Button
          onClick={() => onScan("ITEM_QR_ACC_002")}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          Scan Buttons (No Location - Will Error)
        </Button>
        <Button
          onClick={() => onScan("LOC_QR_C_03_A")}
          className="w-full bg-teal-500 hover:bg-teal-600"
        >
          Scan New Location C-03-A
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
    <Card>
      <CardHeader className="text-center border-b pb-4">
        <Move className="mx-auto h-12 w-12 text-blue-500 mb-2" />
        <CardTitle>Transfer Accessory Location</CardTitle>
        <CardDescription className="mt-2">Selected accessory:</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-left bg-muted p-3 rounded-md border">
          <p className="font-bold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Current location:{" "}
            <Badge variant="outline">{item.currentLocation}</Badge>
          </p>
        </div>
        <div className="mt-4">
          <Scanner
            onScan={onScanLocation}
            scanPrompt="Scan the QR code of the NEW WAREHOUSE LOCATION"
            context="TRANSFER_LOCATION"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onCancel}
          variant="secondary"
          className="w-full text-lg"
          size="lg"
        >
          <X className="mr-2 h-5 w-5" /> Cancel
        </Button>
      </CardFooter>
    </Card>
  </div>
);

// --- MAIN FLOW COMPONENT ---

type State =
  | { name: "AWAITING_ITEM_SCAN" }
  | { name: "SCANNING_NEW_LOCATION"; item: ScannedItem }
  | { name: "PROCESSING"; message: string }
  | { name: "FEEDBACK"; status: "SUCCESS" | "ERROR"; message: string };

const ScanQRAccessory: React.FC = () => {
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
              "Accessory has no location, cannot transfer. Please Put Away first."
            );
            return;
          }
          setState({ name: "SCANNING_NEW_LOCATION", item: data });
          toast.success(`Selected accessory: ${data.sku}`);
        } else {
          toast.error("Please scan an ACCESSORY QR code to start.");
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
            scanPrompt="Scan an Accessory QR Code to start a Transfer"
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
    <div className="p-4 bg-background min-h-full">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto">{renderContent()}</div>
    </div>
  );
};

export default ScanQRAccessory;
