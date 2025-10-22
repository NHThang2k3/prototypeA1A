// Path: src/pages/inventory-list/components/InventoryHeader.tsx

import { useState, useRef, useEffect } from "react";
import {
  FileDown,
  ChevronDown,
  Printer,
  Move,
  History,
  Trash2,
} from "lucide-react";

interface InventoryHeaderProps {
  selectedRowCount: number;
  onExportAll: () => void;
  onExportSelected: () => void;
  onPrintMultiple: () => void;
  onTransfer: () => void;
  onViewHistory: () => void;
  onDelete: () => void;
}

export const InventoryHeader = ({
  selectedRowCount,
  onExportAll,
  onExportSelected,
  onPrintMultiple,
  onTransfer,
  onViewHistory,
  onDelete,
}: InventoryHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasSelection = selectedRowCount > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleActionClick = (action: () => void) => {
    action();
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Inventory Management
        </h1>
        {hasSelection && (
          <p className="text-sm text-gray-500 mt-1">
            {selectedRowCount} item(s) selected.
          </p>
        )}
      </div>
      <div className="flex space-x-2 mt-4 md:mt-0">
        {/* Actions Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={!hasSelection}
            className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Actions
            <ChevronDown className="w-4 h-4 ml-2 -mr-1" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 border border-gray-200 origin-top-right">
              <div className="py-1">
                <button
                  onClick={() => handleActionClick(onExportSelected)}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileDown className="w-4 h-4 mr-3" /> Export Selected to Excel
                </button>
                <button
                  onClick={() => handleActionClick(onPrintMultiple)}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Printer className="w-4 h-4 mr-3" /> Print QR Code
                </button>
                <button
                  onClick={() => handleActionClick(onTransfer)}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Move className="w-4 h-4 mr-3" /> Transfer Location
                </button>
                <button
                  onClick={() => handleActionClick(onViewHistory)}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <History className="w-4 h-4 mr-3" /> View Location History
                </button>
                <div className="border-t my-1"></div>
                <button
                  onClick={() => handleActionClick(onDelete)}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-3" /> Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={onExportAll}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
        >
          <FileDown className="w-5 h-5 mr-2" />
          Export All to Excel
        </button>
      </div>
    </div>
  );
};
