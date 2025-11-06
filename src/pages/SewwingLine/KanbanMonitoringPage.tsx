import React from "react";
import { Clock, CheckCircle, PlayCircle, Archive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Card className="mb-4 cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <span className="text-sm font-bold">{ticket.style}</span>
          <Badge variant="secondary">{ticket.po}</Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {ticket.id} | Layout: {ticket.layout}
        </p>

        {ticket.current !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-1.5 mt-1" />
            <p className="text-right text-xs mt-1 text-muted-foreground">
              {ticket.current.toLocaleString()} /{" "}
              {ticket.target.toLocaleString()}
            </p>
          </div>
        )}

        {!ticket.ready && (
          <Alert className="mt-3 p-2 text-xs text-center text-orange-800 bg-orange-100 border-orange-200">
            <AlertDescription>
              Waiting for SFG from Supermarket
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
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
  <Card className="flex-shrink-0 w-80 bg-slate-100">
    <CardHeader
      className={`flex flex-row items-center justify-between p-3 rounded-t-lg text-white ${color}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <CardTitle className="text-base font-semibold text-white">
          {title}
        </CardTitle>
      </div>
      <Badge variant="secondary">{tickets.length}</Badge>
    </CardHeader>
    <CardContent className="p-2">
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="pr-4">
          {tickets.map((ticket) => (
            <KanbanCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
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
        <h1 className="text-2xl font-bold">Sewing Line Kanban Monitoring</h1>
        <p className="text-sm text-muted-foreground">
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
