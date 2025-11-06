// src/pages/BufferScanOutPage/BufferScanOutPage.tsx

import React, { useState, useEffect, useRef } from "react";
import { QrCode, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Bundle = {
  id: string;
  po: string;
  style: string;
  qty: number;
};

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
  const [scannedBundle, setScannedBundle] = useState<Bundle | null>(null);
  const [goodQty, setGoodQty] = useState<number | string>("");
  const [defectQty, setDefectQty] = useState<number | string>("");
  const [selectedDefects, setSelectedDefects] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
    console.log({
      bundleId: scannedBundle.id,
      goodQty,
      defectQty,
      defects: selectedDefects,
    });
    alert("Scan-out successful!");
    setScannedBundle(null);
    setGoodQty("");
    setDefectQty("");
    setSelectedDefects([]);
  };

  const handleCancel = () => {
    setScannedBundle(null);
    setGoodQty("");
    setDefectQty("");
    setSelectedDefects([]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Scan-Out Bundle</CardTitle>
          <CardDescription>
            Scan a completed bundle and record the output quantities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!scannedBundle ? (
            <form onSubmit={handleScan}>
              <Label htmlFor="scan-input" className="mb-1">
                Bundle QR Code
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
                  className="pl-14 pr-4 py-7 text-lg"
                />
              </div>
            </form>
          ) : (
            <>
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="font-bold text-blue-800">
                  {scannedBundle.id}
                </AlertTitle>
                <AlertDescription className="text-blue-700">
                  {scannedBundle.style} - Total Quantity: {scannedBundle.qty}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="good-qty">Good Quantity</Label>
                  <Input
                    type="number"
                    id="good-qty"
                    value={goodQty}
                    onChange={(e) => setGoodQty(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defect-qty">Defect Quantity</Label>
                  <Input
                    type="number"
                    id="defect-qty"
                    value={defectQty}
                    onChange={(e) => setDefectQty(e.target.value)}
                  />
                </div>
              </div>

              {Number(goodQty) + Number(defectQty) !== scannedBundle.qty && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Quantity Mismatch</AlertTitle>
                  <AlertDescription>
                    Total quantity must equal {scannedBundle.qty}.
                  </AlertDescription>
                </Alert>
              )}

              {Number(defectQty) > 0 && (
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Defect Reason(s)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {defectTypes.map((defect) => (
                      <Button
                        key={defect}
                        variant={
                          selectedDefects.includes(defect)
                            ? "destructive"
                            : "outline"
                        }
                        onClick={() =>
                          setSelectedDefects((prev) =>
                            prev.includes(defect)
                              ? prev.filter((d) => d !== defect)
                              : [...prev, defect]
                          )
                        }
                        className="text-sm"
                      >
                        {defect}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
        {scannedBundle && (
          <CardFooter className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm & Scan Out</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default BufferScanOutPage;
