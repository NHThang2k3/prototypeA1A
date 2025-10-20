// Path: src/pages/issue-transaction-reports/components/ReportFilters.tsx

import React from "react";
import { Search } from "lucide-react";
import type { FabricRollFilters } from "../types";
import ColumnToggler from "./ColumnToggler";
import { ALL_COLUMNS } from "../constants";

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
      {/* [UPDATED] Use Grid Layout with 12 columns for flexible alignment */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search PO / Item Code (takes up more space) */}
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

        {/* [NEW] Column selection button */}
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

export default ReportFilters;
