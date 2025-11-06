import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type WipCardData = {
  id: string;
  sewingLine: string;
  totalWip: number;
  hourWip: number;
};

const mockWipData: WipCardData[] = [
  { id: "wip-01", sewingLine: "Line 01", totalWip: 150, hourWip: 0.8 },
  { id: "wip-02", sewingLine: "Line 05", totalWip: 90, hourWip: 0.5 },
  { id: "wip-03", sewingLine: "Line 02", totalWip: 250, hourWip: 1.2 },
  { id: "wip-04", sewingLine: "Line 08", totalWip: 300, hourWip: 1.9 },
  { id: "wip-05", sewingLine: "Line 03", totalWip: 400, hourWip: 2.5 },
  { id: "wip-06", sewingLine: "Line 07", totalWip: 380, hourWip: 2.1 },
  { id: "wip-07", sewingLine: "Line 11", totalWip: 420, hourWip: 2.9 },
  { id: "wip-08", sewingLine: "Line 04", totalWip: 550, hourWip: 3.3 },
  { id: "wip-09", sewingLine: "Line 06", totalWip: 700, hourWip: 4.1 },
  { id: "wip-10", sewingLine: "Line 10", totalWip: 850, hourWip: 5.5 },
];

const wipColumns = [
  {
    title: "WIP < 1 Hour",
    headerBgColor: "bg-white",
    headerTextColor: "text-gray-800",
    borderColor: "border-gray-300",
    condition: (card: WipCardData) => card.hourWip < 1,
  },
  {
    title: "WIP 1-2 Hours",
    headerBgColor: "bg-red-500",
    headerTextColor: "text-white",
    borderColor: "border-red-500",
    condition: (card: WipCardData) => card.hourWip >= 1 && card.hourWip < 2,
  },
  {
    title: "WIP 2-3 Hours",
    headerBgColor: "bg-yellow-500",
    headerTextColor: "text-white",
    borderColor: "border-yellow-500",
    condition: (card: WipCardData) => card.hourWip >= 2 && card.hourWip < 3,
  },
  {
    title: "WIP 3-4 Hours",
    headerBgColor: "bg-green-500",
    headerTextColor: "text-white",
    borderColor: "border-green-500",
    condition: (card: WipCardData) => card.hourWip >= 3 && card.hourWip < 4,
  },
  {
    title: "WIP >= 4 Hours",
    headerBgColor: "bg-blue-500",
    headerTextColor: "text-white",
    borderColor: "border-blue-500",
    condition: (card: WipCardData) => card.hourWip >= 4,
  },
];

const WipCard = ({
  data,
  borderColor,
}: {
  data: WipCardData;
  borderColor: string;
}) => (
  <Card className={`mb-3 border-l-4 ${borderColor}`}>
    <CardContent className="p-3">
      <p className="font-bold text-gray-800 text-lg">{data.sewingLine}</p>
      <div className="mt-2 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total WIP:</span>
          <span className="font-semibold text-foreground">
            {data.totalWip} pcs
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Hour WIP:</span>
          <span className="font-semibold text-foreground">
            {data.hourWip.toFixed(1)} hr
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const WipColumn = ({
  title,
  cards,
  headerBgColor,
  headerTextColor,
  borderColor,
}: {
  title: string;
  cards: WipCardData[];
  headerBgColor: string;
  headerTextColor: string;
  borderColor: string;
}) => {
  return (
    <div className="bg-muted rounded-lg p-3 flex-1 min-w-[300px]">
      <div
        className={`p-2 rounded-md mb-4 flex items-center justify-between shadow-sm ${headerBgColor} ${headerTextColor} ${
          headerBgColor === "bg-white" ? "border" : ""
        }`}
      >
        <h3 className="font-semibold">{title}</h3>
        <Badge
          className={`w-6 h-6 justify-center rounded-full text-xs font-bold ${
            headerBgColor === "bg-white"
              ? "bg-gray-200 text-gray-800 hover:bg-gray-200"
              : "bg-white/30 text-white hover:bg-white/30"
          }`}
        >
          {cards.length}
        </Badge>
      </div>
      <div>
        {cards.map((card) => (
          <WipCard key={card.id} data={card} borderColor={borderColor} />
        ))}
      </div>
    </div>
  );
};

const WipDashboardPage: React.FC = () => {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Work in Progress (WIP) Dashboard
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-4">
        {wipColumns.map((column) => {
          const filteredCards = mockWipData.filter(column.condition);

          return (
            <WipColumn
              key={column.title}
              title={column.title}
              cards={filteredCards}
              headerBgColor={column.headerBgColor}
              headerTextColor={column.headerTextColor}
              borderColor={column.borderColor}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WipDashboardPage;
