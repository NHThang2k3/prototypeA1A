// src/pages/BufferScanInPage/BufferScanInPage.tsx

import { useState } from "react";
import { CheckCircle2, XCircle, History } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data types
type Bundle = {
  id: string;
  po: string;
  style: string;
  color: string;
  size: string;
  qty: number;
};

type ScanResult = {
  bundle: Bundle | null;
  barcode: string;
  status: "success" | "error";
  timestamp: Date;
};

// Mock bundle lookup function
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
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const processBarcodeScan = (barcode: string) => {
    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      const bundle = mockBundleLookup(barcode);
      
      const result: ScanResult = {
        bundle: bundle,
        barcode: barcode,
        status: bundle ? "success" : "error",
        timestamp: new Date(),
      };
      
      setScanResult(result);
      setScanHistory(prev => [result, ...prev].slice(0, 10));
      setIsScanning(false);
    }, 800);
  };

  const handleNewScan = () => {
    setScanResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header with History Button */}
      <div className="max-w-full md:max-w-3xl mx-auto mb-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">Buffer Scan-In</h1>
        
        {/* Recent Scans Dialog */}
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogTrigger asChild>
            <Button variant="outline" size="lg" className="h-12 md:h-14 px-4 md:px-6">
              <History className="w-6 h-6 mr-2" />
              Recent Scans ({scanHistory.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Recent Scans</DialogTitle>
              <DialogDescription>
                Last {scanHistory.length} scan results
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {scanHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No scan history yet</p>
              ) : (
                scanHistory.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                      item.status === "success"
                        ? "bg-green-50 border-green-300"
                        : "bg-red-50 border-red-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {item.status === "success" ? (
                        <CheckCircle2 className="w-7 h-7 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-7 h-7 text-red-600 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-mono font-bold text-lg truncate">{item.barcode}</p>
                        {item.bundle && (
                          <p className="text-sm text-muted-foreground truncate">
                            {item.bundle.style} - {item.bundle.qty} pcs
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground flex-shrink-0 ml-2">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Scan Card */}
      <Card className="max-w-full md:max-w-3xl mx-auto shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl md:text-4xl font-bold text-center">
            Decoration Buffer Scan-In
          </CardTitle>
          <CardDescription className="text-center text-base md:text-lg mt-2">
            Position barcode in front of camera
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 md:space-y-8">
          {/* Camera Scanner */}
          {!scanResult ? (
            /* Camera Scanner View */
            <div className="space-y-6">
              {/* Camera Preview Area */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                {/* Simulated Camera Feed */}
                <div className="absolute inset-0 bg-black">
                  
                  {/* Scanning Frame */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className={`relative w-full max-w-md aspect-[3/1] border-4 rounded-lg transition-colors duration-300 ${
                      isScanning ? 'border-blue-500 animate-pulse' : 'border-white'
                    }`}>
                      {/* Corner markers */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-8 border-l-8 border-white"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-8 border-r-8 border-white"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-8 border-l-8 border-white"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-8 border-r-8 border-white"></div>
                      
                      {/* Scanning line animation */}
                      {isScanning && (
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="h-1 w-full bg-blue-500 animate-scan"></div>
                        </div>
                      )}
                      
                      {/* Instruction text */}
                      <div className="absolute -bottom-12 left-0 right-0 text-center">
                        <p className="text-white text-lg md:text-xl font-medium">
                          {isScanning ? 'Scanning...' : 'Position barcode here'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Test Buttons */}
              <div className="border-t-2 pt-6">
                <p className="text-lg md:text-xl text-muted-foreground mb-4 font-medium">Quick Test (Simulate Scan):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => processBarcodeScan("BNDL-001")}
                    disabled={isScanning}
                    className="h-20 md:h-24 text-xl md:text-2xl font-semibold text-green-700 border-green-400 border-2 hover:bg-green-100 bg-green-50"
                  >
                    <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 mr-3" />
                    Valid Bundle
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => processBarcodeScan("INVALID-001")}
                    disabled={isScanning}
                    className="h-20 md:h-24 text-xl md:text-2xl font-semibold text-red-700 border-red-400 border-2 hover:bg-red-100 bg-red-50"
                  >
                    <XCircle className="w-8 h-8 md:w-10 md:h-10 mr-3" />
                    Invalid Bundle
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Scan Result Display */
            <div className="space-y-6 md:space-y-8">
              {scanResult.status === "success" && scanResult.bundle ? (
                /* Success Alert */
                <Alert className="bg-green-50 border-green-400 border-2 p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-12 w-12 md:h-16 md:w-16 text-green-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <AlertTitle className="text-2xl md:text-4xl font-bold text-green-800 mb-3">
                        Scan Successful!
                      </AlertTitle>
                      <AlertDescription className="text-green-700">
                        <div className="space-y-3">
                          <p className="text-xl md:text-2xl">
                            Bundle ID: <span className="font-mono font-bold">{scanResult.bundle.id}</span>
                          </p>
                          <p className="text-base md:text-lg text-green-600">
                            Scanned at: {scanResult.timestamp.toLocaleTimeString()}
                          </p>
                          
                          {/* Bundle Details */}
                          <div className="mt-5 p-4 md:p-6 bg-green-100 rounded-lg border-2 border-green-300">
                            <p className="font-bold text-lg md:text-xl mb-3">Bundle Details:</p>
                            <div className="grid grid-cols-2 gap-3 text-base md:text-lg">
                              <span className="text-green-800">PO Number:</span>
                              <span className="font-semibold">{scanResult.bundle.po}</span>
                              
                              <span className="text-green-800">Style:</span>
                              <span className="font-semibold">{scanResult.bundle.style}</span>
                              
                              <span className="text-green-800">Color:</span>
                              <span className="font-semibold">{scanResult.bundle.color}</span>
                              
                              <span className="text-green-800">Size:</span>
                              <span className="font-semibold">{scanResult.bundle.size}</span>
                              
                              <span className="text-green-800">Quantity:</span>
                              <span className="font-semibold">{scanResult.bundle.qty} pcs</span>
                            </div>
                          </div>
                          
                          <p className="mt-4 text-lg md:text-xl font-medium">
                            ✓ Bundle recorded successfully in buffer.
                          </p>
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ) : (
                /* Error Alert */
                <Alert variant="destructive" className="bg-red-50 border-red-400 border-2 p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <XCircle className="h-12 w-12 md:h-16 md:w-16 text-red-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <AlertTitle className="text-2xl md:text-4xl font-bold text-red-800 mb-3">
                        Scan Failed!
                      </AlertTitle>
                      <AlertDescription className="text-red-700">
                        <div className="space-y-3">
                          <p className="text-xl md:text-2xl">
                            Barcode: <span className="font-mono font-bold">{scanResult.barcode}</span>
                          </p>
                          <p className="text-base md:text-lg text-red-600">
                            Scanned at: {scanResult.timestamp.toLocaleTimeString()}
                          </p>
                          <div className="mt-5 p-4 md:p-6 bg-red-100 rounded-lg border-2 border-red-300">
                            <p className="text-xl md:text-2xl font-bold">
                              Bundle not found in system
                            </p>
                          </div>
                          <p className="mt-4 text-base md:text-lg italic">
                            ✗ Please check the barcode and try again.
                          </p>
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}

              {/* Action Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleNewScan}
                  size="lg"
                  className="h-16 md:h-20 px-12 md:px-16 text-xl md:text-2xl font-bold"
                >
                  Scan Next Item
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add scanning animation keyframes to global styles */}
      <style>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(400%);
          }
        }
        
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BufferScanInPage;
