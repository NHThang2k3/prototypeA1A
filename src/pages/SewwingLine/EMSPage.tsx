import ReactECharts from "echarts-for-react";
import {
  Zap,
  Droplets,
  Sun,
  Leaf,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Giả sử bạn dùng shadcn/ui

// -----------------------------------------------------------------------------
// HELPER COMPONENT: StatCard (Defined within the same file)
// -----------------------------------------------------------------------------

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  value: string;
  description: string;
  unit?: string;
  iconColor?: string;
  descriptionClassName?: string;
}

/**
 * Một component con để hiển thị thẻ thông tin (KPI card).
 * Được định nghĩa ở đây để tái sử dụng trong EMSPage mà không cần tạo file riêng.
 */
const StatCard = ({
  title,
  icon: Icon,
  value,
  description,
  unit,
  iconColor = "text-muted-foreground",
  descriptionClassName = "text-muted-foreground",
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit && (
            <span className="ml-1 text-base font-normal text-muted-foreground">
              {unit}
            </span>
          )}
        </div>
        <p className={cn("text-xs", descriptionClassName)}>{description}</p>
      </CardContent>
    </Card>
  );
};

// -----------------------------------------------------------------------------
// MAIN COMPONENT: EMSPage
// -----------------------------------------------------------------------------

const EMSPage = () => {
  // --- Dữ liệu Mock ---
  const energyConsumptionData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    electricity: [120, 132, 101, 134, 90, 230, 210],
    steam: [220, 182, 191, 234, 290, 330, 310],
  };

  // --- Dữ liệu chỉ số trong ngày ---
  const todayElectricity = 134;
  const todaySteam = 234;
  const targetElectricity = 130;

  // --- Logic tính toán cho thẻ điện ---
  const electricityDiff = todayElectricity - targetElectricity;
  const electricityDiffPercent = (electricityDiff / targetElectricity) * 100;
  const isOverTarget = electricityDiff > 0;

  // --- Cấu hình ECharts đã cải tiến ---
  const lineChartOption = {
    tooltip: { trigger: "axis" },
    legend: {
      data: ["Electricity (kWh)", "Steam (kg)"],
      top: 10,
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: energyConsumptionData.labels,
    },
    yAxis: { type: "value" },
    color: ["#f59e0b", "#3b82f6"], // Vàng cho Điện, Xanh dương cho Hơi
    series: [
      {
        name: "Electricity (kWh)",
        type: "line",
        smooth: true,
        data: energyConsumptionData.electricity,
        areaStyle: { opacity: 0.3 },
      },
      {
        name: "Steam (kg)",
        type: "line",
        smooth: true,
        data: energyConsumptionData.steam,
        areaStyle: { opacity: 0.3 },
      },
    ],
  };

  // --- Dữ liệu cho các thẻ StatCard ---
  const statCardsData = [
    {
      title: "Điện năng hôm nay",
      icon: isOverTarget ? AlertTriangle : Zap,
      value: todayElectricity.toString(),
      unit: "kWh",
      description: `${isOverTarget ? "+" : ""}${electricityDiffPercent.toFixed(
        1
      )}% so với mục tiêu`,
      iconColor: isOverTarget ? "text-red-500" : "text-yellow-500",
      descriptionClassName: isOverTarget ? "text-red-500" : "text-green-600",
    },
    {
      title: "Lượng hơi hôm nay",
      icon: Droplets,
      value: todaySteam.toString(),
      unit: "kg",
      description: "-1.5% so với hôm qua",
      iconColor: "text-blue-500",
    },
    {
      title: "Năng lượng mặt trời",
      icon: Sun,
      value: "Đang hoạt động",
      description: "Cung cấp 25% tải hiện tại",
      iconColor: "text-green-500",
    },
    {
      title: "Dấu chân Carbon",
      icon: Leaf,
      value: "Giảm 5%",
      description: "So với tháng trước",
      iconColor: "text-teal-500",
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 dark:bg-black">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Bảng điều khiển Năng lượng (EMS)
        </h1>
        <p className="text-muted-foreground">
          Theo dõi tiêu thụ năng lượng cho các chuyền may để thúc đẩy bền vững.
        </p>
      </header>

      {/* Sử dụng map để render các StatCard một cách linh hoạt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCardsData.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            icon={card.icon}
            value={card.value}
            unit={card.unit}
            description={card.description}
            iconColor={card.iconColor}
            descriptionClassName={card.descriptionClassName}
          />
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">
            Xu hướng tiêu thụ năng lượng hàng tuần
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReactECharts
            option={lineChartOption}
            style={{ height: "400px", width: "100%" }}
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EMSPage;
