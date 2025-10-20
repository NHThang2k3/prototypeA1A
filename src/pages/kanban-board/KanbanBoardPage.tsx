// Path: src/pages/kanban-board/KanbanBoardPage.tsx
import { useState, useMemo } from "react";
// DndContext and related imports are removed
import { mockBoards } from "./data";
import type { KanbanBoard, KanbanTask } from "./types";
import KanbanColumn from "./components/KanbanColumn";
import TaskDetailsModal from "./components/TaskDetailsModal";

// Helper function to parse 'DD/MM/YYYY' string to a Date object
const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

const KanbanBoardPage = () => {
  // The boards state is now only for displaying data, not for drag-and-drop updates.
  const [boards] = useState<KanbanBoard[]>(mockBoards);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [factoryFilter, setFactoryFilter] = useState("all");

  const activeBoard = boards[0];

  const factories = useMemo(() => {
    if (!activeBoard) return [];
    const allFactories = activeBoard.tasks.map((task) => task.factory);
    return ["all", ...Array.from(new Set(allFactories))];
  }, [activeBoard]);

  const filteredTaskIds = useMemo(() => {
    if (!activeBoard) {
      return new Set<string>();
    }
    const startDate = startDateFilter ? new Date(startDateFilter) : null;
    const endDate = endDateFilter ? new Date(endDateFilter) : null;
    if (endDate) endDate.setHours(23, 59, 59, 999);
    const filtered = activeBoard.tasks.filter((task) => {
      const taskDate = parseDate(task.dueDate);
      const dateMatch =
        (!startDate || taskDate >= startDate) &&
        (!endDate || taskDate <= endDate);
      const factoryMatch =
        factoryFilter === "all" || task.factory === factoryFilter;
      return dateMatch && factoryMatch;
    });
    return new Set(filtered.map((t) => t.id));
  }, [activeBoard, startDateFilter, endDateFilter, factoryFilter]);

  const handleViewTaskDetails = (taskId: string) => {
    const task = activeBoard.tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  // The handleDragEnd function is completely removed.

  if (!activeBoard) {
    return <div className="p-8">Kanban board not found.</div>;
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-full">
      {/* Header and Filters remain the same */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Fabric Issuing Management - Cutting Plan
        </h1>
        <p className="text-gray-500 mt-1">
          Track the progress of preparing and delivering fabric to the cutting
          line.
        </p>
      </div>

      <div className="flex items-end space-x-4 mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            From Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            To Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="factory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Factory
          </label>
          <select
            id="factory"
            value={factoryFilter}
            onChange={(e) => setFactoryFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {factories.map((factory) => (
              <option key={factory} value={factory}>
                {factory === "all" ? "All Factories" : factory}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DndContext wrapper is removed */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {activeBoard.columns.map((column) => {
          const tasks = column.taskIds
            .filter((taskId) => filteredTaskIds.has(taskId))
            .map((taskId) => activeBoard.tasks.find((t) => t.id === taskId)!)
            .filter(Boolean);

          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasks}
              onViewDetails={handleViewTaskDetails}
            />
          );
        })}
      </div>

      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default KanbanBoardPage;
