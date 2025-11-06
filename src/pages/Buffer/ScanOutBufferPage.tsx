// src/pages/ScanOutBufferPage.tsx

import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// ============================================================================
// CODE BLOCK DÙNG CHUNG (TYPES, MOCK DATA, UI COMPONENTS)
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
type Feedback = { type: "success" | "error"; message: string };

const mockBundleAtBuffer: Bundle = {
  id: "B-67890",
  po: "PO-2024-002",
  style: "Women Hoodie",
  color: "Gray",
  size: "S",
  status: "At Buffer",
};

const ScannerView: React.FC<{ isScanning: boolean; onScan: () => void }> = ({
  isScanning,
  onScan,
}) => (
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
      size="lg"
      className="mt-10 w-64 text-xl h-14 rounded-full"
    >
      {isScanning ? (
        <>
          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
          Scanning...
        </>
      ) : (
        "Start Scan"
      )}
    </Button>
  </div>
);

const DetailsView: React.FC<{
  bundle: Bundle | null;
  feedback: Feedback | null;
  onConfirmScanIn: () => void;
  onScanOut: (destination: string) => void;
  onBack: () => void;
  pageTitle: string;
}> = ({ bundle, feedback, onConfirmScanIn, onScanOut, onBack, pageTitle }) => {
  const renderActions = () => {
    if (!bundle) return null;
    if (bundle.status === "At Cutting") {
      return (
        <div className="mt-6 text-center">
          <Button
            onClick={onConfirmScanIn}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-xl h-14"
          >
            Confirm Scan In to Buffer
          </Button>
        </div>
      );
    }
    if (bundle.status === "At Buffer") {
      return (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-center mb-4">
            Select next destination:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decorationSteps.map((step) => (
              <Button
                key={step}
                onClick={() => onScanOut(step)}
                variant="outline"
                className="justify-start p-4 h-14"
              >
                <ArrowRight className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-semibold">{step}</span>
              </Button>
            ))}
            <Button
              onClick={() => onScanOut("Temporary Warehouse")}
              variant="outline"
              className="md:col-span-2 justify-start p-4 h-14"
            >
              <Warehouse className="w-5 h-5 mr-3 text-purple-500" />
              <span className="font-semibold">
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
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>
      <Card>
        <CardContent className="p-6">
          {feedback && (
            <Alert
              className="mb-4"
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
          )}
          {bundle && (
            <div>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                  <Info className="w-6 h-6 mr-2 text-blue-500" /> Bundle
                  Information
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p>
                    <strong className="font-semibold">Bundle ID:</strong>{" "}
                    {bundle.id}
                  </p>
                  <p>
                    <strong className="font-semibold">PO #:</strong> {bundle.po}
                  </p>
                  <p>
                    <strong className="font-semibold">Style:</strong>{" "}
                    {bundle.style}
                  </p>
                  <div>
                    <strong className="font-semibold mr-2">Status:</strong>
                    <Badge
                      variant={
                        bundle.status === "At Buffer" ? "default" : "secondary"
                      }
                      className={
                        bundle.status === "At Buffer"
                          ? "bg-yellow-200 text-yellow-800"
                          : bundle.status === "At Decoration"
                          ? "bg-purple-200 text-purple-800"
                          : "bg-blue-200 text-blue-800"
                      }
                    >
                      {bundle.status}
                    </Badge>
                  </div>
                </div>
              </div>
              {renderActions()}
            </div>
          )}
          {!bundle && !feedback && (
            <p className="text-muted-foreground text-center p-8">
              Waiting for scan...
            </p>
          )}
        </CardContent>
      </Card>
      <Button onClick={onBack} variant="link" className="mt-6">
        &larr; Back to Scanner
      </Button>
    </div>
  );
};

const GlobalStyles = () => (
  <style>{`@keyframes scan {0% { transform: translateY(0); } 100% { transform: translateY(calc(20rem - 0.375rem)); }} .animate-scan { animation: scan 1.5s ease-in-out infinite alternate; }`}</style>
);

// ============================================================================
// COMPONENT CHÍNH CỦA TRANG: ScanOutBufferPage
// ============================================================================
const ScanOutBufferPage: React.FC = () => {
  const [view, setView] = useState<"scanner" | "details">("scanner");
  const [isScanning, setIsScanning] = useState(false);
  const [currentBundle, setCurrentBundle] = useState<Bundle | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    setFeedback(null);
    setCurrentBundle(null);
    setTimeout(() => {
      setCurrentBundle({ ...mockBundleAtBuffer });
      setIsScanning(false);
      setView("details");
    }, 1500);
  };

  const handleScanOut = (destination: string) => {
    if (!currentBundle) return;
    const updatedBundle: Bundle = { ...currentBundle, status: "At Decoration" };
    setCurrentBundle(updatedBundle);
    setFeedback({
      type: "success",
      message: `Success! Bundle ${currentBundle.id} has been sent to: ${destination}.`,
    });
  };

  const handleBackToScanner = () => {
    setView("scanner");
    setFeedback(null);
    setCurrentBundle(null);
  };

  return (
    <>
      <GlobalStyles />
      {view === "scanner" ? (
        <ScannerView isScanning={isScanning} onScan={handleScan} />
      ) : (
        <DetailsView
          bundle={currentBundle}
          feedback={feedback}
          onConfirmScanIn={() => {}}
          onScanOut={handleScanOut}
          onBack={handleBackToScanner}
          pageTitle="Buffer Scan Out"
        />
      )}
    </>
  );
};

export default ScanOutBufferPage;
