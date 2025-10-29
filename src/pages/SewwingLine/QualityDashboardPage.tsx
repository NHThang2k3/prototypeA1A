import ReactECharts from "echarts-for-react";
import { ShieldCheck, TrendingDown, ClipboardX } from "lucide-react";

// Mock data preparation for Pareto Chart
const defectsData = [
  { name: "Broken Stitch", value: 85 },
  { name: "Skipped Stitch", value: 62 },
  { name: "Open Seam", value: 31 },
  { name: "Uneven Stitching", value: 15 },
  { name: "Wrong Label", value: 8 },
  { name: "Other", value: 5 },
];

const totalDefects = defectsData.reduce((sum, item) => sum + item.value, 0);
let cumulative = 0;
const paretoData = defectsData.map((item) => {
  cumulative += item.value;
  return {
    ...item,
    cumulativePercentage: (cumulative / totalDefects) * 100,
  };
});

const QualityDashboardPage = () => {
  const paretoChartOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", crossStyle: { color: "#999" } },
    },
    legend: {
      data: ["Defect Count", "Cumulative %"],
    },
    xAxis: [
      {
        type: "category",
        data: paretoData.map((d) => d.name),
        axisPointer: { type: "shadow" },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Count",
        min: 0,
        axisLabel: { formatter: "{value}" },
      },
      {
        type: "value",
        name: "Cumulative %",
        min: 0,
        max: 100,
        axisLabel: { formatter: "{value} %" },
      },
    ],
    series: [
      {
        name: "Defect Count",
        type: "bar",
        yAxisIndex: 0,
        data: paretoData.map((d) => d.value),
      },
      {
        name: "Cumulative %",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        data: paretoData.map((d) => d.cumulativePercentage.toFixed(2)),
      },
    ],
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">
          Quality Statistics Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Analyze quality trends and top defects.
        </p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                First Pass Yield (FPY)
              </p>
              <p className="text-3xl font-bold text-gray-800">96.8%</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <TrendingDown className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Defect Rate (DPMO)
              </p>
              <p className="text-3xl font-bold text-gray-800">32,000</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <ClipboardX className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Top Defect Today
              </p>
              <p className="text-3xl font-bold text-gray-800">Broken Stitch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pareto Chart */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Top Defects Analysis (Pareto)
        </h2>
        <ReactECharts
          option={paretoChartOption}
          style={{ height: "450px", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default QualityDashboardPage;
