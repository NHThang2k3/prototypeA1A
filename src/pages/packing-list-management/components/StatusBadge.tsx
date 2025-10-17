// src/pages/packing-list-management/components/StatusBadge.tsx

import React from "react";
import type { PrintStatus } from "../types";
import { CheckCircle, Printer } from "lucide-react";

interface StatusBadgeProps {
  status: PrintStatus;
}

const statusConfig = {
  NOT_PRINTED: {
    label: "Chưa in",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    icon: <Printer className="w-4 h-4" />,
  },
  PRINTED: {
    label: "Đã in",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    icon: <CheckCircle className="w-4 h-4" />,
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];

  if (!config) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
