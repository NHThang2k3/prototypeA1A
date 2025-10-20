// src/pages/inbound-dashboard/components/DashboardFilters.tsx

import React from "react";
import type { DashboardFilters } from "../types";

interface FilterOptions {
  factories: string[];
  suppliers: string[];
  itemCodes: string[];
}

interface DashboardFiltersProps {
  filters: DashboardFilters;
  onFilterChange: <K extends keyof DashboardFilters>(
    name: K,
    value: DashboardFilters[K]
  ) => void;
  options: FilterOptions;
}

const toInputDateString = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DashboardFiltersComponent: React.FC<DashboardFiltersProps> = ({
  filters,
  onFilterChange,
  options,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    onFilterChange(name as keyof DashboardFilters, value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange("dateRange", {
      ...filters.dateRange,
      [name]: value ? new Date(value) : null,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
        {/* Date From */}
        <div>
          <label
            htmlFor="from"
            className="block text-sm font-medium text-gray-700"
          >
            Date From
          </label>
          <input
            type="date"
            name="from"
            id="from"
            value={toInputDateString(filters.dateRange.from)}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>
        {/* Date To */}
        <div>
          <label
            htmlFor="to"
            className="block text-sm font-medium text-gray-700"
          >
            Date To
          </label>
          <input
            type="date"
            name="to"
            id="to"
            value={toInputDateString(filters.dateRange.to)}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>
        {/* Factory */}
        <div>
          <label
            htmlFor="factory"
            className="block text-sm font-medium text-gray-700"
          >
            Factory
          </label>
          <select
            name="factory"
            id="factory"
            value={filters.factory}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          >
            <option value="">All Factories</option>
            {options.factories.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        {/* Supplier */}
        <div>
          <label
            htmlFor="supplier"
            className="block text-sm font-medium text-gray-700"
          >
            Supplier
          </label>
          <select
            name="supplier"
            id="supplier"
            value={filters.supplier}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          >
            <option value="">All Suppliers</option>
            {options.suppliers.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        {/* Item Code */}
        <div>
          <label
            htmlFor="itemCode"
            className="block text-sm font-medium text-gray-700"
          >
            Item Code
          </label>
          <select
            name="itemCode"
            id="itemCode"
            value={filters.itemCode}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          >
            <option value="">All Items</option>
            {options.itemCodes.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DashboardFiltersComponent;
