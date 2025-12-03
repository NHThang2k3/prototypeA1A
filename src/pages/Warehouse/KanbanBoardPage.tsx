// src/pages/kanban-board/KanbanBoardPage.tsx

import React, { useState, useMemo } from "react";
import { Calendar, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// ============================================================================
// TYPES, CONSTANTS, AND MOCK DATA (Unchanged)
// ============================================================================

export interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string;
}

export type Priority = "Urgent" | "High" | "Normal";

export interface KanbanTask {
  id: string;
  requestId: string;
  title: string;
  issuedQuantity: number;
  requestQuantity: number;
  style: string;
  job: string;
  priority: Priority;
  assignee?: Assignee;
  dueDate: string;
  remarks?: string;
  factory: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  taskIds: string[];
}

export interface KanbanBoard {
  id: string;
  name: string;
  columns: KanbanColumn[];
  tasks: KanbanTask[];
}

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
      },
      { id: "col-2", title: "In Progress", taskIds: ["task-cp003"] },
      { id: "col-3", title: "Ready for Delivery", taskIds: [] },
      { id: "col-4", title: "Delivered", taskIds: ["task-cp005"] },
    ],
  },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const colorMap: Record<Priority, string> = {
    Urgent: "bg-red-100 text-red-800 border-red-200",
    High: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Normal: "bg-green-100 text-green-800 border-green-200",
  };
  return (
    <Badge variant="outline" className={colorMap[priority]}>
      {priority}
    </Badge>
  );
};

const AssigneeAvatar: React.FC<{ assignee?: Assignee }> = ({ assignee }) => {
  if (!assignee) return null;
  const initials = assignee.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <Avatar className="w-7 h-7">
      <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

const KanbanCard: React.FC<{
  task: KanbanTask;
  isSelected: boolean;
  onToggleSelection: (taskId: string) => void;
  onViewDetails: (taskId: string) => void;
  isSelectable: boolean;
}> = ({ task, isSelected, onToggleSelection, onViewDetails, isSelectable }) => {
  return (
    <Card
      className={`mb-3 transition-all ${
        isSelectable
          ? "cursor-pointer hover:shadow-md hover:border-blue-400"
          : "cursor-default"
      } ${
        isSelected && isSelectable
          ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50"
          : ""
      }`}
      onClick={() => isSelectable && onToggleSelection(task.id)}
    >
      <CardContent className="p-3 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isSelectable && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelection(task.id)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <span className="font-bold text-gray-800">{task.job}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{task.dueDate}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(task.id);
              }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 border-t pt-2">{task.title}</p>
      </CardContent>
    </Card>
  );
};

const TaskDetailsModal: React.FC<{
  task: KanbanTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ task, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{task.job}</DialogTitle>
          <DialogDescription>{task.requestId}</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4">
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
            <PriorityBadge priority={task.priority} />
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500">Assignee</p>
            <div className="flex items-center space-x-2 mt-1">
              <AssigneeAvatar assignee={task.assignee} />
              <span className="text-gray-800">
                {task.assignee?.name || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium text-gray-500">Remarks</p>
          <p className="text-md text-gray-700 bg-gray-50 p-3 rounded-md mt-1">
            {task.remarks || "None"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const KanbanColumnComponent: React.FC<{
  column: KanbanColumn;
  tasks: KanbanTask[];
  selectedTaskIds: Set<string>;
  onToggleTaskSelection: (taskId: string) => void;
  onSelectAllInColumn: (taskIdsInColumn: string[]) => void;
  onViewDetails: (taskId: string) => void;
  isSelectable: boolean;
}> = ({
  column,
  tasks,
  selectedTaskIds,
  onToggleTaskSelection,
  onSelectAllInColumn,
  onViewDetails,
  isSelectable,
}) => {
  const taskIdsInColumn = useMemo(() => tasks.map((t) => t.id), [tasks]);
  const selectedCount = useMemo(
    () => taskIdsInColumn.filter((id) => selectedTaskIds.has(id)).length,
    [taskIdsInColumn, selectedTaskIds]
  );

  const isAllSelected = tasks.length > 0 && selectedCount === tasks.length;

  return (
    <div className="w-80 flex-shrink-0 bg-gray-100 rounded-lg p-3 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {isSelectable && (
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={() => onSelectAllInColumn(taskIdsInColumn)}
              disabled={tasks.length === 0}
            />
          )}
          <h3 className="font-semibold text-gray-700">{column.title}</h3>
        </div>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>
      <div className="flex-1 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            onViewDetails={onViewDetails}
            isSelected={selectedTaskIds.has(task.id)}
            onToggleSelection={onToggleTaskSelection}
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

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

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
    if (!activeBoard) return new Set<string>();
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
    if (task) setSelectedTask(task);
  };

  const handleToggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) newSet.delete(taskId);
      else newSet.add(taskId);
      return newSet;
    });
  };

  const handleSelectAllInColumn = (taskIdsInColumn: string[]) => {
    setSelectedTaskIds((prev) => {
      const newSet = new Set(prev);
      const allSelected = taskIdsInColumn.every((id) => newSet.has(id));
      if (allSelected) taskIdsInColumn.forEach((id) => newSet.delete(id));
      else taskIdsInColumn.forEach((id) => newSet.add(id));
      return newSet;
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

  if (!activeBoard) return <div className="p-8">Kanban board not found.</div>;

  const nonSelectableColumnIds = ["col-3", "col-4"];

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Kanban board for FBWH from cutting office
        </h1>
        <p className="text-gray-500 mt-1">
          Track the progress of preparing and delivering fabric to the cutting
          line.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex items-end justify-between space-x-4">
          <div className="flex items-end space-x-4">
            <div>
              <Label htmlFor="startDate">From Date</Label>
              <Input
                type="date"
                id="startDate"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">To Date</Label>
              <Input
                type="date"
                id="endDate"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="factory">Factory</Label>
              <Select value={factoryFilter} onValueChange={setFactoryFilter}>
                <SelectTrigger id="factory" className="w-[180px]">
                  <SelectValue placeholder="Select factory" />
                </SelectTrigger>
                <SelectContent>
                  {factories.map((factory) => (
                    <SelectItem key={factory} value={factory}>
                      {factory === "all" ? "All Factories" : factory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleIssueFabric}
            disabled={selectedTaskIds.size === 0}
          >
            Issue Fabric ({selectedTaskIds.size})
          </Button>
        </CardContent>
      </Card>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {activeBoard.columns.map((column) => {
          const tasks = column.taskIds
            .filter((taskId) => filteredTaskIds.has(taskId))
            .map((taskId) => activeBoard.tasks.find((t) => t.id === taskId)!)
            .filter(Boolean);
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
              isSelectable={isColumnSelectable}
            />
          );
        })}
      </div>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default KanbanBoardPage;
