// src/pages/ScanInBufferPage/ScanInBufferPage.tsx

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  QrCode,
  Loader2,
  Edit,
  AlertTriangle,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomTable } from "@/components/ui/custom-table";
import { Badge } from "@/components/ui/badge";

// ============================================================================
// COMMON CODE BLOCK (TYPES, MOCK DATA, UI COMPONENTS)
// ============================================================================

type POBundle = {
  id: string;
  style: string;
  color: string;
  size: string;
  plannedQty: number;
  actualQty: number;
  location: string;
  confirmed: boolean;
  isDiscrepancy?: boolean;
};

type PurchaseOrder = { id: string; bundles: POBundle[] };
type Feedback = { type: "success" | "error"; message: string };

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
    },
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
    <Button
      onClick={onScan}
      disabled={isScanning}
      size="lg"
      className="mt-10 w-64 text-xl h-14 rounded-full"
    >
      {isScanning ? (
        <>
          <Loader2 className="w-6 h-6 mr-3 animate-spin" /> Scanning...
        </>
      ) : (
        "Start Scan"
      )}
    </Button>
  </div>
);

const ReviewView: React.FC<{
  po: PurchaseOrder;
  onQuantityChange: (bundleId: string, newQty: number) => void;
  onConfirmRow: (bundleId: string) => void;
  onFinish: () => void;
}> = ({ po, onQuantityChange, onConfirmRow, onFinish }) => {
  const allConfirmed = po.bundles.every((b) => b.confirmed || b.isDiscrepancy);

  const columns: ColumnDef<POBundle>[] = [
    { accessorKey: "id", header: "Bundle ID" },
    {
      accessorKey: "style",
      header: "Style",
      cell: ({ row }) =>
        `${row.original.style}, ${row.original.color}, ${row.original.size}`,
    },
    {
      accessorKey: "plannedQty",
      header: "Planned Qty",
      cell: ({ row }) => (
        <div className="text-center">{row.original.plannedQty}</div>
      ),
    },
    {
      accessorKey: "actualQty",
      header: "Actual Qty",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.actualQty}
          onChange={(e) =>
            onQuantityChange(row.original.id, parseInt(e.target.value) || 0)
          }
          disabled={row.original.confirmed}
          className="w-24 text-center mx-auto"
        />
      ),
    },
    {
      header: "Difference",
      cell: ({ row }) => {
        const bundle = row.original;
        const diff = bundle.isDiscrepancy
          ? bundle.actualQty
          : bundle.actualQty - bundle.plannedQty;
        const colorClass =
          diff === 0 ? "" : diff > 0 ? "text-green-600" : "text-red-600";
        return (
          <div className={`text-center font-bold ${colorClass}`}>
            {diff > 0 && !bundle.isDiscrepancy ? `+${diff}` : diff}
            {bundle.isDiscrepancy && (
              <AlertTriangle className="inline-block w-4 h-4 ml-1 text-orange-500" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        const bundle = row.original;
        return (
          <Badge
            variant={bundle.location === "Cutting" ? "destructive" : "default"}
          >
            {bundle.location}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const bundle = row.original;
        if (bundle.isDiscrepancy) {
          return (
            <div className="text-center text-sm italic text-muted-foreground">
              Generated
            </div>
          );
        }
        return (
          <div className="text-center">
            {bundle.confirmed ? (
              <span className="flex items-center justify-center text-green-600 font-semibold">
                <CheckCircle className="w-5 h-5 mr-1" /> Confirmed
              </span>
            ) : (
              <Button
                onClick={() => onConfirmRow(bundle.id)}
                size="sm"
                variant="default"
              >
                Confirm Row
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Review Scanned Items</h1>
      <p className="text-lg text-muted-foreground mb-6 font-semibold">
        Purchase Order: {po.id}
      </p>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <Alert className="mb-6">
          <Edit className="h-4 w-4" />
          <AlertTitle>Instructions</AlertTitle>
          <AlertDescription>
            Edit 'Actual Qty' then press 'Confirm Row' for each item.
            Discrepancies will create a new item to be sent back to 'Cutting'.
          </AlertDescription>
        </Alert>

        <CustomTable
          columns={columns}
          data={po.bundles}
          showCheckbox={false}
          showColumnVisibility={false}
        />
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <Button
          onClick={onFinish}
          disabled={!allConfirmed}
          size="lg"
          className="w-72 bg-green-600 hover:bg-green-700"
        >
          {allConfirmed
            ? "Finish & Return to Scanner"
            : "Confirm All Rows to Finish"}
        </Button>
      </div>
    </div>
  );
};

const DetailsView: React.FC<{
  feedback: Feedback | null;
  pageTitle: string;
}> = ({ feedback, pageTitle }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="max-w-md w-full">
      <h1 className="text-3xl font-bold text-center mb-6">{pageTitle}</h1>
      <div className="bg-white p-6 rounded-xl shadow-md">
        {feedback ? (
          <Alert
            variant={feedback.type === "success" ? "default" : "destructive"}
          >
            {feedback.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {feedback.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        ) : (
          <p className="text-muted-foreground text-center p-8">
            Waiting for action...
          </p>
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
      newBundles[bundleIndex] = { ...originalBundle, confirmed: true };
      const difference = originalBundle.plannedQty - originalBundle.actualQty;
      if (difference !== 0) {
        const discrepancyBundle: POBundle = {
          id: `${originalBundle.id}-DISCREPANCY`,
          style: originalBundle.style,
          color: originalBundle.color,
          size: originalBundle.size,
          plannedQty: 0,
          actualQty: Math.abs(difference),
          location: "Cutting",
          confirmed: true,
          isDiscrepancy: true,
        };
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
