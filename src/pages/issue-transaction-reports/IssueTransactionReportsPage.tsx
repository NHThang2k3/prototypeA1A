// Path: src/pages/issue-transaction-reports/IssueTransactionReportsPage.tsx

import React, { useState, useEffect } from "react";
import PageHeader from "./components/PageHeader";
import ReportFilters from "./components/ReportFilters";
import TransactionsTable from "./components/TransactionsTable";
import { mockTransactions } from "./data";
import type { IssueTransaction } from "./types";

const IssueTransactionReportsPage = () => {
  const [transactions, setTransactions] = useState<IssueTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Logic lọc và tải dữ liệu sẽ nằm ở đây
  useEffect(() => {
    // Giả lập gọi API
    setIsLoading(true);
    setTimeout(() => {
      // Trong thực tế, bạn sẽ lọc dữ liệu dựa trên state của các bộ lọc
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000); // Giả lập độ trễ 1 giây
  }, []);

  const handleFilterChange = (filters: any) => {
    // TODO: Xử lý logic lọc dữ liệu dựa trên filters từ component ReportFilters
    console.log("Filters changed:", filters);
    // Gọi lại API hoặc lọc dữ liệu mock tại đây
  };

  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <PageHeader />
      <ReportFilters onFilterChange={handleFilterChange} />
      <TransactionsTable transactions={transactions} isLoading={isLoading} />
      {/* Thêm Pagination ở đây nếu cần */}
    </div>
  );
};

export default IssueTransactionReportsPage;
