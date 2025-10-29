import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Columns,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ============================================================================
// START: src/pages/packaging-issue-transaction-reports/types.ts
// ============================================================================

// Định nghĩa trạng thái xuất kho bao bì
type PackagingStatus = "Complete" | "Partially" | "Pending";

// Định nghĩa cấu trúc dữ liệu cho một bao bì
interface Packaging {
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
  status: PackagingStatus;
  remark: string | null;
}

// Định nghĩa các trường filter cho báo cáo bao bì
interface PackagingFilters {
  query?: string; // Dùng để tìm kiếm Item Number hoặc PO Number
  supplier?: string;
  status?: PackagingStatus | "";
  dateFrom?: string; // Date Received from
  dateTo?: string; // Date Received to
}

// ============================================================================
// END: src/pages/packaging-issue-transaction-reports/types.ts
// ============================================================================

// ============================================================================
// START: src/pages/packaging-issue-transaction-reports/constants.ts
// ============================================================================

// Định nghĩa cấu trúc cho một cột trong bảng
interface ColumnDefinition {
  key: string; // Phải là một key duy nhất, thường là key trong object data
  label: string; // Tên hiển thị trên header của bảng
}

// Danh sách tất cả các cột có thể có trong bảng bao bì
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

// ============================================================================
// END: src/pages/packaging-issue-transaction-reports/constants.ts
// ============================================================================

// ============================================================================
// START: src/pages/packaging-issue-transaction-reports/data.ts
// ============================================================================

// Dữ liệu mẫu cho bao bì đóng gói
const mockPackagings: Packaging[] = [
  {
    qrCode: "PKG-BOX-001-BRN",
    itemNumber: "BOX-001",
    itemCategory: "BOX",
    materialName: "Thùng carton 5 lớp",
    color: "Nâu",
    size: "60x40x40 cm",
    quantity: 1200,
    unit: "Thùng",
    location: "Khu C-01-02",
    batchNumber: "B20231005",
    dateReceived: "2023-10-05",
    supplier: "Bao bì Toàn Quốc",
    poNumber: "PO23-118",
    reorderPoint: 200,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Phạm Thị Mai",
    description: "Thùng carton đựng sản phẩm áo jacket.",
    job: "JOB2310-JK02",
    issuedQuantity: 500,
    issuedDate: "2023-10-26",
    issuedBy: "Phạm Thị Mai",
    destination: "Xưởng đóng gói",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "PKG-BAG-002-CLR",
    itemNumber: "BAG-002",
    itemCategory: "BAG",
    materialName: "Túi poly trong",
    color: "Trong suốt",
    size: "30x45 cm",
    quantity: 8000,
    unit: "Túi",
    location: "Khu C-02-05",
    batchNumber: "T20230920",
    dateReceived: "2023-09-20",
    supplier: "Bao bì Việt Hưng",
    poNumber: "PO23-101",
    reorderPoint: 1500,
    lastModifiedDate: "2023-10-25",
    lastModifiedBy: "Hoàng Văn Nam",
    description: "Túi poly đựng áo sơ mi đã ủi.",
    job: "JOB2310-SM01",
    issuedQuantity: 3000,
    issuedDate: "2023-10-25",
    issuedBy: "Hoàng Văn Nam",
    destination: "Xưởng đóng gói",
    status: "Partially",
    remark: "Còn lại 5000 túi",
  },
  {
    qrCode: "PKG-TP-001-CLR",
    itemNumber: "TP-001",
    itemCategory: "TAPE",
    materialName: "Băng keo trong",
    color: "Trong suốt",
    size: "4.8cm x 100m",
    quantity: 300,
    unit: "Cuộn",
    location: "Khu C-01-08",
    batchNumber: "K20231015",
    dateReceived: "2023-10-15",
    supplier: "Băng keo Minh Long",
    poNumber: "PO23-125",
    reorderPoint: 50,
    lastModifiedDate: "2023-10-26",
    lastModifiedBy: "Phạm Thị Mai",
    description: "Băng keo dán thùng carton.",
    job: "JOB2310-JK02",
    issuedQuantity: 100,
    issuedDate: "2023-10-26",
    issuedBy: "Phạm Thị Mai",
    destination: "Xưởng đóng gói",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "PKG-LBL-005-WHT",
    itemNumber: "LBL-005",
    itemCategory: "LABEL",
    materialName: "Nhãn dán thùng",
    color: "Trắng",
    size: "10x15 cm",
    quantity: 2500,
    unit: "Nhãn",
    location: "Khu D-01-01",
    batchNumber: "L20231002",
    dateReceived: "2023-10-02",
    supplier: "In ấn An An",
    poNumber: "PO23-116",
    reorderPoint: 500,
    lastModifiedDate: "2023-10-25",
    lastModifiedBy: "Hoàng Văn Nam",
    description: "Nhãn thông tin sản phẩm dán ngoài thùng.",
    job: "JOB2310-SM01",
    issuedQuantity: 1000,
    issuedDate: "2023-10-25",
    issuedBy: "Hoàng Văn Nam",
    destination: "Xưởng đóng gói",
    status: "Complete",
    remark: null,
  },
  {
    qrCode: "PKG-PAP-003-WHT",
    itemNumber: "PAP-003",
    itemCategory: "PAPER",
    materialName: "Giấy nến",
    color: "Trắng",
    size: "75x100 cm",
    quantity: 1500,
    unit: "Tờ",
    location: "Khu C-03-04",
    batchNumber: "P20230925",
    dateReceived: "2023-09-25",
    supplier: "Giấy Hải Tiến",
    poNumber: "PO23-105",
    reorderPoint: 300,
    lastModifiedDate: "2023-10-24",
    lastModifiedBy: "Phạm Thị Mai",
    description: "Giấy lót giữa các lớp áo trong thùng.",
    job: "JOB2310-SM02",
    issuedQuantity: 500,
    issuedDate: "2023-10-24",
    issuedBy: "Phạm Thị Mai",
    destination: "Xưởng đóng gói",
    status: "Pending",
    remark: "Chưa xuất kho",
  },
];

// ============================================================================
// END: src/pages/packaging-issue-transaction-reports/data.ts
// ============================================================================

// ============================================================================
// START: Sub-components
// ============================================================================

// --- Component from: src/pages/packaging-issue-transaction-reports/components/StatusBadge.tsx ---
const StatusBadge: React.FC<{ status: PackagingStatus }> = ({ status }) => {
  const statusStyles: Record<PackagingStatus, string> = {
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

// --- Component from: src/pages/packaging-issue-transaction-reports/components/PageHeader.tsx ---
const PageHeader: React.FC<{
  selectedCount: number;
  onExport: () => void;
}> = ({ selectedCount, onExport }) => {
  const hasSelection = selectedCount > 0;
  return (
    <div className="bg-white p-4 shadow-sm mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Packaging Issue Transaction Report
          </h1>
          <p className="text-sm text-gray-500">
            View, filter, and export packaging transaction history.
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

// --- Component from: src/pages/packaging-issue-transaction-reports/components/ColumnToggler.tsx ---
const ColumnToggler: React.FC<{
  allColumns: ColumnDefinition[];
  visibleColumns: Set<string>;
  onColumnToggle: (columnKey: string) => void;
}> = ({ allColumns, visibleColumns, onColumnToggle }) => {
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

// --- Component from: src/pages/packaging-issue-transaction-reports/components/ReportFilters.tsx ---
const ReportFilters: React.FC<{
  onFilterChange: (filters: PackagingFilters) => void;
  visibleColumns: Set<string>;
  onColumnToggle: (columnKey: string) => void;
}> = ({ onFilterChange, visibleColumns, onColumnToggle }) => {
  const [filters, setFilters] = React.useState<PackagingFilters>({});

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
            Date Received
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

// --- Component from: src/pages/packaging-issue-transaction-reports/components/TransactionsTable.tsx ---
const TableSkeleton = () => (
  <div className="space-y-2 p-4 bg-white rounded-lg shadow-sm">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="bg-gray-200 h-10 rounded-md animate-pulse"></div>
    ))}
  </div>
);

const renderCell = (packaging: Packaging, columnKey: string) => {
  const value = packaging[columnKey as keyof Packaging];
  if (columnKey === "status") return <StatusBadge status={packaging.status} />;
  if (["dateReceived", "lastModifiedDate", "issuedDate"].includes(columnKey)) {
    try {
      return new Date(value as string).toLocaleDateString("en-GB");
    } catch {
      return value;
    }
  }
  if (value === null) return <span className="text-gray-400">N/A</span>;
  return value as React.ReactNode;
};

const TransactionsTable: React.FC<{
  packagings: Packaging[];
  isLoading: boolean;
  selectedPackagings: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  visibleColumns: Set<string>;
}> = ({
  packagings,
  isLoading,
  selectedPackagings,
  onSelectionChange,
  visibleColumns,
}) => {
  const displayedColumns = ALL_COLUMNS.filter((col) =>
    visibleColumns.has(col.key)
  );

  const handleSelectAllOnPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentQrCodes = packagings.map((pkg) => pkg.qrCode);
    const newSelection = new Set(selectedPackagings);
    if (e.target.checked) {
      currentQrCodes.forEach((qrCode) => newSelection.add(qrCode));
    } else {
      currentQrCodes.forEach((qrCode) => newSelection.delete(qrCode));
    }
    onSelectionChange(newSelection);
  };

  const handleSelectOne = (qrCode: string) => {
    const newSelection = new Set(selectedPackagings);
    // FIXED: Changed from ternary operator to if/else
    if (newSelection.has(qrCode)) {
      newSelection.delete(qrCode);
    } else {
      newSelection.add(qrCode);
    }
    onSelectionChange(newSelection);
  };

  if (isLoading) return <TableSkeleton />;

  if (packagings.length === 0) {
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
    packagings.length > 0 &&
    packagings.every((pkg) => selectedPackagings.has(pkg.qrCode));

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
            {packagings.map((packaging) => (
              <tr
                key={packaging.qrCode}
                className={`hover:bg-gray-50 ${
                  selectedPackagings.has(packaging.qrCode) ? "bg-indigo-50" : ""
                }`}
              >
                <td
                  className="p-4 sticky left-0 bg-white hover:bg-gray-50 z-10"
                  style={
                    selectedPackagings.has(packaging.qrCode)
                      ? { backgroundColor: "#eef2ff" }
                      : {}
                  }
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    checked={selectedPackagings.has(packaging.qrCode)}
                    onChange={() => handleSelectOne(packaging.qrCode)}
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
                    {renderCell(packaging, col.key)}
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

// --- Component from: src/pages/packaging-issue-transaction-reports/components/Pagination.tsx ---
const Pagination: React.FC<{
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (size: number) => void;
}> = ({
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
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

// ============================================================================
// END: Sub-components
// ============================================================================

// ============================================================================
// START: Main Page Component
// ============================================================================

const PackagingIssueTransactionReportsPage = () => {
  const isLoading = false;
  const [filters, setFilters] = useState<PackagingFilters>({});
  const [selectedPackagings, setSelectedPackagings] = useState<Set<string>>(
    new Set()
  );
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(ALL_COLUMNS.slice(0, 15).map((c) => c.key))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredPackagings = useMemo(() => {
    return mockPackagings.filter((pkg) => {
      const { query, supplier, status, dateFrom, dateTo } = filters;
      const queryMatch =
        !query ||
        pkg.itemNumber.toLowerCase().includes(query.toLowerCase()) ||
        pkg.poNumber.toLowerCase().includes(query.toLowerCase());
      const supplierMatch = !supplier || pkg.supplier === supplier;
      const statusMatch = !status || pkg.status === status;
      const dateReceived = new Date(pkg.dateReceived);
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

  const paginatedPackagings = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredPackagings.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPackagings, currentPage, rowsPerPage]);

  const handleFilterChange = (newFilters: PackagingFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleColumnToggle = (columnKey: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      // FIXED: Changed from ternary operator to if/else
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
    const selectedData = mockPackagings.filter((pkg) =>
      selectedPackagings.has(pkg.qrCode)
    );
    alert(
      `Exporting ${selectedPackagings.size} selected items. See console for data.`
    );
    console.log("Data to export:", selectedData);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader
        selectedCount={selectedPackagings.size}
        onExport={handleExport}
      />

      <ReportFilters
        onFilterChange={handleFilterChange}
        visibleColumns={visibleColumns}
        onColumnToggle={handleColumnToggle}
      />

      <div className="mt-6">
        <TransactionsTable
          packagings={paginatedPackagings}
          isLoading={isLoading}
          selectedPackagings={selectedPackagings}
          onSelectionChange={setSelectedPackagings}
          visibleColumns={visibleColumns}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={filteredPackagings.length}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
};

export default PackagingIssueTransactionReportsPage;

// ============================================================================
// END: Main Page Component
// ============================================================================
