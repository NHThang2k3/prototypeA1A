import React, { useState } from "react";
import {
  Check,
  QrCode,
  ClipboardList,
  AlertTriangle,
  Send,
} from "lucide-react";

type KanbanRequest = { poId: string; sewingLine: string; totalBundles: number };
type BundleChecklistItem = { id: string; scanned: boolean };

// Mock data with English values
const mockRequests: KanbanRequest[] = [
  { poId: "PO-001", sewingLine: "Sewing Line 05", totalBundles: 12 },
  { poId: "PO-003", sewingLine: "Sewing Line 02", totalBundles: 8 },
];

const getBundlesForPO = (poId: string): BundleChecklistItem[] => {
  const count = mockRequests.find((r) => r.poId === poId)?.totalBundles || 0;
  return Array.from({ length: count }, (_, i) => ({
    id: `${poId}-B${(i + 1).toString().padStart(3, "0")}`,
    scanned: false,
  }));
};

const SupermarketScanPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<KanbanRequest | null>(
    null
  );
  const [bundleChecklist, setBundleChecklist] = useState<BundleChecklistItem[]>(
    []
  );
  const [scannedCode, setScannedCode] = useState("");

  const handleSelectRequest = (req: KanbanRequest) => {
    setSelectedRequest(req);
    setBundleChecklist(getBundlesForPO(req.poId));
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedList = bundleChecklist.map((item) =>
      item.id === scannedCode ? { ...item, scanned: true } : item
    );
    setBundleChecklist(updatedList);
    setScannedCode("");
  };

  const handleRecordMissing = () => {
    alert(
      'The "Record Missing" feature will open a modal to select the missing bundles and provide a reason.'
    );
  };

  const handleComplete = () => {
    alert(`Dispatch complete for PO ${selectedRequest?.poId}!`);
    setSelectedRequest(null);
    setBundleChecklist([]);
  };

  const scannedCount = bundleChecklist.filter((b) => b.scanned).length;

  if (!selectedRequest) {
    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Select a Kanban Request to Process
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRequests.map((req) => (
            <div
              key={req.poId}
              className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleSelectRequest(req)}
            >
              <h2 className="font-bold text-xl text-blue-600">{req.poId}</h2>
              <p className="text-gray-600">Sewing Line: {req.sewingLine}</p>
              <p className="text-gray-600 mt-2">
                Total Bundles:{" "}
                <span className="font-semibold">{req.totalBundles}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        onClick={() => setSelectedRequest(null)}
        className="mb-4 text-blue-600 hover:underline"
      >
        &larr; Back to request selection
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Supermarket Dispatch for PO: {selectedRequest.poId}
      </h1>
      <p className="text-gray-600 mb-6">
        Destination: {selectedRequest.sewingLine}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold flex items-center mb-4">
            <ClipboardList className="mr-2" /> Bundle Checklist
          </h2>
          <div className="max-h-96 overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {bundleChecklist.map((item) => (
              <div
                key={item.id}
                className={`p-2 border rounded-md flex items-center transition-colors ${
                  item.scanned ? "bg-green-100 border-green-300" : "bg-gray-50"
                }`}
              >
                {item.scanned && (
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                )}
                <span
                  className={`font-mono text-sm ${
                    item.scanned ? "text-green-800" : "text-gray-700"
                  }`}
                >
                  {item.id}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold flex items-center mb-4">
              <QrCode className="mr-2" /> Scan Bundle
            </h2>
            <form onSubmit={handleScan} className="flex items-center gap-2">
              <input
                type="text"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                placeholder="Bundle code..."
                className="w-full px-3 py-2 border rounded-lg"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
              >
                <Check className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {scannedCount} / {selectedRequest.totalBundles}
              </p>
              <p className="text-sm text-gray-500">Scanned</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md space-y-3">
            <button
              onClick={handleRecordMissing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-yellow-400 text-yellow-900 font-semibold rounded-lg hover:bg-yellow-500 transition"
            >
              <AlertTriangle className="w-5 h-5" /> Record Missing
            </button>
            <button
              onClick={handleComplete}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition disabled:bg-gray-300"
              disabled={scannedCount !== selectedRequest.totalBundles}
            >
              <Send className="w-5 h-5" /> Complete Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupermarketScanPage;
