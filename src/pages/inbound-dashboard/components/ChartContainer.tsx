// src/pages/inbound-dashboard/components/ChartContainer.tsx

import React from "react";

const ChartContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
    <div style={{ height: "300px" }}>{children}</div>
  </div>
);

export default ChartContainer;
