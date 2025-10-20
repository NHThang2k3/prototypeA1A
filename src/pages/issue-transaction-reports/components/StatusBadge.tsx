// Path: src/pages/issue-transaction-reports/components/StatusBadge.tsx

import React from "react";
import type { QcStatus } from "../types";

interface StatusBadgeProps {
  status: QcStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // [UPDATED] Thay đổi style để phù hợp với trạng thái QC mới
  const statusStyles: Record<QcStatus, string> = {
    Passed: "bg-green-100 text-green-800",
    Failed: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
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
