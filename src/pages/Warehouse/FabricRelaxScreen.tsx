import React, { useState, useEffect, useCallback } from "react";
import { Camera, CheckCircle, QrCode } from "lucide-react";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

//================================================================================
// 1. TYPE DEFINITIONS & HELPERS (Unchanged)
//================================================================================

type StationStatus = "Empty" | "InProgress" | "Complete";

interface RelaxStation {
  id: number;
  machineName: string;
  status: StationStatus;
  fabricId: string | null;
  startTime: number | null;
  elapsedTime: number;
  totalTime: number;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

//================================================================================
// 2. REFACTORED COMPONENTS
//================================================================================

interface ScanScreenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stations: RelaxStation[];
  onScanComplete: (machineId: number, fabricId: string) => void;
}

const ScanScreen: React.FC<ScanScreenProps> = ({
  open,
  onOpenChange,
  stations,
  onScanComplete,
}) => {
  const [scanStep, setScanStep] = useState<"machine" | "fabric">("machine");
  const [scannedMachineId, setScannedMachineId] = useState<number | null>(null);
  const [scannedMachineName, setScannedMachineName] = useState<string>("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    // Reset state when dialog is closed
    if (!open) {
      setTimeout(() => {
        setScanStep("machine");
        setScannedMachineId(null);
        setScannedMachineName("");
        setMessage(null);
      }, 200);
    }
  }, [open]);

  const handleSimulateMachineScan = () => {
    const availableStation = stations.find((s) => s.status === "Empty");
    if (!availableStation) {
      setMessage({ text: "No empty stations available.", type: "error" });
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    setMessage({
      text: `Station "${availableStation.machineName}" Scanned!`,
      type: "success",
    });
    setScannedMachineId(availableStation.id);
    setScannedMachineName(availableStation.machineName);
    setTimeout(() => {
      setScanStep("fabric");
      setMessage(null);
    }, 1500);
  };

  const handleSimulateFabricScan = () => {
    if (!scannedMachineId) return;
    const randomFabricId = `FAB-${Math.floor(1000 + Math.random() * 9000)}`;
    setMessage({
      text: `Fabric "${randomFabricId}" Scanned! Starting timer...`,
      type: "success",
    });
    setTimeout(() => {
      onScanComplete(scannedMachineId, randomFabricId);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {scanStep === "machine"
              ? "1. Scan Station QR Code"
              : `2. Scan Fabric for "${scannedMachineName}"`}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 text-center">
          <div className="my-6 aspect-square w-full max-w-xs mx-auto bg-gray-900 rounded-md flex items-center justify-center">
            <QrCode size={120} className="text-gray-600 animate-pulse" />
          </div>
          {message && (
            <p
              className={`mb-4 font-semibold ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}
          {scanStep === "machine" ? (
            <Button onClick={handleSimulateMachineScan} className="w-full">
              Simulate Station Scan
            </Button>
          ) : (
            <Button
              onClick={handleSimulateFabricScan}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Simulate Fabric Scan
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface RelaxStationCardProps {
  station: RelaxStation;
  onAcknowledgeComplete: (id: number) => void;
}

const RelaxStationCard: React.FC<RelaxStationCardProps> = ({
  station,
  onAcknowledgeComplete,
}) => {
  const { id, machineName, status, fabricId, elapsedTime, totalTime } = station;
  const progressPercentage =
    totalTime > 0 ? (elapsedTime / totalTime) * 100 : 0;

  const statusConfig: Record<
    StationStatus,
    { text: string; variant: "default" | "secondary" | "outline" }
  > = {
    Empty: { text: "Empty", variant: "secondary" },
    InProgress: { text: "In Progress", variant: "outline" },
    Complete: { text: "Finish", variant: "default" },
  };
  const currentStatus = statusConfig[status];
  const variantClasses = {
    secondary: "bg-gray-200 text-gray-800",
    default: "bg-green-500 text-white",
    outline: "bg-yellow-500 text-white",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{machineName}</CardTitle>
          <Badge
            variant={currentStatus.variant}
            className={variantClasses[currentStatus.variant]}
          >
            {currentStatus.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm mb-4">
          Fabric ID: <span className="font-semibold">{fabricId || "N/A"}</span>
        </p>
        <div className="my-4">
          <Progress value={progressPercentage} />
          <div className="text-center text-xl font-mono tracking-wider mt-2 text-gray-700">
            <span>{formatTime(elapsedTime)}</span>
            <span className="text-gray-400"> / {formatTime(totalTime)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="min-h-[52px]">
        {status === "Empty" && (
          <p className="text-center w-full text-muted-foreground italic">
            Scan QR to assign fabric
          </p>
        )}
        {status === "InProgress" && (
          <p className="text-center w-full text-muted-foreground italic">
            Relaxation in progress...
          </p>
        )}
        {status === "Complete" && (
          <Button
            onClick={() => onAcknowledgeComplete(id)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="mr-2" size={18} /> Finish
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

//================================================================================
// 3. MAIN PAGE COMPONENT
//================================================================================

const TOTAL_RELAX_SECONDS = 7;
const initialStations: RelaxStation[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  machineName: `Station ${String(i + 1).padStart(2, "0")}`,
  status: "Empty",
  fabricId: null,
  startTime: null,
  elapsedTime: 0,
  totalTime: TOTAL_RELAX_SECONDS,
}));

const FabricRelaxScreen: React.FC = () => {
  const [stations, setStations] = useState<RelaxStation[]>(initialStations);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setStations((prevStations) =>
        prevStations.map((station) => {
          if (station.status === "InProgress" && station.startTime) {
            const elapsed = Math.floor((Date.now() - station.startTime) / 1000);
            return elapsed >= station.totalTime
              ? {
                  ...station,
                  status: "Complete",
                  elapsedTime: station.totalTime,
                }
              : { ...station, elapsedTime: elapsed };
          }
          return station;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScanComplete = useCallback(
    (machineId: number, fabricId: string) => {
      setStations((prev) =>
        prev.map((s) =>
          s.id === machineId
            ? {
                ...s,
                status: "InProgress", // Directly start the process
                fabricId,
                startTime: Date.now(), // Set start time immediately
              }
            : s
        )
      );
      setIsScanning(false);
    },
    []
  );

  const handleAcknowledgeComplete = useCallback((id: number) => {
    const originalState = initialStations.find((is) => is.id === id)!;
    setStations((prev) => prev.map((s) => (s.id === id ? originalState : s)));
  }, []);

  return (
    <>
      <ScanScreen
        open={isScanning}
        onOpenChange={setIsScanning}
        stations={stations}
        onScanComplete={handleScanComplete}
      />

      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  Fabric Relaxation Management
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Real-time monitoring of the fabric relaxation process.
                </p>
              </div>
              <Button onClick={() => setIsScanning(true)}>
                <Camera size={20} className="mr-2" />
                <span>Scan</span>
              </Button>
            </div>
          </header>
          <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {stations.map((station) => (
              <RelaxStationCard
                key={station.id}
                station={station}
                onAcknowledgeComplete={handleAcknowledgeComplete}
              />
            ))}
          </main>
        </div>
      </div>
    </>
  );
};

export default FabricRelaxScreen;
