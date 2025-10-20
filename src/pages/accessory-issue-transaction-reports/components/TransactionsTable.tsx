// Path: src/pages/accessory-issue-transaction-reports/components/TransactionsTable.tsx

import React from "react";
import type { Accessory } from "../types";
import StatusBadge from "./StatusBadge";
import { ALL_COLUMNS } from "../constants";

// Helper function to render cell content
const renderCell = (accessory: Accessory, columnKey: string) => {
  const value = accessory[columnKey as keyof Accessory];

  // Handle special cases
  if (columnKey === "status") {
    return <StatusBadge status={accessory.status} />;
  }
  if (["dateReceived", "lastModifiedDate", "issuedDate"].includes(columnKey)) {
    try {
      return new Date(value as string).toLocaleDateString("en-GB"); // dd/mm/yyyy
    } catch {
      return value; // Return original if date is invalid
    }
  }
  if (value === null) {
    return <span className="text-gray-400">N/A</span>;
  }

  return value as React.ReactNode;
};

// Props for the TransactionsTable component
interface TransactionsTableProps {
  accessories: Accessory[];
  isLoading: boolean;
  selectedAccessories: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  visibleColumns: Set<string>;
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
  accessories,
  isLoading,
  selectedAccessories,
  onSelectionChange,
  visibleColumns,
}) => {
  const displayedColumns = ALL_COLUMNS.filter((col) =>
    visibleColumns.has(col.key)
  );

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

  if (isLoading) return <TableSkeleton />;

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

export default TransactionsTable;
