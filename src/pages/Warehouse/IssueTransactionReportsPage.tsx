// Path: src/pages/issue-transaction-reports/IssueTransactionReportsPage.tsx

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Columns,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// =================================================================================
// --- START OF FILE: types.ts ---
// =================================================================================

// Định nghĩa trạng thái QC
type QcStatus = "Passed" | "Failed" | "Pending";

// Định nghĩa cấu trúc dữ liệu cho một cuộn vải
interface FabricRoll {
  poNumber: string;
  itemCode: string;
  factory: string;
  supplier: string;
  invoiceNo: string;
  colorCode: string;
  color: string;
  rollNo: number;
  lotNo: string;
  yards: number;
  netWeightKgs: number;
  grossWeightKgs: number;
  width: string;
  location: string;
  qrCode: string; // Sử dụng làm ID duy nhất
  dateInHouse: string;
  description: string;
  qcStatus: QcStatus;
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
  job: string;
  issuedDate: string;
  issuedBy: string;
  destination: string;
  parentQrCode: string | null;
}

// Cập nhật định nghĩa Filters để phù hợp với dữ liệu mới
interface FabricRollFilters {
  query?: string; // Dùng để tìm kiếm PO Number hoặc Item Code
  supplier?: string;
  qcStatus?: QcStatus | "";
  dateFrom?: string; // Date In House from
  dateTo?: string; // Date In House to
}

// =================================================================================
// --- START OF FILE: constants.ts ---
// =================================================================================

// Định nghĩa cấu trúc cho một cột trong bảng
interface ColumnDefinition {
  key: string; // Phải là một key duy nhất, thường là key trong object data
  label: string; // Tên hiển thị trên header của bảng
}

// Danh sách tất cả các cột có thể có trong bảng
const ALL_COLUMNS: ColumnDefinition[] = [
  { key: "poNumber", label: "PO Number" },
  { key: "itemCode", label: "Item Code" },
  { key: "factory", label: "Factory" },
  { key: "supplier", label: "Supplier" },
  { key: "invoiceNo", label: "Invoice No" },
  { key: "colorCode", label: "Color Code" },
  { key: "color", label: "Color" },
  { key: "rollNo", label: "Roll No" },
  { key: "lotNo", label: "Lot No" },
  { key: "yards", label: "Yards" },
  { key: "netWeightKgs", label: "Net Weight (Kgs)" },
  { key: "grossWeightKgs", label: "Gross Weight (Kgs)" },
  { key: "width", label: "Width" },
  { key: "location", label: "Location" },
  { key: "qrCode", label: "QR Code" },
  { key: "dateInHouse", label: "Date In House" },
  { key: "description", label: "Description" },
  { key: "qcStatus", label: "QC Status" },
  { key: "qcDate", label: "QC Date" },
  { key: "qcBy", label: "QC By" },
  { key: "comment", label: "Comment" },
  { key: "printed", label: "Printed" },
  { key: "balanceYards", label: "Balance Yards" },
  { key: "hourStandard", label: "Hour Standard" },
  { key: "hourRelax", label: "Hour Relax" },
  { key: "relaxDate", label: "Relax Date" },
  { key: "relaxTime", label: "Relax Time" },
  { key: "relaxBy", label: "Relax By" },
  { key: "job", label: "JOB" },
  { key: "issuedDate", label: "Issued Date" },
  { key: "issuedBy", label: "Issued By" },
  { key: "destination", label: "Destination" },
  { key: "parentQrCode", label: "Parent QR Code" },
];

// =================================================================================
// --- START OF FILE: data.ts ---
// =================================================================================

// Dữ liệu mẫu mới dựa trên bảng bạn cung cấp
const mockFabricRolls: FabricRoll[] = [
  {
    poNumber: "POPU0018251",
    itemCode: "CK-101-04-00332",
    factory: "Factory A",
    supplier: "Supplier Y",
    invoiceNo: "INV-001",
    colorCode: "CC-003",
    color: "Light Gold",
    rollNo: 1,
    lotNo: "225628091",
    yards: 65,
    netWeightKgs: 16.5,
    grossWeightKgs: 16.9,
    width: '60"',
    location: "F1-01-01",
    qrCode: "QR-43468",
    dateInHouse: "2023-06-08",
    description: "Denim Material",
    qcStatus: "Failed",
    qcDate: "2023-12-23",
    qcBy: "John Doe",
    comment: "No issues found",
    printed: true,
    balanceYards: 46,
    hourStandard: 24,
    hourRelax: 24,
    relaxDate: "2023-12-25",
    relaxTime: "10:30",
    relaxBy: "Alice",
    job: "JOB-B5",
    issuedDate: "2023-08-26",
    issuedBy: "David",
    destination: "Warehouse A",
    parentQrCode: null,
  },
  {
    poNumber: "POPU0018251",
    itemCode: "CK-101-04-00332",
    factory: "Factory B",
    supplier: "Supplier Z",
    invoiceNo: "INV-002",
    colorCode: "CC-004",
    color: "Royal Sapphire",
    rollNo: 2,
    lotNo: "225628091",
    yards: 82,
    netWeightKgs: 20.1,
    grossWeightKgs: 20.5,
    width: '60"',
    location: "F1-01-02",
    qrCode: "QR-33961",
    dateInHouse: "2023-08-10",
    description: "Silk Blend",
    qcStatus: "Failed",
    qcDate: "2023-10-22",
    qcBy: "John Doe",
    comment: "Approved for production",
    printed: false,
    balanceYards: 39,
    hourStandard: 24,
    hourRelax: 24,
    relaxDate: "2023-09-28",
    relaxTime: "14:00",
    relaxBy: "Bob",
    job: "JOB-A2",
    issuedDate: "2023-03-15",
    issuedBy: "Eve",
    destination: "Store B",
    parentQrCode: null,
  },
  {
    poNumber: "PSPU0002932",
    itemCode: "CK-101-04-00483",
    factory: "Factory B",
    supplier: "Supplier Z",
    invoiceNo: "INV-003",
    colorCode: "CC-003",
    color: "Puma Black",
    rollNo: 1,
    lotNo: "225628091",
    yards: 82,
    netWeightKgs: 17.7,
    grossWeightKgs: 18.1,
    width: '60"',
    location: "F1-01-03",
    qrCode: "QR-81808",
    dateInHouse: "2023-10-14",
    description: "Polyester Blend",
    qcStatus: "Failed",
    qcDate: "2023-09-19",
    qcBy: "Peter Jones",
    comment: "Approved for production",
    printed: true,
    balanceYards: 22,
    hourStandard: 36,
    hourRelax: 36,
    relaxDate: "2023-01-20",
    relaxTime: "9:00",
    relaxBy: "Charlie",
    job: "JOB-B2",
    issuedDate: "2023-10-05",
    issuedBy: "Frank",
    destination: "Store B",
    parentQrCode: null,
  },
  {
    poNumber: "POPU0018238",
    itemCode: "CK-102-05-00049",
    factory: "Factory B",
    supplier: "Supplier Y",
    invoiceNo: "INV-004",
    colorCode: "CC-002",
    color: "Puma Black",
    rollNo: 1,
    lotNo: "225628091",
    yards: 55,
    netWeightKgs: 17.5,
    grossWeightKgs: 18,
    width: '53"',
    location: "F1-01-04",
    qrCode: "QR-35149",
    dateInHouse: "2023-04-21",
    description: "Polyester Blend",
    qcStatus: "Failed",
    qcDate: "2023-03-05",
    qcBy: "John Doe",
    comment: "No issues found",
    printed: true,
    balanceYards: 34,
    hourStandard: 36,
    hourRelax: 36,
    relaxDate: "2023-08-01",
    relaxTime: "10:30",
    relaxBy: "Bob",
    job: "JOB-A5",
    issuedDate: "2023-04-29",
    issuedBy: "David",
    destination: "Warehouse A",
    parentQrCode: null,
  },
  {
    poNumber: "POPU0018235",
    itemCode: "CK-126-04-00277",
    factory: "Factory C",
    supplier: "Supplier Z",
    invoiceNo: "INV-005",
    colorCode: "CC-002",
    color: "Puma Black",
    rollNo: 1,
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
    relaxTime: "9:00",
    relaxBy: "Alice",
    job: "JOB-C4",
    issuedDate: "2023-09-22",
    issuedBy: "Eve",
    destination: "Store B",
    parentQrCode: null,
  },
  {
    poNumber: "PSPU0002986",
    itemCode: "WO-413-04-00361",
    factory: "Factory B",
    supplier: "Supplier X",
    invoiceNo: "INV-006",
    colorCode: "CC-004",
    color: "PUMA BLACK",
    rollNo: 1,
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
    job: "JOB-A9",
    issuedDate: "2023-02-12",
    issuedBy: "Eve",
    destination: "Distribution Center C",
    parentQrCode: null,
  },
  {
    poNumber: "PSPU0002986",
    itemCode: "WO-413-04-00361",
    factory: "Factory B",
    supplier: "Supplier X",
    invoiceNo: "INV-007",
    colorCode: "CC-003",
    color: "PUMA WHITE",
    rollNo: 2,
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
    job: "JOB-B6",
    issuedDate: "2023-10-30",
    issuedBy: "Eve",
    destination: "Distribution Center C",
    parentQrCode: null,
  },
  {
    poNumber: "SPPU0004476",
    itemCode: "CK-105-05-00062",
    factory: "Factory C",
    supplier: "Supplier Y",
    invoiceNo: "INV-008",
    colorCode: "CC-003",
    color: "PUMA WHITE",
    rollNo: 1,
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
    job: "JOB-C8",
    issuedDate: "2023-06-02",
    issuedBy: "Frank",
    destination: "Distribution Center C",
    parentQrCode: null,
  },
  {
    poNumber: "SSPU0002939",
    itemCode: "CK-105-04-00325",
    factory: "Factory C",
    supplier: "Supplier Y",
    invoiceNo: "INV-009",
    colorCode: "CC-002",
    color: "PUMA WHITE",
    rollNo: 1,
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
    job: "JOB-A8",
    issuedDate: "2023-04-26",
    issuedBy: "David",
    destination: "Warehouse A",
    parentQrCode: null,
  },
];

// =================================================================================
// --- COMPONENT: StatusBadge (from components/StatusBadge.tsx) ---
// =================================================================================

interface StatusBadgeProps {
  status: QcStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles: Record<QcStatus, string> = {
    Passed: "bg-green-100 text-green-800",
    Failed: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

// =================================================================================
// --- COMPONENT: ColumnToggler (from components/ColumnToggler.tsx) ---
// =================================================================================

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

// =================================================================================
// --- COMPONENT: PageHeader (from components/PageHeader.tsx) ---
// =================================================================================

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
            Fabric Roll Inventory Report
          </h1>
          <p className="text-sm text-gray-500">
            View, filter, and export fabric roll transaction history.
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

// =================================================================================
// --- COMPONENT: ReportFilters (from components/ReportFilters.tsx) ---
// =================================================================================

interface ReportFiltersProps {
  onFilterChange: (filters: FabricRollFilters) => void;
  visibleColumns: Set<string>;
  onColumnToggle: (columnKey: string) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  onFilterChange,
  visibleColumns,
  onColumnToggle,
}) => {
  const [filters, setFilters] = React.useState<FabricRollFilters>({});

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
        {/* Search PO / Item Code */}
        <div className="relative md:col-span-12 lg:col-span-4">
          <label
            htmlFor="query"
            className="text-sm font-medium text-gray-600 block mb-1"
          >
            Search PO / Item Code
          </label>
          <input
            id="query"
            name="query"
            type="text"
            placeholder="e.g., POPU0018251"
            value={filters.query || ""}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
        </div>

        {/* Filter by QC Status */}
        <div className="md:col-span-4 lg:col-span-2">
          <label
            htmlFor="qcStatus"
            className="text-sm font-medium text-gray-600 block mb-1"
          >
            QC Status
          </label>
          <select
            id="qcStatus"
            name="qcStatus"
            value={filters.qcStatus || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Date Range Picker */}
        <div className="md:col-span-12 lg:col-span-4">
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Date In House
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

        {/* Column selection button */}
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

// =================================================================================
// --- COMPONENT: Pagination (from components/Pagination.tsx) ---
// =================================================================================

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

// =================================================================================
// --- COMPONENT: TransactionsTable (from components/TransactionsTable.tsx) ---
// =================================================================================

const renderCell = (roll: FabricRoll, columnKey: string) => {
  const value = roll[columnKey as keyof FabricRoll];

  if (columnKey === "qcStatus") {
    return <StatusBadge status={roll.qcStatus} />;
  }
  if (typeof value === "boolean") {
    return String(value).toUpperCase();
  }
  if (
    ["dateInHouse", "qcDate", "relaxDate", "issuedDate"].includes(columnKey)
  ) {
    try {
      return new Date(value as string).toLocaleDateString("en-GB"); // dd/mm/yyyy
    } catch {
      return value;
    }
  }
  if (value === null) {
    return <span className="text-gray-400">N/A</span>;
  }
  return value as React.ReactNode;
};

interface TransactionsTableProps {
  rolls: FabricRoll[];
  isLoading: boolean;
  selectedRolls: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  visibleColumns: Set<string>;
}

const TableSkeleton = () => (
  <div className="space-y-2 p-4 bg-white rounded-lg shadow-sm">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="bg-gray-200 h-10 rounded-md animate-pulse"></div>
    ))}
  </div>
);

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  rolls,
  isLoading,
  selectedRolls,
  onSelectionChange,
  visibleColumns,
}) => {
  const displayedColumns = ALL_COLUMNS.filter((col) =>
    visibleColumns.has(col.key)
  );

  const handleSelectAllOnPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentRollQrCodes = rolls.map((roll) => roll.qrCode);
    const newSelection = new Set(selectedRolls);
    if (event.target.checked) {
      currentRollQrCodes.forEach((qrCode) => newSelection.add(qrCode));
    } else {
      currentRollQrCodes.forEach((qrCode) => newSelection.delete(qrCode));
    }
    onSelectionChange(newSelection);
  };

  const handleSelectOne = (qrCode: string) => {
    const newSelection = new Set(selectedRolls);
    if (newSelection.has(qrCode)) {
      newSelection.delete(qrCode);
    } else {
      newSelection.add(qrCode);
    }
    onSelectionChange(newSelection);
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (rolls.length === 0) {
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
    rolls.length > 0 && rolls.every((roll) => selectedRolls.has(roll.qrCode));

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
                  aria-label="Select all rolls on this page"
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
            {rolls.map((roll) => (
              <tr
                key={roll.qrCode}
                className={`hover:bg-gray-50 ${
                  selectedRolls.has(roll.qrCode) ? "bg-indigo-50" : ""
                }`}
              >
                <td
                  className="p-4 sticky left-0 bg-white hover:bg-gray-50 z-10"
                  style={
                    selectedRolls.has(roll.qrCode)
                      ? { backgroundColor: "#eef2ff" }
                      : {}
                  }
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    checked={selectedRolls.has(roll.qrCode)}
                    onChange={() => handleSelectOne(roll.qrCode)}
                    aria-label={`Select roll ${roll.qrCode}`}
                  />
                </td>
                {displayedColumns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-4 whitespace-nowrap ${
                      col.key === "qrCode" || col.key === "poNumber"
                        ? "font-medium text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {renderCell(roll, col.key)}
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

// =================================================================================
// --- MAIN PAGE COMPONENT: IssueTransactionReportsPage ---
// =================================================================================

const IssueTransactionReportsPage = () => {
  const isLoading = false;
  const [filters, setFilters] = useState<FabricRollFilters>({});
  const [selectedRolls, setSelectedRolls] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(ALL_COLUMNS.slice(0, 15).map((c) => c.key))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredRolls = useMemo(() => {
    return mockFabricRolls.filter((roll) => {
      const { query, supplier, qcStatus, dateFrom, dateTo } = filters;

      const queryMatch =
        !query ||
        roll.poNumber.toLowerCase().includes(query.toLowerCase()) ||
        roll.itemCode.toLowerCase().includes(query.toLowerCase());

      const supplierMatch = !supplier || roll.supplier === supplier;
      const qcStatusMatch = !qcStatus || roll.qcStatus === qcStatus;

      const dateInHouse = new Date(roll.dateInHouse);
      const fromDateMatch = !dateFrom || dateInHouse >= new Date(dateFrom);
      const toDateMatch = !dateTo || dateInHouse <= new Date(dateTo);

      return (
        queryMatch &&
        supplierMatch &&
        qcStatusMatch &&
        fromDateMatch &&
        toDateMatch
      );
    });
  }, [filters]);

  const paginatedRolls = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredRolls.slice(startIndex, endIndex);
  }, [filteredRolls, currentPage, rowsPerPage]);

  const handleFilterChange = (newFilters: FabricRollFilters) => {
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
    const selectedData = mockFabricRolls.filter((roll) =>
      selectedRolls.has(roll.qrCode)
    );
    alert(
      `Exporting ${selectedRolls.size} selected rolls. See console for data.`
    );
    console.log("Data to export:", selectedData);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader selectedCount={selectedRolls.size} onExport={handleExport} />

      <ReportFilters
        onFilterChange={handleFilterChange}
        visibleColumns={visibleColumns}
        onColumnToggle={handleColumnToggle}
      />

      <div className="mt-6">
        <TransactionsTable
          rolls={paginatedRolls}
          isLoading={isLoading}
          selectedRolls={selectedRolls}
          onSelectionChange={setSelectedRolls}
          visibleColumns={visibleColumns}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={filteredRolls.length}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
};

export default IssueTransactionReportsPage;
