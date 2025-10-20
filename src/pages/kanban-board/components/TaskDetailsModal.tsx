// Path: src/pages/kanban-board/components/TaskDetailsModal.tsx
import React from "react";
import type { KanbanTask } from "../types";
import { X } from "lucide-react";
import PriorityTag from "./PriorityTag";
import AssigneeAvatar from "./AssigneeAvatar";

interface Props {
  task: KanbanTask;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<Props> = ({ task, onClose }) => {
  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{task.job}</h2>
            <p className="text-sm text-gray-500">{task.requestId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-b py-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Item</p>
            <p className="text-md text-gray-800">{task.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Style</p>
            <p className="text-md text-gray-800">{task.style}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Factory</p>
            <p className="text-md text-gray-800">{task.factory}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Plan Date</p>
            <p className="text-md text-gray-800">{task.dueDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Progress</p>
            <p className="text-md text-gray-800 font-semibold">
              {task.issuedQuantity} / {task.requestQuantity}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Priority</p>
            <PriorityTag priority={task.priority} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Assignee</p>
            <div className="flex items-center space-x-2 mt-1">
              <AssigneeAvatar assignee={task.assignee} />
              <span>{task.assignee?.name || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div>
          <p className="text-sm font-medium text-gray-500">Remarks</p>
          <p className="text-md text-gray-700 bg-gray-50 p-3 rounded-md mt-1">
            {task.remarks || "None"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
