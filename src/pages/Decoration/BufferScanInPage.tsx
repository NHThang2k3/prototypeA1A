// src/pages/BufferScanInPage/BufferScanInPage.tsx

import React, { useState, useEffect, useRef } from "react";
import { QrCode, CheckCircle, XCircle } from "lucide-react";

type ScanLog = {
  id: string;
  style: string;
  qty: number;
  time: string;
  status: "success" | "error";
};

// ADD: Định nghĩa một type cho đối tượng bundle để thay thế cho 'any'
type Bundle = {
  id: string;
  po: string;
  style: string;
  color: string;
  size: string;
  qty: number;
};

const mockBundleLookup = (bundleId: string) => {
  if (bundleId.startsWith("BNDL-")) {
    return {
      id: bundleId,
      po: "PO12345",
      style: "STYLE-A01",
      color: "Black",
      size: "M",
      qty: 100,
    };
  }
  return null;
};

const BufferScanInPage = () => {
  const [scanInput, setScanInput] = useState("");
  // FIX 1: Thay thế 'any' bằng type 'Bundle | null' để đảm bảo an toàn kiểu dữ liệu
  const [scannedBundle, setScannedBundle] = useState<Bundle | null>(null);
  const [scanStatus, setScanStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [scanLog, setScanLog] = useState<ScanLog[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const bundle = mockBundleLookup(scanInput);
    const time = new Date().toLocaleTimeString();

    if (bundle) {
      setScannedBundle(bundle);
      setScanStatus("success");

      // FIX 2: Tạo một biến có kiểu ScanLog để TypeScript hiểu đúng kiểu của thuộc tính 'status'
      const newLog: ScanLog = {
        id: scanInput,
        style: bundle.style,
        qty: bundle.qty,
        time,
        status: "success",
      };
      setScanLog((prev) => [newLog, ...prev].slice(0, 5));
    } else {
      setScannedBundle(null);
      setScanStatus("error");

      // FIX 3: Tương tự, tạo một biến có kiểu ScanLog cho trường hợp lỗi
      const newLog: ScanLog = {
        id: scanInput,
        style: "N/A",
        qty: 0,
        time,
        status: "error",
      };
      setScanLog((prev) => [newLog, ...prev].slice(0, 5));
    }
    setScanInput("");
    setTimeout(() => setScanStatus("idle"), 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Left: Scan Interface */}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Scan-In Bundle
        </h1>
        <p className="text-gray-500 mb-8">
          Scan the QR code on the fabric bundle to record its entry.
        </p>

        <form onSubmit={handleScan}>
          <label
            htmlFor="scan-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bundle QR Code
          </label>
          <div className="relative">
            <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              ref={inputRef}
              id="scan-input"
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="Waiting for scan..."
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </form>

        {/* Scan Result */}
        <div className="mt-6 min-h-[180px]">
          {scanStatus === "success" && scannedBundle && (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-r-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={32} />
                <div>
                  <h3 className="font-bold text-lg">Scan Successful!</h3>
                  <p className="text-sm">Bundle {scannedBundle.id} recorded.</p>
                </div>
              </div>
            </div>
          )}
          {scanStatus === "error" && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-lg">
              <div className="flex items-center gap-3">
                <XCircle size={32} />
                <div>
                  <h3 className="font-bold text-lg">Scan Failed!</h3>
                  <p className="text-sm">Bundle not found. Please try again.</p>
                </div>
              </div>
            </div>
          )}
          {scanStatus === "idle" && scannedBundle && (
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                Last Scanned Bundle
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <span>PO Number:</span>{" "}
                <span className="font-medium text-gray-900">
                  {scannedBundle.po}
                </span>
                <span>Style:</span>{" "}
                <span className="font-medium text-gray-900">
                  {scannedBundle.style}
                </span>
                <span>Color/Size:</span>{" "}
                <span className="font-medium text-gray-900">
                  {scannedBundle.color} / {scannedBundle.size}
                </span>
                <span>Quantity:</span>{" "}
                <span className="font-medium text-gray-900">
                  {scannedBundle.qty} pcs
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Recent Scans */}
      <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Recent Scan-In Log
        </h2>
        <div className="space-y-3">
          {scanLog.length === 0 && (
            <p className="text-gray-500">No scans recorded yet.</p>
          )}
          {scanLog.map((log, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg flex items-center justify-between ${
                log.status === "success" ? "bg-white" : "bg-red-100"
              }`}
            >
              <div className="flex items-center gap-3">
                {log.status === "success" ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
                <div>
                  <p className="font-semibold text-gray-800">{log.id}</p>
                  <p className="text-xs text-gray-500">
                    {log.style} - {log.qty} pcs
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500">{log.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BufferScanInPage;
