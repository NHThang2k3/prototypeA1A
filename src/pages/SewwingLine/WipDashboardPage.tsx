import React from "react";
// import { BarChart2, AlertCircle, Percent } from "lucide-react";

// 1. ĐỊNH NGHĨA CẤU TRÚC DỮ LIỆU MỚI CHO THẺ WIP
type WipCardData = {
  id: string;
  sewingLine: string; // Tên Line may
  totalWip: number; // Tổng WIP
  hourWip: number; // WIP theo giờ
};

// 2. TẠO DỮ LIỆU MẪU (MOCK DATA) THEO CẤU TRÚC MỚI
// Dữ liệu này là một danh sách phẳng, sẽ được lọc và nhóm vào các cột một cách tự động.
const mockWipData: WipCardData[] = [
  // Cột < 1 (Trắng)
  { id: "wip-01", sewingLine: "Line 01", totalWip: 150, hourWip: 0.8 },
  { id: "wip-02", sewingLine: "Line 05", totalWip: 90, hourWip: 0.5 },
  // Cột 1 - 2 (Đỏ)
  { id: "wip-03", sewingLine: "Line 02", totalWip: 250, hourWip: 1.2 },
  { id: "wip-04", sewingLine: "Line 08", totalWip: 300, hourWip: 1.9 },
  // Cột 2 - 3 (Vàng)
  { id: "wip-05", sewingLine: "Line 03", totalWip: 400, hourWip: 2.5 },
  { id: "wip-06", sewingLine: "Line 07", totalWip: 380, hourWip: 2.1 },
  { id: "wip-07", sewingLine: "Line 11", totalWip: 420, hourWip: 2.9 },
  // Cột 3 - 4 (Xanh lá)
  { id: "wip-08", sewingLine: "Line 04", totalWip: 550, hourWip: 3.3 },
  // Cột >= 4 (Xanh dương)
  { id: "wip-09", sewingLine: "Line 06", totalWip: 700, hourWip: 4.1 },
  { id: "wip-10", sewingLine: "Line 10", totalWip: 850, hourWip: 5.5 },
];

// 3. ĐỊNH NGHĨA CÁC CỘT, MÀU SẮC VÀ ĐIỀU KIỆN LỌC
// Đây là "bộ não" quyết định thẻ nào sẽ nằm ở cột nào.
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

// --- CÁC COMPONENT GIAO DIỆN ---

// Component KPI được giữ nguyên
// const KPICard = ({
//   icon,
//   title,
//   value,
//   color,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   value: string;
//   color: string;
// }) => (
//   <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
//     <div className={`p-3 rounded-full ${color} mr-4`}>{icon}</div>
//     <div>
//       <p className="text-gray-500 text-sm">{title}</p>
//       <p className="text-2xl font-bold text-gray-800">{value}</p>
//     </div>
//   </div>
// );

// 4. CẬP NHẬT COMPONENT THẺ ĐỂ HIỂN THỊ THÔNG TIN WIP
const WipCard = ({
  data,
  borderColor,
}: {
  data: WipCardData;
  borderColor: string;
}) => (
  <div
    className={`bg-white p-3 rounded-lg shadow mb-3 border-l-4 ${borderColor}`}
  >
    <p className="font-bold text-gray-800 text-lg">{data.sewingLine}</p>
    <div className="mt-2 text-sm space-y-1">
      <div className="flex justify-between">
        <span className="text-gray-500">Total WIP:</span>
        <span className="font-semibold text-gray-700">{data.totalWip} pcs</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Hour WIP:</span>
        <span className="font-semibold text-gray-700">
          {data.hourWip.toFixed(1)} hr
        </span>
      </div>
    </div>
  </div>
);

// 5. CẬP NHẬT COMPONENT CỘT ĐỂ LINH HOẠT HƠN
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
    <div className="bg-gray-100 rounded-lg p-3 flex-1 min-w-[300px]">
      <div
        className={`p-2 rounded-md mb-4 flex items-center justify-between shadow-sm ${headerBgColor} ${headerTextColor} ${
          headerBgColor === "bg-white" ? "border" : ""
        }`}
      >
        <h3 className="font-semibold">{title}</h3>
        <span
          className={`${
            headerBgColor === "bg-white"
              ? "bg-gray-200 text-gray-800"
              : "bg-white/30"
          } text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full`}
        >
          {cards.length}
        </span>
      </div>
      <div>
        {cards.map((card) => (
          <WipCard key={card.id} data={card} borderColor={borderColor} />
        ))}
      </div>
    </div>
  );
};

// 6. CẬP NHẬT COMPONENT PAGE CHÍNH ĐỂ RENDER LOGIC MỚI
const WipDashboardPage: React.FC = () => {
  // Dữ liệu KPIs có thể lấy từ nơi khác, ở đây giữ nguyên để minh họa
  // const kpis = {
  //   avgResponseTime: "2 hours 15 minutes",
  //   pendingRequests: 7,
  //   splitOrderRate: "5%",
  // };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Work in Progress (WIP) Dashboard
      </h1>

      {/* KPI Section - Giữ nguyên */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
      </div> */}

      {/* WIP Board Section - Logic render mới */}
      <div className="flex gap-2 overflow-x-auto pb-4">
        {wipColumns.map((column) => {
          // Với mỗi định nghĩa cột, lọc ra các thẻ phù hợp từ dữ liệu tổng
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
