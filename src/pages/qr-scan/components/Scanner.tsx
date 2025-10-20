// Path: src/pages/qr-scan/components/Scanner.tsx

import { Camera } from "lucide-react";
import React from "react";

type ScanContext =
  | "INITIAL"
  | "PUT_AWAY_ITEM"
  | "TRANSFER_LOCATION"
  | "ISSUE_ITEM";

interface ScannerProps {
  onScan: (data: string) => void;
  scanPrompt: string;
  context: ScanContext;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, scanPrompt, context }) => {
  const renderDevButtons = () => {
    switch (context) {
      case "INITIAL":
        return (
          <>
            <h3 className="text-sm font-bold text-center text-gray-600">
              SIMULATE FIRST SCAN
            </h3>
            <button
              onClick={() => onScan("LOC_QR_A_01_B")}
              className="w-full bg-teal-500 text-white py-2 rounded-md"
            >
              Scan Warehouse Location (Put Away Function)
            </button>
            <button
              onClick={() => onScan("ITEM_QR_FAB_002")}
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              Scan Fabric (Transfer Location Function)
            </button>
            <button
              onClick={() => onScan("ISSUE_REQ_001")}
              className="w-full bg-purple-500 text-white py-2 rounded-md"
            >
              Scan Issue Request (Issue Function)
            </button>
          </>
        );
      case "PUT_AWAY_ITEM":
        return (
          <>
            <h3 className="text-sm font-bold text-center text-gray-600">
              SIMULATE SCANNING FABRIC FOR PUT AWAY
            </h3>
            <button
              onClick={() => onScan("ITEM_QR_FAB_001")}
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              Scan Cotton Fabric (No location)
            </button>
            {/* NEW: Add button to scan second fabric roll */}
            <button
              onClick={() => onScan("ITEM_QR_FAB_004")}
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              Scan Denim Fabric (No location)
            </button>
            <button
              onClick={() => onScan("LOC_QR_A_01_B")}
              className="w-full bg-orange-500 text-white py-2 rounded-md"
            >
              Scan Location (Will show error)
            </button>
          </>
        );
      case "TRANSFER_LOCATION":
        return (
          <>
            <h3 className="text-sm font-bold text-center text-gray-600">
              SIMULATE SCANNING NEW LOCATION
            </h3>
            <button
              onClick={() => onScan("LOC_QR_C_03_A")}
              className="w-full bg-teal-500 text-white py-2 rounded-md"
            >
              Scan Warehouse Location C-03-A
            </button>
            <button
              onClick={() => onScan("ITEM_QR_FAB_001")}
              className="w-full bg-orange-500 text-white py-2 rounded-md"
            >
              Scan Fabric (Will show error)
            </button>
          </>
        );
      case "ISSUE_ITEM":
        return (
          <>
            <h3 className="text-sm font-bold text-center text-gray-600">
              SIMULATE SCANNING FABRIC FOR ISSUE
            </h3>
            <button
              onClick={() => onScan("ITEM_QR_FAB_002")}
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              Scan Red Fabric (In request)
            </button>
            <button
              onClick={() => onScan("ITEM_QR_FAB_003")}
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              Scan Silk Fabric (In request)
            </button>
            <button
              onClick={() => onScan("ITEM_QR_FAB_001")}
              className="w-full bg-orange-500 text-white py-2 rounded-md"
            >
              Scan Blue Fabric (NOT in request)
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center">
      <div className="relative w-full aspect-square bg-gray-900 rounded-lg flex items-center justify-center mb-4 border-4 border-gray-700">
        <Camera className="w-24 h-24 text-gray-600" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 border-4 border-dashed border-green-400 rounded-lg"></div>
      </div>
      <p className="text-lg font-semibold text-center text-gray-700 mb-6">
        {scanPrompt}
      </p>
      <div className="w-full space-y-3 p-4 bg-gray-200 rounded-lg border border-gray-300">
        {renderDevButtons()}
        <button
          onClick={() => onScan("QR_INVALID")}
          className="w-full bg-red-500 text-white py-2 rounded-md"
        >
          Scan INVALID QR Code
        </button>
      </div>
    </div>
  );
};

export default Scanner;
