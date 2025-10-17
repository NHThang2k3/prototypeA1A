// Path: src/pages/kanban-board/components/KanbanColumn.tsx
import React from "react";
import { SortableContext } from "@dnd-kit/sortable";
import type { KanbanColumn as ColumnType, KanbanTask } from "../types";
import KanbanCard from "./KanbanCard";

interface Props {
  column: ColumnType;
  tasks: KanbanTask[];
}

const KanbanColumn: React.FC<Props> = ({ column, tasks }) => {
  return (
    <div className="w-80 flex-shrink-0 bg-gray-100 rounded-lg p-3 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">{column.title}</h3>
        <span className="bg-gray-300 text-gray-600 text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
          {tasks.length}
        </span>
      </div>
      {/* Container cho các card, có thể scroll nếu quá nhiều */}
      <div className="flex-1 overflow-y-auto">
        <SortableContext items={tasks.map((t) => t.id)}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
