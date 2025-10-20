// Path: src/pages/sewing-trims-kanban/components/SewingTrimsCard.tsx
// Changes: Moved the dateRequired to the header to save vertical space.

import React from "react";
import type { SewingTrimsTask } from "../types";
import PriorityTag from "./PriorityTag";
import { Calendar, MoreHorizontal } from "lucide-react";

interface Props {
  task: SewingTrimsTask;
  onViewDetails: (taskId: string) => void;
}

const SewingTrimsCard: React.FC<Props> = ({ task, onViewDetails }) => {
  const completionPercentage =
    task.requiredQuantity > 0
      ? (task.issuedQuantity / task.requiredQuantity) * 100
      : 0;

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 mb-3 hover:shadow-md hover:border-blue-400 transition-shadow space-y-3">
      {/* Header: Now includes JOB, Priority, Date Required, and Details Button */}
      <div className="flex justify-between items-start">
        {/* Left Side: JOB and Priority */}
        <div>
          <span className="font-bold text-gray-800">{task.job}</span>
          <div className="mt-1">
            <PriorityTag priority={task.priority} />
          </div>
        </div>

        {/* Right Side: Date and Details Button */}
        <div className="flex items-center space-x-2">
          {/* Date Required (Moved from footer) */}
          <div
            className="flex items-center space-x-1.5 text-sm text-gray-500"
            title="Date Required"
          >
            <Calendar className="w-4 h-4" />
            <span>{task.dateRequired}</span>
          </div>
          <button
            onClick={() => onViewDetails(task.id)}
            className="text-gray-500 hover:bg-gray-200 rounded-full p-1"
            title="View Details"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-gray-700 border-t border-gray-100 pt-2">
        {task.requestName}
      </p>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span className="font-semibold">
            {task.issuedQuantity} / {task.requiredQuantity}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Footer section has been removed */}
    </div>
  );
};

export default SewingTrimsCard;
