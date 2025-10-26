import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";

// Mock data
const hourlyData = [
  { hour: "8AM", target: 50, actual: 45 },
  { hour: "9AM", target: 50, actual: 52 },
  { hour: "10AM", target: 50, actual: 48 },
  { hour: "11AM", target: 50, actual: 55 },
  { hour: "12PM", target: 50, actual: 30 }, // Lunch break might cause a dip
  { hour: "1PM", target: 50, actual: 0 },
  { hour: "2PM", target: 50, actual: 0 },
  { hour: "3PM", target: 50, actual: 0 },
  { hour: "4PM", target: 50, actual: 0 },
];

const EFFDashboardPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulate real-time data
  const [target, setTarget] = useState(230);
  const [actual, setActual] = useState(230);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const dataUpdater = setInterval(() => {
      setTarget((prev) => prev + 1); // Target increases steadily
      setActual((prev) => prev + (Math.random() > 0.3 ? 1 : 0)); // Actual might lag
    }, 5000); // Update every 5 seconds

    return () => {
      clearInterval(timer);
      clearInterval(dataUpdater);
    };
  }, []);

  const efficiency = target > 0 ? (actual / target) * 100 : 0;
  const variance = actual - target;

  const getPacerColor = () => {
    if (efficiency >= 98) return "bg-green-500";
    if (efficiency >= 90) return "bg-yellow-400";
    return "bg-red-500";
  };

  const getEfficiencyGaugeColor = () => {
    if (efficiency >= 98) return "#48bb78"; // green-500
    if (efficiency >= 90) return "#f6e05e"; // yellow-400
    return "#f56565"; // red-500
  };

  // ECharts options
  const efficiencyGaugeOption = {
    series: [
      {
        type: "gauge",
        startAngle: 90,
        endAngle: -270,
        pointer: { show: false },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            borderColor: "#464646",
            color: getEfficiencyGaugeColor(),
          },
        },
        axisLine: {
          lineStyle: {
            width: 20,
            color: [[1, "#4a5568"]], // Tương đương bg-gray-700
          },
        },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        data: [{ value: parseFloat(efficiency.toFixed(1)) }],
        title: { show: false },
        detail: {
          width: "60%",
          height: "60%",
          fontSize: 40,
          color: "white",
          borderColor: "auto",
          borderRadius: 20,
          borderWidth: 1,
          formatter: "{value}%",
          offsetCenter: [0, 0],
        },
      },
    ],
  };

  const hourlyBarChartOption = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "#2d3748", // gray-800
      borderColor: "#4a5568", // gray-700
      textStyle: { color: "#e2e8f0" }, // gray-300
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: hourlyData.map((d) => d.hour),
      axisLabel: { color: "#a0aec0" }, // gray-500
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#a0aec0" }, // gray-500
      splitLine: { lineStyle: { color: "#4a5568" } }, // gray-700
    },
    series: [
      {
        data: hourlyData.map((item) => ({
          value: item.actual,
          itemStyle: {
            color: item.actual >= item.target ? "#48bb78" : "#f56565",
          },
        })),
        type: "bar",
        barWidth: "60%",
      },
    ],
  };

  return (
    <div className="h-full bg-gray-900 text-white p-6 grid grid-cols-1 lg:grid-cols-3 grid-rows-3 gap-6">
      <header className="lg:col-span-3 flex justify-between items-center p-4 bg-gray-800 rounded-lg">
        <div>
          <h1 className="text-4xl font-bold">Line 05 - Efficiency Dashboard</h1>
          <p className="text-xl text-gray-400">Style: T-SHIRT-01</p>
        </div>
        <div className="text-right">
          <p className="text-5xl font-mono font-bold">
            {currentTime.toLocaleTimeString()}
          </p>
          <p className="text-xl text-gray-400">
            {currentTime.toLocaleDateString()}
          </p>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-400">TARGET</h2>
        <p className="text-8xl font-bold text-blue-400">{target}</p>
      </div>

      <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-400">ACTUAL</h2>
        <p className="text-8xl font-bold text-cyan-400">{actual}</p>
      </div>

      <div
        className={`flex flex-col items-center justify-center p-6 rounded-lg ${getPacerColor()}`}
      >
        <h2 className="text-3xl font-semibold text-gray-900">VARIANCE</h2>
        <p className={`text-8xl font-bold text-white`}>
          {variance >= 0 ? `+${variance}` : variance}
        </p>
      </div>

      <div className="lg:col-span-2 flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-400 mb-4">
          EFFICIENCY
        </h2>
        {/* THAY THẾ SVG BẰNG ECHARTS GAUGE */}
        <ReactECharts
          option={efficiencyGaugeOption}
          style={{ height: "200px", width: "200px" }}
        />
      </div>

      <div className="lg:col-span-1 row-span-2 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">
          Top 3 Defects Today
        </h2>
        <ul className="space-y-4 text-lg">
          <li className="flex justify-between items-center">
            <span className="text-gray-400">Broken Stitch</span>{" "}
            <span className="font-bold text-red-400">12</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-400">Skipped Stitch</span>{" "}
            <span className="font-bold text-red-400">8</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-400">Incorrect Label</span>{" "}
            <span className="font-bold text-yellow-400">3</span>
          </li>
        </ul>
      </div>

      <div className="lg:col-span-2 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">
          Hourly Performance
        </h2>
        {/* THAY THẾ RECHARTS BẰNG ECHARTS BAR CHART */}
        <ReactECharts
          option={hourlyBarChartOption}
          style={{ height: "150px", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default EFFDashboardPage;
