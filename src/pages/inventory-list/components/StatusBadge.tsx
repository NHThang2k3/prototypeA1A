// Path: src/pages/inventory-list/components/StatusBadge.tsx

import React from "react";
import type { QCStatus } from "../types";

interface StatusBadgeProps {
  status: QCStatus;
}

const statusMap: Record<QCStatus, { text: string; className: string }> = {
  Passed: { text: "Passed", className: "bg-green-100 text-green-800" },
  Failed: { text: "Failed", className: "bg-red-100 text-red-800" },
  Pending: { text: "Pending", className: "bg-yellow-100 text-yellow-800" },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { text, className } = statusMap[status] || {
    text: "Unknown",
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${className}`}
    >
      {text}
    </span>
  );
};
