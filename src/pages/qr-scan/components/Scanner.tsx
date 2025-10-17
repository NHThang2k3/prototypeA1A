// Path: src/pages/qr-scan/components/Scanner.tsx

import { Camera } from "lucide-react";
import React from "react";
import type { OperationMode } from "../types";

interface ScannerProps {
  onScan: (data: string) => void;
  scanPrompt: string;
  mode: OperationMode | "SELECT";
}

const Scanner: React.FC<ScannerProps> = ({ onScan, scanPrompt, mode }) => {
  const renderDevButtons = () => {
    if (mode === "INBOUND" || mode === "TRANSFER") {
      return (
        <>
          <h3 className="text-sm font-bold text-center text-gray-600">
            GIẢ LẬP NHẬP/CHUYỂN KHO
          </h3>
          <button
            onClick={() => onScan("ITEM_QR_FAB_001")}
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Quét Vải (Chưa có vị trí)
          </button>
          <button
            onClick={() => onScan("ITEM_QR_ACC_003")}
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Quét Phụ Liệu (Đã có vị trí)
          </button>
          <button
            onClick={() => onScan("LOC_QR_A_01_B")}
            className="w-full bg-teal-500 text-white py-2 rounded-md"
          >
            Quét Vị trí Kho A-01-B
          </button>
          <button
            onClick={() => onScan("LOC_QR_C_03_A")}
            className="w-full bg-teal-500 text-white py-2 rounded-md"
          >
            Quét Vị trí Kho C-03-A
          </button>
        </>
      );
    }
    if (mode === "OUTBOUND") {
      return (
        <>
          <h3 className="text-sm font-bold text-center text-gray-600">
            GIẢ LẬP XUẤT KHO
          </h3>
          <button
            onClick={() => onScan("ISSUE_REQ_001")}
            className="w-full bg-purple-500 text-white py-2 rounded-md"
          >
            Quét Phiếu Yêu Cầu
          </button>
          <button
            onClick={() => onScan("ITEM_QR_FAB_002")}
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Quét Vải (Có trong phiếu)
          </button>
          <button
            onClick={() => onScan("ITEM_QR_ACC_003")}
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Quét Phụ Liệu (Có trong phiếu)
          </button>
          <button
            onClick={() => onScan("ITEM_QR_FAB_001")}
            className="w-full bg-orange-500 text-white py-2 rounded-md"
          >
            Quét Vải (KHÔNG có trong phiếu)
          </button>
        </>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center">
      <div className="relative w-full aspect-square bg-gray-900 rounded-lg flex items-center justify-center mb-4 border-4 border-gray-700">
        <Camera className="w-24 h-24 text-gray-600" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 border-4 border-dashed border-green-400 rounded-lg"></div>
      </div>

      <p className="text-lg font-semibold text-center text-gray-700 mb-6">
        {scanPrompt}
      </p>

      <div className="w-full space-y-3 p-4 bg-gray-200 rounded-lg border border-gray-300">
        {renderDevButtons()}
        <button
          onClick={() => onScan("QR_INVALID")}
          className="w-full bg-red-500 text-white py-2 rounded-md"
        >
          Quét Mã KHÔNG HỢP LỆ
        </button>
      </div>
    </div>
  );
};

export default Scanner;
