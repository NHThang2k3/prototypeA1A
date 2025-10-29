import React, { useState, useMemo, useEffect, useRef } from "react";
import { Calendar, MoreHorizontal, X } from "lucide-react";

export interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string; // Avatar URL
}

export type Priority = "Urgent" | "High" | "Normal";

export interface KanbanTask {
  id: string;
  requestId: string; // e.g., "CP001"
  title: string; // e.g., "Fabric CTN-005 - White" (This will be the Item)
  issuedQuantity: number; // e.g., 150
  requestQuantity: number; // e.g., 200
  style: string; // e.g., "TSH-001"
  job: string; // e.g., "JOB-101"
  priority: Priority;
  assignee?: Assignee;
  dueDate: string; // Planned date, format "DD/MM/YYYY"
  remarks?: string; // Notes
  factory: string; // New: To filter by factory
}

export interface KanbanColumn {
  id: string; // e.g., "todo", "inprogress", "done"
  title: string;
  taskIds: string[]; // Array containing the IDs of the tasks in this column
}

export interface KanbanBoard {
  id: string; // e.g., "cutting-plan-fabric-issuance"
  name: string; // e.g., "Cutting Plan - Fabric Issuance"
  columns: KanbanColumn[];
  tasks: KanbanTask[];
}

// For better user management
const users: Record<string, Assignee> = {
  "an.nguyen": { id: "user-1", name: "An Nguyen" },
  "bao.tran": { id: "user-2", name: "Bao Tran" },
  "chi.le": { id: "user-3", name: "Chi Le" },
};

const mockBoards: KanbanBoard[] = [
  {
    id: "cutting-plan-fabric-issuance",
    name: "Cutting Plan - Fabric Issuance",
    tasks: [
      {
        id: "task-cp001",
        requestId: "CP001",
        title: "Fabric CTN-005 - White",
        issuedQuantity: 0,
        requestQuantity: 500,
        style: "TSH-001",
        job: "JOB-101",
        priority: "Urgent",
        dueDate: "20/10/2025",
        assignee: users["an.nguyen"],
        remarks: "Priority for cutting first.",
        factory: "Factory A",
      },
      {
        id: "task-cp002",
        requestId: "CP002",
        title: "Fabric DNM-003 - Dark Blue",
        issuedQuantity: 0,
        requestQuantity: 350,
        style: "JEA-002",
        job: "JOB-102",
        priority: "Normal",
        dueDate: "21/10/2025",
        assignee: users["an.nguyen"],
        remarks: "Denim fabric needs to be checked for shrinkage.",
        factory: "Factory B",
      },
      {
        id: "task-cp003",
        requestId: "CP003",
        title: "Fabric SIL-001 - Burgundy",
        issuedQuantity: 150,
        requestQuantity: 200,
        style: "DRS-004",
        job: "JOB-103",
        priority: "High",
        dueDate: "22/10/2025",
        assignee: users["bao.tran"],
        remarks: "Received enough fabric.",
        factory: "Factory A",
      },
      {
        id: "task-cp004",
        requestId: "CP004",
        title: "Fabric POP-002 - Light Blue",
        issuedQuantity: 0,
        requestQuantity: 420,
        style: "SHT-003",
        job: "JOB-104",
        priority: "Normal",
        dueDate: "23/10/2025",
        assignee: users["chi.le"],
        remarks: "Request to check the cutting layout.",
        factory: "Factory B",
      },
      {
        id: "task-cp005",
        requestId: "CP005",
        title: "Fabric NYL-007 - Black",
        issuedQuantity: 150,
        requestQuantity: 150,
        style: "JCK-005",
        job: "JOB-105",
        priority: "Normal",
        dueDate: "25/10/2025",
        assignee: users["bao.tran"],
        remarks: "Completed, waiting to be transferred to sewing.",
        factory: "Factory A",
      },
    ],
    columns: [
      {
        id: "col-1",
        title: "To Do",
        taskIds: ["task-cp001", "task-cp002", "task-cp004"],
      }, // Status: Planned
      { id: "col-2", title: "In Progress", taskIds: ["task-cp003"] }, // Status: In Progress
      { id: "col-3", title: "Ready for Delivery", taskIds: [] },
      { id: "col-4", title: "Delivered", taskIds: ["task-cp005"] }, // Status: Completed
    ],
  },
];

interface PriorityTagProps {
  priority: Priority;
}

const PriorityTag: React.FC<PriorityTagProps> = ({ priority }) => {
  const colorClasses: Record<Priority, string> = {
    Urgent: "bg-red-100 text-red-800",
    High: "bg-yellow-100 text-yellow-800",
    Normal: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorClasses[priority]}`}
    >
      {priority}
    </span>
  );
};

interface AssigneeAvatarProps {
  assignee?: Assignee;
}

const AssigneeAvatar: React.FC<AssigneeAvatarProps> = ({ assignee }) => {
  if (!assignee) {
    return null;
  }

  const initials = assignee.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div
      title={assignee.name}
      className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold"
    >
      {assignee.avatarUrl ? (
        <img
          src={assignee.avatarUrl}
          alt={assignee.name}
          className="w-full h-full rounded-full"
        />
      ) : (
        initials
      )}
    </div>
  );
};

// MODIFIED: Add 'isSelectable' prop
interface KanbanCardProps {
  task: KanbanTask;
  isSelected: boolean;
  onToggleSelection: (taskId: string) => void;
  onViewDetails: (taskId: string) => void;
  isSelectable: boolean; // NEW: To control if the card can be selected
}

const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  isSelected,
  onToggleSelection,
  onViewDetails,
  isSelectable, // NEW
}) => {
  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    onViewDetails(task.id);
  };

  return (
    <div
      // MODIFIED: Class and onClick handler are now conditional based on 'isSelectable'
      className={`bg-white rounded-lg p-3 shadow-sm border mb-3 transition-all space-y-3 ${
        isSelectable
          ? "cursor-pointer hover:shadow-md hover:border-blue-400"
          : "cursor-default"
      } ${
        isSelected && isSelectable
          ? "border-blue-500 ring-2 ring-blue-500 ring-offset-1 bg-blue-50"
          : "border-gray-200"
      }`}
      onClick={() => isSelectable && onToggleSelection(task.id)}
    >
      {/* Header: JOB, Plan Date, and Details Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* NEW: Conditionally render the checkbox */}
          {isSelectable && (
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={isSelected}
              onChange={() => onToggleSelection(task.id)}
              onClick={(e) => e.stopPropagation()} // Prevent double toggle
            />
          )}
          <span className="font-bold text-gray-800">{task.job}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{task.dueDate}</span>
          </div>
          <button
            onClick={handleViewDetailsClick}
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
    </div>
  );
};

interface TaskDetailsModalProps {
  task: KanbanTask;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  onClose,
}) => {
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

// MODIFIED: Add 'isSelectable' prop
interface KanbanColumnComponentProps {
  column: KanbanColumn;
  tasks: KanbanTask[];
  selectedTaskIds: Set<string>;
  onToggleTaskSelection: (taskId: string) => void;
  onSelectAllInColumn: (taskIdsInColumn: string[]) => void;
  onViewDetails: (taskId: string) => void;
  isSelectable: boolean; // NEW: To control selection UI
}

const KanbanColumnComponent: React.FC<KanbanColumnComponentProps> = ({
  column,
  tasks,
  selectedTaskIds,
  onToggleTaskSelection,
  onSelectAllInColumn,
  onViewDetails,
  isSelectable, // NEW
}) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  const taskIdsInColumn = useMemo(() => tasks.map((t) => t.id), [tasks]);
  const selectedCount = useMemo(
    () => taskIdsInColumn.filter((id) => selectedTaskIds.has(id)).length,
    [taskIdsInColumn, selectedTaskIds]
  );

  const isAllSelected = tasks.length > 0 && selectedCount === tasks.length;
  const isIndeterminate = selectedCount > 0 && selectedCount < tasks.length;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className="w-80 flex-shrink-0 bg-gray-100 rounded-lg p-3 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {/* NEW: Conditionally render the "Select All" checkbox */}
          {isSelectable && (
            <input
              ref={checkboxRef}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
              checked={isAllSelected}
              onChange={() => onSelectAllInColumn(taskIdsInColumn)}
              disabled={tasks.length === 0}
            />
          )}
          <h3 className="font-semibold text-gray-700">{column.title}</h3>
        </div>
        <span className="bg-gray-300 text-gray-600 text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            onViewDetails={onViewDetails}
            isSelected={selectedTaskIds.has(task.id)}
            onToggleSelection={onToggleTaskSelection}
            // MODIFIED: Pass 'isSelectable' down to the card
            isSelectable={isSelectable}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-sm text-gray-500 mt-8">
            No tasks in this column.
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to parse 'DD/MM/YYYY' string to a Date object
const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

const KanbanBoardPage = () => {
  const [boards] = useState<KanbanBoard[]>(mockBoards);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [factoryFilter, setFactoryFilter] = useState("all");

  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set()
  );

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

  const handleToggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (newSelectedIds.has(taskId)) {
        newSelectedIds.delete(taskId);
      } else {
        newSelectedIds.add(taskId);
      }
      return newSelectedIds;
    });
  };

  const handleSelectAllInColumn = (taskIdsInColumn: string[]) => {
    setSelectedTaskIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);

      const allSelected = taskIdsInColumn.every((id) => newSelectedIds.has(id));

      if (allSelected) {
        taskIdsInColumn.forEach((id) => newSelectedIds.delete(id));
      } else {
        taskIdsInColumn.forEach((id) => newSelectedIds.add(id));
      }
      return newSelectedIds;
    });
  };

  const handleIssueFabric = () => {
    if (selectedTaskIds.size === 0) {
      alert("Please select at least one JOB to issue fabric.");
      return;
    }
    const selectedJobs = Array.from(selectedTaskIds)
      .map((taskId) => activeBoard.tasks.find((t) => t.id === taskId)?.job)
      .filter(Boolean);

    alert(
      `Issuing fabric for the following JOBs:\n- ${selectedJobs.join("\n- ")}`
    );
    setSelectedTaskIds(new Set());
  };

  if (!activeBoard) {
    return <div className="p-8">Kanban board not found.</div>;
  }

  // NEW: Define which columns should not have selection enabled
  const nonSelectableColumnIds = ["col-3", "col-4"]; // IDs for 'Ready for Delivery' and 'Delivered'

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-full">
      {/* Header and Filters */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Fabric Issuing Management - Cutting Plan
        </h1>
        <p className="text-gray-500 mt-1">
          Track the progress of preparing and delivering fabric to the cutting
          line.
        </p>
      </div>

      <div className="flex items-end justify-between space-x-4 mb-6 bg-white p-4 rounded-lg shadow-sm border">
        {/* Filters */}
        <div className="flex items-end space-x-4">
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

        {/* Action Button */}
        <div>
          <button
            onClick={handleIssueFabric}
            disabled={selectedTaskIds.size === 0}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Issue Fabric ({selectedTaskIds.size})
          </button>
        </div>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {activeBoard.columns.map((column) => {
          const tasks = column.taskIds
            .filter((taskId) => filteredTaskIds.has(taskId))
            .map((taskId) => activeBoard.tasks.find((t) => t.id === taskId)!)
            .filter(Boolean);

          // NEW: Determine if the column should allow selection
          const isColumnSelectable = !nonSelectableColumnIds.includes(
            column.id
          );

          return (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              tasks={tasks}
              onViewDetails={handleViewTaskDetails}
              selectedTaskIds={selectedTaskIds}
              onToggleTaskSelection={handleToggleTaskSelection}
              onSelectAllInColumn={handleSelectAllInColumn}
              // NEW: Pass the selectability flag down to the column component
              isSelectable={isColumnSelectable}
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
