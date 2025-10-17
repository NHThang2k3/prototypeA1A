// Path: src/pages/shipment-detail/components/StatusBadge.tsx

import React from "react";
import type { PrintStatus } from "../types";
import { CheckCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: PrintStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isPrinted = status === "printed";

  const badgeClasses = isPrinted
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";

  const text = isPrinted ? "Đã in" : "Chưa in";
  const Icon = isPrinted ? CheckCircle : Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses}`}
    >
      <Icon className="w-3 h-3" />
      {text}
    </span>
  );
};

export default StatusBadge;
