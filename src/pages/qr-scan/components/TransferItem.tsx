// Path: src/pages/qr-scan/components/TransferItem.tsx

import React from "react";
import { Move, X } from "lucide-react";
import type { ScannedItem } from "../types";
import Scanner from "./Scanner";

interface TransferItemProps {
  item: ScannedItem;
  onScanLocation: (qrCode: string) => void;
  onCancel: () => void;
}

const TransferItem: React.FC<TransferItemProps> = ({
  item,
  onScanLocation,
  onCancel,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="text-center mb-4 border-b pb-4">
          <Move className="mx-auto h-12 w-12 text-blue-500 mb-2" />
          <h2 className="text-xl font-bold text-gray-800">Chuyển Vị Trí Vải</h2>
          <p className="text-sm text-gray-500 mt-2">Cuộn vải đã chọn:</p>
          <div className="mt-2 text-left bg-gray-50 p-3 rounded-md border">
            <p className="font-bold text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-500">SKU: {item.sku}</p>
            <p className="text-xs text-gray-500 mt-1">
              Vị trí hiện tại:{" "}
              <span className="font-mono bg-gray-200 px-1 rounded">
                {item.currentLocation}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Scanner
            onScan={onScanLocation}
            scanPrompt="Quét mã QR của VỊ TRÍ KHO MỚI"
            context="TRANSFER_LOCATION"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={onCancel}
          className="w-1/2 text-lg bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center shadow-md"
        >
          <X className="mr-2" /> Hủy
        </button>
      </div>
    </div>
  );
};

export default TransferItem;
