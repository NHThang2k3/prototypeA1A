// Path: src/pages/sewing-trims-kanban/components/KanbanColumn.tsx
// Changes: Removed SortableContext and passed down onViewDetails prop.
import React from "react";
import type { KanbanColumn as ColumnType, SewingTrimsTask } from "../types";
import SewingTrimsCard from "./SewingTrimsCard.tsx";

interface Props {
  column: ColumnType;
  tasks: SewingTrimsTask[];
  onViewDetails: (taskId: string) => void;
}

const KanbanColumn: React.FC<Props> = ({ column, tasks, onViewDetails }) => {
  return (
    <div className="w-80 flex-shrink-0 bg-gray-100 rounded-lg p-3 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">{column.title}</h3>
        <span className="bg-gray-300 text-gray-600 text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <SewingTrimsCard
            key={task.id}
            task={task}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
