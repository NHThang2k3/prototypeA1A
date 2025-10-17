// D:\WATATECH\WH\src\pages\inbound-dashboard\components\StatusBadge.tsx

import React from "react";
import type { WarehouseReceiptStatus } from "../types";

interface StatusBadgeProps {
  status: WarehouseReceiptStatus;
}

const statusStyles: Record<
  WarehouseReceiptStatus,
  { text: string; className: string }
> = {
  pending_receipt: {
    text: "Chờ nhận",
    className: "bg-yellow-100 text-yellow-800",
  },
  processing: {
    text: "Đang xử lý",
    className: "bg-blue-100 text-blue-800",
  },
  partially_received: {
    text: "Nhận một phần",
    className: "bg-cyan-100 text-cyan-800",
  },
  fully_received: {
    text: "Đã nhận đủ",
    className: "bg-green-100 text-green-800",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const style = statusStyles[status] || {
    text: "Không xác định",
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.className}`}
    >
      {style.text}
    </span>
  );
};
