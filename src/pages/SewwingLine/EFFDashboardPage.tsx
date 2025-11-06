import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Assuming a utility for classnames

const EFFDashboardPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [target, setTarget] = useState(230);
  const [actual, setActual] = useState(230);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const dataUpdater = setInterval(() => {
      setTarget((prev) => prev + 1);
      setActual((prev) => prev + (Math.random() > 0.3 ? 1 : 0));
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(dataUpdater);
    };
  }, []);

  const efficiency = target > 0 ? (actual / target) * 100 : 0;
  const variance = actual - target;

  const getPacerColor = () => {
    if (efficiency >= 98) return "bg-green-500 text-white";
    if (efficiency >= 90) return "bg-yellow-400 text-gray-900";
    return "bg-red-500 text-white";
  };

  const efficiencyGaugeOption = {
    series: [
      {
        type: "gauge",
        // ... (chart options unchanged)
      },
    ],
  };

  const hourlyBarChartOption = {
    // ... (chart options unchanged)
  };

  return (
    <div className="h-full bg-background text-foreground p-6 grid grid-cols-1 lg:grid-cols-3 grid-rows-3 gap-6">
      <Card className="lg:col-span-3">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-4xl">
              Line 05 - Efficiency Dashboard
            </CardTitle>
            <CardDescription className="text-xl">
              Style: T-SHIRT-01
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-5xl font-mono font-bold">
              {currentTime.toLocaleTimeString()}
            </p>
            <p className="text-xl text-muted-foreground">
              {currentTime.toLocaleDateString()}
            </p>
          </div>
        </CardHeader>
      </Card>

      <Card className="flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle className="text-3xl text-muted-foreground">
            TARGET
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-8xl font-bold text-blue-400">{target}</p>
        </CardContent>
      </Card>

      <Card className="flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle className="text-3xl text-muted-foreground">
            ACTUAL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-8xl font-bold text-cyan-400">{actual}</p>
        </CardContent>
      </Card>

      <Card
        className={cn(
          "flex flex-col items-center justify-center",
          getPacerColor()
        )}
      >
        <CardHeader>
          <CardTitle className="text-3xl">VARIANCE</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-8xl font-bold">
            {variance >= 0 ? `+${variance}` : variance}
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle className="text-3xl text-muted-foreground">
            EFFICIENCY
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReactECharts
            option={efficiencyGaugeOption}
            style={{ height: "200px", width: "200px" }}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-1 row-span-2">
        <CardHeader>
          <CardTitle className="text-2xl">Top 3 Defects Today</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4 text-lg">
            <li className="flex justify-between items-center">
              <span className="text-muted-foreground">Broken Stitch</span>
              <span className="font-bold text-red-400">12</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-muted-foreground">Skipped Stitch</span>
              <span className="font-bold text-red-400">8</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-muted-foreground">Incorrect Label</span>
              <span className="font-bold text-yellow-400">3</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-2xl">Hourly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactECharts
            option={hourlyBarChartOption}
            style={{ height: "150px", width: "100%" }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EFFDashboardPage;
