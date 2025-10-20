// Path: src/pages/sewing-trims-kanban/components/PriorityTag.tsx
import React from "react";
import type { Priority } from "../types";

interface Props {
  priority: Priority;
}

const PriorityTag: React.FC<Props> = ({ priority }) => {
  const colorClasses: Record<Priority, string> = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorClasses[priority]}`}
    >
      {priority}
    </span>
  );
};

export default PriorityTag;
