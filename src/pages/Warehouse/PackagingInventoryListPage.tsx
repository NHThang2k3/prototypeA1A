// Path: src/pages/packaging-inventory-list/PackagingInventoryListPage.tsx
// SYNTHESIZED SINGLE-FILE COMPONENT

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  type FC,
  type ReactNode,
} from "react";
import {
  FileDown,
  View,
  Printer,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MoreHorizontal,
  Move,
  PackageMinus,
} from "lucide-react";

// --- TYPE DEFINITIONS (from types.ts) ---

type PackagingStatus = "In Stock" | "Out of Stock" | "Low Stock";

interface PackagingItem {
  id: string;
  qrCode: string;
  itemNumber: string;
  itemCategory: string;
  materialName: string;
  color: string;
  size: string;
  quantity: number;
  unit: string;
  location: string;
  requiredQuantity: number;
  status: PackagingStatus;
  batchNumber: string;
  dateReceived: string;
  supplier: string;
  poNumber: string;
  reorderPoint: number;
  lastModifiedDate: string;
  lastModifiedBy: string;
  description: string;
}

// --- DUMMY DATA (from data.ts) ---

const DUMMY_PACKAGING_DATA: PackagingItem[] = [
  {
    id: "PKG-CTN-001-L",
    qrCode: "PKG-CTN-001-L",
    itemNumber: "CTN-001",
    itemCategory: "Thùng Carton",
    materialName: "Thùng carton 5 lớp",
    color: "Nâu",
    size: "60x40x40 cm",
    quantity: 1200,
    unit: "Thùng",
    location: "Kệ P-01-A",
    requiredQuantity: 200,
    status: "In Stock",
    batchNumber: "CTN231001",
    dateReceived: "2023-10-01",
    supplier: "Bao bì Toàn Quốc",
    poNumber: "PO-PKG-081",
    reorderPoint: 300,
    lastModifiedDate: "2023-10-25",
    lastModifiedBy: "Khoa Nguyễn",
    description: "Thùng carton lớn để đóng gói áo khoác.",
  },
  {
    id: "PKG-POLY-002-M",
    qrCode: "PKG-POLY-002-M",
    itemNumber: "POLY-002",
    itemCategory: "Túi Poly",
    materialName: "Túi poly có khóa zip",
    color: "Trong suốt",
    size: "30x40 cm",
    quantity: 4500,
    unit: "Túi",
    location: "Kệ P-02-B",
    requiredQuantity: 1000,
    status: "In Stock",
    batchNumber: "POLY230925",
    dateReceived: "2023-09-25",
    supplier: "Nhựa Rạng Đông",
    poNumber: "PO-PKG-075",
    reorderPoint: 1000,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Linh Trần",
    description: "Túi poly để đóng gói áo thun, có lỗ thoát hơi.",
  },
  {
    id: "PKG-TAPE-001",
    qrCode: "PKG-TAPE-001",
    itemNumber: "TAPE-001",
    itemCategory: "Băng keo",
    materialName: "Băng keo trong",
    color: "Trong suốt",
    size: "4.8cm x 100m",
    quantity: 85,
    unit: "Cuộn",
    location: "Kệ P-05-C",
    requiredQuantity: 20,
    status: "Low Stock",
    batchNumber: "TAPE230901",
    dateReceived: "2023-09-01",
    supplier: "Băng keo Hùng Vương",
    poNumber: "PO-PKG-068",
    reorderPoint: 100,
    lastModifiedDate: "2023-10-24",
    lastModifiedBy: "Khoa Nguyễn",
    description: "Băng keo dán thùng carton, độ dính cao.",
  },
  {
    id: "PKG-LBL-003",
    qrCode: "PKG-LBL-003",
    itemNumber: "LBL-003",
    itemCategory: "Nhãn",
    materialName: "Nhãn vận chuyển",
    color: "Trắng",
    size: "10x15 cm",
    quantity: 0,
    unit: "Cái",
    location: "Kệ P-03-A",
    requiredQuantity: 2000,
    status: "Out of Stock",
    batchNumber: "LBL230815",
    dateReceived: "2023-08-15",
    supplier: "Giấy in An Lộc",
    poNumber: "PO-PKG-052",
    reorderPoint: 500,
    lastModifiedDate: "2023-10-15",
    lastModifiedBy: "Linh Trần",
    description: "Nhãn in thông tin vận chuyển, có keo dán sẵn.",
  },
  {
    id: "PKG-PAP-001",
    qrCode: "PKG-PAP-001",
    itemNumber: "PAP-001",
    itemCategory: "Giấy lót",
    materialName: "Giấy nến lót",
    color: "Trắng",
    size: "40x60 cm",
    quantity: 15000,
    unit: "Tờ",
    location: "Kệ P-04-D",
    requiredQuantity: 3000,
    status: "In Stock",
    batchNumber: "PAP231010",
    dateReceived: "2023-10-10",
    supplier: "Giấy Vĩnh Phú",
    poNumber: "PO-PKG-085",
    reorderPoint: 2000,
    lastModifiedDate: "2023-10-22",
    lastModifiedBy: "Khoa Nguyễn",
    description: "Giấy lót giữa các lớp áo để chống nhăn.",
  },
  {
    id: "PKG-CTN-002-S",
    qrCode: "PKG-CTN-002-S",
    itemNumber: "CTN-002",
    itemCategory: "Thùng Carton",
    materialName: "Thùng carton 3 lớp",
    color: "Nâu",
    size: "30x20x15 cm",
    quantity: 2500,
    unit: "Thùng",
    location: "Kệ P-01-B",
    requiredQuantity: 500,
    status: "In Stock",
    batchNumber: "CTN231005",
    dateReceived: "2023-10-05",
    supplier: "Bao bì Toàn Quốc",
    poNumber: "PO-PKG-083",
    reorderPoint: 500,
    lastModifiedDate: "2023-10-25",
    lastModifiedBy: "Linh Trần",
    description: "Thùng carton nhỏ cho phụ kiện hoặc đơn hàng nhỏ.",
  },
];

// --- COLUMN CONFIGURATIONS ---

// List of all available columns for the user to toggle
const allColumns = [
  { id: "qrCode", name: "QR Code" },
  { id: "itemNumber", name: "Item Number" },
  { id: "materialName", name: "Material Name" },
  { id: "description", name: "Description" },
  { id: "color", name: "Color" },
  { id: "size", name: "Size" },
  { id: "quantity", name: "Quantity" },
  { id: "unit", name: "Unit" },
  { id: "location", name: "Location" },
  { id: "status", name: "Status" },
  { id: "supplier", name: "Supplier" },
  { id: "poNumber", name: "PO Number" },
  { id: "itemCategory", name: "Item Category" },
  { id: "requiredQuantity", name: "Required Quantity" },
  { id: "batchNumber", name: "Batch Number" },
  { id: "dateReceived", name: "Date Received" },
  { id: "reorderPoint", name: "Reorder Point" },
  { id: "lastModifiedDate", name: "Last Modified Date" },
  { id: "lastModifiedBy", name: "Last Modified By" },
];

// Default columns to show on initial load
const defaultVisibleColumns = new Set([
  "qrCode",
  "itemNumber",
  "materialName",
  "color",
  "quantity",
  "unit",
  "location",
  "status",
  "supplier",
]);

// --- CHILD COMPONENTS ---

// --- StatusBadge.tsx ---
const StatusBadge: FC<{ status: PackagingStatus }> = ({ status }) => {
  const statusMap: Record<
    PackagingStatus,
    { text: string; className: string }
  > = {
    "In Stock": { text: "In Stock", className: "bg-green-100 text-green-800" },
    "Low Stock": {
      text: "Low Stock",
      className: "bg-yellow-100 text-yellow-800",
    },
    "Out of Stock": {
      text: "Out of Stock",
      className: "bg-red-100 text-red-800",
    },
  };

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

// --- Skeletons (FilterSkeleton.tsx, TableSkeleton.tsx) ---
const FilterSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
    <div className="h-7 bg-gray-200 rounded w-full mb-6"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="flex justify-end space-x-3">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-8 bg-gray-200 rounded w-48"></div>
      </div>
      <div className="flex space-x-2">
        <div className="h-10 bg-gray-200 rounded w-28"></div>
        <div className="h-10 bg-gray-200 rounded w-28"></div>
      </div>
    </div>
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

// --- PackagingInventoryHeader.tsx ---
interface PackagingInventoryHeaderProps {
  allColumns: { id: string; name: string }[];
  visibleColumns: Set<string>;
  onColumnVisibilityChange: (newVisibleColumns: Set<string>) => void;
  selectedRowCount: number;
  onPrintMultiple: () => void;
  onExportExcel: () => void;
}

const PackagingInventoryHeader: FC<PackagingInventoryHeaderProps> = ({
  allColumns,
  visibleColumns,
  onColumnVisibilityChange,
  selectedRowCount,
  onPrintMultiple,
  onExportExcel,
}) => {
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

// --- PackagingInventoryFilters.tsx ---
const PackagingInventoryFilters = () => {
  const [isOpen, setIsOpen] = useState(true);
  const inputClass =
    "mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-lg font-semibold text-gray-900 ${
          isOpen ? "mb-6" : ""
        }`}
      >
        <span className="flex items-center">
          <SlidersHorizontal className="w-5 h-5 mr-3 text-gray-500" />
          Filters
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
            <div>
              <label
                htmlFor="itemNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Item Number
              </label>
              <input
                type="text"
                id="itemNumber"
                className={inputClass}
                placeholder="e.g., BTN-001"
              />
            </div>
            <div>
              <label
                htmlFor="poNumber"
                className="block text-sm font-medium text-gray-700"
              >
                PO Number
              </label>
              <input
                type="text"
                id="poNumber"
                className={inputClass}
                placeholder="e.g., PO23-115"
              />
            </div>
            <div>
              <label
                htmlFor="materialName"
                className="block text-sm font-medium text-gray-700"
              >
                Material Name
              </label>
              <input
                type="text"
                id="materialName"
                className={inputClass}
                placeholder="e.g., Cúc nhựa"
              />
            </div>
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
                placeholder="e.g., Đen"
              />
            </div>
            <div>
              <label
                htmlFor="supplier"
                className="block text-sm font-medium text-gray-700"
              >
                Supplier
              </label>
              <input
                type="text"
                id="supplier"
                className={inputClass}
                placeholder="e.g., Phụ liệu Phong Phú"
              />
            </div>
            <div>
              <label
                htmlFor="batchNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Batch Number
              </label>
              <input
                type="text"
                id="batchNumber"
                className={inputClass}
                placeholder="e.g., B20231001"
              />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              className="bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-200"
            >
              Reset
            </button>
            <button
              type="submit"
              onClick={(e) => e.preventDefault()}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
            >
              <Search className="w-5 h-5 mr-2 -ml-1" />
              Apply Filters
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// --- PackagingInventoryTable.tsx ---
interface PackagingInventoryTableProps {
  items: PackagingItem[];
  visibleColumns: Set<string>;
  selectedRows: Set<string>;
  onSelectionChange: (newSelection: Set<string>) => void;
  onPrintQr: (item: PackagingItem) => void;
  onTransferLocation: (item: PackagingItem) => void;
  onIssue: (item: PackagingItem) => void;
}

const PackagingInventoryTable: FC<PackagingInventoryTableProps> = ({
  items,
  visibleColumns,
  selectedRows,
  onSelectionChange,
  onPrintQr,
  onTransferLocation,
  onIssue,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !menuRef.current?.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

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

  const columnConfig: {
    id: keyof PackagingItem;
    header: string;
    cell?: (item: PackagingItem) => React.ReactNode;
  }[] = [
    {
      id: "qrCode",
      header: "QR Code",
      cell: (item) => (
        <span className="font-medium text-blue-600">{item.qrCode}</span>
      ),
    },
    {
      id: "itemNumber",
      header: "Item Number",
      cell: (item) => (
        <span className="font-medium text-gray-800">{item.itemNumber}</span>
      ),
    },
    { id: "itemCategory", header: "Item Category" },
    { id: "materialName", header: "Material Name" },
    { id: "color", header: "Color" },
    { id: "size", header: "Size" },
    {
      id: "quantity",
      header: "Quantity",
      cell: (item) => <span>{item.quantity.toLocaleString()}</span>,
    },
    { id: "unit", header: "Unit" },
    { id: "location", header: "Location" },
    {
      id: "requiredQuantity",
      header: "Required Qty",
      cell: (item) => <span>{item.requiredQuantity.toLocaleString()}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    { id: "batchNumber", header: "Batch Number" },
    {
      id: "dateReceived",
      header: "Date Received",
      cell: (item) => new Date(item.dateReceived).toLocaleDateString(),
    },
    { id: "supplier", header: "Supplier" },
    { id: "poNumber", header: "PO Number" },
    {
      id: "reorderPoint",
      header: "Reorder Point",
      cell: (item) => <span>{item.reorderPoint.toLocaleString()}</span>,
    },
    {
      id: "lastModifiedDate",
      header: "Last Modified",
      cell: (item) => new Date(item.lastModifiedDate).toLocaleDateString(),
    },
    { id: "lastModifiedBy", header: "Modified By" },
    { id: "description", header: "Description" },
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectionChange(new Set(items.map((item) => item.id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectOne = (itemId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(itemId)) newSelection.delete(itemId);
    else newSelection.add(itemId);
    onSelectionChange(newSelection);
  };

  const TableHeader = ({ children }: { children: ReactNode }) => (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <span className="flex items-center cursor-pointer hover:text-gray-800">
        {children}
        <ArrowUpDown className="w-4 h-4 ml-1.5" />
      </span>
    </th>
  );

  const displayedColumns = columnConfig.filter((c) => visibleColumns.has(c.id));

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  ref={selectAllCheckboxRef}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              {displayedColumns.map((col) => (
                <TableHeader key={col.id}>{col.header}</TableHeader>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
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
                {displayedColumns.map((col) => (
                  <td
                    key={col.id}
                    className="px-4 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {col.cell
                      ? col.cell(item)
                      : (item[col.id as keyof PackagingItem] as string)}
                  </td>
                ))}
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === item.id ? null : item.id)
                    }
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {openMenuId === item.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200 origin-top-right"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onPrintQr(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Printer className="w-4 h-4 mr-3" /> Print QR Code
                        </button>
                        <button
                          onClick={() => {
                            onIssue(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <PackageMinus className="w-4 h-4 mr-3" /> Issue for
                          Production
                        </button>
                        <button
                          onClick={() => {
                            onTransferLocation(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Move className="w-4 h-4 mr-3" /> Transfer Location
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

// --- Pagination.tsx ---
interface PaginationProps {
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (size: number) => void;
}

const Pagination: FC<PaginationProps> = ({
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
      <div className="flex-1 flex justify-end items-center">
        <p className="text-sm text-gray-700 mr-4">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </p>
        <div>
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

// --- Modal Components (Internal to Page) ---
const Modal: FC<{
  title: string;
  children: ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
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

const IssueModal: FC<{
  item: PackagingItem;
  onSubmit: (quantity: number) => void;
  onCancel: () => void;
}> = ({ item, onSubmit, onCancel }) => {
  const [quantity, setQuantity] = useState<number | string>("");
  return (
    <Modal title={`Issue Packaging: ${item.itemNumber}`} onClose={onCancel}>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">{item.materialName}</span> - {item.color}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Current quantity: <span className="font-bold">{item.quantity}</span>{" "}
        {item.unit}
      </p>
      <div>
        <label
          htmlFor="quantity-issue"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quantity to issue
        </label>
        <input
          type="number"
          id="quantity-issue"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., 100"
          min="1"
          max={item.quantity}
        />
      </div>
      <button
        onClick={() => onSubmit(Number(quantity))}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        disabled={
          !quantity || Number(quantity) <= 0 || Number(quantity) > item.quantity
        }
      >
        Confirm Issue
      </button>
    </Modal>
  );
};

// --- MAIN PAGE COMPONENT ---

const PackagingInventoryListPage = () => {
  const [packagingItems, setPackagingItems] = useState<PackagingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    defaultVisibleColumns
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  type ModalType = "transfer" | "issue";
  const [modalState, setModalState] = useState<{
    type: ModalType | null;
    data: PackagingItem | null;
  }>({ type: null, data: null });

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setPackagingItems(DUMMY_PACKAGING_DATA);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectedRows(new Set());
  }, [currentPage, rowsPerPage]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return packagingItems.slice(startIndex, startIndex + rowsPerPage);
  }, [packagingItems, currentPage, rowsPerPage]);

  const handlePrintQr = (item: PackagingItem) =>
    alert(`Printing QR Code for: ${item.qrCode}`);

  const handlePrintMultipleQr = () => {
    if (selectedRows.size === 0) return alert("No rows selected to print.");
    alert(`Printing QR Codes for: ${Array.from(selectedRows).join(", ")}`);
    setSelectedRows(new Set());
  };

  const handleExportExcel = () => {
    if (selectedRows.size === 0) return alert("No rows selected to export.");
    alert(`Exporting data for: ${Array.from(selectedRows).join(", ")}`);
    setSelectedRows(new Set());
  };

  const handleExecuteIssue = (
    itemToUpdate: PackagingItem,
    quantityToIssue: number
  ) => {
    if (
      !quantityToIssue ||
      quantityToIssue <= 0 ||
      quantityToIssue > itemToUpdate.quantity
    ) {
      return alert("Invalid quantity to issue.");
    }
    setPackagingItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemToUpdate.id) {
          const newQuantity = item.quantity - quantityToIssue;
          let newStatus: PackagingStatus = "In Stock";
          if (newQuantity <= 0) newStatus = "Out of Stock";
          else if (newQuantity <= item.reorderPoint) newStatus = "Low Stock";
          return {
            ...item,
            quantity: newQuantity,
            status: newStatus,
            lastModifiedDate: new Date().toISOString().split("T")[0],
            lastModifiedBy: "Admin User",
          };
        }
        return item;
      })
    );
    setModalState({ type: null, data: null });
    alert(
      `Issued ${quantityToIssue} ${itemToUpdate.unit} of ${itemToUpdate.itemNumber}.`
    );
  };

  const handleTransferLocation = (
    itemToUpdate: PackagingItem,
    newLocation: string
  ) => {
    if (!newLocation.trim()) return alert("New location cannot be empty.");
    setPackagingItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemToUpdate.id
          ? {
              ...item,
              location: newLocation,
              lastModifiedDate: new Date().toISOString().split("T")[0],
              lastModifiedBy: "Admin User",
            }
          : item
      )
    );
    setModalState({ type: null, data: null });
    alert(
      `Transferred ${itemToUpdate.itemNumber} to new location: ${newLocation}`
    );
  };

  const renderModal = () => {
    if (!modalState.data) return null;
    switch (modalState.type) {
      case "transfer":
        return (
          <Modal
            title={`Transfer Location for ${modalState.data.itemNumber}`}
            onClose={() => setModalState({ type: null, data: null })}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newLocation = (
                  e.currentTarget.elements.namedItem(
                    "new-location"
                  ) as HTMLInputElement
                ).value;
                handleTransferLocation(modalState.data!, newLocation);
              }}
            >
              <p className="mb-4">
                Current location:{" "}
                <span className="font-semibold">
                  {modalState.data.location}
                </span>
              </p>
              <label
                htmlFor="new-location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New location
              </label>
              <input
                type="text"
                id="new-location"
                name="new-location"
                className="block w-full py-2 px-3 border border-gray-300 rounded-md"
                placeholder="e.g., Kệ Z-99-99"
                required
              />
              <button
                type="submit"
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Confirm Transfer
              </button>
            </form>
          </Modal>
        );
      case "issue":
        return (
          <IssueModal
            item={modalState.data}
            onSubmit={(quantity) =>
              handleExecuteIssue(modalState.data!, quantity)
            }
            onCancel={() => setModalState({ type: null, data: null })}
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
            <PackagingInventoryHeader
              allColumns={allColumns}
              visibleColumns={visibleColumns}
              onColumnVisibilityChange={setVisibleColumns}
              selectedRowCount={selectedRows.size}
              onPrintMultiple={handlePrintMultipleQr}
              onExportExcel={handleExportExcel}
            />
            <PackagingInventoryFilters />
            {packagingItems.length > 0 ? (
              <>
                <PackagingInventoryTable
                  items={paginatedItems}
                  visibleColumns={visibleColumns}
                  selectedRows={selectedRows}
                  onSelectionChange={setSelectedRows}
                  onPrintQr={handlePrintQr}
                  onTransferLocation={(item) =>
                    setModalState({ type: "transfer", data: item })
                  }
                  onIssue={(item) =>
                    setModalState({ type: "issue", data: item })
                  }
                />
                <Pagination
                  currentPage={currentPage}
                  totalItems={packagingItems.length}
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

export default PackagingInventoryListPage;
