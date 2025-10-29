// src/pages/KanbanMonitoringPage/KanbanMonitoringPage.tsx

import React from "react";
import { Clock, CheckCircle, PlayCircle, Archive } from "lucide-react";

// 1. Định nghĩa một interface cho cấu trúc dữ liệu của một ticket
interface Ticket {
  id: string;
  style: string;
  po: string;
  target: number;
  layout: string;
  ready: boolean;
  current?: number; // Thêm '?' để cho biết thuộc tính này là tùy chọn
}

// Mock Data
const kanbanData = {
  waiting: [
    {
      id: "BK003",
      style: "PANT-SLIM",
      po: "PO003",
      target: 3000,
      layout: "LY-05",
      ready: false,
    },
  ],
  ready: [
    {
      id: "BK002",
      style: "JACKET-V2",
      po: "PO002",
      target: 2500,
      layout: "LY-02",
      ready: true,
    },
    {
      id: "BK004",
      style: "T-SHIRT-01",
      po: "PO004",
      target: 5000,
      layout: "LY-01",
      ready: true,
    },
  ],
  inProgress: [
    {
      id: "BK001",
      style: "T-SHIRT-01",
      po: "PO001",
      target: 5000,
      current: 2150,
      layout: "LY-01",
      ready: true,
    },
  ],
  completed: [
    {
      id: "BK000",
      style: "POLO-XYZ",
      po: "PO000",
      target: 1500,
      current: 1500,
      layout: "LY-03",
      ready: true,
    },
  ],
};

// 2. Sửa lỗi tại dòng 60: Thay thế `any` bằng `Ticket`
const KanbanCard = ({ ticket }: { ticket: Ticket }) => {
  // TypeScript giờ sẽ hiểu ticket.current có thể là undefined
  const progress = ticket.current ? (ticket.current / ticket.target) * 100 : 0;
  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <span className="text-sm font-bold text-gray-800">{ticket.style}</span>
        <span className="px-2 py-0.5 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">
          {ticket.po}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {ticket.id} | Layout: {ticket.layout}
      </p>

      {ticket.current !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs font-medium text-gray-600">
            <span>Progress</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-right text-xs mt-1 text-gray-500">
            {ticket.current.toLocaleString()} / {ticket.target.toLocaleString()}
          </p>
        </div>
      )}

      {!ticket.ready && (
        <div className="mt-3 p-2 text-xs text-center text-orange-800 bg-orange-100 rounded-md">
          Waiting for SFG from Supermarket
        </div>
      )}
    </div>
  );
};

const KanbanColumn = ({
  title,
  tickets,
  icon: Icon,
  color,
}: {
  title: string;
  // 3. Sửa lỗi tại dòng 108: Thay thế `any[]` bằng `Ticket[]`
  tickets: Ticket[];
  icon: React.ElementType;
  color: string;
}) => (
  <div className="flex-shrink-0 w-80 bg-gray-100 rounded-lg">
    <div
      className={`flex items-center justify-between p-3 rounded-t-lg ${color}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-white" />
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <span className="px-2 py-1 text-xs font-bold text-gray-700 bg-white rounded-full">
        {tickets.length}
      </span>
    </div>
    <div className="p-2 overflow-y-auto h-[calc(100vh-200px)]">
      {tickets.map((ticket) => (
        <KanbanCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  </div>
);

const KanbanMonitoringPage = () => {
  const columns = [
    {
      title: "Waiting for Materials",
      tickets: kanbanData.waiting,
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      title: "Ready to Start",
      tickets: kanbanData.ready,
      icon: CheckCircle,
      color: "bg-indigo-500",
    },
    {
      title: "In Progress",
      tickets: kanbanData.inProgress,
      icon: PlayCircle,
      color: "bg-blue-500",
    },
    {
      title: "Completed",
      tickets: kanbanData.completed,
      icon: Archive,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">
          Sewing Line Kanban Monitoring
        </h1>
        <p className="text-sm text-gray-500">
          Drag and drop to prioritize. Click a card for details.
        </p>
      </header>
      <div className="flex gap-4 pb-4 overflow-x-auto">
        {columns.map((col) => (
          <KanbanColumn
            key={col.title}
            title={col.title}
            tickets={col.tickets}
            icon={col.icon}
            color={col.color}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanMonitoringPage;
