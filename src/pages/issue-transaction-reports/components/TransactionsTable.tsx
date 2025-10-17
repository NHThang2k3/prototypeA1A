// Path: src/pages/issue-transaction-reports/components/TransactionsTable.tsx

import React from "react";
import type { IssueTransaction } from "../types";
import StatusBadge from "./StatusBadge";
import { ChevronRight } from "lucide-react";

interface TransactionsTableProps {
  transactions: IssueTransaction[];
  isLoading: boolean;
}

const TableSkeleton = () => (
  // Một skeleton đơn giản
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-gray-200 h-12 rounded-lg animate-pulse"></div>
    ))}
  </div>
);

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isLoading,
}) => {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-700">
          Không tìm thấy giao dịch nào
        </h3>
        <p className="text-gray-500 mt-1">
          Vui lòng thử thay đổi bộ lọc hoặc tạo phiếu xuất mới.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mã Phiếu
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Loại Phiếu
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ngày Tạo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Người Yêu Cầu
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Lệnh SX
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trạng Thái
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Xem</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                  {tx.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(tx.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.requestor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.productionOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={tx.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => alert(`Xem chi tiết phiếu ${tx.id}`)}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center"
                  >
                    Xem chi tiết <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
