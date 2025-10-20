// src/pages/inbound-dashboard/components/charts/CuttingPlanProgressChart.tsx
import React from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { StackedChartData } from "../../types";

interface ChartProps {
  data: StackedChartData[];
}

const CuttingPlanProgressChart: React.FC<ChartProps> = ({ data }) => {
  const option: EChartsOption = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: {},
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "value" },
    yAxis: { type: "category", data: data.map((p) => p.name) },
    series: [
      {
        name: "Issued",
        type: "bar",
        stack: "total",
        label: { show: true },
        emphasis: { focus: "series" },
        data: data.map((p) => p.issued),
      },
      {
        name: "Remaining",
        type: "bar",
        stack: "total",
        label: { show: true },
        emphasis: { focus: "series" },
        data: data.map((p) => p.remaining),
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: "100%" }} />;
};
export default CuttingPlanProgressChart;
