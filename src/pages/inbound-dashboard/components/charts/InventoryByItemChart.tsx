// src/pages/inbound-dashboard/components/charts/InventoryByItemChart.tsx
import React from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { ChartData } from "../../types";

interface ChartProps {
  data: ChartData[];
}

const InventoryByItemChart: React.FC<ChartProps> = ({ data }) => {
  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: "{b}<br/>{c} yds",
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "value", boundaryGap: [0, 0.01] },
    yAxis: { type: "category", data: data.map((d) => d.name).reverse() },
    series: [
      {
        name: "Inventory",
        type: "bar",
        data: data.map((d) => d.value).reverse(),
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: "100%" }} />;
};
export default InventoryByItemChart;
