// Path: src/pages/inventory-list/components/StatusBadge.tsx

import React from "react";
import type { InventoryStatus } from "../types";

interface StatusBadgeProps {
  status: InventoryStatus;
}

const statusMap: Record<InventoryStatus, { text: string; className: string }> =
  {
    "in-stock": { text: "Còn hàng", className: "bg-green-100 text-green-800" },
    "low-stock": {
      text: "Sắp hết",
      className: "bg-yellow-100 text-yellow-800",
    },
    "out-of-stock": { text: "Hết hàng", className: "bg-red-100 text-red-800" },
  };

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { text, className } = statusMap[status] || {
    text: "Không rõ",
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
