import {
  Shirt,
  Barcode,
  CheckCircle,
  XCircle,
  Camera,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

const defects = [
  "Stitching Error",
  "Fabric Defect",
  "Measurement Off",
  "Dirt/Stain",
  "Open Seam",
  "Accessory Issue",
];

const GarmentInspectionPage = () => {
  const [scanInfo, setScanInfo] = useState({ po: "", carton: "", garment: "" });
  const [garmentDetails, setGarmentDetails] = useState<{
    style: string;
    color: string;
    size: string;
  } | null>(null);
  const [showFailModal, setShowFailModal] = useState(false);

  const handleFetchDetails = () => {
    if (scanInfo.po && scanInfo.carton && scanInfo.garment) {
      setGarmentDetails({ style: "A-STYLE-01", color: "Black", size: "M" });
    }
  };

  const handleFail = () => {
    // This simulates failing for the first time
    setShowFailModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Garment Inspection
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Barcode className="w-6 h-6" />
          Scan Garment Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="PO Number"
            className="p-2 border rounded-md"
            value={scanInfo.po}
            onChange={(e) => setScanInfo({ ...scanInfo, po: e.target.value })}
          />
          <input
            type="text"
            placeholder="Carton ID"
            className="p-2 border rounded-md"
            value={scanInfo.carton}
            onChange={(e) =>
              setScanInfo({ ...scanInfo, carton: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Garment #"
            className="p-2 border rounded-md"
            value={scanInfo.garment}
            onChange={(e) =>
              setScanInfo({ ...scanInfo, garment: e.target.value })
            }
          />
          <button
            onClick={handleFetchDetails}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Fetch Details
          </button>
        </div>

        {garmentDetails && (
          <div className="mt-4 bg-gray-50 p-4 rounded-md border">
            <h3 className="font-semibold">Garment Details:</h3>
            <p>
              <strong>Style:</strong> {garmentDetails.style} |{" "}
              <strong>Color:</strong> {garmentDetails.color} |{" "}
              <strong>Size:</strong> {garmentDetails.size}
            </p>
          </div>
        )}
      </div>

      {garmentDetails && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Shirt className="w-6 h-6" />
            Inspection Checklist
          </h2>
          <div className="space-y-4">
            {defects.map((defect) => (
              <div key={defect} className="grid grid-cols-5 gap-2 items-center">
                <label className="col-span-2 text-sm">{defect}</label>
                <input
                  type="number"
                  placeholder="Qty"
                  min="0"
                  className="col-span-1 p-2 border rounded-md"
                />
                <button className="col-span-2 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-200 border text-sm">
                  <Camera className="w-4 h-4" /> Add Photo
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t flex justify-center gap-4">
            <button
              className="flex items-center gap-2 bg-red-600 text-white font-bold py-3 px-8 rounded-md hover:bg-red-700 transition-colors text-lg"
              onClick={handleFail}
            >
              <XCircle /> Fail
            </button>
            <button className="flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-8 rounded-md hover:bg-green-700 transition-colors text-lg">
              <CheckCircle /> Pass
            </button>
          </div>
        </div>
      )}

      {/* Fail Modal */}
      {showFailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-10 h-10 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800">
                Inspection Failed: 1st Time
              </h2>
            </div>
            <p className="mt-2 text-gray-600">
              This garment has failed the initial inspection. Please provide
              comments and submit to notify the QAM for a decision.
            </p>
            <div className="mt-6">
              <label
                htmlFor="comments"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Comments
              </label>
              <textarea
                id="comments"
                rows={4}
                className="w-full p-2 border rounded-md"
                placeholder="Describe the issue..."
              ></textarea>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowFailModal(false)}
                className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowFailModal(false)}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700"
              >
                Submit to QAM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GarmentInspectionPage;
