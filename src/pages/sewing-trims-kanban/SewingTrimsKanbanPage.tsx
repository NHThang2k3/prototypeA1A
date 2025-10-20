// Path: src/pages/sewing-trims-kanban/SewingTrimsKanbanPage.tsx
// Changes: A lot. Removed dnd-kit, added filtering logic (date range, factory, job),
// and state management for the details modal. The UI is updated to be consistent.

import { useState, useMemo } from "react";
import { mockSewingBoard } from "./data";
import type { KanbanBoard, SewingTrimsTask } from "./types";
import KanbanColumn from "./components/KanbanColumn";
import SewingTrimsTaskDetailsModal from "./components/SewingTrimsTaskDetailsModal";

const SewingTrimsKanbanPage = () => {
  const [boards] = useState<KanbanBoard[]>(mockSewingBoard);
  const [selectedTask, setSelectedTask] = useState<SewingTrimsTask | null>(
    null
  );
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [factoryLineFilter, setFactoryLineFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");

  const activeBoard = boards[0];

  const { uniqueFactoryLines, uniqueJobs } = useMemo(() => {
    if (!activeBoard) return { uniqueFactoryLines: [], uniqueJobs: [] };
    const allFactoryLines = activeBoard.tasks.map((task) => task.factoryLine);
    const allJobs = activeBoard.tasks.map((task) => {
      // Extract job type (e.g., CUT, SEW, FIN) for filtering
      if (task.job.startsWith("CUT")) return "Cắt";
      if (task.job.startsWith("SEW")) return "May";
      if (task.job.startsWith("FIN")) return "Hoàn thiện";
      return "Khác";
    });
    return {
      uniqueFactoryLines: ["all", ...Array.from(new Set(allFactoryLines))],
      uniqueJobs: ["all", ...Array.from(new Set(allJobs))],
    };
  }, [activeBoard]);

  const filteredTaskIds = useMemo(() => {
    if (!activeBoard) return new Set<string>();

    const startDate = startDateFilter ? new Date(startDateFilter) : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);

    const endDate = endDateFilter ? new Date(endDateFilter) : null;
    if (endDate) endDate.setHours(23, 59, 59, 999);

    const filtered = activeBoard.tasks.filter((task) => {
      const taskDate = new Date(task.dateRequired);
      const dateMatch =
        (!startDate || taskDate >= startDate) &&
        (!endDate || taskDate <= endDate);

      const factoryMatch =
        factoryLineFilter === "all" || task.factoryLine === factoryLineFilter;

      const getJobType = (jobCode: string) => {
        if (jobCode.startsWith("CUT")) return "Cắt";
        if (jobCode.startsWith("SEW")) return "May";
        if (jobCode.startsWith("FIN")) return "Hoàn thiện";
        return "Khác";
      };

      const jobMatch =
        jobFilter === "all" || getJobType(task.job) === jobFilter;

      return dateMatch && factoryMatch && jobMatch;
    });

    return new Set(filtered.map((t) => t.id));
  }, [
    activeBoard,
    startDateFilter,
    endDateFilter,
    factoryLineFilter,
    jobFilter,
  ]);

  const handleViewTaskDetails = (taskId: string) => {
    const task = activeBoard.tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  if (!activeBoard) {
    return <div className="p-8">Kanban board not found.</div>;
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Sewing Line - Trims Request
        </h1>
        <p className="text-gray-500 mt-1">
          Track and manage material requests from sewing lines.
        </p>
      </div>

      <div className="flex items-end space-x-4 mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            From Date Required
          </label>
          <input
            type="date"
            id="startDate"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            To Date Required
          </label>
          <input
            type="date"
            id="endDate"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="factoryLine"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Factory Line
          </label>
          <select
            id="factoryLine"
            value={factoryLineFilter}
            onChange={(e) => setFactoryLineFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {uniqueFactoryLines.map((line) => (
              <option key={line} value={line}>
                {line === "all" ? "All Factory Lines" : line}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="jobType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            JOB Type
          </label>
          <select
            id="jobType"
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {uniqueJobs.map((job) => (
              <option key={job} value={job}>
                {job === "all" ? "All JOB Types" : job}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex space-x-4 pb-4">
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
      </div>

      {selectedTask && (
        <SewingTrimsTaskDetailsModal
          task={selectedTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default SewingTrimsKanbanPage;
