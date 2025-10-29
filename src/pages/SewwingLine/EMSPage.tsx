import ReactECharts from "echarts-for-react";
import { Zap, Droplets, TrendingUp, Sun, Leaf } from "lucide-react";

// Mock data
const energyConsumptionData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  electricity: [120, 132, 101, 134, 90, 230, 210], // kWh
  steam: [220, 182, 191, 234, 290, 330, 310], // kg
};

const EMSPage = () => {
  const lineChartOption = {
    tooltip: { trigger: "axis" },
    legend: { data: ["Electricity (kWh)", "Steam (kg)"] },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: energyConsumptionData.labels,
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Electricity (kWh)",
        type: "line",
        stack: "Total",
        data: energyConsumptionData.electricity,
        areaStyle: {},
      },
      {
        name: "Steam (kg)",
        type: "line",
        stack: "Total",
        data: energyConsumptionData.steam,
        areaStyle: {},
      },
    ],
  };

  const todayElectricity = 134;
  const todaySteam = 234;
  const targetElectricity = 130;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">
          Energy Management Dashboard (EMS)
        </h1>
        <p className="text-sm text-gray-500">
          Monitor energy consumption for sewing lines to promote sustainability.
        </p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Electricity Today
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {todayElectricity}{" "}
                <span className="text-lg font-normal">kWh</span>
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <p
            className={`mt-2 text-sm flex items-center gap-1 ${
              todayElectricity > targetElectricity
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            {(
              ((todayElectricity - targetElectricity) / targetElectricity) *
              100
            ).toFixed(1)}
            % vs Target
          </p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Steam Today</p>
              <p className="text-3xl font-bold text-gray-800">
                {todaySteam} <span className="text-lg font-normal">kg</span>
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Droplets className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
            -1.5% vs Yesterday
          </p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Solar Panel Status
              </p>
              <p className="text-2xl font-bold text-green-600">
                Active & Generating
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Sun className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            25% of current load covered
          </p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Carbon Footprint
              </p>
              <p className="text-2xl font-bold text-gray-800">Reduced by 5%</p>
            </div>
            <div className="p-3 bg-teal-100 rounded-full">
              <Leaf className="w-6 h-6 text-teal-500" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Month-over-month</p>
        </div>
      </div>

      {/* Consumption Chart */}
      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Weekly Energy Consumption Trend
        </h2>
        <ReactECharts
          option={lineChartOption}
          style={{ height: "400px", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default EMSPage;
