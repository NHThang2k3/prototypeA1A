// Path: src/pages/shipment-detail/components/PrintToolbar.tsx

import React from "react";
import { Printer } from "lucide-react";

interface PrintToolbarProps {
  selectedCount: number;
  onPrintSelected: () => void;
  onPrintAll: () => void;
}

const PrintToolbar: React.FC<PrintToolbarProps> = ({
  selectedCount,
  onPrintSelected,
  onPrintAll,
}) => {
  return (
    <div className="my-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onPrintSelected}
          disabled={selectedCount === 0}
          className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Printer className="w-4 h-4" />
          In tem đã chọn ({selectedCount})
        </button>
        <button
          onClick={onPrintAll}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Printer className="w-4 h-4" />
          In tất cả
        </button>
      </div>
      <div className="flex items-center">
        <label
          htmlFor="template"
          className="mr-2 text-sm font-medium text-gray-700"
        >
          Mẫu tem:
        </label>
        <select
          id="template"
          name="template"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option>Tem Vải (cuộn)</option>
          <option>Tem Phụ liệu (A4)</option>
          <option>Tem Thùng (A5)</option>
        </select>
      </div>
    </div>
  );
};

export default PrintToolbar;
