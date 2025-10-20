// src/pages/inbound-dashboard/components/charts/ShipmentTimelineChart.tsx

import React from "react";
import ReactECharts from "echarts-for-react";
// Import các kiểu dữ liệu cần thiết trực tiếp từ ECharts
import type {
  EChartsOption,
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemParams,
  CustomSeriesRenderItemReturn,
} from "echarts";
import type { GanttChartData } from "../../types";
import { format } from "date-fns";

interface ChartProps {
  data: GanttChartData[];
  categories: string[];
  chartStartDate: Date;
}

// Kiểu dữ liệu cho params của tooltip, đặc thù cho biểu đồ này
interface TooltipCallbackData {
  name: string;
  value: [number, number, number, number];
  data: GanttChartData;
}

const ShipmentTimelineChart: React.FC<ChartProps> = ({
  data,
  categories,
  chartStartDate,
}) => {
  const option: EChartsOption = {
    tooltip: {
      formatter: (params) => {
        // Xử lý trường hợp params có thể là array hoặc single object
        const seriesData = Array.isArray(params) ? params[0] : params;

        // Ép kiểu an toàn qua 'unknown' sau khi đã xác định là single object
        const p = seriesData as unknown as TooltipCallbackData;

        const { name, value, data: itemData } = p;
        const etd = format(
          new Date(chartStartDate.getTime() + value[1]),
          "MMM dd"
        );
        const eta = format(
          new Date(chartStartDate.getTime() + value[2]),
          "MMM dd"
        );
        const duration = (value[3] / (1000 * 3600 * 24)).toFixed(0);

        return (
          `<b>${name}</b><br/>` +
          `Supplier: ${itemData.supplier}<br/>` +
          `Item: ${itemData.itemCode}<br/>` +
          `ETD: ${etd} - ETA: ${eta} (${duration} days)`
        );
      },
    },
    grid: { left: "120px", right: "4%", bottom: "10%", containLabel: false },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: (val: number) =>
          format(new Date(chartStartDate.getTime() + val), "MMM dd"),
      },
    },
    yAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        interval: 0,
        overflow: "truncate",
        width: 100,
      },
    },
    series: [
      {
        type: "custom",
        // Sử dụng các kiểu được import từ ECharts để đảm bảo tương thích
        renderItem: (
          _params: CustomSeriesRenderItemParams,
          api: CustomSeriesRenderItemAPI
        ): CustomSeriesRenderItemReturn => {
          const categoryIndex = api.value(0) as number;
          const start = api.coord([api.value(1) as number, categoryIndex]);
          const end = api.coord([api.value(2) as number, categoryIndex]);
          const size = api.size!([0, 1]);
          const heightValue = Array.isArray(size)
            ? (size[1] as number)
            : (size as number);
          const height = heightValue * 0.6;

          const rectShape = {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height,
          };

          // Trả về đối tượng tuân thủ kiểu CustomSeriesRenderItemReturn
          return {
            type: "rect",
            shape: rectShape,
            style: api.style!(),
          };
        },
        itemStyle: {
          opacity: 0.8,
        },
        encode: {
          x: [1, 2],
          y: 0,
        },
        data: data,
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: "100%" }} />;
};

export default ShipmentTimelineChart;
