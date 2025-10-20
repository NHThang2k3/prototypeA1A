// Path: src/pages/issue-transaction-reports/components/TransactionsTable.tsx

import React from "react";
import type { FabricRoll } from "../types";
import StatusBadge from "./StatusBadge";
import { ALL_COLUMNS } from "../constants";

// Helper function to render cell content flexibly
// This helps keep the JSX in the main component cleaner
const renderCell = (roll: FabricRoll, columnKey: string) => {
  const value = roll[columnKey as keyof FabricRoll];

  // Handle special cases
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
      // Format the date for easy reading
      return new Date(value as string).toLocaleDateString("en-GB"); // dd/mm/yyyy
    } catch {
      return value; // Return the original value if the date is invalid
    }
  }
  if (value === null) {
    return <span className="text-gray-400">N/A</span>;
  }

  // Return the default value
  return value as React.ReactNode;
};

// Props for the TransactionsTable component
interface TransactionsTableProps {
  rolls: FabricRoll[]; // Only receive data for the current page
  isLoading: boolean;
  selectedRolls: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  visibleColumns: Set<string>; // Receive the list of columns to display
}

// Skeleton loading component
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
  // Filter the list of columns to be displayed on the table
  const displayedColumns = ALL_COLUMNS.filter((col) =>
    visibleColumns.has(col.key)
  );

  // Handler to select or deselect all rows on the current page
  const handleSelectAllOnPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentRollQrCodes = rolls.map((roll) => roll.qrCode);
    const newSelection = new Set(selectedRolls);

    if (event.target.checked) {
      // Add all QR codes of the current page to the Set
      currentRollQrCodes.forEach((qrCode) => newSelection.add(qrCode));
    } else {
      // Remove all QR codes of the current page from the Set
      currentRollQrCodes.forEach((qrCode) => newSelection.delete(qrCode));
    }
    onSelectionChange(newSelection);
  };

  // Handler to select or deselect a single row
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

  // Check if all rows on the current page are selected
  const areAllOnPageSelected =
    rolls.length > 0 && rolls.every((roll) => selectedRolls.has(roll.qrCode));

  return (
    <div className="bg-white shadow-sm rounded-t-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {/* "Select all" checkbox - Fixed on the left when scrolling horizontally */}
              <th scope="col" className="p-4 sticky left-0 bg-gray-50 z-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  checked={areAllOnPageSelected}
                  onChange={handleSelectAllOnPage}
                  aria-label="Select all rolls on this page"
                />
              </th>
              {/* Dynamically render column headers */}
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
                {/* Checkbox for each row - Fixed on the left */}
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
                {/* Dynamically render row data cells */}
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

export default TransactionsTable;
