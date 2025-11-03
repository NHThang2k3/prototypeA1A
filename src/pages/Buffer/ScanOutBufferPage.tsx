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

// ============================================================================
// CODE BLOCK DÙNG CHUNG (TYPES, MOCK DATA, UI COMPONENTS)
// Khối này được sao chép vào mỗi file nghiệp vụ để đảm bảo tính độc lập.
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
    <button
      onClick={onScan}
      disabled={isScanning}
      className="mt-10 flex items-center justify-center w-64 bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all text-xl disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {isScanning ? (
        <>
          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
          Scanning...
        </>
      ) : (
        "Start Scan"
      )}
    </button>
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
          <button
            onClick={onConfirmScanIn}
            className="bg-green-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-green-600 transition-colors text-xl"
          >
            Confirm Scan In to Buffer
          </button>
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
              <button
                key={step}
                onClick={() => onScanOut(step)}
                className="flex items-center justify-center p-4 bg-white border rounded-lg shadow hover:bg-gray-50 transition-all"
              >
                <ArrowRight className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-semibold text-gray-800">{step}</span>
              </button>
            ))}
            <button
              onClick={() => onScanOut("Temporary Warehouse")}
              className="md:col-span-2 flex items-center justify-center p-4 bg-white border rounded-lg shadow hover:bg-gray-50 transition-all"
            >
              <Warehouse className="w-5 h-5 mr-3 text-purple-500" />
              <span className="font-semibold text-gray-800">
                Store in Temporary Warehouse
              </span>
            </button>
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="max-w-4xl mx-auto p-4 pt-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{pageTitle}</h1>
      <div className="bg-white p-6 rounded-xl shadow-md">
        {feedback && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-center ${
              feedback.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 mr-2" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
        {bundle && (
          <div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <Info className="w-6 h-6 mr-2 text-blue-500" /> Bundle
                Information
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700">
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
                <p>
                  <strong className="font-semibold">Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                      bundle.status === "At Buffer"
                        ? "bg-yellow-200 text-yellow-800"
                        : bundle.status === "At Decoration"
                        ? "bg-purple-200 text-purple-800"
                        : "bg-blue-200 text-blue-800"
                    }`}
                  >
                    {bundle.status}
                  </span>
                </p>
              </div>
            </div>
            {renderActions()}
          </div>
        )}
        {!bundle && !feedback && (
          <p className="text-gray-500 text-center p-8">Waiting for scan...</p>
        )}
      </div>
      <button onClick={onBack} className="mt-6 text-blue-600 hover:underline">
        &larr; Back to Scanner
      </button>
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
  // Đã xóa scanSimulationCounter vì không cần mô phỏng lỗi nữa

  const handleScan = () => {
    setIsScanning(true);
    setFeedback(null);
    setCurrentBundle(null);

    // Luôn mô phỏng quét thành công bundle hợp lệ để scan out
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
          onConfirmScanIn={() => {}} // Không dùng trong trang này
          onScanOut={handleScanOut}
          onBack={handleBackToScanner}
          pageTitle="Buffer Scan Out"
        />
      )}
    </>
  );
};

export default ScanOutBufferPage;
