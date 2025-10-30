// src/pages/Warehouse/InventoryListPage.tsx

export type QCStatus = "Passed" | "Failed" | "Pending";

export interface LocationHistoryEntry {
  dateTime: string; // ISO 8601 format string
  from: string;
  to: string;
  changedBy: string;
}

export interface FabricRoll {
  id: string; // Using QR Code as a unique ID
  poNumber: string;
  itemCode: string;
  factory: string;
  supplier: string;
  supplierCode: string;
  invoiceNo: string;
  colorCode: string;
  color: string;
  rollNo: string;
  lotNo: string;
  yards: number;
  netWeightKgs: number;
  grossWeightKgs: number;
  width: string;
  location: string;
  qrCode: string;
  dateInHouse: string;
  description: string;
  qcStatus: QCStatus;
  qcDate: string;
  qcBy: string;
  comment: string;
  printed: boolean;
  balanceYards: number;
  hourStandard: number;
  hourRelax: number;
  relaxDate: string;
  relaxTime: string;
  relaxBy: string;
  needRelax: "Yes" | "No"; // Đã thêm cột này
  parentQrCode: string | null;
  locationHistory: LocationHistoryEntry[];
}

const DUMMY_FABRIC_DATA: FabricRoll[] = [
  {
    id: "QR-76433",
    poNumber: "POPU0018235",
    itemCode: "CK-126-04-00277",
    factory: "Factory C",
    supplier: "Supplier Z",
    supplierCode: "SUP-Z",
    invoiceNo: "INV-005",
    colorCode: "CC-002",
    color: "Puma Black",
    rollNo: "1",
    lotNo: "225628091",
    yards: 45,
    netWeightKgs: 17.4,
    grossWeightKgs: 17.8,
    width: '68"',
    location: "F2-03-05",
    qrCode: "QR-76433",
    dateInHouse: "2023-02-18",
    description: "Polyester Blend",
    qcStatus: "Failed",
    qcDate: "2023-04-29",
    qcBy: "John Doe",
    comment: "Minor defect on edge",
    printed: true,
    balanceYards: 37,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-01-17",
    relaxTime: "09:00",
    relaxBy: "Alice",
    needRelax: "Yes", // Đã thêm giá trị
    parentQrCode: null,
    locationHistory: [],
  },
  {
    id: "QR-93641",
    poNumber: "PSPU0002986",
    itemCode: "WO-413-04-00361",
    factory: "Factory B",
    supplier: "Supplier X",
    supplierCode: "SUP-X",
    invoiceNo: "INV-006",
    colorCode: "CC-004",
    color: "PUMA BLACK",
    rollNo: "1",
    lotNo: "225628091",
    yards: 22,
    netWeightKgs: 4.5,
    grossWeightKgs: 4.8,
    width: '57"',
    location: "F2-03-06",
    qrCode: "QR-93641",
    dateInHouse: "2023-03-16",
    description: "Silk Blend",
    qcStatus: "Passed",
    qcDate: "2023-08-05",
    qcBy: "Jane Smith",
    comment: "No issues found",
    printed: false,
    balanceYards: 13,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-05-10",
    relaxTime: "15:45",
    relaxBy: "Bob",
    needRelax: "No", // Đã thêm giá trị
    parentQrCode: null,
    locationHistory: [],
  },
  {
    id: "QR-89437",
    poNumber: "PSPU0002986",
    itemCode: "WO-413-04-00361",
    factory: "Factory B",
    supplier: "Supplier X",
    supplierCode: "SUP-X",
    invoiceNo: "INV-007",
    colorCode: "CC-003",
    color: "PUMA WHITE",
    rollNo: "2",
    lotNo: "225628091",
    yards: 119,
    netWeightKgs: 24.6,
    grossWeightKgs: 24.7,
    width: '57"',
    location: "F2-03-07",
    qrCode: "QR-89437",
    dateInHouse: "2023-11-22",
    description: "Polyester Blend",
    qcStatus: "Failed",
    qcDate: "2023-03-18",
    qcBy: "Peter Jones",
    comment: "Approved for production",
    printed: true,
    balanceYards: 26,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-05-25",
    relaxTime: "15:45",
    relaxBy: "Bob",
    needRelax: "Yes", // Đã thêm giá trị
    parentQrCode: null,
    locationHistory: [],
  },
  {
    id: "QR-22682",
    poNumber: "SPPU0004476",
    itemCode: "CK-105-05-00062",
    factory: "Factory C",
    supplier: "Supplier Y",
    supplierCode: "SUP-Y",
    invoiceNo: "INV-008",
    colorCode: "CC-003",
    color: "PUMA WHITE",
    rollNo: "1",
    lotNo: "225628091",
    yards: 4,
    netWeightKgs: 1,
    grossWeightKgs: 1.4,
    width: '61"',
    location: "F2-03-08",
    qrCode: "QR-22682",
    dateInHouse: "2023-12-08",
    description: "Cotton Fabric",
    qcStatus: "Failed",
    qcDate: "2023-02-27",
    qcBy: "John Doe",
    comment: "No issues found",
    printed: false,
    balanceYards: 32,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-03-06",
    relaxTime: "10:30",
    relaxBy: "Charlie",
    needRelax: "No", // Đã thêm giá trị
    parentQrCode: null,
    locationHistory: [],
  },
  {
    id: "QR-16812",
    poNumber: "SSPU0002939",
    itemCode: "CK-105-04-00325",
    factory: "Factory C",
    supplier: "Supplier Y",
    supplierCode: "SUP-Y",
    invoiceNo: "INV-009",
    colorCode: "CC-002",
    color: "PUMA WHITE",
    rollNo: "1",
    lotNo: "225628091",
    yards: 90,
    netWeightKgs: 24,
    grossWeightKgs: 24.4,
    width: '63"',
    location: "F2-03-09",
    qrCode: "QR-16812",
    dateInHouse: "2023-05-05",
    description: "Denim Material",
    qcStatus: "Pending",
    qcDate: "2023-03-12",
    qcBy: "Peter Jones",
    comment: "Rework required",
    printed: true,
    balanceYards: 26,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-02-24",
    relaxTime: "15:45",
    relaxBy: "Alice",
    needRelax: "Yes", // Đã thêm giá trị
    parentQrCode: null,
    locationHistory: [],
  },
];

// =================================================================================
// Consolidated Imports & Component Definitions
// =================================================================================

import React, { useState, useEffect, useMemo, useRef, type FC } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileDown,
  History,
  MoreVertical,
  Move,
  Printer,
  Search,
  SlidersHorizontal,
  Trash2,
  View,
} from "lucide-react";

export const FilterSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
    {/* Header Skeleton */}
    <div className="h-7 bg-gray-200 rounded w-full mb-6"></div>

    {/* Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>

    {/* Buttons Skeleton */}
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="flex justify-end space-x-3">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
    {/* Header Skeleton */}
    <div className="flex justify-between items-center mb-6">
      <div className="h-8 bg-gray-200 rounded w-64"></div>
      <div className="flex space-x-2">
        <div className="h-10 bg-gray-200 rounded w-40"></div>
      </div>
    </div>

    {/* Table Content Skeleton */}
    <div className="w-full">
      <div className="flex bg-gray-50 p-4 rounded-t-lg">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex-1 h-6 bg-gray-200 rounded mx-2"></div>
        ))}
      </div>
      <div className="space-y-2 mt-2">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="flex items-center p-4 border-b border-gray-100"
          >
            {[...Array(10)].map((_, j) => (
              <div
                key={j}
                className="flex-1 h-6 bg-gray-200 rounded mx-2"
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface StatusBadgeProps {
  status: QCStatus;
}

const statusMap: Record<QCStatus, { text: string; className: string }> = {
  Passed: { text: "Passed", className: "bg-green-100 text-green-800" },
  Failed: { text: "Failed", className: "bg-red-100 text-red-800" },
  Pending: { text: "Pending", className: "bg-yellow-100 text-yellow-800" },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { text, className } = statusMap[status] || {
    text: "Unknown",
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${className}`}
    >
      {text}
    </span>
  );
};

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

const inputClass =
  "mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

export const InventoryFilters = () => {
  // NOTE: For a real application, the state and onChange handlers would be passed via props.
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-lg font-semibold text-gray-900 ${
          isOpen ? "mb-6" : ""
        }`}
      >
        <span className="flex items-center">
          <SlidersHorizontal className="w-5 h-5 mr-3 text-gray-500" />
          Search
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <form className="transition-opacity duration-300 ease-in-out">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {/* PO NO */}
            <div>
              <label
                htmlFor="poNumber"
                className="block text-sm font-medium text-gray-700"
              >
                PO NO
              </label>
              <input
                type="text"
                id="poNumber"
                className={inputClass}
                placeholder="e.g., POPU0018251"
              />
            </div>

            {/* Supplier Code */}
            <div>
              <label
                htmlFor="supplierCode"
                className="block text-sm font-medium text-gray-700"
              >
                Supplier Code
              </label>
              <input
                type="text"
                id="supplierCode"
                className={inputClass}
                placeholder="e.g., SUP-Y"
              />
            </div>

            {/* Invoice No */}
            <div>
              <label
                htmlFor="invoiceNo"
                className="block text-sm font-medium text-gray-700"
              >
                Invoice No
              </label>
              <input
                type="text"
                id="invoiceNo"
                className={inputClass}
                placeholder="e.g., INV-001"
              />
            </div>

            {/* Fabric */}
            <div>
              <label
                htmlFor="rollNo"
                className="block text-sm font-medium text-gray-700"
              >
                Fabric
              </label>
              <input
                type="text"
                id="rollNo"
                className={inputClass}
                placeholder="e.g., 1"
              />
            </div>

            {/* Color */}
            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700"
              >
                Color
              </label>
              <input
                type="text"
                id="color"
                className={inputClass}
                placeholder="e.g., Puma Black"
              />
            </div>

            {/* QC Status */}
            <div>
              <label
                htmlFor="qcStatus"
                className="block text-sm font-medium text-gray-700"
              >
                QC Status
              </label>
              <select id="qcStatus" className={inputClass}>
                <option value="">All Statuses</option>
                {(["Passed", "Failed", "Pending"] as QCStatus[]).map(
                  (status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              className="bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-200"
            >
              Clear
            </button>
            <button
              type="submit"
              onClick={(e) => e.preventDefault()} // Prevent form submission for this demo
              className="flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
            >
              <Search className="w-5 h-5 mr-2 -ml-1" />
              Search
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

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
  { id: "poNumber", header: "PO NO" },
  { id: "supplierCode", header: "Supplier Code" },
  { id: "invoiceNo", header: "Invoice No" },
  { id: "rollNo", header: "Fabric" },
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
  { id: "needRelax", header: "Need Relax" }, // Đã thêm cấu hình cột
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
                          <Printer className="w-4 h-4 mr-3" /> Reprint QR Code
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

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
      {/* Left side: Rows per page selector */}
      <div className="flex-1 flex items-center">
        <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
        <select
          id="rowsPerPage"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="p-1 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Right side: Navigation */}
      <div className="flex-1 flex justify-end items-center">
        <p className="text-sm text-gray-700 mr-4">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </p>
        <div className="flex items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalItems === 0}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// (allColumns and defaultVisibleColumns remain the same)
const allColumns = [
  { id: "poNumber", name: "PO NO" },
  { id: "supplierCode", name: "Supplier Code" },
  { id: "invoiceNo", name: "Invoice No" },
  { id: "rollNo", name: "Fabric" },
  { id: "color", name: "Color" },
  { id: "lotNo", name: "Batch No" },
  { id: "yards", name: "Shipped length" },
  { id: "balanceYards", name: "Actual length" },
  { id: "grossWeightKgs", name: "Gross Weight" },
  { id: "netWeightKgs", name: "Net Weight" },
  { id: "qcStatus", name: "QC Status" },
  { id: "location", name: "Location" },
  { id: "factory", name: "Factory" },
  { id: "hourStandard", name: "Relax hour" },
  { id: "needRelax", name: "Need Relax" }, // Đã thêm vào danh sách tất cả các cột
  { id: "relaxProgress", name: "Relax Progress" },
  { id: "relaxDate", name: "Date Relaxed" },
];

const defaultVisibleColumns = new Set([
  "poNumber",
  "supplierCode",
  "invoiceNo",
  "rollNo",
  "color",
  "lotNo",
  "balanceYards",
  "qcStatus",
  "location",
  "needRelax", // Đã thêm để hiển thị mặc định
  "relaxProgress",
]);

// --- Modal Components ---

const Modal: FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}> = ({ title, children, onClose, maxWidth = "max-w-md" }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
    <div className={`bg-white p-6 rounded-lg shadow-xl w-full ${maxWidth}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
      </div>
      <div>{children}</div>
    </div>
  </div>
);

const MultiTransferLocationModal: FC<{
  rolls: FabricRoll[];
  onSubmit: (newLocation: string) => void;
  onCancel: () => void;
}> = ({ rolls, onSubmit, onCancel }) => {
  const [newLocation, setNewLocation] = useState("");

  return (
    <Modal title={`Transfer ${rolls.length} Item(s)`} onClose={onCancel}>
      <p className="mb-2 text-sm text-gray-600">
        The following items will be moved:
      </p>
      <div className="mb-4 p-2 border rounded-md bg-gray-50 max-h-40 overflow-y-auto">
        <ul className="list-disc list-inside text-sm text-gray-800">
          {rolls.map((roll) => (
            <li key={roll.id}>
              {roll.qrCode} (Current: {roll.location})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label
          htmlFor="new-location"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          New Location
        </label>
        <input
          type="text"
          id="new-location"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., F2-10-05"
        />
      </div>
      <button
        onClick={() => onSubmit(newLocation)}
        disabled={!newLocation}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        Confirm Transfer
      </button>
    </Modal>
  );
};

const MultiLocationHistoryModal: FC<{
  rolls: FabricRoll[];
  onClose: () => void;
}> = ({ rolls, onClose }) => {
  return (
    <Modal
      title={`Location History for ${rolls.length} Item(s)`}
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {rolls.map((roll) => (
          <div key={roll.id}>
            <h4 className="font-semibold text-lg text-gray-800 mb-2 border-b pb-1">
              {roll.qrCode}
            </h4>
            {roll.locationHistory.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Date Time
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      From
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      To
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...roll.locationHistory].reverse().map((entry, index) => (
                    <tr key={index}>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                        {new Date(entry.dateTime).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {entry.from}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {entry.to}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {entry.changedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-sm text-gray-500 py-2">
                No location history.
              </p>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

// --- Main Page Component ---

const InventoryListPage = () => {
  const [fabricRolls, setFabricRolls] = useState<FabricRoll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    defaultVisibleColumns
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  type ModalType = "transfer" | "history";
  const [modalState, setModalState] = useState<{
    type: ModalType | null;
    data: FabricRoll[];
  }>({ type: null, data: [] });

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setFabricRolls(DUMMY_FABRIC_DATA);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectedRows(new Set());
  }, [currentPage, rowsPerPage]);

  const paginatedRolls = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return fabricRolls.slice(startIndex, endIndex);
  }, [fabricRolls, currentPage, rowsPerPage]);

  const getSelectedItems = (): FabricRoll[] => {
    return fabricRolls.filter((roll) => selectedRows.has(roll.id));
  };

  const handleExportSelected = () => {
    const selectedItems = getSelectedItems();
    alert(`Exporting ${selectedItems.length} selected item(s) to Excel.`);
  };

  const handlePrintMultiple = () => {
    const selectedIds = Array.from(selectedRows).join(", ");
    alert(`Printing QR Codes for: ${selectedIds}`);
    setSelectedRows(new Set());
  };

  const handleTransfer = () => {
    const items = getSelectedItems();
    if (items.length > 0) {
      setModalState({ type: "transfer", data: items });
    }
  };

  const handleViewHistory = () => {
    const items = getSelectedItems();
    if (items.length > 0) {
      setModalState({ type: "history", data: items });
    }
  };

  const handleExecuteTransfer = (
    rollsToUpdate: FabricRoll[],
    newLocation: string
  ) => {
    const idsToUpdate = new Set(rollsToUpdate.map((r) => r.id));

    setFabricRolls((prevRolls) =>
      prevRolls.map((roll) => {
        if (idsToUpdate.has(roll.id)) {
          const newHistoryEntry: LocationHistoryEntry = {
            dateTime: new Date().toISOString(),
            from: roll.location,
            to: newLocation,
            changedBy: "Admin User", // Mock user
          };
          return {
            ...roll,
            location: newLocation,
            locationHistory: [...roll.locationHistory, newHistoryEntry],
          };
        }
        return roll;
      })
    );

    setModalState({ type: null, data: [] });
    setSelectedRows(new Set());
    alert(`${rollsToUpdate.length} item(s) have been moved to ${newLocation}.`);
  };

  const handleDeleteMultiple = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedRows.size} selected item(s)?`
      )
    ) {
      setFabricRolls((prevRolls) =>
        prevRolls.filter((roll) => !selectedRows.has(roll.id))
      );
      alert(`${selectedRows.size} item(s) have been deleted.`);
      setSelectedRows(new Set());
    }
  };

  const handleExportAll = () => {
    alert(`Exporting all ${fabricRolls.length} items to Excel.`);
  };

  // --- Single Item Action Handlers ---
  const handlePrintSingle = (item: FabricRoll) => {
    alert(`Printing QR Code for: ${item.id}`);
  };

  const handleTransferSingle = (item: FabricRoll) => {
    setModalState({ type: "transfer", data: [item] });
  };

  const handleViewHistorySingle = (item: FabricRoll) => {
    setModalState({ type: "history", data: [item] });
  };

  const handleDeleteSingle = (item: FabricRoll) => {
    if (window.confirm(`Are you sure you want to delete item ${item.id}?`)) {
      setFabricRolls((prevRolls) =>
        prevRolls.filter((roll) => roll.id !== item.id)
      );
      alert(`Item ${item.id} has been deleted.`);
      // Also remove from selection if it was selected
      setSelectedRows((prev) => {
        const newSelection = new Set(prev);
        newSelection.delete(item.id);
        return newSelection;
      });
    }
  };

  const renderModal = () => {
    if (!modalState.type || modalState.data.length === 0) return null;

    switch (modalState.type) {
      case "transfer":
        return (
          <MultiTransferLocationModal
            rolls={modalState.data}
            onCancel={() => setModalState({ type: null, data: [] })}
            onSubmit={(newLocation) => {
              handleExecuteTransfer(modalState.data, newLocation);
            }}
          />
        );
      case "history":
        return (
          <MultiLocationHistoryModal
            rolls={modalState.data}
            onClose={() => setModalState({ type: null, data: [] })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {renderModal()}

      <section>
        {isLoading ? (
          <>
            <FilterSkeleton />
            <TableSkeleton />
          </>
        ) : (
          <>
            <InventoryHeader
              selectedRowCount={selectedRows.size}
              onExportAll={handleExportAll}
              onExportSelected={handleExportSelected}
              onPrintMultiple={handlePrintMultiple}
              onTransfer={handleTransfer}
              onViewHistory={handleViewHistory}
              onDelete={handleDeleteMultiple}
            />
            <InventoryFilters />
            {fabricRolls.length > 0 ? (
              <>
                <InventoryTable
                  items={paginatedRolls}
                  allColumns={allColumns}
                  visibleColumns={visibleColumns}
                  onColumnVisibilityChange={setVisibleColumns}
                  selectedRows={selectedRows}
                  onSelectionChange={setSelectedRows}
                  onPrintSingle={handlePrintSingle}
                  onViewHistorySingle={handleViewHistorySingle}
                  onTransferSingle={handleTransferSingle}
                  onDeleteSingle={handleDeleteSingle}
                />
                <Pagination
                  currentPage={currentPage}
                  totalItems={fabricRolls.length}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setCurrentPage}
                  onRowsPerPageChange={setRowsPerPage}
                />
              </>
            ) : (
              <div className="bg-white text-center p-12 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-gray-900">
                  No items found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  No items match the current filters.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default InventoryListPage;
