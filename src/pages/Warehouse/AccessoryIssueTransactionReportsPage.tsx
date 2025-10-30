// =============== START OF COMBINED FILE: AccessoryIssueTransactionReportsPage.tsx ===============

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Columns,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// =============== TYPES (from types.ts) ===============

// Định nghĩa trạng thái xuất kho phụ liệu
type AccessoryStatus = "Complete" | "Partially" | "Pending";

// Định nghĩa cấu trúc dữ liệu cho một phụ liệu
interface Accessory {
  qrCode: string; // Sử dụng làm ID duy nhất
  itemNumber: string;
  itemCategory: string;
  materialName: string;
  color: string;
  size: string;
  quantity: number;
  unit: string;
  location: string;
  batchNumber: string;
  dateReceived: string; // ISO date string (e.g., '2023-10-01')
  supplier: string;
  poNumber: string;
  reorderPoint: number;
  lastModifiedDate: string; // ISO date string
  lastModifiedBy: string;
  description: string;
  job: string;
  issuedQuantity: number;
  issuedDate: string; // ISO date string
  issuedBy: string;
  destination: string;
  status: AccessoryStatus;
  remark: string | null;
}

// Định nghĩa các trường filter cho báo cáo phụ liệu
interface AccessoryFilters {
  query?: string; // Dùng để tìm kiếm Item Number hoặc PO Number
  supplier?: string;
  status?: AccessoryStatus | "";
  dateFrom?: string; // Date Received from
  dateTo?: string; // Date Received to
}

// =============== CONSTANTS (from constants.ts) ===============

// Định nghĩa cấu trúc cho một cột trong bảng
interface ColumnDefinition {
  key: string; // Phải là một key duy nhất, thường là key trong object data
  label: string; // Tên hiển thị trên header của bảng
}

// Danh sách tất cả các cột có thể có trong bảng phụ liệu
const ALL_COLUMNS: ColumnDefinition[] = [
  { key: "qrCode", label: "QR Code" },
  { key: "itemNumber", label: "Item Number" },
  { key: "itemCategory", label: "Item Category" },
  { key: "materialName", label: "Material Name" },
  { key: "color", label: "Color" },
  { key: "size", label: "Size" },
  { key: "quantity", label: "Quantity" },
  { key: "unit", label: "Unit" },
  { key: "location", label: "Location" },
  { key: "batchNumber", label: "Batch Number" },
  { key: "dateReceived", label: "Date Received" },
  { key: "supplier", label: "Supplier" },
  { key: "poNumber", label: "PO Number" },
  { key: "reorderPoint", label: "Reorder Point" },
  { key: "lastModifiedDate", label: "Last Modified Date" },
  { key: "lastModifiedBy", label: "Last Modified By" },
  { key: "description", label: "Description" },
  { key: "job", label: "JOB" },
  { key: "issuedQuantity", label: "Issued Quantity" },
  { key: "issuedDate", label: "Issued Date" },
  { key: "issuedBy", label: "Issued By" },
  { key: "destination", label: "Destination" },
  { key: "status", label: "Status" },
  { key: "remark", label: "Remark" },
];

// =============== MOCK DATA (from data.ts) ===============

// Dữ liệu mẫu cho phụ liệu
const mockAccessories: Accessory[] = [
  {
    qrCode: "ACC-BTN-001-BLK",
    itemNumber: "BTN-001",
    itemCategory: "BTN",
    materialName: "Cúc nhựa 4 lỗ",
    color: "Đen",
    size: "15mm",
    quantity: 5000,
    unit: "Cái",
    location: "Kệ A-01-05",
    batchNumber: "B20231001",
    dateReceived: "2023-10-01",
    supplier: "Phụ liệu Phong Phú",
    poNumber: "PO23-115",
    reorderPoint: 1000,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Nguyễn Văn An",
    description: "Cúc nhựa thông dụng cho áo sơ mi nam.",
    job: "JOB2310-SM01",
    issuedQuantity: 2000,
    issuedDate: "2023-10-25",
    issuedBy: "Nguyễn Văn An",
    destination: "Chuyền may 1",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "ACC-ZIP-001-BRS",
    itemNumber: "ZIP-001",
    itemCategory: "ZIP",
    materialName: "Khóa kéo kim loại",
    color: "Đồng",
    size: "50cm",
    quantity: 850,
    unit: "Cái",
    location: "Kệ B-03-01",
    batchNumber: "Z20230915",
    dateReceived: "2023-09-15",
    supplier: "Dệt may Thành Công",
    poNumber: "PO23-098",
    reorderPoint: 200,
    lastModifiedDate: "2023-10-25",
    lastModifiedBy: "Trần Thị Bích",
    description: "Dùng cho áo khoác jean, loại răng 5.",
    job: "JOB2310-JK02",
    issuedQuantity: 350,
    issuedDate: "2023-10-24",
    issuedBy: "Trần Thị Bích",
    destination: "Xưởng may 2",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "ACC-THR-001-WHT",
    itemNumber: "THR-001",
    itemCategory: "THR",
    materialName: "Chỉ may polyester",
    color: "Trắng",
    size: "40/2",
    quantity: 150,
    unit: "Cuộn",
    location: "Kệ C-02-11",
    batchNumber: "T20231010",
    dateReceived: "2023-10-10",
    supplier: "Sợi Việt Thắng",
    poNumber: "PO23-121",
    reorderPoint: 50,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Lê Minh Tuấn",
    description: "Chỉ may vắt sổ, độ bền cao.",
    job: "JOB2310-SM01",
    issuedQuantity: 50,
    issuedDate: "2023-10-25",
    issuedBy: "Lê Minh Tuấn",
    destination: "Chuyền may 1",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "ACC-BTN-002-BRN",
    itemNumber: "BTN-002",
    itemCategory: "BTN",
    materialName: "Cúc gỗ 2 lỗ",
    color: "Nâu",
    size: "20mm",
    quantity: 90,
    unit: "Cái",
    location: "Kệ A-01-06",
    batchNumber: "B20230820",
    dateReceived: "2023-08-20",
    supplier: "Phụ liệu Sài Gòn",
    poNumber: "PO23-075",
    reorderPoint: 100,
    lastModifiedDate: "2023-10-24",
    lastModifiedBy: "Trần Thị Bích",
    description: "Cúc trang trí cho áo khoác len.",
    job: "JOB2310-SM02",
    issuedQuantity: 40,
    issuedDate: "2023-10-25",
    issuedBy: "Lê Minh Tuấn",
    destination: "Chuyền may 1",
    status: "Partially",
    remark: "Cần đặt thêm hàng.",
  },
  {
    qrCode: "ACC-ELS-001-WHT",
    itemNumber: "ELS-001",
    itemCategory: "ELS",
    materialName: "Thun dệt kim",
    color: "Trắng",
    size: "2.5cm",
    quantity: 2500,
    unit: "Mét",
    location: "Kệ C-04-08",
    batchNumber: "E20230928",
    dateReceived: "2023-09-28",
    supplier: "Phụ liệu Phong Phú",
    poNumber: "PO23-109",
    reorderPoint: 500,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Lê Minh Tuấn",
    description: "Thun luồn lưng quần thể thao.",
    job: "JOB2310-QT05",
    issuedQuantity: 1200,
    issuedDate: "2023-10-25",
    issuedBy: "Lê Minh Tuấn",
    destination: "Tổ cắt",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "ACC-INT-001-WHT",
    itemNumber: "INT-001",
    itemCategory: "INT",
    materialName: "Keo giấy dựng cổ",
    color: "Trắng",
    size: "90cm",
    quantity: 800,
    unit: "Mét",
    location: "Kệ B-01-03",
    batchNumber: "I20230905",
    dateReceived: "2023-09-05",
    supplier: "Dệt may Thành Công",
    poNumber: "PO23-088",
    reorderPoint: 150,
    lastModifiedDate: "2023-10-22",
    lastModifiedBy: "Nguyễn Văn An",
    description: "Keo ủi dùng cho cổ và nẹp áo sơ mi.",
    job: "JOB2310-SM01",
    issuedQuantity: 400,
    issuedDate: "2023-10-21",
    issuedBy: "Nguyễn Văn An",
    destination: "Tổ ép keo",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "ACC-ZIP-002-RED",
    itemNumber: "ZIP-002",
    itemCategory: "ZIP",
    materialName: "Khóa kéo giọt nước",
    color: "Đỏ",
    size: "20cm",
    quantity: 320,
    unit: "Cái",
    location: "Kệ B-03-09",
    batchNumber: "Z20231005",
    dateReceived: "2023-10-05",
    supplier: "Phụ liệu Sài Gòn",
    poNumber: "PO23-118",
    reorderPoint: 100,
    lastModifiedDate: "2023-10-25",
    lastModifiedBy: "Trần Thị Bích",
    description: "Khóa kéo giấu, dùng cho đầm nữ.",
    job: "JOB2310-D03",
    issuedQuantity: 180,
    issuedDate: "2023-10-24",
    issuedBy: "Trần Thị Bích",
    destination: "Chuyền may 3",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "ACC-LBL-002-WHT",
    itemNumber: "LBL-002",
    itemCategory: "LBL",
    materialName: "Nhãn satin in HDSD",
    color: "Trắng",
    size: "3cm x 6cm",
    quantity: 4500,
    unit: "Cái",
    location: "Kệ D-05-03",
    batchNumber: "L20231012",
    dateReceived: "2023-10-12",
    supplier: "Nhãn mác An Phát",
    poNumber: "PO23-124",
    reorderPoint: 1000,
    lastModifiedDate: "2023-10-23",
    lastModifiedBy: "Nguyễn Văn An",
    description: "Nhãn sườn in hướng dẫn sử dụng.",
    job: "JOB2310-SM01",
    issuedQuantity: 2000,
    issuedDate: "2023-10-22",
    issuedBy: "Nguyễn Văn An",
    destination: "Tổ hoàn thiện",
    status: "Complete",
    remark: null,
  },
];

// =============== CHILD COMPONENTS ===============

// --- Component from StatusBadge.tsx ---
interface StatusBadgeProps {
  status: AccessoryStatus;
}
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles: Record<AccessoryStatus, string> = {
    Complete: "bg-green-100 text-green-800",
    Partially: "bg-yellow-100 text-yellow-800",
    Pending: "bg-blue-100 text-blue-800",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

// --- Component from ColumnToggler.tsx ---
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

// --- Component from PageHeader.tsx ---
interface PageHeaderProps {
  selectedCount: number;
  onExport: () => void;
}
const PageHeader: React.FC<PageHeaderProps> = ({ selectedCount, onExport }) => {
  const hasSelection = selectedCount > 0;
  return (
    <div className="bg-white p-4 shadow-sm mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Accessory Issue Report
          </h1>
          <p className="text-sm text-gray-500">
            View, filter, and export accessory transaction history.
          </p>
        </div>
        <button
          className={`flex items-center text-white px-4 py-2 rounded-lg transition-colors ${
            hasSelection
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={onExport}
          disabled={!hasSelection}
        >
          <Download className="w-4 h-4 mr-2" />
          Export to Excel {hasSelection && `(${selectedCount})`}
        </button>
      </div>
    </div>
  );
};

// --- Component from ReportFilters.tsx ---
interface ReportFiltersProps {
  onFilterChange: (filters: AccessoryFilters) => void;
  visibleColumns: Set<string>;
  onColumnToggle: (columnKey: string) => void;
}
const ReportFilters: React.FC<ReportFiltersProps> = ({
  onFilterChange,
  visibleColumns,
  onColumnToggle,
}) => {
  const [filters, setFilters] = useState<AccessoryFilters>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="relative md:col-span-12 lg:col-span-4">
          <label
            htmlFor="query"
            className="text-sm font-medium text-gray-600 block mb-1"
          >
            Search Item No / PO
          </label>
          <input
            id="query"
            name="query"
            type="text"
            placeholder="e.g., BTN-001 or PO23-115"
            value={filters.query || ""}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
        </div>
        <div className="md:col-span-4 lg:col-span-2">
          <label
            htmlFor="status"
            className="text-sm font-medium text-gray-600 block mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All</option>
            <option value="Complete">Complete</option>
            <option value="Partially">Partially</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div className="md:col-span-12 lg:col-span-4">
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Issued Date (From - To)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="md:col-span-4 lg:col-span-2 ">
          <ColumnToggler
            allColumns={ALL_COLUMNS}
            visibleColumns={visibleColumns}
            onColumnToggle={onColumnToggle}
          />
        </div>
      </div>
    </div>
  );
};

// --- Component from Pagination.tsx ---
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
            Page {currentPage} of {totalPages > 0 ? totalPages : 1}
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

// --- Component from TransactionsTable.tsx ---
interface TransactionsTableProps {
  accessories: Accessory[];
  isLoading: boolean;
  selectedAccessories: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  visibleColumns: Set<string>;
}
const TransactionsTable: React.FC<TransactionsTableProps> = ({
  accessories,
  isLoading,
  selectedAccessories,
  onSelectionChange,
  visibleColumns,
}) => {
  const displayedColumns = ALL_COLUMNS.filter((col) =>
    visibleColumns.has(col.key)
  );

  const renderCell = (accessory: Accessory, columnKey: string) => {
    const value = accessory[columnKey as keyof Accessory];
    if (columnKey === "status")
      return <StatusBadge status={accessory.status} />;
    if (
      ["dateReceived", "lastModifiedDate", "issuedDate"].includes(columnKey)
    ) {
      try {
        return new Date(value as string).toLocaleDateString("en-GB");
      } catch {
        return value;
      }
    }
    if (value === null) return <span className="text-gray-400">N/A</span>;
    return value as React.ReactNode;
  };

  const handleSelectAllOnPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentQrCodes = accessories.map((acc) => acc.qrCode);
    const newSelection = new Set(selectedAccessories);
    if (event.target.checked) {
      currentQrCodes.forEach((qrCode) => newSelection.add(qrCode));
    } else {
      currentQrCodes.forEach((qrCode) => newSelection.delete(qrCode));
    }
    onSelectionChange(newSelection);
  };

  const handleSelectOne = (qrCode: string) => {
    const newSelection = new Set(selectedAccessories);
    if (newSelection.has(qrCode)) {
      newSelection.delete(qrCode);
    } else {
      newSelection.add(qrCode);
    }
    onSelectionChange(newSelection);
  };

  if (isLoading) {
    return (
      <div className="space-y-2 p-4 bg-white rounded-lg shadow-sm">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 h-10 rounded-md animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (accessories.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm border-t">
        <h3 className="text-lg font-medium text-gray-700">No Data Found</h3>
        <p className="text-gray-500 mt-1">
          There are no records matching your current filters.
        </p>
      </div>
    );
  }

  const areAllOnPageSelected =
    accessories.length > 0 &&
    accessories.every((acc) => selectedAccessories.has(acc.qrCode));

  return (
    <div className="bg-white shadow-sm rounded-t-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="p-4 sticky left-0 bg-gray-50 z-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  checked={areAllOnPageSelected}
                  onChange={handleSelectAllOnPage}
                />
              </th>
              {displayedColumns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accessories.map((accessory) => (
              <tr
                key={accessory.qrCode}
                className={`hover:bg-gray-50 ${
                  selectedAccessories.has(accessory.qrCode)
                    ? "bg-indigo-50"
                    : ""
                }`}
              >
                <td
                  className="p-4 sticky left-0 bg-white hover:bg-gray-50 z-10"
                  style={
                    selectedAccessories.has(accessory.qrCode)
                      ? { backgroundColor: "#eef2ff" }
                      : {}
                  }
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    checked={selectedAccessories.has(accessory.qrCode)}
                    onChange={() => handleSelectOne(accessory.qrCode)}
                  />
                </td>
                {displayedColumns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-4 whitespace-nowrap ${
                      col.key === "qrCode" || col.key === "itemNumber"
                        ? "font-medium text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {renderCell(accessory, col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =============== MAIN PAGE COMPONENT ===============

const AccessoryIssueTransactionReportsPage = () => {
  const isLoading = false;
  const [filters, setFilters] = useState<AccessoryFilters>({});
  const [selectedAccessories, setSelectedAccessories] = useState<Set<string>>(
    new Set()
  );
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(ALL_COLUMNS.slice(0, 15).map((c) => c.key))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredAccessories = useMemo(() => {
    return mockAccessories.filter((acc) => {
      const { query, supplier, status, dateFrom, dateTo } = filters;
      const queryMatch =
        !query ||
        acc.itemNumber.toLowerCase().includes(query.toLowerCase()) ||
        acc.poNumber.toLowerCase().includes(query.toLowerCase());
      const supplierMatch = !supplier || acc.supplier === supplier;
      const statusMatch = !status || acc.status === status;
      const dateReceived = new Date(acc.dateReceived);
      const fromDateMatch = !dateFrom || dateReceived >= new Date(dateFrom);
      const toDateMatch = !dateTo || dateReceived <= new Date(dateTo);
      return (
        queryMatch &&
        supplierMatch &&
        statusMatch &&
        fromDateMatch &&
        toDateMatch
      );
    });
  }, [filters]);

  const paginatedAccessories = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredAccessories.slice(startIndex, endIndex);
  }, [filteredAccessories, currentPage, rowsPerPage]);

  const handleFilterChange = (newFilters: AccessoryFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleColumnToggle = (columnKey: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  };

  const handleRowsPerPageChange = (size: number) => {
    setRowsPerPage(size);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const selectedData = mockAccessories.filter((acc) =>
      selectedAccessories.has(acc.qrCode)
    );
    alert(
      `Exporting ${selectedAccessories.size} selected items. See console for data.`
    );
    console.log("Data to export:", selectedData);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader
        selectedCount={selectedAccessories.size}
        onExport={handleExport}
      />

      <ReportFilters
        onFilterChange={handleFilterChange}
        visibleColumns={visibleColumns}
        onColumnToggle={handleColumnToggle}
      />

      <div className="mt-6">
        <TransactionsTable
          accessories={paginatedAccessories}
          isLoading={isLoading}
          selectedAccessories={selectedAccessories}
          onSelectionChange={setSelectedAccessories}
          visibleColumns={visibleColumns}
        />
        <Pagination
          currentPage={currentPage}
          totalItems={filteredAccessories.length}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
};

export default AccessoryIssueTransactionReportsPage;
// =============== END OF COMBINED FILE ===============
