// src/pages/BufferScanInPage/BufferScanInPage.tsx

import React, { useState, useEffect, useRef } from "react";
import { QrCode, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ScanLog = {
  id: string;
  style: string;
  qty: number;
  time: string;
  status: "success" | "error";
};

type Bundle = {
  id: string;
  po: string;
  style: string;
  color: string;
  size: string;
  qty: number;
};

const mockBundleLookup = (bundleId: string): Bundle | null => {
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
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Decoration Buffer Scan-In</CardTitle>
          <CardDescription>
            Scan the QR code on the fabric bundle to record its entry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleScan} className="mb-6">
            <Label htmlFor="scan-input">Bundle QR Code</Label>
            <div className="relative mt-1">
              <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
              <Input
                ref={inputRef}
                id="scan-input"
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Waiting for scan..."
                className="pl-14 pr-4 py-7 text-lg"
              />
            </div>
          </form>

          <div className="min-h-[180px]">
            {scanStatus === "success" && scannedBundle && (
              <Alert>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="font-bold text-lg text-green-800">
                  Scan Successful!
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Bundle {scannedBundle.id} recorded.
                </AlertDescription>
              </Alert>
            )}
            {scanStatus === "error" && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle className="font-bold text-lg">
                  Scan Failed!
                </AlertTitle>
                <AlertDescription>
                  Bundle not found. Please try again.
                </AlertDescription>
              </Alert>
            )}
            {scanStatus === "idle" && scannedBundle && (
              <Card className="bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-lg">Last Scanned Bundle</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span>PO Number:</span>
                  <span className="font-medium">{scannedBundle.po}</span>
                  <span>Style:</span>
                  <span className="font-medium">{scannedBundle.style}</span>
                  <span>Color/Size:</span>
                  <span className="font-medium">
                    {scannedBundle.color} / {scannedBundle.size}
                  </span>
                  <span>Quantity:</span>
                  <span className="font-medium">{scannedBundle.qty} pcs</span>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Recent Scan-In Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scanLog.length === 0 && (
              <p className="text-muted-foreground">No scans recorded yet.</p>
            )}
            {scanLog.map((log, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  log.status === "success"
                    ? "bg-background border"
                    : "bg-red-100 dark:bg-red-900/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  {log.status === "success" ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <XCircle className="text-red-500" />
                  )}
                  <div>
                    <p className="font-semibold">{log.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.style} - {log.qty} pcs
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{log.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BufferScanInPage;
