// src/pages/inbound-dashboard/components/charts/InventoryAgingChart.tsx
import React from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { ChartData } from "../../types";

interface ChartProps {
  data: ChartData[];
}

const InventoryAgingChart: React.FC<ChartProps> = ({ data }) => {
  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: "{b}<br/>{c} yds",
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "category", data: data.map((d) => d.name) },
    yAxis: { type: "value" },
    series: [
      {
        name: "Yards",
        type: "bar",
        data: data.map((d) => d.value),
        color: "#ffc658",
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: "100%" }} />;
};
export default InventoryAgingChart;
