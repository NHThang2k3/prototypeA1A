import React, { useState, useEffect, useCallback } from "react";
import {
  Camera,
  Play,
  Pause,
  Trash2,
  CheckCircle,
  X,
  QrCode,
} from "lucide-react";

//================================================================================
// 1. TYPE DEFINITIONS
//================================================================================

type StationStatus = "Empty" | "Ready" | "InProgress" | "Complete";

interface RelaxStation {
  id: number;
  machineName: string;
  status: StationStatus;
  fabricId: string | null;
  startTime: number | null; // Stored as a timestamp (Date.now())
  elapsedTime: number; // Elapsed time in seconds
  totalTime: number; // Total required time in seconds (e.g., 24 * 3600)
}

//================================================================================
// 2. HELPER FUNCTIONS
//================================================================================

/**
 * Formats time from total seconds into HH:MM:SS format.
 */
const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

//================================================================================
// 3. NEW COMPONENT: ScanScreen
//================================================================================

interface ScanScreenProps {
  stations: RelaxStation[];
  onScanComplete: (machineId: number, fabricId: string) => void;
  onCancel: () => void;
}

const ScanScreen: React.FC<ScanScreenProps> = ({
  stations,
  onScanComplete,
  onCancel,
}) => {
  const [scanStep, setScanStep] = useState<"machine" | "fabric">("machine");
  const [scannedMachineId, setScannedMachineId] = useState<number | null>(null);
  const [scannedMachineName, setScannedMachineName] = useState<string>("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSimulateMachineScan = () => {
    // Find the first available 'Empty' station to simulate a successful scan
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
    }, 1500); // Automatically move to the next step
  };

  const handleSimulateFabricScan = () => {
    if (!scannedMachineId) return;

    const randomFabricId = `FAB-${Math.floor(1000 + Math.random() * 9000)}`;
    setMessage({
      text: `Fabric "${randomFabricId}" Scanned!`,
      type: "success",
    });

    setTimeout(() => {
      onScanComplete(scannedMachineId, randomFabricId);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {scanStep === "machine"
              ? "1. Scan Station QR Code"
              : `2. Scan Fabric for "${scannedMachineName}"`}
          </h2>

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
            <button
              onClick={handleSimulateMachineScan}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Simulate Station Scan
            </button>
          ) : (
            <button
              onClick={handleSimulateFabricScan}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Simulate Fabric Scan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

//================================================================================
// 4. CHILD COMPONENT: RelaxStationCard
//================================================================================

interface RelaxStationCardProps {
  station: RelaxStation;
  // onChooseFabric is removed
  onStart: (id: number) => void;
  onInterrupt: (id: number) => void;
  onRemove: (id: number) => void;
  onAcknowledgeComplete: (id: number) => void;
}

const RelaxStationCard: React.FC<RelaxStationCardProps> = ({
  station,
  onStart,
  onInterrupt,
  onRemove,
  onAcknowledgeComplete,
}) => {
  const { id, machineName, status, fabricId, elapsedTime, totalTime } = station;
  const progressPercentage =
    totalTime > 0 ? (elapsedTime / totalTime) * 100 : 0;

  const statusConfig = {
    Empty: { text: "Empty", color: "bg-gray-400", textColor: "text-gray-800" },
    Ready: { text: "Ready", color: "bg-blue-500", textColor: "text-white" },
    InProgress: {
      text: "In Progress",
      color: "bg-yellow-500",
      textColor: "text-white",
    },
    Complete: {
      text: "Complete",
      color: "bg-green-500",
      textColor: "text-white",
    },
  };

  const currentStatus = statusConfig[status];
  const progressBarColor =
    status === "Complete" ? "bg-green-500" : "bg-blue-600";

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between border-t-8"
      style={{ borderTopColor: currentStatus.color.replace("bg-", "#") }}
    >
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">{machineName}</h3>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${currentStatus.color} ${currentStatus.textColor}`}
          >
            {currentStatus.text}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Fabric ID: <span className="font-semibold">{fabricId || "N/A"}</span>
        </p>
      </div>

      <div className="my-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${progressBarColor}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-center text-xl font-mono tracking-wider mt-2 text-gray-700">
          <span>{formatTime(elapsedTime)}</span>
          <span className="text-gray-400"> / {formatTime(totalTime)}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200 min-h-[52px] flex items-center">
        {status === "Empty" && (
          <p className="text-center w-full text-gray-400 italic">
            Scan QR to assign fabric
          </p>
        )}
        {status === "Ready" && (
          <div className="flex gap-2 w-full">
            <button
              onClick={() => onStart(id)}
              className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              <Play className="mr-2" size={18} /> Start
            </button>
            <button
              onClick={() => onRemove(id)}
              className="w-full flex items-center justify-center bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              <Trash2 className="mr-2" size={18} /> Remove
            </button>
          </div>
        )}
        {status === "InProgress" && (
          <button
            onClick={() => onInterrupt(id)}
            className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            <Pause className="mr-2" size={18} /> Interrupt
          </button>
        )}
        {status === "Complete" && (
          <button
            onClick={() => onAcknowledgeComplete(id)}
            className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            <CheckCircle className="mr-2" size={18} /> Acknowledge & Clear
          </button>
        )}
      </div>
    </div>
  );
};

//================================================================================
// 5. MAIN COMPONENT: FabricRelaxScreen
//================================================================================

const TOTAL_RELAX_SECONDS = 10; // 24 hours
// const TOTAL_RELAX_SECONDS = 120; // 2 minutes for testing

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
  const [isScanning, setIsScanning] = useState(false); // NEW state to control ScanScreen
  const [showInterruptModal, setShowInterruptModal] = useState(false);
  const [stationToInterrupt, setStationToInterrupt] = useState<number | null>(
    null
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setStations((prevStations) =>
        prevStations.map((station) => {
          if (station.status === "InProgress" && station.startTime) {
            const now = Date.now();
            const elapsed = Math.floor((now - station.startTime) / 1000);
            if (elapsed >= station.totalTime) {
              return {
                ...station,
                status: "Complete",
                elapsedTime: station.totalTime,
              };
            }
            return { ...station, elapsedTime: elapsed };
          }
          return station;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // NEW: Handler for when scanning is complete
  const handleScanComplete = useCallback(
    (machineId: number, fabricId: string) => {
      setStations((prev) =>
        prev.map((s) =>
          s.id === machineId ? { ...s, status: "Ready", fabricId: fabricId } : s
        )
      );
      setIsScanning(false);
    },
    []
  );

  const handleStart = useCallback((id: number) => {
    setStations((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "InProgress", startTime: Date.now() } : s
      )
    );
  }, []);

  const handleInterrupt = useCallback((id: number) => {
    setStationToInterrupt(id);
    setShowInterruptModal(true);
  }, []);

  const handleConfirmInterrupt = useCallback(() => {
    if (stationToInterrupt === null) return;
    setStations((prev) =>
      prev.map((s) =>
        s.id === stationToInterrupt
          ? { ...s, status: "Ready", startTime: null, elapsedTime: 0 }
          : s
      )
    );
    setShowInterruptModal(false);
    setStationToInterrupt(null);
  }, [stationToInterrupt]);

  const handleCancelInterrupt = () => {
    setShowInterruptModal(false);
    setStationToInterrupt(null);
  };

  const handleRemove = useCallback((id: number) => {
    const originalStationState = initialStations.find((is) => is.id === id)!;
    setStations((prev) =>
      prev.map((s) => (s.id === id ? { ...originalStationState } : s))
    );
  }, []);

  const handleAcknowledgeComplete = useCallback((id: number) => {
    const originalStationState = initialStations.find((is) => is.id === id)!;
    setStations((prev) =>
      prev.map((s) => (s.id === id ? { ...originalStationState } : s))
    );
  }, []);

  return (
    <>
      {isScanning && (
        <ScanScreen
          stations={stations}
          onScanComplete={handleScanComplete}
          onCancel={() => setIsScanning(false)}
        />
      )}

      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Fabric Relaxation Management
                </h1>
                <p className="mt-1 text-gray-600">
                  Real-time monitoring of the fabric relaxation process.
                </p>
              </div>
              <button
                onClick={() => setIsScanning(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                <Camera size={20} />
                <span>Scan</span>
              </button>
            </div>
          </header>

          <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {stations.map((station) => (
              <RelaxStationCard
                key={station.id}
                station={station}
                onStart={handleStart}
                onInterrupt={handleInterrupt}
                onRemove={handleRemove}
                onAcknowledgeComplete={handleAcknowledgeComplete}
              />
            ))}
          </main>
        </div>

        {/* Interrupt Confirmation Modal */}
        {showInterruptModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold text-gray-900">
                Confirm Interruption
              </h3>
              <p className="mt-2 text-gray-600">
                Are you sure you want to interrupt the relaxation process?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleCancelInterrupt}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmInterrupt}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FabricRelaxScreen;
