// Path: src/pages/inventory-list/components/InventoryFilters.tsx

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import type { QCStatus } from "../types";

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
            {/* Order No */}
            <div>
              <label
                htmlFor="poNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Order No
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

            {/* Roll No */}
            <div>
              <label
                htmlFor="rollNo"
                className="block text-sm font-medium text-gray-700"
              >
                Roll No
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
              Reset
            </button>
            <button
              type="submit"
              onClick={(e) => e.preventDefault()} // Prevent form submission for this demo
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
