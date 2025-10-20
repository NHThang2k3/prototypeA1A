// Path: src/pages/qr-scan/components/PickingList.tsx

import React from "react";
import type { IssueRequest } from "../types";
import { PackageSearch, ArrowLeft } from "lucide-react";

interface PickingListProps {
  request: IssueRequest;
  onStartScanning: () => void;
  onBack: () => void;
}

const PickingList: React.FC<PickingListProps> = ({ 
  request,
  onStartScanning,
  onBack,
}) => {
  const isCompleted = request.pickingList.every(
    (item) => item.pickedQuantity >= item.requiredQuantity
  );

  return (
    <div className="w-full max-w-lg mx-auto p-4 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-4"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="text-center mb-4 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Warehouse Issue Request
          </h2>
          <p className="font-mono text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block mt-1">
            {request.id}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Destination: <strong>{request.destination}</strong>
          </p>
        </div>

        <div className="space-y-4">
          {request.pickingList.map((item) => (
            <div key={item.sku} className="p-3 bg-gray-50 rounded-md border">
              <p className="font-bold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (item.pickedQuantity / item.requiredQuantity) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-right mt-1 font-medium">
                  Picked: {item.pickedQuantity.toLocaleString()} /{" "}
                  {item.requiredQuantity.toLocaleString()} {item.uom}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Suggested location:{" "}
                <span className="font-mono bg-gray-200 px-1 rounded">
                  {item.locations.join(", ")}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {isCompleted ? (
          <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
            <p className="font-bold">Picking list completed!</p>
          </div>
        ) : (
          <button
            onClick={onStartScanning}
            className="w-full text-lg bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center shadow-md"
          >
            <PackageSearch className="mr-3" /> Start Scanning Items
          </button>
        )}
      </div>
    </div>
  );
};
export default PickingList;
