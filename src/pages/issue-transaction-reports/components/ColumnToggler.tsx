// Path: src/pages/issue-transaction-reports/components/ColumnToggler.tsx

import React, { useState, useRef, useEffect } from "react";
import { Columns } from "lucide-react";
import type { ColumnDefinition } from "../constants";

interface ColumnTogglerProps {
  allColumns: ColumnDefinition[];
  visibleColumns: Set<string>;
  onColumnToggle: (columnKey: string) => void;
}

const ColumnToggler: React.FC<ColumnTogglerProps> = ({
  allColumns,
  visibleColumns,
  onColumnToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Columns className="w-4 h-4 mr-2 text-gray-500" />
        View Columns
      </button>

      {isOpen && (
        <div className="absolute z-10 right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="p-2">
            {allColumns.map((column) => (
              <label
                key={column.key}
                className="flex items-center space-x-3 px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={visibleColumns.has(column.key)}
                  onChange={() => onColumnToggle(column.key)}
                />
                <span className="text-sm text-gray-700">{column.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnToggler;
