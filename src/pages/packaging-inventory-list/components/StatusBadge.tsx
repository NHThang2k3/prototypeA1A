// Path: src/pages/packaging-inventory-list/components/StatusBadge.tsx

import React from "react";
import type { PackagingStatus } from "../types";

interface StatusBadgeProps {
  status: PackagingStatus;
}

const statusMap: Record<PackagingStatus, { text: string; className: string }> =
  {
    "In Stock": { text: "In Stock", className: "bg-green-100 text-green-800" },
    "Low Stock": {
      text: "Low Stock",
      className: "bg-yellow-100 text-yellow-800",
    },
    "Out of Stock": {
      text: "Out of Stock",
      className: "bg-red-100 text-red-800",
    },
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
