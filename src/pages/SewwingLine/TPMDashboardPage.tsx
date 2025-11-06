import ReactECharts from "echarts-for-react";
import { Zap, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const downtimeReasons = [
  { value: 45, name: "Needle Breakage" },
  { value: 30, name: "Thread Breakage" },
  { value: 15, name: "Mechanical Fault" },
  { value: 10, name: "No Operator" },
];

const TPMDashboardPage = () => {
  const oee = 82.5;
  const gaugeOption = {
    series: [
      {
        type: "gauge",
        progress: { show: true, width: 18 },
        axisLine: { lineStyle: { width: 18 } },
        axisTick: { show: false },
        splitLine: { length: 15, lineStyle: { width: 2, color: "#999" } },
        axisLabel: { distance: 25, color: "#999", fontSize: 16 },
        anchor: {
          show: true,
          showAbove: true,
          size: 25,
          itemStyle: { borderWidth: 10 },
        },
        title: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 40,
          offsetCenter: [0, "70%"],
          formatter: "{value}%",
        },
        data: [{ value: oee }],
      },
    ],
  };

  const barOption = {
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: downtimeReasons.map((d) => d.name) },
    yAxis: { type: "value", name: "Minutes" },
    series: [{ data: downtimeReasons.map((d) => d.value), type: "bar" }],
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">TPM Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor Overall Equipment Effectiveness (OEE) and downtime.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="items-center pb-2">
            <CardTitle className="text-xl">
              Overall Equipment Effectiveness (OEE)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReactECharts
              option={gaugeOption}
              style={{ height: "300px", width: "100%" }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid grid-cols-1 gap-4 content-center p-6">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Zap className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="font-bold text-2xl">90.2%</p>
                <p className="text-sm text-muted-foreground">Performance</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-bold text-2xl">92.5%</p>
                <p className="text-sm text-muted-foreground">Availability</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-bold text-2xl">98.9%</p>
                <p className="text-sm text-muted-foreground">Quality</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Top Downtime Reasons (Last 24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReactECharts option={barOption} style={{ height: "400px" }} />
        </CardContent>
      </Card>
    </div>
  );
};
export default TPMDashboardPage;
