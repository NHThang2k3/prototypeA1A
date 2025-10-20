// Path: src/pages/kanban-board/components/KanbanCard.tsx
import React from "react";
// No longer need useSortable or CSS
import type { KanbanTask } from "../types";
import { Calendar, MoreHorizontal } from "lucide-react";

interface Props {
  task: KanbanTask;
  onViewDetails: (taskId: string) => void;
}

const KanbanCard: React.FC<Props> = ({ task, onViewDetails }) => {
  // The useSortable hook and its related variables are completely removed.

  const progressPercentage =
    task.requestQuantity > 0
      ? (task.issuedQuantity / task.requestQuantity) * 100
      : 0;

  return (
    // All dnd-kit related props (ref, style, attributes, listeners) are removed.
    // Cursor classes are also removed as the card is no longer draggable.
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 mb-3 hover:shadow-md hover:border-blue-400 transition-shadow space-y-3">
      {/* Header: JOB, Plan Date, and Details Button */}
      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-800">{task.job}</span>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{task.dueDate}</span>
          </div>
          <button
            onClick={() => onViewDetails(task.id)}
            // onMouseDown is no longer needed as there's no drag conflict
            className="text-gray-500 hover:bg-gray-200 rounded-full p-1"
            title="View Details"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item (Title) */}
      <p className="text-sm text-gray-600 border-t border-gray-100 pt-2">
        {task.title}
      </p>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span className="font-semibold">
            {task.issuedQuantity} / {task.requestQuantity}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
