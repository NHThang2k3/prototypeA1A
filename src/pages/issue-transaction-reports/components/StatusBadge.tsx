// Path: src/pages/issue-transaction-reports/components/StatusBadge.tsx

import React from "react";
import type { TransactionStatus } from "../types";

interface StatusBadgeProps {
  status: TransactionStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles: Record<TransactionStatus, string> = {
    "Đã hoàn tất": "bg-green-100 text-green-800",
    "Đang xử lý": "bg-blue-100 text-blue-800",
    "Mới yêu cầu": "bg-yellow-100 text-yellow-800",
    "Đã hủy": "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
