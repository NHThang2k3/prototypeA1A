import React, { useState } from "react";
import {
  Info,
  ArrowRight,
  Warehouse,
  CheckCircle,
  XCircle,
  QrCode,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ============================================================================
// 1. MOCK DATA & TYPES
// ============================================================================

const decorationSteps = ["Bonding", "Heat Press", "Embroidery", "Pad Print"];

type Bundle = {
  id: string;
  po: string;
  style: string;
  color: string;
  size: string;
  status: "At Cutting" | "At Buffer" | "At Decoration";
};

const mockBundleAtCutting: Bundle = {
  id: "B-12345",
  po: "PO-2024-001",
  style: "Men T-Shirt",
  color: "Black",
  size: "M",
  status: "At Cutting",
};

const mockBundleAtBuffer: Bundle = {
  id: "B-67890",
  po: "PO-2024-002",
  style: "Women Hoodie",
  color: "Gray",
  size: "S",
  status: "At Buffer",
};

// ============================================================================
// 2. DUMB UI COMPONENTS
// ============================================================================

const ScannerView: React.FC<{
  isScanning: boolean;
  onScan: () => void;
}> = ({ isScanning, onScan }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
    <h1 className="text-4xl font-bold mb-4">Scan Bundle QR Code</h1>
    <p className="text-gray-400 mb-8 text-lg">
      Position the QR code inside the frame
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
      className="mt-10 w-64 text-xl"
      size="lg"
    >
      {isScanning ? (
        <>
          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
          Scanning...
        </>
      ) : (
        "Scan"
      )}
    </Button>
  </div>
);

type Feedback = { type: "success" | "error"; message: string };

const DetailsView: React.FC<{
  bundle: Bundle | null;
  feedback: Feedback | null;
  onConfirmScanIn: () => void;
  onScanOut: (destination: string) => void;
  onBack: () => void;
}> = ({ bundle, feedback, onConfirmScanIn, onScanOut, onBack }) => {
  const renderActions = () => {
    if (!bundle) return null;

    if (bundle.status === "At Cutting") {
      return (
        <div className="mt-6 text-center">
          <Button
            onClick={onConfirmScanIn}
            className="bg-green-500 hover:bg-green-600 text-white text-xl"
            size="lg"
          >
            Confirm Scan In to Buffer
          </Button>
        </div>
      );
    }
    if (bundle.status === "At Buffer") {
      return (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">
            Select next destination:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decorationSteps.map((step) => (
              <Button
                key={step}
                onClick={() => onScanOut(step)}
                variant="outline"
                className="flex items-center justify-center p-4 h-auto"
              >
                <ArrowRight className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-semibold text-gray-800">{step}</span>
              </Button>
            ))}
            <Button
              onClick={() => onScanOut("Temporary Warehouse")}
              variant="outline"
              className="md:col-span-2 flex items-center justify-center p-4 h-auto"
            >
              <Warehouse className="w-5 h-5 mr-3 text-purple-500" />
              <span className="font-semibold text-gray-800">
                Store in Temporary Warehouse
              </span>
            </Button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pt-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Buffer Scan In/Out
      </h1>
      <Card>
        <CardContent className="pt-6">
          {feedback && (
            <Alert
              variant={feedback.type === "error" ? "destructive" : "default"}
              className="mb-4"
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
          )}

          {bundle && (
            <div>
              <Card className="bg-muted">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Info className="w-6 h-6 mr-2 text-blue-500" /> Bundle
                    Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-foreground/80">
                    <p>
                      <strong className="font-semibold text-foreground">
                        Bundle ID:
                      </strong>{" "}
                      {bundle.id}
                    </p>
                    <p>
                      <strong className="font-semibold text-foreground">
                        PO #:
                      </strong>{" "}
                      {bundle.po}
                    </p>
                    <p>
                      <strong className="font-semibold text-foreground">
                        Style:
                      </strong>{" "}
                      {bundle.style}
                    </p>
                    <div>
                      <strong className="font-semibold text-foreground">
                        Status:
                      </strong>{" "}
                      <Badge
                        variant={
                          bundle.status === "At Buffer"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {bundle.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {renderActions()}
            </div>
          )}

          {!bundle && !feedback && (
            <p className="text-gray-500 text-center p-8">Waiting for scan...</p>
          )}
        </CardContent>
      </Card>
      <Button onClick={onBack} variant="link" className="mt-4 px-0">
        &larr; Back to Scanner
      </Button>
    </div>
  );
};

const GlobalStyles = () => (
  <style>{`
    @keyframes scan {
      0% { transform: translateY(0); }
      100% { transform: translateY(calc(20rem - 0.375rem)); }
    }
    .animate-scan {
      animation: scan 1.5s ease-in-out infinite alternate;
    }
  `}</style>
);

// ============================================================================
// 3. MAIN STATEFUL COMPONENT
// ============================================================================

const BufferScanPage: React.FC = () => {
  const [view, setView] = useState<"scanner" | "details">("scanner");
  const [isScanning, setIsScanning] = useState(false);
  const [currentBundle, setCurrentBundle] = useState<Bundle | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleScan = () => {
    const code = window.prompt(
      "SIMULATE SCAN: Enter Bundle ID (e.g., B-12345, B-67890, or anything else for an error)"
    );
    if (!code) return;

    setIsScanning(true);
    setFeedback(null);

    setTimeout(() => {
      let foundBundle: Bundle | null = null;
      if (code === mockBundleAtCutting.id) {
        foundBundle = { ...mockBundleAtCutting };
      } else if (code === mockBundleAtBuffer.id) {
        foundBundle = { ...mockBundleAtBuffer };
      }

      if (foundBundle) {
        setCurrentBundle(foundBundle);
        setFeedback(null);
      } else {
        setCurrentBundle(null);
        setFeedback({
          type: "error",
          message: `Error! Bundle with code: ${code} not found`,
        });
      }

      setIsScanning(false);
      setView("details");
    }, 1500);
  };

  const handleConfirmScanIn = () => {
    if (!currentBundle) return;
    const updatedBundle: Bundle = { ...currentBundle, status: "At Buffer" };
    setCurrentBundle(updatedBundle);
    setFeedback({
      type: "success",
      message: `Success! Bundle ${currentBundle.id} has been recorded: Scan In to Buffer`,
    });
  };

  const handleScanOut = (destination: string) => {
    if (!currentBundle) return;
    const updatedBundle: Bundle = { ...currentBundle, status: "At Decoration" };
    setCurrentBundle(updatedBundle);
    setFeedback({
      type: "success",
      message: `Success! Bundle ${currentBundle.id} has been sent to: ${destination}`,
    });
  };

  const handleBackToScanner = () => {
    setView("scanner");
    setCurrentBundle(null);
    setFeedback(null);
  };

  const renderCurrentView = () => {
    if (view === "scanner") {
      return <ScannerView isScanning={isScanning} onScan={handleScan} />;
    }
    return (
      <DetailsView
        bundle={currentBundle}
        feedback={feedback}
        onConfirmScanIn={handleConfirmScanIn}
        onScanOut={handleScanOut}
        onBack={handleBackToScanner}
      />
    );
  };

  return (
    <>
      <GlobalStyles />
      {renderCurrentView()}
    </>
  );
};

export default BufferScanPage;
