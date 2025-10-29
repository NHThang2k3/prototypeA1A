// src/pages/BondingOutputPage/BondingOutputPage.tsx

import { Download, Calendar, Search, TrendingUp } from "lucide-react";

// Mock Data for Bonding Output
const bondingOutputData = [
  {
    bundleId: "BNDL-008",
    po: "PO12348",
    style: "STYLE-D04",
    worker: "W005 - David Chen",
    goodQty: 98,
    defectQty: 2,
    completedAt: "10:30 AM",
  },
  {
    bundleId: "BNDL-012",
    po: "PO12348",
    style: "STYLE-D04",
    worker: "W006 - Emily White",
    goodQty: 100,
    defectQty: 0,
    completedAt: "11:15 AM",
  },
  {
    bundleId: "BNDL-015",
    po: "PO12350",
    style: "STYLE-F06",
    worker: "W005 - David Chen",
    goodQty: 145,
    defectQty: 5,
    completedAt: "01:45 PM",
  },
  {
    bundleId: "BNDL-019",
    po: "PO12350",
    style: "STYLE-F06",
    worker: "W006 - Emily White",
    goodQty: 150,
    defectQty: 0,
    completedAt: "03:00 PM",
  },
];

// 2. Định nghĩa kiểu cho props của KPICard
type KPICardProps = {
  title: string;
  value: string | number;
  subValue?: string; // subValue có thể có hoặc không, nên dùng '?'
};

// 3. Áp dụng kiểu đã định nghĩa vào component
const KPICard = ({ title, value, subValue }: KPICardProps) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
  </div>
);

const BondingOutputPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <TrendingUp size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bonding Output</h1>
            <p className="text-gray-500">
              Daily production statistics for the Bonding process.
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
          <Download size={16} /> Export
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Total Output Today"
          value="1,250 pcs"
          subValue="Sum of Good and Defect Qty"
        />
        <KPICard
          title="Good Quantity"
          value="1,235 pcs"
          subValue="98.8% of Total"
        />
        <KPICard title="Defect Rate" value="1.2%" subValue="15 pcs" />
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by PO, Style, Worker..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              defaultValue={new Date().toISOString().substring(0, 10)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3">Bundle ID</th>
                <th className="px-6 py-3">PO Number</th>
                <th className="px-6 py-3">Style</th>
                <th className="px-6 py-3">Worker</th>
                <th className="px-6 py-3">Good Qty</th>
                <th className="px-6 py-3">Defect Qty</th>
                <th className="px-6 py-3">Completed At</th>
              </tr>
            </thead>
            <tbody>
              {bondingOutputData.map((item) => (
                <tr
                  key={item.bundleId}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.bundleId}
                  </td>
                  <td className="px-6 py-4">{item.po}</td>
                  <td className="px-6 py-4">{item.style}</td>
                  <td className="px-6 py-4">{item.worker}</td>
                  <td className="px-6 py-4 text-green-600 font-semibold">
                    {item.goodQty}
                  </td>
                  <td className="px-6 py-4 text-red-600 font-semibold">
                    {item.defectQty}
                  </td>
                  <td className="px-6 py-4">{item.completedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BondingOutputPage;
