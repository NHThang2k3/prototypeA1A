// Path: src/pages/overall-dashboard/OverallDashboardPage.tsx

import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import {
  Filter,
  Calendar,
  AlertCircle,
  Package,
  Target,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

// --- Type Definitions ---
interface ProductionAreaData {
  id: string;
  name: string;
  wip: number;
  target: number;
  performance: number;
  quality: number;
  link: string;
}

interface OrderData {
  id: string;
  customer: string;
  shipmentDate: string;
  status: "On Track" | "At Risk" | "Late";
  currentLocation: string;
  progress: number;
}

type OrderStatusFilter = "all" | "unfinished" | "late";

// ECharts parameter types
interface ChartSeriesData {
  value: number;
  id: string;
  name: string;
  target: number;
  performance: number;
  quality: number;
  progress: number;
  itemStyle?: {
    color: string;
    borderRadius: number[];
  };
}
interface EChartTooltipParams {
  name: string;
  data: ChartSeriesData;
}
interface EChartClickParams {
  data: {
    id: string;
  };
}

// --- Mock Data ---
const mockProductionAreas: ProductionAreaData[] = [
  {
    id: "cutting",
    name: "Cutting Dept.",
    wip: 1500,
    target: 2000,
    performance: 95,
    quality: 98,
    link: "/cutting/dashboard/cutting-dashboard-performance",
  },
  {
    id: "sewing_a",
    name: "Sewing Line A",
    wip: 3200,
    target: 4000,
    performance: 88,
    quality: 95,
    link: "/sewing-line/productivity/line-dashboard",
  },
  {
    id: "sewing_b",
    name: "Sewing Line B",
    wip: 2800,
    target: 4000,
    performance: 75,
    quality: 92,
    link: "/sewing-line/productivity/line-dashboard",
  }, // Low performance
  {
    id: "decoration",
    name: "Decoration Dept.",
    wip: 800,
    target: 1000,
    performance: 92,
    quality: 99,
    link: "/decoration/productivity/decoration-dashboard",
  },
  {
    id: "packaging",
    name: "Packaging Dept.",
    wip: 1200,
    target: 5000,
    performance: 98,
    quality: 97,
    link: "/finishedgoods-warehouse/productivity/monitoring-report",
  },
];

const mockOrders: OrderData[] = [
  {
    id: "PO-1001",
    customer: "Nike",
    shipmentDate: "2023-11-15",
    status: "On Track",
    currentLocation: "Packaging Dept.",
    progress: 95,
  },
  {
    id: "PO-1002",
    customer: "Adidas",
    shipmentDate: "2023-11-20",
    status: "On Track",
    currentLocation: "Packaging Dept.",
    progress: 85,
  },
  {
    id: "PO-1003",
    customer: "Puma",
    shipmentDate: "2023-11-22",
    status: "At Risk",
    currentLocation: "Sewing Line B",
    progress: 60,
  },
  {
    id: "PO-1004",
    customer: "Uniqlo",
    shipmentDate: "2023-11-18",
    status: "Late",
    currentLocation: "Sewing Line B",
    progress: 55,
  },
  {
    id: "PO-1005",
    customer: "Nike",
    shipmentDate: "2023-12-05",
    status: "On Track",
    currentLocation: "Cutting Dept.",
    progress: 20,
  },
  {
    id: "PO-1006",
    customer: "Adidas",
    shipmentDate: "2023-11-30",
    status: "At Risk",
    currentLocation: "Decoration Dept.",
    progress: 45,
  },
];

// --- Sub-components ---
const KpiCard: React.FC<{
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`rounded-full p-3 mr-4 ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// --- Main Page Component ---
const OverallDashboardPage: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: "2023-10-01",
    to: "2023-10-31",
  });
  const [orderStatusFilter, setOrderStatusFilter] =
    useState<OrderStatusFilter>("all");
  const [selectedArea, setSelectedArea] = useState<ProductionAreaData | null>(
    null
  );

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      if (orderStatusFilter === "late") return order.status === "Late";
      if (orderStatusFilter === "unfinished") return order.progress < 100;
      return true;
    });
  }, [orderStatusFilter]);

  const getChartOptions = () => ({
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: EChartTooltipParams[] | EChartTooltipParams) => {
        const param = Array.isArray(params) ? params[0] : params;
        const data = param.data;
        return `<b>${param.name}</b><br/>
                      WIP: ${data.value.toLocaleString()} / ${data.target.toLocaleString()}<br/>
                      Progress: ${data.progress}%<br/>
                      Performance: ${data.performance}%<br/>
                      Quality: ${data.quality}%<br/>
                      <span style="font-size:12px; color:#888;">Click to see details</span>`;
      },
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: mockProductionAreas.map((area) => area.name),
      axisLabel: {
        interval: 0,
        rotate: 15,
      },
    },
    yAxis: { type: "value", name: "WIP (Units)" },
    series: [
      {
        name: "Work In Progress",
        type: "bar",
        barWidth: "60%",
        data: mockProductionAreas.map(
          (area): ChartSeriesData => ({
            value: area.wip,
            id: area.id,
            name: area.name,
            target: area.target,
            performance: area.performance,
            quality: area.quality,
            progress: Math.round((area.wip / area.target) * 100),
            itemStyle: {
              color: area.performance < 85 ? "#FBBF24" : "#3B82F6",
              borderRadius: [5, 5, 0, 0],
            },
          })
        ),
      },
    ],
  });

  const onChartClick = (params: EChartClickParams) => {
    const areaId = params.data.id;
    const areaData = mockProductionAreas.find((a) => a.id === areaId);
    if (areaData) {
      setSelectedArea(areaData);
    }
  };

  const onEvents = {
    click: onChartClick,
  };

  return (
    // <<< FIX SCROLL: Changed min-h-screen to h-screen and added overflow-y-auto >>>
    <div className="h-screen w-full bg-gray-100 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Overall Production Dashboard
          </h1>
          {/* <<< TRANSLATION >>> */}
          <p className="text-sm text-gray-500 mt-1">
            An overview of all production activities in the factory.
          </p>
        </header>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap items-center justify-between gap-4">
            {/* <<< TRANSLATION >>> */}
            <h2 className="text-lg font-semibold text-gray-700">
              Data Filters
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, from: e.target.value }))
                  }
                  className="p-2 border rounded-md text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, to: e.target.value }))
                  }
                  className="p-2 border rounded-md text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={orderStatusFilter}
                  onChange={(e) =>
                    setOrderStatusFilter(e.target.value as OrderStatusFilter)
                  }
                  className="p-2 border rounded-md text-sm bg-white"
                >
                  {/* <<< TRANSLATION >>> */}
                  <option value="all">All Orders</option>
                  <option value="unfinished">Unfinished</option>
                  <option value="late">Late</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* <<< TRANSLATION >>> */}
            <KpiCard
              title="Total Orders"
              value="1,250"
              icon={Package}
              color="bg-blue-500"
            />
            <KpiCard
              title="In Production"
              value="890"
              icon={Clock}
              color="bg-teal-500"
            />
            <KpiCard
              title="Late Orders"
              value="12"
              icon={AlertCircle}
              color="bg-red-500"
            />
            <KpiCard
              title="Overall Efficiency"
              value="89.5%"
              icon={Target}
              color="bg-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
              {/* <<< TRANSLATION >>> */}
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Production Status by Area
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                This chart shows the Work In Progress (WIP) at each stage.
                Yellow bars indicate areas with low performance.
              </p>
              <ReactECharts
                option={getChartOptions()}
                style={{ height: "400px" }}
                onEvents={onEvents}
              />
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              {/* <<< TRANSLATION >>> */}
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Upcoming Shipment Orders
              </h3>
              <div className="overflow-y-auto max-h-[400px]">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                    <tr>
                      {/* <<< TRANSLATION >>> */}
                      <th scope="col" className="px-4 py-3">
                        Order ID
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {order.id}
                          <br />
                          <span className="font-normal text-gray-500 text-xs">
                            {order.customer} | {order.shipmentDate}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "Late"
                                ? "bg-red-100 text-red-800"
                                : order.status === "At Risk"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {/* <<< TRANSLATION >>> */}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{order.currentLocation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {selectedArea && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setSelectedArea(null)}
            >
              <div
                className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedArea.name} Details
                  </h2>
                  <button
                    onClick={() => setSelectedArea(null)}
                    className="text-gray-500 hover:text-gray-800 text-3xl leading-none"
                  >
                    &times;
                  </button>
                </div>
                <div className="space-y-4">
                  {/* <<< TRANSLATION >>> */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Performance</span>
                    <span
                      className={`font-bold text-lg ${
                        selectedArea.performance < 85
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {selectedArea.performance}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quality</span>
                    <span className="font-bold text-lg text-blue-600">
                      {selectedArea.quality}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">WIP / Target</span>
                    <span className="font-bold text-lg text-gray-800">
                      {selectedArea.wip.toLocaleString()} /{" "}
                      {selectedArea.target.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-6 border-t pt-4">
                  <Link
                    to={selectedArea.link}
                    className="w-full text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    {/* <<< TRANSLATION >>> */}
                    Go to Detailed Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverallDashboardPage;
