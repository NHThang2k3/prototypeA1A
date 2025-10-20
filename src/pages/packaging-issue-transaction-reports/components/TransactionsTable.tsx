// Path: src/pages/packaging-issue-transaction-reports/components/TransactionsTable.tsx

import React from "react";
import type { Packaging } from "../types";
import StatusBadge from "./StatusBadge";
import { ALL_COLUMNS } from "../constants";

// Helper function to render cell content
const renderCell = (packaging: Packaging, columnKey: string) => {
  const value = packaging[columnKey as keyof Packaging];

  // Handle special cases
  if (columnKey === "status") {
    return <StatusBadge status={packaging.status} />;
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
  packagings: Packaging[];
  isLoading: boolean;
  selectedPackagings: Set<string>;
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
  packagings,
  isLoading,
  selectedPackagings,
  onSelectionChange,
  visibleColumns,
}) => {
  const displayedColumns = ALL_COLUMNS.filter((col) =>
    visibleColumns.has(col.key)
  );

  const handleSelectAllOnPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentQrCodes = packagings.map((pkg) => pkg.qrCode);
    const newSelection = new Set(selectedPackagings);
    if (event.target.checked) {
      currentQrCodes.forEach((qrCode) => newSelection.add(qrCode));
    } else {
      currentQrCodes.forEach((qrCode) => newSelection.delete(qrCode));
    }
    onSelectionChange(newSelection);
  };

  const handleSelectOne = (qrCode: string) => {
    const newSelection = new Set(selectedPackagings);
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
                  selectedPackagings.has(packaging.qrCode)
                    ? "bg-indigo-50"
                    : ""
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

export default TransactionsTable;
