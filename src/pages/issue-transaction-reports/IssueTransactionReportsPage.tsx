// Path: src/pages/issue-transaction-reports/IssueTransactionReportsPage.tsx

import { useState, useMemo } from "react";
import PageHeader from "./components/PageHeader";
import ReportFilters from "./components/ReportFilters";
import TransactionsTable from "./components/TransactionsTable";
import Pagination from "./components/Pagination";
import { mockFabricRolls } from "./data";
import type { FabricRollFilters } from "./types";
import { ALL_COLUMNS } from "./constants";

const IssueTransactionReportsPage = () => {
  // State to manage data loading status
  const isLoading = false;

  // State for filter values
  const [filters, setFilters] = useState<FabricRollFilters>({});

  // State to manage selected rows (using Set for high performance)
  const [selectedRolls, setSelectedRolls] = useState<Set<string>>(new Set());

  // State for selecting visible columns
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    // Default to showing the first 15 columns for neatness
    new Set(ALL_COLUMNS.slice(0, 15).map((c) => c.key))
  );

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Memoized: Filter data based on the `filters` state
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

  // Memoized: Paginate the filtered data
  const paginatedRolls = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredRolls.slice(startIndex, endIndex);
  }, [filteredRolls, currentPage, rowsPerPage]);

  // Handler for when filters change
  const handleFilterChange = (newFilters: FabricRollFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 each time a new filter is applied
  };

  // Handler to toggle a column
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

  // Handler for changing rows per page
  const handleRowsPerPageChange = (size: number) => {
    setRowsPerPage(size);
    setCurrentPage(1); // Reset to page 1
  };

  // Handler for exporting to Excel
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
          rolls={paginatedRolls} // Only pass the data for the current page
          isLoading={isLoading}
          selectedRolls={selectedRolls}
          onSelectionChange={setSelectedRolls}
          visibleColumns={visibleColumns} // Pass the list of columns to display
        />

        {/* Pagination component is below the table */}
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
