import { Barcode, Shield, Database, Send, PlusCircle } from "lucide-react";
import { useState } from "react";

// Mock data for inspected items
const initialInspectedItems = [
  { id: 1, cartonId: "CARTON-001", result: "Pass", defects: "" },
  { id: 2, cartonId: "CARTON-009", result: "Fail", defects: "2pcs open seam" },
];

const SampleInspectionPage = () => {
  const [po, setPo] = useState("");
  const [poDetails, setPoDetails] = useState<{
    total: number;
    aql: string;
    sampleSize: number;
  } | null>(null);
  const [inspectedItems] = useState(initialInspectedItems);

  const handleLoadPo = () => {
    if (po) {
      setPoDetails({ total: 250, aql: "2.5 General II", sampleSize: 15 });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Carton Sample Inspection (AQL)
      </h1>

      {/* PO Input Card */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Barcode className="w-6 h-6" />
          Enter PO Number
        </h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={po}
            onChange={(e) => setPo(e.target.value)}
            placeholder="Enter PO Number..."
            className="flex-grow p-2 border rounded-md"
          />
          <button
            onClick={handleLoadPo}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Load Details
          </button>
        </div>
      </div>

      {poDetails && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Total Cartons in PO</p>
              <p className="text-2xl font-bold text-gray-800">
                {poDetails.total}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">AQL Level</p>
              <p className="text-2xl font-bold text-gray-800">
                {poDetails.aql}
              </p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-md">
              <p className="text-sm text-blue-700">Suggested Sample Size</p>
              <p className="text-2xl font-bold text-blue-800">
                {poDetails.sampleSize}
              </p>
            </div>
          </div>
        </div>
      )}

      {poDetails && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-700 p-6 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Inspection Results
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Carton ID</th>
                  <th className="px-6 py-3">Result</th>
                  <th className="px-6 py-3">Defects Found / Comments</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {inspectedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        defaultValue={item.cartonId}
                        className="p-1 border rounded-md w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        defaultValue={item.result}
                        className="p-1 border rounded-md w-full"
                      >
                        <option>Pass</option>
                        <option>Fail</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        defaultValue={item.defects}
                        className="p-1 border rounded-md w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 border-t">
            <button className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800">
              <PlusCircle className="w-5 h-5" /> Add Another Carton
            </button>
          </div>
        </div>
      )}

      {poDetails && (
        <div className="p-4 bg-gray-100 rounded-lg flex flex-col md:flex-row justify-end items-center gap-4">
          <p className="text-sm text-gray-600 mr-auto">
            Finalize Inspection Report:
          </p>
          <button
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-600 text-white font-bold py-3 px-6 rounded-md hover:bg-gray-700 transition-colors"
            title="Save for internal review only. This will NOT be sent to the client."
          >
            <Database className="w-5 h-5" />
            Save to Internal
          </button>
          <button
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
            title="Submit final report to client system (e.g., PV88/ZDC). This action is irreversible."
          >
            <Send className="w-5 h-5" />
            Submit to PV88/ZDC
          </button>
        </div>
      )}
    </div>
  );
};

export default SampleInspectionPage;
