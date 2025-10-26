import React from "react";
import {
  Clock,
  Settings2,
  Send,
  Check,
  BarChart2,
  AlertCircle,
  Percent,
} from "lucide-react";

// Translated status column types
type StatusColumn =
  | "Sewing Line Request"
  | "Supermarket Preparing"
  | "Ready for Delivery"
  | "Delivered";

type KanbanCardData = {
  poId: string;
  sewingLine: string;
  requestAge: string; // e.g., "5 mins ago"
};

// KPIs with translated values
const kpis = {
  avgResponseTime: "2 hours 15 minutes",
  pendingRequests: 7,
  splitOrderRate: "5%",
};

// Translated mock data
const mockData: Record<StatusColumn, KanbanCardData[]> = {
  "Sewing Line Request": [
    { poId: "PO-015", sewingLine: "Line 08", requestAge: "5 mins ago" },
    { poId: "PO-012", sewingLine: "Line 03", requestAge: "25 mins ago" },
  ],
  "Supermarket Preparing": [
    { poId: "PO-014", sewingLine: "Line 01", requestAge: "1 hour ago" },
  ],
  "Ready for Delivery": [
    { poId: "PO-009", sewingLine: "Line 07", requestAge: "3 hours ago" },
  ],
  Delivered: [
    { poId: "PO-010", sewingLine: "Line 10", requestAge: "Today" },
    { poId: "PO-006", sewingLine: "Line 12", requestAge: "Today" },
  ],
};

// Styles linked to translated column names
const columnStyles: Record<
  StatusColumn,
  { bg: string; icon: React.ReactNode }
> = {
  "Sewing Line Request": { bg: "bg-blue-500", icon: <Clock /> },
  "Supermarket Preparing": { bg: "bg-yellow-500", icon: <Settings2 /> },
  "Ready for Delivery": { bg: "bg-purple-500", icon: <Send /> },
  Delivered: { bg: "bg-green-500", icon: <Check /> },
};

const KPICard = ({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}) => (
  <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
    <div className={`p-3 rounded-full ${color} mr-4`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const KanbanCard = ({ data }: { data: KanbanCardData }) => (
  <div className="bg-white p-3 rounded-lg shadow mb-3 border-l-4 border-blue-400">
    <p className="font-bold text-gray-800">{data.poId}</p>
    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
      <span>{data.sewingLine}</span>
      <span>{data.requestAge}</span>
    </div>
  </div>
);

const KanbanColumn = ({
  title,
  cards,
}: {
  title: StatusColumn;
  cards: KanbanCardData[];
}) => {
  const { bg, icon } = columnStyles[title];
  return (
    <div className="bg-gray-100 rounded-lg p-3 flex-1 min-w-[280px]">
      <div
        className={`text-white p-2 rounded-md mb-4 flex items-center justify-between ${bg}`}
      >
        <div className="flex items-center">
          <span className="mr-2">{icon}</span>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <span className="bg-white/30 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
          {cards.length}
        </span>
      </div>
      <div>
        {cards.map((card) => (
          <KanbanCard key={card.poId} data={card} />
        ))}
      </div>
    </div>
  );
};

const WipDashboardPage: React.FC = () => {
  return (
    <div className="p-4">
      {/* Translated main title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Work in Progress (WIP) Dashboard
      </h1>

      {/* KPI Section with translated titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KPICard
          icon={<BarChart2 className="text-blue-800" />}
          title="Average Response Time"
          value={kpis.avgResponseTime}
          color="bg-blue-100"
        />
        <KPICard
          icon={<AlertCircle className="text-yellow-800" />}
          title="Pending Requests"
          value={kpis.pendingRequests.toString()}
          color="bg-yellow-100"
        />
        <KPICard
          icon={<Percent className="text-red-800" />}
          title="Split/Missing Order Rate"
          value={kpis.splitOrderRate}
          color="bg-red-100"
        />
      </div>

      {/* Kanban Board Section */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {Object.entries(mockData).map(([title, cards]) => (
          <KanbanColumn
            key={title}
            title={title as StatusColumn}
            cards={cards}
          />
        ))}
      </div>
    </div>
  );
};

export default WipDashboardPage;
