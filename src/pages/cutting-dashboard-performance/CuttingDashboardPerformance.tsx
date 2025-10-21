// Path: src/pages/cutting-dashboard-performance/CuttingDashboardPerformance.tsx
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import {
  Scissors,
  AlertTriangle,
  Clock,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

// --- Mock Data ---
const cuttingData = [
  {
    jobNo: "SOAD2510113/1",
    style: "L JACKET",
    color: "BLACK",
    totalRequiredQty: 8200,
    requiredCompletionDate: "15/12/2025",
    actualCutQty: 8200,
    completionRate: 100,
    status: "Completed",
    actualCuttingTime: 3500,
    downtime: 150,
    fabricUtilizationRate: 93.8,
    targetUtilization: 93.5,
    utilizationVariance: 0.3,
    defectRecutQty: 50,
    machine: "Cutter 01",
    worker: "John Doe",
  },
  {
    jobNo: "SOAD2510113/2",
    style: "L JACKET",
    color: "WHITE",
    totalRequiredQty: 4150,
    requiredCompletionDate: "15/12/2025",
    actualCutQty: 4000,
    completionRate: 96.4,
    status: "Cutting in Progress",
    actualCuttingTime: 1850,
    downtime: 100,
    fabricUtilizationRate: 92.1,
    targetUtilization: 93.0,
    utilizationVariance: -0.9,
    defectRecutQty: 40,
    machine: "Cutter 02",
    worker: "Jane Smith",
  },
  {
    jobNo: "SOAD2510114/1",
    style: "KIDS TEE",
    color: "RED",
    totalRequiredQty: 650,
    requiredCompletionDate: "5/12/2025",
    actualCutQty: 0,
    completionRate: 0,
    status: "Waiting for Fabric",
    actualCuttingTime: 0,
    downtime: 0,
    fabricUtilizationRate: null,
    targetUtilization: 95.0,
    utilizationVariance: null,
    defectRecutQty: 0,
    machine: "Cutter 01",
    worker: "John Doe",
  },
  {
    jobNo: "SOTSM2503115/1",
    style: "SAMPLE SHOE",
    color: "GREY",
    totalRequiredQty: 15,
    requiredCompletionDate: "25/11/2025",
    actualCutQty: 15,
    completionRate: 100,
    status: "Completed",
    actualCuttingTime: 45,
    downtime: 5,
    fabricUtilizationRate: 85.0,
    targetUtilization: 86.0,
    utilizationVariance: -1.0,
    defectRecutQty: 0,
    machine: "Cutter 03",
    worker: "Peter Jones",
  },
  {
    jobNo: "SOAD2510116/1",
    style: "TRACKPANTS",
    color: "NAVY",
    totalRequiredQty: 12050,
    requiredCompletionDate: "10/1/2026",
    actualCutQty: 5000,
    completionRate: 41.5,
    status: "Cutting in Progress",
    actualCuttingTime: 2100,
    downtime: 250,
    fabricUtilizationRate: 94.5,
    targetUtilization: 94.0,
    utilizationVariance: 0.5,
    defectRecutQty: 120,
    machine: "Cutter 01",
    worker: "John Doe",
  },
  {
    jobNo: "SOAD2510120/1",
    style: "WMNS TEE",
    color: "PINK",
    totalRequiredQty: 5500,
    requiredCompletionDate: "20/12/2025",
    actualCutQty: 5500,
    completionRate: 100,
    status: "Completed",
    actualCuttingTime: 1400,
    downtime: 80,
    fabricUtilizationRate: 96.2,
    targetUtilization: 96.0,
    utilizationVariance: 0.2,
    defectRecutQty: 20,
    machine: "Cutter 02",
    worker: "Jane Smith",
  },
  {
    jobNo: "SOAD2510121/1",
    style: "MENS SHIRT",
    color: "YELLOW",
    totalRequiredQty: 9800,
    requiredCompletionDate: "25/01/2026",
    actualCutQty: 1500,
    completionRate: 15.3,
    status: "Cutting in Progress",
    actualCuttingTime: 650,
    downtime: 50,
    fabricUtilizationRate: 91.0,
    targetUtilization: 92.0,
    utilizationVariance: -1.0,
    defectRecutQty: 85,
    machine: "Cutter 03",
    worker: "Sam Wilson",
  },
  {
    jobNo: "SORB2510122/1",
    style: "MENS SHORTS",
    color: "ORANGE",
    totalRequiredQty: 7100,
    requiredCompletionDate: "18/11/2025",
    actualCutQty: 6900,
    completionRate: 97.2,
    status: "Urgent Cut",
    actualCuttingTime: 2950,
    downtime: 300,
    fabricUtilizationRate: 90.5,
    targetUtilization: 91.0,
    utilizationVariance: -0.5,
    defectRecutQty: 60,
    machine: "Cutter 02",
    worker: "Jane Smith",
  },
  {
    jobNo: "SOPU2510123/1",
    style: "KIDS JACKET",
    color: "PURPLE",
    totalRequiredQty: 3200,
    requiredCompletionDate: "10/12/2025",
    actualCutQty: 0,
    completionRate: 0,
    status: "Waiting for Setup",
    actualCuttingTime: 0,
    downtime: 0,
    fabricUtilizationRate: null,
    targetUtilization: 90.0,
    utilizationVariance: null,
    defectRecutQty: 0,
    machine: "Cutter 01",
    worker: "Sam Wilson",
  },
  {
    jobNo: "SOTSM2510124/1",
    style: "UNISEX SCARF",
    color: "GREEN",
    totalRequiredQty: 15000,
    requiredCompletionDate: "28/01/2026",
    actualCutQty: 0,
    completionRate: 0,
    status: "Planned",
    actualCuttingTime: 0,
    downtime: 0,
    fabricUtilizationRate: null,
    targetUtilization: 88.0,
    utilizationVariance: null,
    defectRecutQty: 0,
    machine: "Cutter 03",
    worker: "Peter Jones",
  },
];

type KpiCardProps = {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
};

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div
      className={`p-3 rounded-full mr-4`}
      style={{ backgroundColor: `${color}20` }}
    >
      <Icon className="h-7 w-7" style={{ color: color }} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const getStatusClass = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Cutting in Progress":
      return "bg-blue-100 text-blue-800";
    case "Urgent Cut":
      return "bg-red-100 text-red-800 font-semibold";
    case "Waiting for Fabric":
    case "Waiting for Setup":
      return "bg-yellow-100 text-yellow-800";
    case "Planned":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const CuttingDashboardPerformance: React.FC = () => {
  // --- Chart Options ---
  const dailyPerformanceOptions = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      legend: { data: ["Required QTY", "Actual Cut QTY"] },
      xAxis: {
        type: "category",
        data: cuttingData.map((d) => d.jobNo.split("/")[0]),
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "Required QTY",
          type: "bar",
          data: cuttingData.map((d) => d.totalRequiredQty),
          itemStyle: { color: "#a0aec0" },
        },
        {
          name: "Actual Cut QTY",
          type: "bar",
          data: cuttingData.map((d) => d.actualCutQty),
          itemStyle: { color: "#4299e1" },
        },
      ],
    }),
    []
  );

  const machinePerformanceOptions = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      legend: { data: ["Cutting Time (Mins)", "Downtime (Mins)"] },
      xAxis: {
        type: "category",
        data: ["Cutter 01", "Cutter 02", "Cutter 03"],
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "Cutting Time (Mins)",
          type: "bar",
          stack: "total",
          data: [5600, 4750, 695],
          itemStyle: { color: "#48bb78" },
        },
        {
          name: "Downtime (Mins)",
          type: "bar",
          stack: "total",
          data: [400, 480, 55],
          itemStyle: { color: "#f56565" },
        },
      ],
    }),
    []
  );

  const fabricUtilizationOptions = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      legend: { data: ["Utilization Rate", "Target Rate"] },
      xAxis: {
        type: "category",
        data: cuttingData
          .filter((d) => d.fabricUtilizationRate !== null)
          .map((d) => d.jobNo),
      },
      yAxis: { type: "value", axisLabel: { formatter: "{value}%" } },
      series: [
        {
          name: "Utilization Rate",
          type: "line",
          data: cuttingData
            .filter((d) => d.fabricUtilizationRate !== null)
            .map((d) => d.fabricUtilizationRate),
          smooth: true,
          itemStyle: { color: "#38b2ac" },
        },
        {
          name: "Target Rate",
          type: "line",
          data: cuttingData
            .filter((d) => d.fabricUtilizationRate !== null)
            .map((d) => d.targetUtilization),
          smooth: true,
          lineStyle: { type: "dashed" },
          itemStyle: { color: "#f6ad55" },
        },
      ],
    }),
    []
  );

  const completionStatusOptions = useMemo(() => {
    const statusCounts = cuttingData.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      tooltip: { trigger: "item" },
      legend: { orient: "vertical", left: "left" },
      series: [
        {
          name: "Job Status",
          type: "pie",
          radius: "50%",
          data: Object.entries(statusCounts).map(([name, value]) => ({
            value,
            name,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  }, []);

  const totalCutQty = useMemo(
    () => cuttingData.reduce((sum, item) => sum + item.actualCutQty, 0),
    []
  );
  const totalDefects = useMemo(
    () => cuttingData.reduce((sum, item) => sum + item.defectRecutQty, 0),
    []
  );
  const totalDowntime = useMemo(
    () => cuttingData.reduce((sum, item) => sum + item.downtime, 0),
    []
  );
  const avgUtilization = useMemo(() => {
    const itemsWithUtilization = cuttingData.filter(
      (item) => item.fabricUtilizationRate != null
    );
    if (itemsWithUtilization.length === 0) return 0;
    const totalUtilization = itemsWithUtilization.reduce(
      (sum, item) => sum + item.fabricUtilizationRate!,
      0
    );
    return (totalUtilization / itemsWithUtilization.length).toFixed(2);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Cutting Performance Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Real-time overview of cutting floor efficiency and status.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-white rounded-md shadow-sm">
            <button className="px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-l-md focus:outline-none">
              Daily
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:outline-none">
              Weekly
            </button>
          </div>

          <div className="relative">
            <select className="appearance-none w-full bg-white border border-gray-300 text-gray-600 py-2 pl-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800">
              <option>All Machines</option>
              <option>Cutter 01</option>
              <option>Cutter 02</option>
              <option>Cutter 03</option>
            </select>
            <ChevronDown className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative">
            <select className="appearance-none w-full bg-white border border-gray-300 text-gray-600 py-2 pl-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800">
              <option>All Workers</option>
              <option>John Doe</option>
              <option>Jane Smith</option>
              <option>Peter Jones</option>
              <option>Sam Wilson</option>
            </select>
            <ChevronDown className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Cut Quantity (PCS)"
          value={totalCutQty.toLocaleString()}
          icon={Scissors}
          color="#4299e1"
        />
        <KpiCard
          title="Defect / Recut QTY (PCS)"
          value={totalDefects.toLocaleString()}
          icon={AlertTriangle}
          color="#f56565"
        />
        <KpiCard
          title="Total Downtime (Mins)"
          value={totalDowntime.toLocaleString()}
          icon={Clock}
          color="#f6ad55"
        />
        <KpiCard
          title="Avg. Fabric Utilization"
          value={`${avgUtilization}%`}
          icon={TrendingUp}
          color="#48bb78"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg text-gray-700">
            Daily Cutting Performance
          </h3>
          <ReactECharts
            option={dailyPerformanceOptions}
            style={{ height: 350 }}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg text-gray-700">
            Machine Performance (Time)
          </h3>
          <ReactECharts
            option={machinePerformanceOptions}
            style={{ height: 350 }}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg text-gray-700">
            Fabric Utilization Rate (%)
          </h3>
          <ReactECharts
            option={fabricUtilizationOptions}
            style={{ height: 350 }}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg text-gray-700">
            Job Completion Status
          </h3>
          <ReactECharts
            option={completionStatusOptions}
            style={{ height: 350 }}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="font-bold text-lg text-gray-700">
            Cutting Job Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  JOB NO
                </th>
                <th scope="col" className="px-6 py-3">
                  Style
                </th>
                <th scope="col" className="px-6 py-3">
                  Color
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Required QTY
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Actual Cut QTY
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Completion Rate
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Cutting Time (Mins)
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Downtime (Mins)
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Fabric Utilization
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Defect/Recut QTY
                </th>
              </tr>
            </thead>
            <tbody>
              {cuttingData.map((job, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {job.jobNo}
                  </td>
                  <td className="px-6 py-4">{job.style}</td>
                  <td className="px-6 py-4">{job.color}</td>
                  <td className="px-6 py-4 text-right">
                    {job.totalRequiredQty.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {job.actualCutQty.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">
                    {job.completionRate.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {job.actualCuttingTime.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {job.downtime.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {job.fabricUtilizationRate !== null
                      ? `${job.fabricUtilizationRate.toFixed(2)}%`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {job.defectRecutQty.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CuttingDashboardPerformance;
