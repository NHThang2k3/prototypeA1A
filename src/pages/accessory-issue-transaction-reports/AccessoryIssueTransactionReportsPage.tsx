// Path: src/pages/accessory-issue-transaction-reports/AccessoryIssueTransactionReportsPage.tsx

import { useState, useMemo } from "react";
import PageHeader from "./components/PageHeader";
import ReportFilters from "./components/ReportFilters";
import TransactionsTable from "./components/TransactionsTable";
import Pagination from "./components/Pagination";
import { mockAccessories } from "./data";
import type { AccessoryFilters } from "./types";
import { ALL_COLUMNS } from "./constants";

const AccessoryIssueTransactionReportsPage = () => {
  const isLoading = false;
  const [filters, setFilters] = useState<AccessoryFilters>({});
  const [selectedAccessories, setSelectedAccessories] = useState<Set<string>>(
    new Set()
  );
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(ALL_COLUMNS.slice(0, 15).map((c) => c.key))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Memoized: Filter data based on filters
  const filteredAccessories = useMemo(() => {
    return mockAccessories.filter((acc) => {
      const { query, supplier, status, dateFrom, dateTo } = filters;

      const queryMatch =
        !query ||
        acc.itemNumber.toLowerCase().includes(query.toLowerCase()) ||
        acc.poNumber.toLowerCase().includes(query.toLowerCase());

      const supplierMatch = !supplier || acc.supplier === supplier;
      const statusMatch = !status || acc.status === status;

      const dateReceived = new Date(acc.dateReceived);
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

  // Memoized: Paginate the filtered data
  const paginatedAccessories = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredAccessories.slice(startIndex, endIndex);
  }, [filteredAccessories, currentPage, rowsPerPage]);

  const handleFilterChange = (newFilters: AccessoryFilters) => {
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
    const selectedData = mockAccessories.filter((acc) =>
      selectedAccessories.has(acc.qrCode)
    );
    alert(
      `Exporting ${selectedAccessories.size} selected items. See console for data.`
    );
    console.log("Data to export:", selectedData);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader
        selectedCount={selectedAccessories.size}
        onExport={handleExport}
      />

      <ReportFilters
        onFilterChange={handleFilterChange}
        visibleColumns={visibleColumns}
        onColumnToggle={handleColumnToggle}
      />

      <div className="mt-6">
        <TransactionsTable
          accessories={paginatedAccessories}
          isLoading={isLoading}
          selectedAccessories={selectedAccessories}
          onSelectionChange={setSelectedAccessories}
          visibleColumns={visibleColumns}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={filteredAccessories.length}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
};

export default AccessoryIssueTransactionReportsPage;
