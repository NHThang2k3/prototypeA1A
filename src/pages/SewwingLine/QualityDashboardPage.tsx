import ReactECharts from "echarts-for-react";
import { ShieldCheck, TrendingDown, ClipboardX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <h1 className="text-2xl font-bold">Quality Statistics Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Analyze quality trends and top defects.
        </p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  First Pass Yield (FPY)
                </p>
                <p className="text-3xl font-bold">96.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingDown className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Defect Rate (DPMO)
                </p>
                <p className="text-3xl font-bold">32,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <ClipboardX className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Top Defect Today
                </p>
                <p className="text-3xl font-bold">Broken Stitch</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pareto Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Defects Analysis (Pareto)</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactECharts
            option={paretoChartOption}
            style={{ height: "450px", width: "100%" }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityDashboardPage;
