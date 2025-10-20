// Path: src/pages/packaging-issue-transaction-reports/components/StatusBadge.tsx

import React from "react";
import type { PackagingStatus } from "../types";

interface StatusBadgeProps {
  status: PackagingStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Cập nhật style để phù hợp với trạng thái của bao bì
  const statusStyles: Record<PackagingStatus, string> = {
    Complete: "bg-green-100 text-green-800",
    Partially: "bg-yellow-100 text-yellow-800",
    Pending: "bg-blue-100 text-blue-800", // Thêm trạng thái Pending
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
