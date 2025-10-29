// src/pages/BufferScanPage/BufferScanPage.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  ScanLine,
  Info,
  ArrowRight,
  Warehouse,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Mock data
const decorationSteps = ["Bonding", "Heat Press", "Embroidery", "Screen Print"];
type Bundle = {
  id: string;
  po: string;
  style: string;
  color: string;
  size: string;
  status: "At Cutting" | "At Buffer" | "At Decoration";
};

const findBundle = (id: string): Bundle | null => {
  if (id.startsWith("B-")) {
    return {
      id,
      po: "PO-2024-001",
      style: "Men T-Shirt",
      color: "Black",
      size: "M",
      status: Math.random() > 0.5 ? "At Cutting" : "At Buffer",
    };
  }
  return null;
};

const BufferScanPage: React.FC = () => {
  const [scannedCode, setScannedCode] = useState("");
  const [scannedBundle, setScannedBundle] = useState<Bundle | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [scannedBundle]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const bundle = findBundle(scannedCode);
    if (bundle) {
      setScannedBundle(bundle);
    } else {
      setFeedback({
        type: "error",
        message: `Bundle with code: ${scannedCode} not found`,
      });
      setScannedBundle(null);
    }
  };

  const handleAction = (action: string) => {
    // Handle scan out or scan in logic
    setFeedback({
      type: "success",
      message: `Bundle ${scannedBundle?.id} has been recorded: ${action}`,
    });
    resetState();
  };

  const resetState = () => {
    setScannedCode("");
    setScannedBundle(null);
    setTimeout(() => setFeedback(null), 3000);
  };

  const renderActions = () => {
    if (!scannedBundle) return null;
    if (scannedBundle.status === "At Cutting") {
      // Logic for Scan In
      return (
        <div className="mt-6 text-center">
          <button
            onClick={() => handleAction("Scan In to Buffer")}
            className="bg-green-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-green-600 transition-colors text-xl"
          >
            Confirm Scan In to Buffer
          </button>
        </div>
      );
    }
    if (scannedBundle.status === "At Buffer") {
      // Logic for Scan Out
      return (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">
            Select next destination:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decorationSteps.map((step) => (
              <button
                key={step}
                onClick={() => handleAction(`Scan Out to ${step}`)}
                className="flex items-center justify-center p-4 bg-white border rounded-lg shadow hover:bg-gray-50 transition-all"
              >
                <ArrowRight className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-semibold text-gray-800">{step}</span>
              </button>
            ))}
            <button
              onClick={() => handleAction("Store in Temporary WH")}
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Buffer Scan In/Out
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <form
          onSubmit={handleScan}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <ScanLine className="w-10 h-10 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={scannedCode}
            onChange={(e) => setScannedCode(e.target.value)}
            placeholder="Scan bundle QR code..."
            className="w-full text-lg px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow"
          >
            Check
          </button>
        </form>

        {feedback && (
          <div
            className={`mt-4 p-3 rounded-lg flex items-center ${
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

        {scannedBundle && (
          <div className="mt-6 border-t pt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <Info className="w-6 h-6 mr-2 text-blue-500" /> Bundle
                Information
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700">
                <p>
                  <strong className="font-semibold">Bundle ID:</strong>{" "}
                  {scannedBundle.id}
                </p>
                <p>
                  <strong className="font-semibold">PO #:</strong>{" "}
                  {scannedBundle.po}
                </p>
                <p>
                  <strong className="font-semibold">Style:</strong>{" "}
                  {scannedBundle.style}
                </p>
                <p>
                  <strong className="font-semibold">Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                      scannedBundle.status === "At Buffer"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-blue-200 text-blue-800"
                    }`}
                  >
                    {scannedBundle.status}
                  </span>
                </p>
              </div>
            </div>
            {renderActions()}
          </div>
        )}
      </div>
    </div>
  );
};

export default BufferScanPage;
