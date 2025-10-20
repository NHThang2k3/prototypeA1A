// src/pages/inbound-dashboard/components/SummaryCard.tsx

import React from "react";
import type { SummaryData } from "../types";

const SummaryCard: React.FC<SummaryData> = ({
  icon: Icon,
  title,
  value,
  color,
  unit,
}) => (
  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-4">
    <div className={`rounded-full p-3 ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">
        {typeof value === "number" ? value.toLocaleString() : value}
        {unit && (
          <span className="text-lg font-medium text-gray-500 ml-1">{unit}</span>
        )}
      </p>
    </div>
  </div>
);

export default SummaryCard;
