// Path: src/pages/qr-scan/components/ScanResult.tsx

import React from "react";
import type { ScannedItem, ScanAction } from "../types";
import { Move, XCircle } from "lucide-react"; // Bỏ CheckSquare

interface ScanResultProps {
  item: ScannedItem;
  onActionSelect: (action: ScanAction) => void;
  onCancel: () => void;
}

const ScanResult: React.FC<ScanResultProps> = ({
  item,
  onActionSelect,
  onCancel,
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h2>
        <p className="text-sm text-gray-500 mb-4">SKU: {item.sku}</p>

        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Số lượng:</strong> {item.quantity} {item.uom}
          </p>
          <p>
            <strong>Vị trí hiện tại:</strong>
            <span
              className={
                item.currentLocation
                  ? "font-mono bg-gray-200 px-2 py-1 rounded"
                  : "text-gray-400"
              }
            >
              {item.currentLocation || "Chưa có vị trí"}
            </span>
          </p>
          <p>
            <strong>Lô hàng:</strong> {item.shipmentId}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {!item.currentLocation && (
          <button
            onClick={() => onActionSelect("PUT_AWAY")}
            className="w-full text-lg bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center shadow-md"
          >
            <Move className="mr-3" /> Cất Hàng
          </button>
        )}
        {item.currentLocation && (
          <button
            onClick={() => onActionSelect("TRANSFER")}
            className="w-full text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center shadow-md"
          >
            <Move className="mr-3" /> Chuyển Vị Trí
          </button>
        )}
        {/* REMOVED: Nút Kiểm Kê đã bị xóa */}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onCancel}
          className="text-red-600 hover:text-red-800 font-semibold flex items-center justify-center mx-auto"
        >
          <XCircle className="mr-2" /> Hủy & Quét Lại
        </button>
      </div>
    </div>
  );
};

export default ScanResult;
