// src/pages/inbound-dashboard/components/charts/FillRateByLocationChart.tsx
import React from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { ChartData } from "../../types";

interface ChartProps {
  data: ChartData[];
}

const FillRateByLocationChart: React.FC<ChartProps> = ({ data }) => {
  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: "{b}<br/>{c}%",
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "value", max: 100 },
    yAxis: { type: "category", data: data.map((d) => d.name).reverse() },
    series: [
      {
        name: "Fill Rate",
        type: "bar",
        data: data
          .map((d) => ({
            value: d.value.toFixed(1),
            itemStyle: { color: d.value > 90 ? "#FF6347" : "#4682B4" },
          }))
          .reverse(),
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: "100%" }} />;
};
export default FillRateByLocationChart;
