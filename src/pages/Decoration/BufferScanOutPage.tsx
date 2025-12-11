// src/pages/BufferScanOutPage/BufferScanOutPage.tsx

import React, { useState, useEffect, useRef } from "react";
import { QrCode, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Giả lập dữ liệu QC cho các barcode
const mockQCData: Record<string, { qcStatus: "pass" | "fail"; reason?: string }> = {
  "QC-PASS-001": { qcStatus: "pass" },
  "QC-PASS-002": { qcStatus: "pass" },
  "QC-FAIL-001": { qcStatus: "fail", reason: "Wrong Color" },
  "QC-FAIL-002": { qcStatus: "fail", reason: "Stain Detected" },
  "QC-FAIL-003": { qcStatus: "fail", reason: "Broken Thread" },
  "QC-FAIL-004": { qcStatus: "fail", reason: "Missed Stitches" },
  "QC-FAIL-005": { qcStatus: "fail", reason: "Incorrect Placement" },
};

type ScanResult = {
  barcode: string;
  qcStatus: "pass" | "fail";
  reason?: string;
  timestamp: Date;
};

const BufferScanOutPage = () => {
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto focus input khi component mount hoặc sau khi scan
    inputRef.current?.focus();
  }, [scanResult]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scanInput.trim()) {
      return;
    }

    processBarcodeScan(scanInput.toUpperCase());
    setScanInput("");
  };

  const processBarcodeScan = (barcode: string) => {
    // Kiểm tra barcode trong mock data
    const qcData = mockQCData[barcode];
    
    if (qcData) {
      const result: ScanResult = {
        barcode: barcode,
        qcStatus: qcData.qcStatus,
        reason: qcData.reason,
        timestamp: new Date(),
      };
      
      setScanResult(result);
      setScanHistory(prev => [result, ...prev].slice(0, 10)); // Giữ 10 kết quả gần nhất
    } else {
      // Barcode không tồn tại trong hệ thống
      const result: ScanResult = {
        barcode: barcode,
        qcStatus: "fail",
        reason: "Barcode not found in system",
        timestamp: new Date(),
      };
      setScanResult(result);
      setScanHistory(prev => [result, ...prev].slice(0, 10));
    }
  };

  const handleNewScan = () => {
    setScanResult(null);
    setScanInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Scan Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Decoration Buffer Scan-Out</CardTitle>
          <CardDescription>
            Scan barcode to check QC status. Use "QC-PASS-XXX" for pass or "QC-FAIL-XXX" for fail simulation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scan Input Form */}
          {!scanResult ? (
            <form onSubmit={handleScan} className="space-y-4">
              <div>
                <Label htmlFor="scan-input" className="text-lg mb-2">
                  Scan Barcode
                </Label>
                <div className="relative">
                  <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    id="scan-input"
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="Waiting for scan..."
                    className="pl-14 pr-4 py-8 text-xl font-mono"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Quick Test Buttons */}
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-3">Quick Test:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => processBarcodeScan("QC-PASS-001")}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    QC Pass
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => processBarcodeScan("QC-FAIL-001")}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    QC Fail
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            /* Scan Result Display */
            <div className="space-y-6">
              {scanResult.qcStatus === "pass" ? (
                /* QC Pass Alert */
                <Alert className="bg-green-50 border-green-300">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <AlertTitle className="text-2xl font-bold text-green-800">
                    QC Pass - Scan Successful!
                  </AlertTitle>
                  <AlertDescription className="text-green-700 mt-2">
                    <div className="space-y-1">
                      <p className="text-lg">Barcode: <span className="font-mono font-semibold">{scanResult.barcode}</span></p>
                      <p className="text-sm text-green-600">
                        Scanned at: {scanResult.timestamp.toLocaleTimeString()}
                      </p>
                      <p className="mt-3 text-base">
                        ✓ Quality check passed. Bundle is ready for next process.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                /* QC Fail Alert */
                <Alert variant="destructive" className="bg-red-50 border-red-300">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <AlertTitle className="text-2xl font-bold text-red-800">
                    QC Fail - Scan Failed!
                  </AlertTitle>
                  <AlertDescription className="text-red-700 mt-2">
                    <div className="space-y-1">
                      <p className="text-lg">Barcode: <span className="font-mono font-semibold">{scanResult.barcode}</span></p>
                      <p className="text-sm text-red-600">
                        Scanned at: {scanResult.timestamp.toLocaleTimeString()}
                      </p>
                      <div className="mt-4 p-3 bg-red-100 rounded-md">
                        <p className="font-semibold flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Failure Reason:
                        </p>
                        <p className="mt-1 text-base font-medium">
                          {scanResult.reason || "Unknown defect"}
                        </p>
                      </div>
                      <p className="mt-3 text-sm italic">
                        ✗ This bundle requires repair or rework before proceeding.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={handleNewScan}
                  size="lg"
                  className="px-8"
                >
                  Scan Next Item
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Scans</CardTitle>
            <CardDescription>Last {scanHistory.length} scan results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanHistory.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    item.qcStatus === "pass"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.qcStatus === "pass" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-mono font-semibold">{item.barcode}</p>
                      {item.reason && (
                        <p className="text-sm text-muted-foreground">{item.reason}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BufferScanOutPage;
