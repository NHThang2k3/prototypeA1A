// src/pages/SupermarketScanPage/SupermarketScanPage.tsx

import React, { useState } from "react";
import {
  Check,
  QrCode,
  ClipboardList,
  AlertTriangle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
      <div className="p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">
          Select a Kanban Request to Process
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRequests.map((req) => (
            <Card
              key={req.poId}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleSelectRequest(req)}
            >
              <CardHeader>
                <CardTitle className="text-blue-600">{req.poId}</CardTitle>
                <CardDescription>Destination: {req.sewingLine}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Total Bundles:{" "}
                  <span className="font-semibold">{req.totalBundles}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <Button
        variant="link"
        onClick={() => setSelectedRequest(null)}
        className="mb-4 p-0 h-auto"
      >
        &larr; Back to request selection
      </Button>
      <h1 className="text-3xl font-bold mb-2">
        Supermarket Dispatch for PO: {selectedRequest.poId}
      </h1>
      <p className="text-muted-foreground mb-6">
        Destination: {selectedRequest.sewingLine}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" /> Bundle Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 pr-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {bundleChecklist.map((item) => (
                  <Badge
                    key={item.id}
                    variant={item.scanned ? "default" : "secondary"}
                    className={`p-2 flex items-center justify-center transition-colors h-10 ${
                      item.scanned
                        ? "bg-green-600 hover:bg-green-600"
                        : "bg-secondary"
                    }`}
                  >
                    {item.scanned && (
                      <Check className="w-4 h-4 text-white mr-2" />
                    )}
                    <span className="font-mono text-sm">{item.id}</span>
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="mr-2 h-5 w-5" /> Scan Bundle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleScan} className="flex items-center gap-2">
                <Input
                  type="text"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  placeholder="Bundle code..."
                  className="w-full"
                />
                <Button type="submit" size="icon">
                  <Check className="w-5 h-5" />
                </Button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold">
                  {scannedCount} / {selectedRequest.totalBundles}
                </p>
                <p className="text-sm text-muted-foreground">Scanned</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-3">
              <Button
                onClick={handleRecordMissing}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2 py-6 bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-500"
              >
                <AlertTriangle className="w-5 h-5" /> Record Missing
              </Button>
              <Button
                onClick={handleComplete}
                className="w-full flex items-center justify-center gap-2 py-6 bg-green-500 hover:bg-green-600"
                disabled={scannedCount !== selectedRequest.totalBundles}
              >
                <Send className="w-5 h-5" /> Complete Dispatch
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupermarketScanPage;
