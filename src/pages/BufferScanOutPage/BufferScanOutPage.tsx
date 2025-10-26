// src/pages/BufferScanOutPage/BufferScanOutPage.tsx

import React, { useState, useEffect, useRef } from "react";
import { QrCode, AlertTriangle } from "lucide-react";

// ADD: Định nghĩa một type cho đối tượng bundle để thay thế cho 'any'
type Bundle = {
  id: string;
  po: string;
  style: string;
  qty: number;
};

// Thêm kiểu dữ liệu cho mock data để đảm bảo tính nhất quán
const mockBundleData: Bundle = {
  id: "BNDL-001",
  po: "PO12345",
  style: "STYLE-A01",
  qty: 100,
};

const defectTypes = [
  "Wrong Color",
  "Stain",
  "Broken Thread",
  "Missed Stitches",
  "Incorrect Placement",
  "Other",
];

const BufferScanOutPage = () => {
  const [scanInput, setScanInput] = useState("");
  // FIX: Thay thế 'any' bằng type 'Bundle | null' để đảm bảo an toàn kiểu dữ liệu
  const [scannedBundle, setScannedBundle] = useState<Bundle | null>(null);
  const [goodQty, setGoodQty] = useState<number | string>("");
  const [defectQty, setDefectQty] = useState<number | string>("");
  const [selectedDefects, setSelectedDefects] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Chỉ focus khi chưa có bundle nào được scan
    if (!scannedBundle) {
      inputRef.current?.focus();
    }
  }, [scannedBundle]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (scanInput.toUpperCase() === "BNDL-001") {
      setScannedBundle(mockBundleData);
      setGoodQty(mockBundleData.qty);
      setDefectQty(0);
    } else {
      alert("Bundle not found!");
    }
    setScanInput("");
  };

  const handleConfirm = () => {
    // Thêm kiểm tra null cho scannedBundle để TypeScript yên tâm
    if (!scannedBundle) return;

    const total = Number(goodQty) + Number(defectQty);
    if (total !== scannedBundle.qty) {
      alert(
        `Total quantity (${total}) must match bundle quantity (${scannedBundle.qty})!`
      );
      return;
    }
    if (Number(defectQty) > 0 && selectedDefects.length === 0) {
      alert("Please select at least one defect type.");
      return;
    }
    // Logic to submit data
    console.log({
      bundleId: scannedBundle.id,
      goodQty,
      defectQty,
      defects: selectedDefects,
    });
    alert("Scan-out successful!");
    // Reset state
    setScannedBundle(null);
    setGoodQty("");
    setDefectQty("");
    setSelectedDefects([]);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Scan-Out Bundle</h1>
      <p className="text-gray-500 mb-8">
        Scan a completed bundle and record the output quantities.
      </p>

      {!scannedBundle ? (
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
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-bold text-blue-800">{scannedBundle.id}</p>
            <p className="text-sm text-blue-700">
              {scannedBundle.style} - Total Quantity: {scannedBundle.qty}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="good-qty"
                className="block text-sm font-medium text-gray-700"
              >
                Good Quantity
              </label>
              <input
                type="number"
                id="good-qty"
                value={goodQty}
                onChange={(e) => setGoodQty(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="defect-qty"
                className="block text-sm font-medium text-gray-700"
              >
                Defect Quantity
              </label>
              <input
                type="number"
                id="defect-qty"
                value={defectQty}
                onChange={(e) => setDefectQty(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {Number(goodQty) + Number(defectQty) !== scannedBundle.qty && (
            <div className="flex items-center gap-2 p-3 text-sm text-yellow-800 bg-yellow-50 rounded-lg">
              <AlertTriangle size={16} />
              Total quantity must equal {scannedBundle.qty}.
            </div>
          )}

          {Number(defectQty) > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">
                Defect Reason(s)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {defectTypes.map((defect) => (
                  <button
                    key={defect}
                    onClick={() =>
                      setSelectedDefects((prev) =>
                        prev.includes(defect)
                          ? prev.filter((d) => d !== defect)
                          : [...prev, defect]
                      )
                    }
                    className={`p-2 text-sm text-center rounded-md border ${
                      selectedDefects.includes(defect)
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {defect}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                setScannedBundle(null);
                setGoodQty("");
                setDefectQty("");
                setSelectedDefects([]);
              }}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Confirm & Scan Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BufferScanOutPage;
