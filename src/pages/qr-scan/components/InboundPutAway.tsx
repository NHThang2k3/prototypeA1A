// Path: src/pages/qr-scan/components/InboundPutAway.tsx

import React from "react";
import { Check, X, Warehouse } from "lucide-react";
import type { ScannedItem, ScannedLocation } from "../types";
import Scanner from "./Scanner";

interface InboundPutAwayProps {
  location: ScannedLocation;
  scannedItems: ScannedItem[];
  onScanItem: (qrCode: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const InboundPutAway: React.FC<InboundPutAwayProps> = ({
  location,
  scannedItems,
  onScanItem,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="text-center mb-4 border-b pb-4">
          <Warehouse className="mx-auto h-12 w-12 text-blue-500 mb-2" />
          <h2 className="text-xl font-bold text-gray-800">Cất Vải Vào Kho</h2>
          <p className="text-sm text-gray-500">Vị trí đã chọn:</p>
          <p className="font-mono text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block mt-1">
            {location.locationCode}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">
            Các cuộn vải đã quét ({scannedItems.length}):
          </h3>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
            {scannedItems.length === 0 ? (
              <p className="text-center text-gray-500 italic py-4">
                Chưa có cuộn vải nào được quét.
              </p>
            ) : (
              scannedItems.map((item) => (
                <div
                  key={item.qrCode}
                  className="p-2 bg-gray-50 rounded-md border text-sm"
                >
                  <p className="font-bold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-4">
          <Scanner
            onScan={onScanItem}
            scanPrompt="Tiếp tục quét mã QR trên các cuộn vải"
            context="PUT_AWAY_ITEM"
          />
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={onCancel}
          className="w-1/3 text-lg bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center shadow-md"
        >
          <X className="mr-2" /> Hủy
        </button>
        <button
          onClick={onSubmit}
          disabled={scannedItems.length === 0}
          className="w-2/3 text-lg bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Check className="mr-2" /> Hoàn Tất
        </button>
      </div>
    </div>
  );
};

export default InboundPutAway;
