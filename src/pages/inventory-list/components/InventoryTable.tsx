// Path: src/pages/inventory-list/components/InventoryTable.tsx

import React, { useState, useRef, useEffect } from "react";
import type { FabricRoll } from "../types";
import {
  View,
  MoreVertical,
  Printer,
  History,
  Move,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface Column {
  id: string;
  name: string;
}

interface InventoryTableProps {
  items: FabricRoll[];
  allColumns: Column[];
  visibleColumns: Set<string>;
  onColumnVisibilityChange: (newVisibleColumns: Set<string>) => void;
  selectedRows: Set<string>;
  onSelectionChange: (newSelection: Set<string>) => void;
  onPrintSingle: (item: FabricRoll) => void;
  onViewHistorySingle: (item: FabricRoll) => void;
  onTransferSingle: (item: FabricRoll) => void;
  onDeleteSingle: (item: FabricRoll) => void;
}

const RelaxProgressBar: React.FC<{ roll: FabricRoll }> = ({ roll }) => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!roll.relaxDate || !roll.relaxTime) {
      setProgress(0);
      return;
    }

    const calculateProgress = () => {
      const startTime = new Date(`${roll.relaxDate}T${roll.relaxTime}`);
      const now = new Date();
      const elapsedHours =
        (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      const calculatedProgress = Math.min(
        100,
        (elapsedHours / roll.hourStandard) * 100
      );

      setProgress(calculatedProgress);
      setIsCompleted(calculatedProgress >= 100);
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [roll.relaxDate, roll.relaxTime, roll.hourStandard]);

  const barColor = isCompleted ? "bg-green-500" : "bg-blue-500";

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`${barColor} h-2.5 rounded-full`}
        style={{ width: `${progress}%` }}
        title={`${Math.round(progress)}% Complete`}
      ></div>
    </div>
  );
};

const columnConfig: {
  id: string;
  header: string;
  cell?: (item: FabricRoll) => React.ReactNode;
}[] = [
  { id: "poNumber", header: "Order No" },
  { id: "supplierCode", header: "Supplier Code" },
  { id: "invoiceNo", header: "Invoice No" },
  { id: "rollNo", header: "Roll No" },
  { id: "color", header: "Color" },
  { id: "lotNo", header: "Batch No" },
  { id: "yards", header: "Shipped length" },
  { id: "balanceYards", header: "Actual length" },
  { id: "grossWeightKgs", header: "Gross Weight" },
  { id: "netWeightKgs", header: "Net Weight" },
  {
    id: "qcStatus",
    header: "QC Status",
    cell: (item) => <StatusBadge status={item.qcStatus} />,
  },
  { id: "location", header: "Location" },
  { id: "factory", header: "Factory" },
  { id: "hourStandard", header: "Relax hour" },
  {
    id: "relaxProgress",
    header: "Relax Progress",
    cell: (item) => <RelaxProgressBar roll={item} />,
  },
  {
    id: "relaxDate",
    header: "Date Relaxed",
    cell: (item) =>
      item.relaxDate ? new Date(item.relaxDate).toLocaleDateString() : "-",
  },
];

const ColumnToggleButton: React.FC<{
  allColumns: Column[];
  visibleColumns: Set<string>;
  onColumnVisibilityChange: (newVisibleColumns: Set<string>) => void;
}> = ({ allColumns, visibleColumns, onColumnVisibilityChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  return (
    <div className="relative inline-block ml-2" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <View className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 border border-gray-200">
          <div className="p-2">
            <p className="text-sm font-semibold text-gray-800 px-2 py-1 uppercase">
              Toggle Columns
            </p>
          </div>
          <div className="border-t border-gray-200"></div>
          <div className="py-1 max-h-60 overflow-y-auto">
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
                <span className="ml-3 uppercase">{column.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  allColumns,
  visibleColumns,
  onColumnVisibilityChange,
  selectedRows,
  onSelectionChange,
  onPrintSingle,
  onViewHistorySingle,
  onTransferSingle,
  onDeleteSingle,
}) => {
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const displayedColumnConfig = columnConfig.filter((c) =>
    visibleColumns.has(c.id)
  );

  // Effect for closing the action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      const numSelected = selectedRows.size;
      const numItems = items.length;
      selectAllCheckboxRef.current.checked =
        numSelected === numItems && numItems > 0;
      selectAllCheckboxRef.current.indeterminate =
        numSelected > 0 && numSelected < numItems;
    }
  }, [selectedRows, items]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allItemIds = new Set(items.map((item) => item.id));
      onSelectionChange(allItemIds);
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectOne = (itemId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    onSelectionChange(newSelection);
  };

  const handleActionClick = (action: () => void) => {
    action();
    setOpenMenuId(null);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  ref={selectAllCheckboxRef}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              {displayedColumnConfig.map((col) => (
                <th
                  key={col.id}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-20">
                <div className="flex items-center justify-end space-x-2">
                  {/* <span>Actions</span> */}
                  <ColumnToggleButton
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    onColumnVisibilityChange={onColumnVisibilityChange}
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-gray-50 ${
                  selectedRows.has(item.id) ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(item.id)}
                    onChange={() => handleSelectOne(item.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                {displayedColumnConfig.map((col) => (
                  <td
                    key={col.id}
                    className="px-4 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {col.cell
                      ? col.cell(item)
                      : (item[col.id as keyof FabricRoll] as string)}
                  </td>
                ))}
                <td
                  className={`relative px-4 py-4 whitespace-nowrap text-right text-sm font-medium  right-0 z-10 ${
                    selectedRows.has(item.id) ? "bg-blue-50" : "bg-white"
                  } hover:bg-gray-50`}
                >
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === item.id ? null : item.id)
                    }
                    className="p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {openMenuId === item.id && (
                    <div
                      ref={actionMenuRef}
                      className="absolute right-12 top-0 mt-2 w-56 bg-white rounded-md shadow-lg z-30 border border-gray-200 origin-top-right"
                    >
                      <div className="py-1">
                        <button
                          onClick={() =>
                            handleActionClick(() => onPrintSingle(item))
                          }
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Printer className="w-4 h-4 mr-3" /> Print QR Code
                        </button>
                        <button
                          onClick={() =>
                            handleActionClick(() => onViewHistorySingle(item))
                          }
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <History className="w-4 h-4 mr-3" /> View Location
                          History
                        </button>
                        <button
                          onClick={() =>
                            handleActionClick(() => onTransferSingle(item))
                          }
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Move className="w-4 h-4 mr-3" /> Transfer Location
                        </button>
                        <div className="border-t my-1"></div>
                        <button
                          onClick={() =>
                            handleActionClick(() => onDeleteSingle(item))
                          }
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-3" /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
