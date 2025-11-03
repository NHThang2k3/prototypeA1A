import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  QrCode,
  Loader2,
  Edit,
  AlertTriangle,
} from "lucide-react";

// ============================================================================
// COMMON CODE BLOCK (TYPES, MOCK DATA, UI COMPONENTS)
// ============================================================================

// --- Updated Types for PO and Bundles ---
type POBundle = {
  id: string; // Bundle ID
  style: string;
  color: string;
  size: string;
  plannedQty: number;
  actualQty: number;
  location: string;
  confirmed: boolean;
  isDiscrepancy?: boolean; // Flag for system-generated rows
};

type PurchaseOrder = {
  id: string;
  bundles: POBundle[];
};

type Feedback = { type: "success" | "error"; message: string };

// --- Updated Mock Data for a full Purchase Order ---
const mockPOData: PurchaseOrder = {
  id: "PO-2024-001",
  bundles: [
    {
      id: "B-12345",
      style: "Men T-Shirt",
      color: "Black",
      size: "M",
      plannedQty: 50,
      actualQty: 50,
      location: "At Buffer",
      confirmed: false,
    },
    {
      id: "B-12346",
      style: "Men T-Shirt",
      color: "Black",
      size: "L",
      plannedQty: 75,
      actualQty: 70,
      location: "At Buffer",
      confirmed: false,
    }, // Example with discrepancy
    {
      id: "B-12347",
      style: "Men T-Shirt",
      color: "White",
      size: "M",
      plannedQty: 48,
      actualQty: 48,
      location: "At Buffer",
      confirmed: false,
    },
  ],
};

const ScannerView: React.FC<{ isScanning: boolean; onScan: () => void }> = ({
  isScanning,
  onScan,
}) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
    <h1 className="text-4xl font-bold mb-4">Scan PO QR Code</h1>
    <p className="text-gray-400 mb-8 text-lg">
      Scan any bundle to load the entire Purchase Order
    </p>
    <div className="relative w-80 h-80 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-700">
      <QrCode
        className="absolute inset-0 w-full h-full text-gray-700/50"
        strokeWidth={0.5}
      />
      <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
      <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
      <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
      <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
      {isScanning && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-green-400 shadow-[0_0_20px_5px_rgba(52,211,153,0.7)] animate-scan"></div>
      )}
    </div>
    <button
      onClick={onScan}
      disabled={isScanning}
      className="mt-10 flex items-center justify-center w-64 bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all text-xl disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {isScanning ? (
        <>
          <Loader2 className="w-6 h-6 mr-3 animate-spin" /> Scanning...
        </>
      ) : (
        "Start Scan"
      )}
    </button>
  </div>
);

// --- NEW: Review View Component ---
const ReviewView: React.FC<{
  po: PurchaseOrder;
  onQuantityChange: (bundleId: string, newQty: number) => void;
  onConfirmRow: (bundleId: string) => void;
  onFinish: () => void;
}> = ({ po, onQuantityChange, onConfirmRow, onFinish }) => {
  const allConfirmed = po.bundles.every((b) => b.confirmed || b.isDiscrepancy);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Review Scanned Items
      </h1>
      <p className="text-lg text-gray-600 mb-6 font-semibold">
        Purchase Order: {po.id}
      </p>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center text-blue-700 bg-blue-50 p-3 rounded-lg mb-6">
          <Edit className="w-5 h-5 mr-3 flex-shrink-0" />
          <p>
            Edit 'Actual Qty' then press 'Confirm Row' for each item.
            Discrepancies will create a new item to be sent back to 'Cutting'.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                <th className="p-3">Bundle ID</th>
                <th className="p-3">Style</th>
                <th className="p-3">Planned Qty</th>
                <th className="p-3">Actual Qty</th>
                <th className="p-3">Difference</th>
                <th className="p-3">Location</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {po.bundles.map((bundle) => {
                const diff = bundle.isDiscrepancy
                  ? bundle.actualQty
                  : bundle.actualQty - bundle.plannedQty;
                return (
                  <tr
                    key={bundle.id}
                    className={`${
                      bundle.isDiscrepancy
                        ? "bg-yellow-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3 font-medium text-gray-800">
                      {bundle.id}
                    </td>
                    <td className="p-3 text-gray-700">
                      {bundle.style}, {bundle.color}, {bundle.size}
                    </td>
                    <td className="p-3 text-center text-gray-700">
                      {bundle.plannedQty}
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        value={bundle.actualQty}
                        onChange={(e) =>
                          onQuantityChange(
                            bundle.id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        disabled={bundle.confirmed}
                        className="w-20 text-center border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td
                      className={`p-3 text-center font-bold ${
                        diff === 0
                          ? "text-gray-500"
                          : diff > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {diff > 0 && !bundle.isDiscrepancy ? `+${diff}` : diff}
                      {bundle.isDiscrepancy && (
                        <AlertTriangle className="inline-block w-4 h-4 ml-1 text-orange-500" />
                      )}
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        bundle.location === "Cutting"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {bundle.location}
                    </td>
                    <td className="p-3 text-center">
                      {!bundle.isDiscrepancy ? (
                        bundle.confirmed ? (
                          <span className="flex items-center justify-center text-green-600 font-semibold">
                            <CheckCircle className="w-5 h-5 mr-1" /> Confirmed
                          </span>
                        ) : (
                          <button
                            onClick={() => onConfirmRow(bundle.id)}
                            className="bg-blue-600 text-white font-bold py-1 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            Confirm Row
                          </button>
                        )
                      ) : (
                        <span className="text-gray-500 text-sm italic">
                          Generated
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={onFinish}
          disabled={!allConfirmed}
          className="flex items-center justify-center w-64 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {allConfirmed
            ? "Finish & Return to Scanner"
            : "Confirm All Rows to Finish"}
        </button>
      </div>
    </div>
  );
};

// This view shows final feedback.
const DetailsView: React.FC<{
  feedback: Feedback | null;
  pageTitle: string;
}> = ({ feedback, pageTitle }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="max-w-md w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {pageTitle}
      </h1>
      <div className="bg-white p-6 rounded-xl shadow-md">
        {feedback ? (
          <div
            className={`p-4 rounded-lg flex flex-col items-center text-center ${
              feedback.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle className="w-12 h-12 mb-3" />
            ) : (
              <XCircle className="w-12 h-12 mb-3" />
            )}
            <span className="font-semibold text-lg">{feedback.message}</span>
          </div>
        ) : (
          <p className="text-gray-500 text-center p-8">Waiting for action...</p>
        )}
      </div>
    </div>
  </div>
);

const GlobalStyles = () => (
  <style>{`@keyframes scan {0% { transform: translateY(0); } 100% { transform: translateY(calc(20rem - 0.375rem)); }} .animate-scan { animation: scan 1.5s ease-in-out infinite alternate; }`}</style>
);

// ============================================================================
// MAIN PAGE COMPONENT: ScanInBufferPage
// ============================================================================

const ScanInBufferPage: React.FC = () => {
  const [view, setView] = useState<"scanner" | "review" | "details">("scanner");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedPO, setScannedPO] = useState<PurchaseOrder | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const resetToScanner = () => {
    setView("scanner");
    setScannedPO(null);
    setFeedback(null);
  };

  const handleScan = () => {
    setIsScanning(true);
    setFeedback(null);
    setTimeout(() => {
      // Deep copy mock data to prevent mutation issues on reset
      const initialPO = JSON.parse(JSON.stringify(mockPOData));
      setScannedPO(initialPO);
      setView("review");
      setIsScanning(false);
    }, 1500);
  };

  const handleQuantityChange = (bundleId: string, newQty: number) => {
    if (!scannedPO) return;
    const updatedBundles = scannedPO.bundles.map((bundle) =>
      bundle.id === bundleId ? { ...bundle, actualQty: newQty } : bundle
    );
    setScannedPO({ ...scannedPO, bundles: updatedBundles });
  };

  const handleConfirmRow = (bundleId: string) => {
    setScannedPO((prevPO) => {
      if (!prevPO) return null;

      const newBundles = [...prevPO.bundles];
      const bundleIndex = newBundles.findIndex((b) => b.id === bundleId);
      if (bundleIndex === -1) return prevPO;

      const originalBundle = newBundles[bundleIndex];

      // 1. Mark the original bundle as confirmed
      newBundles[bundleIndex] = { ...originalBundle, confirmed: true };

      // 2. Calculate difference (Planned vs Actual)
      const difference = originalBundle.plannedQty - originalBundle.actualQty;

      // 3. If there is a difference, create and add a new discrepancy bundle
      if (difference !== 0) {
        const discrepancyBundle: POBundle = {
          id: `${originalBundle.id}-DISCREPANCY`,
          style: originalBundle.style,
          color: originalBundle.color,
          size: originalBundle.size,
          plannedQty: 0,
          actualQty: Math.abs(difference),
          location: "Cutting", // This new item is designated for Cutting
          confirmed: true, // System-generated rows are always confirmed
          isDiscrepancy: true,
        };
        // Insert the new bundle right after the original one
        newBundles.splice(bundleIndex + 1, 0, discrepancyBundle);
      }

      return { ...prevPO, bundles: newBundles };
    });
  };

  const handleFinishReview = () => {
    console.log("Final PO State:", scannedPO);
    setFeedback({
      type: "success",
      message: `PO ${scannedPO?.id} has been processed.`,
    });
    setView("details");
    setTimeout(() => {
      resetToScanner();
    }, 2500);
  };

  const renderView = () => {
    switch (view) {
      case "scanner":
        return <ScannerView isScanning={isScanning} onScan={handleScan} />;
      case "review":
        if (!scannedPO) return null;
        return (
          <ReviewView
            po={scannedPO}
            onQuantityChange={handleQuantityChange}
            onConfirmRow={handleConfirmRow}
            onFinish={handleFinishReview}
          />
        );
      case "details":
        return (
          <DetailsView feedback={feedback} pageTitle="Buffer Scan In Status" />
        );
      default:
        return <ScannerView isScanning={isScanning} onScan={handleScan} />;
    }
  };

  return (
    <>
      <GlobalStyles />
      {renderView()}
    </>
  );
};

export default ScanInBufferPage;
