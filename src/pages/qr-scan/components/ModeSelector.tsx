// Path: src/pages/qr-scan/components/ModeSelector.tsx

import React from "react";
import { ArrowRight, ArrowLeft, Shuffle } from "lucide-react";
import type { OperationMode } from "../types";

interface ModeSelectorProps {
  onSelectMode: (mode: OperationMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Chọn Tác Vụ</h1>
        <p className="text-gray-600">
          Vui lòng chọn quy trình bạn muốn thực hiện.
        </p>
      </div>
      <div className="w-full space-y-4">
        <button
          onClick={() => onSelectMode("INBOUND")}
          className="w-full text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded-lg flex items-center justify-between shadow-lg transition-transform transform hover:scale-105"
        >
          <span>
            <ArrowRight className="inline-block mr-3" />
            Nhập Kho / Cất Hàng
          </span>
          <span className="text-sm opacity-80">INBOUND</span>
        </button>

        <button
          onClick={() => onSelectMode("OUTBOUND")}
          className="w-full text-lg bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-4 rounded-lg flex items-center justify-between shadow-lg transition-transform transform hover:scale-105"
        >
          <span>
            <ArrowLeft className="inline-block mr-3" />
            Xuất Kho / Soạn Hàng
          </span>
          <span className="text-sm opacity-80">OUTBOUND</span>
        </button>

        <button
          onClick={() => onSelectMode("TRANSFER")}
          className="w-full text-lg bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-6 px-4 rounded-lg flex items-center justify-between shadow-lg transition-transform transform hover:scale-105"
        >
          <span>
            <Shuffle className="inline-block mr-3" />
            Chuyển Vị Trí Kho
          </span>
          <span className="text-sm opacity-80">TRANSFER</span>
        </button>
      </div>
    </div>
  );
};

export default ModeSelector;
