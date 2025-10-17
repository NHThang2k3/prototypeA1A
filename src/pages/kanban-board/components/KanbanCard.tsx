// Path: src/pages/kanban-board/components/KanbanCard.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { KanbanTask } from "../types";
import PriorityTag from "./PriorityTag";
import AssigneeAvatar from "./AssigneeAvatar";
import { Calendar } from "lucide-react";

interface Props {
  task: KanbanTask;
}

const KanbanCard: React.FC<Props> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 mb-3 cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-semibold text-gray-500">
          {task.requestId}
        </span>
        <PriorityTag priority={task.priority} />
      </div>
      <p className="font-semibold text-gray-800 mb-1">{task.title}</p>
      <p className="text-sm text-gray-600 mb-3">{task.details}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{task.dueDate}</span>
        </div>
        <AssigneeAvatar assignee={task.assignee} />
      </div>
    </div>
  );
};

export default KanbanCard;
