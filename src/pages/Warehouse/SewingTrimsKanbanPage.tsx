// Path: src/pages/sewing-trims-kanban/SewingTrimsKanbanPage.tsx
// All related files have been combined into this single component file.

import React, { useState, useMemo } from "react";
import { X, Calendar, MoreHorizontal } from "lucide-react";

// --- START: types.ts ---
interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string;
}

type Priority = "High" | "Medium" | "Low";

type Status =
  | "New"
  | "Confirmed"
  | "Picking"
  | "Ready for Pickup"
  | "Partially Issued"
  | "Completed"
  | "Cancelled";

interface SewingTrimsTask {
  id: string;
  requestName: string;
  dateCreated: string;
  dateRequired: string;
  factoryLine: string;
  style: string;
  job: string;
  color: string;
  size: string;
  poNumber: string;
  requiredQuantity: number;
  issuedQuantity: number;
  status: Status;
  priority: Priority;
  bomId: string;
  createdBy: Assignee;
  remarks?: string;
}

interface KanbanColumnData {
  id: string;
  title: string;
  taskIds: string[];
}

interface KanbanBoard {
  id: string;
  name: string;
  columns: KanbanColumnData[];
  tasks: SewingTrimsTask[];
}
// --- END: types.ts ---

// --- START: data.ts ---
const users: Record<string, Assignee> = {
  "lan.nguyen": { id: "user-lan", name: "Nguyễn Thị Lan" },
  "hung.tran": { id: "user-hung", name: "Trần Văn Hùng" },
  "hoa.le": { id: "user-hoa", name: "Lê Thị Hoa" },
  "bach.pham": { id: "user-bach", name: "Phạm Văn Bách" },
  "tu.hoang": { id: "user-tu", name: "Hoàng Minh Tú" },
};

const mockSewingBoard: KanbanBoard[] = [
  {
    id: "sewing-line-trims-request",
    name: "Sewing Line - Trims Request",
    tasks: [
      {
        id: "KB-001",
        requestName: "Yêu cầu vải chính JKT-0821",
        dateCreated: "2023-11-20 08:00",
        dateRequired: "2023-11-20",
        factoryLine: "Chuyền 1",
        style: "JKT-0821",
        job: "CUT-0821-01",
        color: "Black",
        size: "M",
        poNumber: "PO-23-US-5512",
        requiredQuantity: 500,
        issuedQuantity: 0,
        status: "New",
        priority: "High",
        bomId: "BOM-JKT-0821-V2",
        createdBy: users["lan.nguyen"],
        remarks: "Cần gấp để kịp tiến độ cắt.",
      },
      {
        id: "KB-002",
        requestName: "Cấp chỉ may PNT-5503",
        dateCreated: "2023-11-19 14:30",
        dateRequired: "2023-11-20",
        factoryLine: "Chuyền 3",
        style: "PNT-5503",
        job: "SEW-5503-05",
        color: "Navy",
        size: "L",
        poNumber: "PO-23-EU-8904",
        requiredQuantity: 1200,
        issuedQuantity: 1200,
        status: "Completed",
        priority: "Medium",
        bomId: "BOM-PNT-5503-V1",
        createdBy: users["hung.tran"],
        remarks: "Đã nhận đủ hàng.",
      },
      {
        id: "KB-003",
        requestName: "Yêu cầu cúc áo SHRT-112A",
        dateCreated: "2023-11-20 09:15",
        dateRequired: "2023-11-21",
        factoryLine: "Chuyền 5",
        style: "SHRT-112A",
        job: "FIN-112A-02",
        color: "White",
        size: "S",
        poNumber: "PO-23-JP-7765",
        requiredQuantity: 800,
        issuedQuantity: 500,
        status: "Partially Issued",
        priority: "Medium",
        bomId: "BOM-SHRT-112A-V1",
        createdBy: users["hoa.le"],
        remarks: "Kho báo sẽ cấp phần còn lại vào chiều nay.",
      },
      {
        id: "KB-004",
        requestName: "Lấy vải lót cho JKT-0821",
        dateCreated: "2023-11-20 10:00",
        dateRequired: "2023-11-20",
        factoryLine: "Chuyền 1",
        style: "JKT-0821",
        job: "SEW-0821-03",
        color: "Black",
        size: "M",
        poNumber: "PO-23-US-5512",
        requiredQuantity: 500,
        issuedQuantity: 0,
        status: "Ready for Pickup",
        priority: "Medium",
        bomId: "BOM-JKT-0821-V2",
        createdBy: users["lan.nguyen"],
        remarks: "Kho đã soạn xong, chờ tổ trưởng nhận.",
      },
      {
        id: "KB-005",
        requestName: "Yêu cầu dây kéo cho PNT-5503",
        dateCreated: "2023-11-20 11:25",
        dateRequired: "2023-11-21",
        factoryLine: "Chuyền 3",
        style: "PNT-5503",
        job: "SEW-5503-08",
        color: "Navy",
        size: "L",
        poNumber: "PO-23-EU-8904",
        requiredQuantity: 1200,
        issuedQuantity: 0,
        status: "Confirmed",
        priority: "Medium",
        bomId: "BOM-PNT-5503-V1",
        createdBy: users["hung.tran"],
      },
      {
        id: "KB-007",
        requestName: "Yêu cầu nhãn mác cho SHRT-112A",
        dateCreated: "2023-11-21 13:00",
        dateRequired: "2023-11-22",
        factoryLine: "Chuyền 5",
        style: "SHRT-112A",
        job: "FIN-112A-09",
        color: "White",
        size: "S, M, L",
        poNumber: "PO-23-JP-7765",
        requiredQuantity: 2400,
        issuedQuantity: 0,
        status: "Picking",
        priority: "Low",
        bomId: "BOM-SHRT-112A-V1",
        createdBy: users["hoa.le"],
        remarks: "Kho đang tìm hàng.",
      },
      {
        id: "KB-009",
        requestName: "Hủy yêu cầu vải JKT-0821",
        dateCreated: "2023-11-22 10:45",
        dateRequired: "2023-11-22",
        factoryLine: "Chuyền 1",
        style: "JKT-0821",
        job: "CUT-0821-02",
        color: "Beige",
        size: "S",
        poNumber: "PO-23-US-5512",
        requiredQuantity: 250,
        issuedQuantity: 0,
        status: "Cancelled",
        priority: "Low",
        bomId: "BOM-JKT-0821-V2",
        createdBy: users["lan.nguyen"],
        remarks: "Đổi mã màu, sẽ tạo yêu cầu mới.",
      },
      {
        id: "KB-010",
        requestName: "Yêu cầu mex cổ cho SHRT-112A",
        dateCreated: "2023-11-23 08:10",
        dateRequired: "2023-11-24",
        factoryLine: "Chuyền 5",
        style: "SHRT-112A",
        job: "CUT-112A-04",
        color: "White",
        size: "All sizes",
        poNumber: "PO-23-JP-7765",
        requiredQuantity: 1500,
        issuedQuantity: 0,
        status: "New",
        priority: "Medium",
        bomId: "BOM-SHRT-112A-V1",
        createdBy: users["hoa.le"],
      },
    ],
    columns: [
      { id: "col-new", title: "New", taskIds: ["KB-001", "KB-010"] },
      { id: "col-confirmed", title: "Confirmed", taskIds: ["KB-005"] },
      { id: "col-picking", title: "Picking", taskIds: ["KB-007"] },
      { id: "col-ready", title: "Ready for Pickup", taskIds: ["KB-004"] },
      { id: "col-partial", title: "Partially Issued", taskIds: ["KB-003"] },
      { id: "col-completed", title: "Completed", taskIds: ["KB-002"] },
      { id: "col-cancelled", title: "Cancelled", taskIds: ["KB-009"] },
    ],
  },
];
// --- END: data.ts ---

// --- START: AssigneeAvatar.tsx ---
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
// --- END: AssigneeAvatar.tsx ---

// --- START: PriorityTag.tsx ---
interface PriorityTagProps {
  priority: Priority;
}

const PriorityTag: React.FC<PriorityTagProps> = ({ priority }) => {
  const colorClasses: Record<Priority, string> = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorClasses[priority]}`}
    >
      {priority}
    </span>
  );
};
// --- END: PriorityTag.tsx ---

// --- START: SewingTrimsCard.tsx ---
interface SewingTrimsCardProps {
  task: SewingTrimsTask;
  onViewDetails: (taskId: string) => void;
}

const SewingTrimsCard: React.FC<SewingTrimsCardProps> = ({
  task,
  onViewDetails,
}) => {
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
    </div>
  );
};
// --- END: SewingTrimsCard.tsx ---

// --- START: KanbanColumn.tsx ---
interface KanbanColumnProps {
  column: KanbanColumnData;
  tasks: SewingTrimsTask[];
  onViewDetails: (taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onViewDetails,
}) => {
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
// --- END: KanbanColumn.tsx ---

// --- START: SewingTrimsTaskDetailsModal.tsx ---
interface SewingTrimsTaskDetailsModalProps {
  task: SewingTrimsTask;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className="text-md text-gray-800 mt-1">{children}</div>
  </div>
);

const SewingTrimsTaskDetailsModal: React.FC<
  SewingTrimsTaskDetailsModalProps
> = ({ task, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 space-y-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {task.requestName}
            </h2>
            <p className="text-sm text-gray-500">Request ID: {task.id}</p>
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 border-t border-b py-4">
          <DetailItem label="JOB">{task.job}</DetailItem>
          <DetailItem label="Style">{task.style}</DetailItem>
          <DetailItem label="Factory Line">{task.factoryLine}</DetailItem>
          <DetailItem label="Date Required">{task.dateRequired}</DetailItem>
          <DetailItem label="Date Created">{task.dateCreated}</DetailItem>
          <DetailItem label="PO Number">{task.poNumber}</DetailItem>
          <DetailItem label="BOM ID">{task.bomId}</DetailItem>
          <DetailItem label="Color">{task.color}</DetailItem>
          <DetailItem label="Size">{task.size}</DetailItem>
          <DetailItem label="Progress">
            <span className="font-semibold">
              {task.issuedQuantity} / {task.requiredQuantity}
            </span>
          </DetailItem>
          <DetailItem label="Priority">
            <PriorityTag priority={task.priority} />
          </DetailItem>
          <DetailItem label="Created By">
            <div className="flex items-center space-x-2">
              <AssigneeAvatar assignee={task.createdBy} />
              <span>{task.createdBy.name}</span>
            </div>
          </DetailItem>
        </div>

        {/* Remarks */}
        {task.remarks && (
          <div>
            <p className="text-sm font-medium text-gray-500">Remarks</p>
            <p className="text-md text-gray-700 bg-gray-50 p-3 rounded-md mt-1">
              {task.remarks}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
// --- END: SewingTrimsTaskDetailsModal.tsx ---

// --- START: SewingTrimsKanbanPage.tsx (Main Component) ---
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
// --- END: SewingTrimsKanbanPage.tsx (Main Component) ---
