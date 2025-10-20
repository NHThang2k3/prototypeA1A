// Path: src/pages/packaging-issue-transaction-reports/PackagingIssueTransactionReportsPage.tsx

import { useState, useMemo } from "react";
import PageHeader from "./components/PageHeader";
import ReportFilters from "./components/ReportFilters";
import TransactionsTable from "./components/TransactionsTable";
import Pagination from "./components/Pagination";
import { mockPackagings } from "./data";
import type { PackagingFilters } from "./types";
import { ALL_COLUMNS } from "./constants";

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

  // Memoized: Filter data based on filters
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

  // Memoized: Paginate the filtered data
  const paginatedPackagings = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredPackagings.slice(startIndex, endIndex);
  }, [filteredPackagings, currentPage, rowsPerPage]);

  const handleFilterChange = (newFilters: PackagingFilters) => {
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
