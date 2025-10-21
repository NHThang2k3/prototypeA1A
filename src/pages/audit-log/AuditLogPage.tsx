// Path: src/pages/audit-log/AuditLogPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldAlert,
  Search,
  Download,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";

// Define the data type for an Audit Log entry
type AuditLogEntry = {
  ID: number;
  Action: "Create" | "Update" | "Delete" | "Login" | "Logout" | "Scan QR";
  Module: string;
  User: string;
  DateTime: string; // ISO 8601 format is best for parsing
};

// --- Helper Function to Generate More Realistic Mock Data ---
const generateMockData = (count: number): AuditLogEntry[] => {
  const data: AuditLogEntry[] = [];
  const actions: AuditLogEntry["Action"][] = [
    "Create",
    "Update",
    "Delete",
    "Login",
    "Logout",
    "Scan QR",
  ];
  const modules = [
    "Packing List",
    "Inventory Management",
    "Location Management",
    "System",
    "Issue Fabric",
    "Relax Fabric",
  ];
  const users = ["uyen.nt", "thanh.pv", "hieu.lm", "admin", "guest.user"];

  for (let i = 0; i < count; i++) {
    const date = new Date(2025, 9, 21 - Math.floor(i / 5)); // Go back a day every 5 records
    date.setHours(
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60),
      Math.floor(Math.random() * 60)
    );

    data.push({
      ID: 1001 + i,
      Action: actions[Math.floor(Math.random() * actions.length)],
      Module: modules[Math.floor(Math.random() * modules.length)],
      User: users[Math.floor(Math.random() * users.length)],
      DateTime: date.toISOString().slice(0, 19).replace("T", " "),
    });
  }
  return data;
};

// --- Action Badge Component (for styling the 'Action' column) ---
const ActionBadge: React.FC<{ action: AuditLogEntry["Action"] }> = ({
  action,
}) => {
  const baseClasses =
    "px-2.5 py-1 text-xs font-semibold rounded-full inline-block";
  const colorClasses = {
    Create: "bg-green-100 text-green-800",
    Update: "bg-blue-100 text-blue-800",
    Delete: "bg-red-100 text-red-800",
    Login: "bg-yellow-100 text-yellow-800",
    Logout: "bg-gray-100 text-gray-800",
    "Scan QR": "bg-indigo-100 text-indigo-800",
  };
  return (
    <span className={`${baseClasses} ${colorClasses[action]}`}>{action}</span>
  );
};

// --- Main Audit Log Page Component ---
const AuditLogPage = () => {
  // State for the full dataset
  const [auditLogData] = useState<AuditLogEntry[]>(() => generateMockData(100));

  // State for filtering and pagination
  const [filteredData, setFilteredData] =
    useState<AuditLogEntry[]>(auditLogData);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Effect to apply filters when search term or date range changes
  useEffect(() => {
    let data = auditLogData;

    // Apply search term filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      data = data.filter((log) =>
        Object.values(log).some((value) =>
          String(value).toLowerCase().includes(lowercasedTerm)
        )
      );
    }

    // Apply date range filter
    const [startDate, endDate] = dateRange;
    if (startDate && endDate) {
      // Set end date to the end of the day to include all logs on that day
      const inclusiveEndDate = new Date(endDate);
      inclusiveEndDate.setHours(23, 59, 59, 999);
      data = data.filter((log) => {
        const logDate = new Date(log.DateTime);
        return logDate >= startDate && logDate <= inclusiveEndDate;
      });
    }

    setFilteredData(data);
    setCurrentPage(1); // Reset to first page on new filter
  }, [searchTerm, dateRange, auditLogData]);

  // Memoized calculation for paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Handler for exporting data to Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AuditLogs");
    XLSX.writeFile(workbook, "audit_log_export.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* --- Page Header --- */}
      <div className="bg-white p-5 shadow-sm rounded-lg flex items-center gap-4 border-l-4 border-blue-600">
        <ShieldAlert className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Audit Log</h1>
          <p className="text-gray-600 mt-1">
            Track and record key activities within the fabric warehouse system.
          </p>
        </div>
      </div>

      {/* --- Filters and Actions Bar --- */}
      <div className="bg-white p-4 shadow-sm rounded-lg space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search all fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <DatePicker
              selectsRange={true}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => setDateRange(update)}
              isClearable={true}
              placeholderText="Filter by date range"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleExportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export to Excel
          </button>
        </div>
      </div>

      {/* --- Data Table --- */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Module
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  User
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((log) => (
                <tr key={log.ID} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {log.ID}
                  </td>
                  <td className="px-6 py-4">
                    <ActionBadge action={log.Action} />
                  </td>
                  <td className="px-6 py-4">{log.Module}</td>
                  <td className="px-6 py-4">{log.User}</td>
                  <td className="px-6 py-4 text-gray-500">{log.DateTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Controls --- */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <label htmlFor="rows-per-page" className="text-sm text-gray-600">
              Rows per page:
            </label>
            <select
              id="rows-per-page"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md p-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Page {totalPages > 0 ? currentPage : 0} of {totalPages}
            </span>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border-t border-b border-r border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;
