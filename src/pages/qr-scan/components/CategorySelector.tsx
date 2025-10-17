// Path: src/pages/qr-scan/components/CategorySelector.tsx

import React from "react";
import { ArrowLeft, FileOutput, Boxes, Package } from "lucide-react";
import type { ItemCategory } from "../types";

interface CategorySelectorProps {
  onSelectCategory: (category: ItemCategory) => void;
  onBack: () => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onSelectCategory,
  onBack,
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
      <button
        onClick={onBack}
        className="self-start mb-4 flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={16} className="mr-1" />
        Quay lại
      </button>

      <div className="text-center mb-8 w-full">
        <h1 className="text-2xl font-bold text-gray-800">
          Chọn Loại Vật Tư Xuất Kho
        </h1>
        <p className="text-gray-600">
          Vui lòng chọn loại hàng hóa bạn muốn soạn.
        </p>
      </div>
      <div className="w-full space-y-4">
        <button
          onClick={() => onSelectCategory("FABRIC")}
          className="w-full text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 px-4 rounded-lg flex items-center justify-between shadow-lg transition-transform transform hover:scale-105"
        >
          <span>
            <FileOutput className="inline-block mr-3" />
            Xuất Vải
          </span>
          <span className="text-sm opacity-80">FABRIC</span>
        </button>
        <button
          onClick={() => onSelectCategory("ACCESSORY")}
          className="w-full text-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-6 px-4 rounded-lg flex items-center justify-between shadow-lg transition-transform transform hover:scale-105"
        >
          <span>
            <Boxes className="inline-block mr-3" />
            Xuất Phụ Liệu
          </span>
          <span className="text-sm opacity-80">ACCESSORY</span>
        </button>
        <button
          onClick={() => onSelectCategory("PACKAGING")}
          className="w-full text-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 px-4 rounded-lg flex items-center justify-between shadow-lg transition-transform transform hover:scale-105"
        >
          <span>
            <Package className="inline-block mr-3" />
            Xuất Đóng Gói
          </span>
          <span className="text-sm opacity-80">PACKAGING</span>
        </button>
      </div>
    </div>
  );
};

export default CategorySelector;
