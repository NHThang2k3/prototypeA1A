import React, { useState, useEffect, useMemo, useRef, type FC } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  FileDown,
  View,
  Printer,
  ArrowUpDown,
  MoreHorizontal,
  Move,
  PackageMinus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ============================================================================
// --- START: TYPES (from src/pages/accessory-inventory-list/types.ts) ---
// ============================================================================

export type AccessoryStatus = "In Stock" | "Out of Stock" | "Low Stock";

export interface AccessoryItem {
  id: string; // Using ItemNumber as a unique ID
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
  status: AccessoryStatus;
  batchNumber: string;
  dateReceived: string;
  supplier: string;
  poNumber: string;
  reorderPoint: number;
  lastModifiedDate: string;
  lastModifiedBy: string;
  description: string;
}

// ==========================================================================
// --- START: DUMMY DATA (from src/pages/accessory-inventory-list/data.ts) ---
// ==========================================================================

const DUMMY_ACCESSORY_DATA: AccessoryItem[] = [
  {
    id: "ACC-LBL-001-MLT",
    qrCode: "ACC-LBL-001-MLT",
    itemNumber: "LBL-001",
    itemCategory: "LBL",
    materialName: "Nhãn dệt logo",
    color: "Nhiều màu",
    size: "2cm x 5cm",
    quantity: 0,
    unit: "Cái",
    location: "Kệ D-05-02",
    requiredQuantity: 1000,
    status: "Out of Stock",
    batchNumber: "L20230701",
    dateReceived: "2023-07-01",
    supplier: "Nhãn mác An Phát",
    poNumber: "PO23-050",
    reorderPoint: 500,
    lastModifiedDate: "2023-10-20",
    lastModifiedBy: "Nguyễn Văn An",
    description: "Nhãn dệt chính cho áo T-shirt.",
  },
  {
    id: "ACC-ELS-001-WHT",
    qrCode: "ACC-ELS-001-WHT",
    itemNumber: "ELS-001",
    itemCategory: "ELS",
    materialName: "Thun dệt kim",
    color: "Trắng",
    size: "2.5cm",
    quantity: 2500,
    unit: "Mét",
    location: "Kệ C-04-08",
    requiredQuantity: 800,
    status: "In Stock",
    batchNumber: "E20230928",
    dateReceived: "2023-09-28",
    supplier: "Phụ liệu Phong Phú",
    poNumber: "PO23-109",
    reorderPoint: 500,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Lê Minh Tuấn",
    description: "Thun luồn lưng quần thể thao.",
  },
  {
    id: "ACC-INT-001-WHT",
    qrCode: "ACC-INT-001-WHT",
    itemNumber: "INT-001",
    itemCategory: "INT",
    materialName: "Keo giấy dựng cổ",
    color: "Trắng",
    size: "90cm",
    quantity: 800,
    unit: "Mét",
    location: "Kệ B-01-03",
    requiredQuantity: 150,
    status: "In Stock",
    batchNumber: "I20230905",
    dateReceived: "2023-09-05",
    supplier: "Dệt may Thành Công",
    poNumber: "PO23-088",
    reorderPoint: 150,
    lastModifiedDate: "2023-10-22",
    lastModifiedBy: "Nguyễn Văn An",
    description: "Keo ủi dùng cho cổ và nẹp áo sơ mi.",
  },
  {
    id: "ACC-ZIP-002-RED",
    qrCode: "ACC-ZIP-002-RED",
    itemNumber: "ZIP-002",
    itemCategory: "ZIP",
    materialName: "Khóa kéo giọt nước",
    color: "Đỏ",
    size: "20cm",
    quantity: 320,
    unit: "Cái",
    location: "Kệ B-03-09",
    requiredQuantity: 100,
    status: "In Stock",
    batchNumber: "Z20231005",
    dateReceived: "2023-10-05",
    supplier: "Phụ liệu Sài Gòn",
    poNumber: "PO23-118",
    reorderPoint: 100,
    lastModifiedDate: "2023-10-25",
    lastModifiedBy: "Trần Thị Bích",
    description: "Khóa kéo giấu, dùng cho đầm nữ.",
  },
  {
    id: "ACC-THR-002-NVY",
    qrCode: "ACC-THR-002-NVY",
    itemNumber: "THR-002",
    itemCategory: "THR",
    materialName: "Chỉ may cotton",
    color: "Xanh Navy",
    size: "50/3",
    quantity: 45,
    unit: "Cuộn",
    location: "Kệ C-02-12",
    requiredQuantity: 60,
    status: "Low Stock",
    batchNumber: "T20230815",
    dateReceived: "2023-08-15",
    supplier: "Sợi Việt Thắng",
    poNumber: "PO23-070",
    reorderPoint: 50,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Lê Minh Tuấn",
    description: "Chỉ cotton chần cho quần kaki.",
  },
  {
    id: "ACC-LBL-002-WHT",
    qrCode: "ACC-LBL-002-WHT",
    itemNumber: "LBL-002",
    itemCategory: "LBL",
    materialName: "Nhãn satin in HDSD",
    color: "Trắng",
    size: "3cm x 6cm",
    quantity: 4500,
    unit: "Cái",
    location: "Kệ D-05-03",
    requiredQuantity: 0,
    status: "In Stock",
    batchNumber: "L20231012",
    dateReceived: "2023-10-12",
    supplier: "Nhãn mác An Phát",
    poNumber: "PO23-124",
    reorderPoint: 1000,
    lastModifiedDate: "2023-10-23",
    lastModifiedBy: "Nguyễn Văn An",
    description: "Nhãn sườn in hướng dẫn sử dụng.",
  },
];

// ======================================================================================
// --- START: SKELETON COMPONENTS (from skeletons/FilterSkeleton & skeletons/TableSkeleton) ---
// ======================================================================================

const FilterSkeleton: FC = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse mb-6">
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

const TableSkeleton: FC = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
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

// =======================================================================================
// --- START: UI COMPONENTS (StatusBadge, Pagination, Filters, Header, Table) ---
// =======================================================================================

const StatusBadge: FC<{ status: AccessoryStatus }> = ({ status }) => {
  const statusMap: Record<
    AccessoryStatus,
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
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalItems === 0}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AccessoryInventoryFilters: FC = () => {
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

interface AccessoryInventoryHeaderProps {
  allColumns: { id: string; name: string }[];
  visibleColumns: Set<string>;
  onColumnVisibilityChange: (newVisibleColumns: Set<string>) => void;
  selectedRowCount: number;
  onPrintMultiple: () => void;
  onExportExcel: () => void;
}

const AccessoryInventoryHeader: FC<AccessoryInventoryHeaderProps> = ({
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
      )
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleColumn = (columnId: string) => {
    const newVisibleColumns = new Set(visibleColumns);
    // ============================================================================
    // --- START: SỬA LỖI 1 ---
    // Lý do: Toán tử ba ngôi được dùng để thực hiện hành động (thêm/xóa phần tử
    // trong Set), vi phạm quy tắc `no-unused-expressions`.
    // Giải pháp: Chuyển đổi sang câu lệnh if/else rõ ràng.
    // ============================================================================
    if (newVisibleColumns.has(columnId)) {
      newVisibleColumns.delete(columnId);
    } else {
      newVisibleColumns.add(columnId);
    }
    // ============================================================================
    // --- END: SỬA LỖI 1 ---
    // ============================================================================
    onColumnVisibilityChange(newVisibleColumns);
  };

  const hasSelection = selectedRowCount > 0;

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Accessory Inventory Management
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

interface AccessoryInventoryTableProps {
  items: AccessoryItem[];
  visibleColumns: Set<string>;
  selectedRows: Set<string>;
  onSelectionChange: (newSelection: Set<string>) => void;
  onPrintQr: (item: AccessoryItem) => void;
  onTransferLocation: (item: AccessoryItem) => void;
  onIssue: (item: AccessoryItem) => void;
}

const AccessoryInventoryTable: FC<AccessoryInventoryTableProps> = ({
  items,
  visibleColumns,
  selectedRows,
  onSelectionChange,
  onPrintQr,
  onTransferLocation,
  onIssue,
}) => {
  const columnConfig: {
    id: keyof AccessoryItem;
    header: string;
    cell?: (item: AccessoryItem) => React.ReactNode;
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

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !menuRef.current?.contains(event.target as Node))
        setOpenMenuId(null);
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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectionChange(
      e.target.checked ? new Set(items.map((item) => item.id)) : new Set()
    );
  };

  const handleSelectOne = (itemId: string) => {
    const newSelection = new Set(selectedRows);
    // ============================================================================
    // --- START: SỬA LỖI 2 ---
    // Lý do: Tương tự lỗi 1, toán tử ba ngôi được dùng để thực hiện hành động,
    // vi phạm quy tắc `no-unused-expressions`.
    // Giải pháp: Chuyển đổi sang câu lệnh if/else rõ ràng.
    // ============================================================================
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    // ============================================================================
    // --- END: SỬA LỖI 2 ---
    // ============================================================================
    onSelectionChange(newSelection);
  };

  const TableHeader = ({ children }: { children: React.ReactNode }) => (
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
              <th className="px-4 py-3 text-right"></th>
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
                      : (item[col.id as keyof AccessoryItem] as string)}
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

// ============================================================================
// --- START: MAIN PAGE COMPONENT (AccessoryInventoryListPage) ---
// ============================================================================

const AccessoryInventoryListPage: FC = () => {
  // --- Data & State ---
  const [accessoryItems, setAccessoryItems] = useState<AccessoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set([
      "qrCode",
      "itemNumber",
      "materialName",
      "color",
      "quantity",
      "unit",
      "location",
      "status",
      "supplier",
    ])
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  type ModalType = "transfer" | "issue";
  const [modalState, setModalState] = useState<{
    type: ModalType | null;
    data: AccessoryItem | null;
  }>({ type: null, data: null });

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

  // --- Effects ---
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setAccessoryItems(DUMMY_ACCESSORY_DATA);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectedRows(new Set());
  }, [currentPage, rowsPerPage]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return accessoryItems.slice(startIndex, startIndex + rowsPerPage);
  }, [accessoryItems, currentPage, rowsPerPage]);

  // --- Handlers ---
  const handlePrintQr = (item: AccessoryItem) =>
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
    itemToUpdate: AccessoryItem,
    quantityToIssue: number
  ) => {
    if (
      !quantityToIssue ||
      quantityToIssue <= 0 ||
      quantityToIssue > itemToUpdate.quantity
    )
      return alert("Invalid quantity to issue.");

    setAccessoryItems((prev) =>
      prev.map((item) => {
        if (item.id === itemToUpdate.id) {
          const newQuantity = item.quantity - quantityToIssue;
          const newStatus: AccessoryStatus =
            newQuantity <= 0
              ? "Out of Stock"
              : newQuantity <= item.reorderPoint
              ? "Low Stock"
              : "In Stock";
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
    itemToUpdate: AccessoryItem,
    newLocation: string
  ) => {
    if (!newLocation.trim()) return alert("New location cannot be empty.");

    setAccessoryItems((prev) =>
      prev.map((item) =>
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

  // --- Modal Components ---
  const Modal: FC<{
    title: string;
    children: React.ReactNode;
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
    item: AccessoryItem;
    onSubmit: (quantity: number) => void;
    onCancel: () => void;
  }> = ({ item, onSubmit, onCancel }) => {
    const [quantity, setQuantity] = useState<number | string>("");
    return (
      <Modal title={`Issue Accessory: ${item.itemNumber}`} onClose={onCancel}>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">{item.materialName}</span> -{" "}
          {item.color}
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
            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            placeholder="e.g., 100"
            min="1"
            max={item.quantity}
          />
        </div>
        <button
          onClick={() => onSubmit(Number(quantity))}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={
            !quantity ||
            Number(quantity) <= 0 ||
            Number(quantity) > item.quantity
          }
        >
          Confirm Issue
        </button>
      </Modal>
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
                handleTransferLocation(
                  modalState.data!,
                  (
                    e.currentTarget.elements.namedItem(
                      "new-location"
                    ) as HTMLInputElement
                  ).value
                );
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
            onSubmit={(q) => handleExecuteIssue(modalState.data!, q)}
            onCancel={() => setModalState({ type: null, data: null })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      {renderModal()}
      {isLoading ? (
        <>
          <div className="h-16 mb-6"></div> {/* Placeholder for header */}
          <FilterSkeleton />
          <TableSkeleton />
        </>
      ) : (
        <>
          <AccessoryInventoryHeader
            allColumns={allColumns}
            visibleColumns={visibleColumns}
            onColumnVisibilityChange={setVisibleColumns}
            selectedRowCount={selectedRows.size}
            onPrintMultiple={handlePrintMultipleQr}
            onExportExcel={handleExportExcel}
          />
          <AccessoryInventoryFilters />
          {accessoryItems.length > 0 ? (
            <>
              <AccessoryInventoryTable
                items={paginatedItems}
                visibleColumns={visibleColumns}
                selectedRows={selectedRows}
                onSelectionChange={setSelectedRows}
                onPrintQr={handlePrintQr}
                onTransferLocation={(item) =>
                  setModalState({ type: "transfer", data: item })
                }
                onIssue={(item) => setModalState({ type: "issue", data: item })}
              />
              <Pagination
                currentPage={currentPage}
                totalItems={accessoryItems.length}
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
    </div>
  );
};

export default AccessoryInventoryListPage;
