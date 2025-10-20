// src/pages/inbound-dashboard/components/charts/QcStatusChart.tsx
import React from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { ChartData } from "../../types";

interface ChartProps {
  data: ChartData[];
}

const QcStatusChart: React.FC<ChartProps> = ({ data }) => {
  const option: EChartsOption = {
    tooltip: { trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)" },
    legend: { orient: "vertical", left: "left" },
    series: [
      {
        name: "QC Status",
        type: "pie",
        radius: "50%",
        data: data,
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
  return <ReactECharts option={option} style={{ height: "100%" }} />;
};
export default QcStatusChart;
