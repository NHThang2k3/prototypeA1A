// Path: src/pages/packaging-inventory-list/components/PackagingInventoryHeader.tsx

import { useState, useRef, useEffect } from "react";
import { FileDown, View, Printer } from "lucide-react";

interface Column {
  id: string;
  name: string;
}

interface PackagingInventoryHeaderProps {
  allColumns: Column[];
  visibleColumns: Set<string>;
  onColumnVisibilityChange: (newVisibleColumns: Set<string>) => void;
  selectedRowCount: number;
  onPrintMultiple: () => void;
  onExportExcel: () => void;
}

export const PackagingInventoryHeader = ({
  allColumns,
  visibleColumns,
  onColumnVisibilityChange,
  selectedRowCount,
  onPrintMultiple,
  onExportExcel,
}: PackagingInventoryHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleToggleColumn = (columnId: string) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(columnId)) {
      newVisibleColumns.delete(columnId);
    } else {
      newVisibleColumns.add(columnId);
    }
    onColumnVisibilityChange(newVisibleColumns);
  };

  const hasSelection = selectedRowCount > 0;

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Packaging Inventory Management
        </h1>
        {hasSelection && (
          <p className="text-sm text-gray-500 mt-1">
            {selectedRowCount} item(s) selected.
          </p>
        )}
      </div>
      <div className="flex space-x-2 mt-4 md:mt-0">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <View className="w-5 h-5 mr-2" />
            View
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 border border-gray-200">
              <div className="p-2">
                <p className="text-sm font-semibold text-gray-800 px-2 py-1">
                  Toggle Columns
                </p>
              </div>
              <div className="border-t border-gray-200"></div>
              <div className="py-1 max-h-80 overflow-y-auto">
                {allColumns.map((column) => (
                  <label
                    key={column.id}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={visibleColumns.has(column.id)}
                      onChange={() => handleToggleColumn(column.id)}
                    />
                    <span className="ml-3">{column.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onPrintMultiple}
          disabled={!hasSelection}
          className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Printer className="w-5 h-5 mr-2" />
          Print QR
        </button>
        <button
          onClick={onExportExcel}
          disabled={!hasSelection}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileDown className="w-5 h-5 mr-2" />
          Export Excel
        </button>
      </div>
    </div>
  );
};
