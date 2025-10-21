// src/pages/bundle-management/components/ColumnToggler.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Columns } from "lucide-react";
import type { ColumnConfig } from "../types";

type ColumnTogglerProps = {
  allColumns: ColumnConfig[];
  visibleColumns: Record<string, boolean>;
  onColumnToggle: (columnKey: string) => void;
};

const ColumnToggler = ({
  allColumns,
  visibleColumns,
  onColumnToggle,
}: ColumnTogglerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <Columns className="mr-2 h-5 w-5" />
        Columns
        <ChevronDown className="ml-2 -mr-1 h-5 w-5" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-2 max-h-80 overflow-y-auto">
            {allColumns.map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center space-x-3 px-2 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={visibleColumns[key]}
                  onChange={() => onColumnToggle(key)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnToggler;
