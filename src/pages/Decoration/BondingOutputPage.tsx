// src/pages/Decoration/BondingOutputPage.tsx

import React, { useMemo } from "react";
import {
  Download,
  Calendar,
  Search,
  TrendingUp,
  Clock,
  Layers,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomTable } from "@/components/ui/custom-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

type BondingOutput = {
  bundleId: string;
  po: string;
  style: string;
  stage: string;
  worker: string;
  goodQty: number;
  defectQty: number;
  completedAt: string;
};

// Dữ liệu mẫu (Giữ nguyên)
const bondingOutputData: BondingOutput[] = [
  {
    bundleId: "BNDL-008",
    po: "PO12348",
    style: "STYLE-D04",
    stage: "Hemming (Ép gấu)",
    worker: "W005 - David Chen",
    goodQty: 98,
    defectQty: 2,
    completedAt: "08:30 AM",
  },
  {
    bundleId: "BNDL-009",
    po: "PO12348",
    style: "STYLE-D04",
    stage: "Hemming (Ép gấu)",
    worker: "W007 - Sarah Lee",
    goodQty: 45,
    defectQty: 0,
    completedAt: "08:45 AM",
  },
  {
    bundleId: "BNDL-012",
    po: "PO12348",
    style: "STYLE-D04",
    stage: "Side Seam (Ép sườn)",
    worker: "W006 - Emily White",
    goodQty: 100,
    defectQty: 0,
    completedAt: "09:15 AM",
  },
  {
    bundleId: "BNDL-015",
    po: "PO12350",
    style: "STYLE-F06",
    stage: "Pocket (Ép túi)",
    worker: "W005 - David Chen",
    goodQty: 145,
    defectQty: 5,
    completedAt: "10:45 AM",
  },
  {
    bundleId: "BNDL-019",
    po: "PO12350",
    style: "STYLE-F06",
    stage: "Neck (Ép cổ)",
    worker: "W006 - Emily White",
    goodQty: 150,
    defectQty: 0,
    completedAt: "11:00 AM",
  },
  {
    bundleId: "BNDL-022",
    po: "PO12352",
    style: "STYLE-G08",
    stage: "Side Seam (Ép sườn)",
    worker: "W008 - John Doe",
    goodQty: 120,
    defectQty: 2,
    completedAt: "01:30 PM",
  },
  {
    bundleId: "BNDL-025",
    po: "PO12352",
    style: "STYLE-G08",
    stage: "Hemming (Ép gấu)",
    worker: "W005 - David Chen",
    goodQty: 110,
    defectQty: 1,
    completedAt: "02:15 PM",
  },
];

const columns: ColumnDef<BondingOutput>[] = [
  { accessorKey: "bundleId", header: "Bundle ID" },
  { accessorKey: "po", header: "PO Number" },
  { accessorKey: "style", header: "Style" },
  {
    accessorKey: "stage",
    header: "Stage (Công đoạn)",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Layers size={14} className="text-blue-500" />
        <span>{row.original.stage}</span>
      </div>
    ),
  },
  { accessorKey: "worker", header: "Worker" },
  {
    accessorKey: "goodQty",
    header: "Good Qty",
    cell: ({ row }) => (
      <div className="font-semibold text-green-600">{row.original.goodQty}</div>
    ),
  },
  {
    accessorKey: "defectQty",
    header: "Defect Qty",
    cell: ({ row }) => (
      <div
        className={cn(
          "font-semibold",
          row.original.defectQty > 0 ? "text-red-600" : "text-muted-foreground"
        )}
      >
        {row.original.defectQty}
      </div>
    ),
  },
  { accessorKey: "completedAt", header: "Completed At" },
];

type KPICardProps = {
  title: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
};

const KPICard = ({ title, value, subValue, icon }: KPICardProps) => (
  <Card>
    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
      <div>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl mt-1">{value}</CardTitle>
      </div>
      {icon && <div className="text-muted-foreground">{icon}</div>}
    </CardHeader>
    {subValue && (
      <CardContent>
        <p className="text-xs text-muted-foreground">{subValue}</p>
      </CardContent>
    )}
  </Card>
);

// --- SỬA CHỮA CHÍNH Ở ĐÂY ---
const HourlyChart = ({ data }: { data: BondingOutput[] }) => {
  const hourlyData = useMemo(() => {
    const hoursMap: Record<number, number> = {};
    for (let i = 8; i <= 17; i++) hoursMap[i] = 0;

    data.forEach((item) => {
      const timeParts = item.completedAt.split(" "); // VD: ["10:30", "AM"]
      // FIX LỖI 1: Bỏ biến 'm' không sử dụng
      const [h] = timeParts[0].split(":").map(Number);
      const ampm = timeParts[1];

      let hour24 = h;
      if (ampm === "PM" && h !== 12) hour24 += 12;
      if (ampm === "AM" && h === 12) hour24 = 0;

      if (hoursMap[hour24] !== undefined) {
        hoursMap[hour24] += item.goodQty + item.defectQty;
      }
    });

    return Object.entries(hoursMap).map(([hour, qty]) => ({
      hour: parseInt(hour),
      qty,
      label: `${hour}:00`,
    }));
  }, [data]);

  const maxQty = Math.max(...hourlyData.map((d) => d.qty), 10); // Đặt min là 10 để tránh chia cho 0

  return (
    // FIX LỖI 2: Layout CSS
    // Container giữ nguyên items-end nhưng bên trong từng cột cần h-full
    <div className="flex items-end justify-between h-40 w-full gap-2 mt-4 px-2 pb-2">
      {hourlyData.map((d) => {
        // Tính chiều cao, tối thiểu 1% để hiển thị vạch nếu có số liệu thấp
        const heightPercent =
          d.qty > 0 ? Math.max((d.qty / maxQty) * 100, 1) : 0;

        return (
          // Thêm 'h-full justify-end' để cột chiếm hết chiều cao container và đẩy nội dung xuống đáy
          <div
            key={d.hour}
            className="flex flex-col items-center flex-1 group h-full justify-end"
          >
            {/* Tooltip số lượng khi hover */}
            <div className="text-xs font-bold text-gray-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {d.qty}
            </div>
            {/* Thanh bar */}
            <div
              className={cn(
                "w-full rounded-t-md transition-all duration-500 ease-in-out min-h-[4px]", // Thêm min-h để luôn thấy đáy
                d.qty > 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-100"
              )}
              // Nếu qty = 0, set height cố định nhỏ để làm placeholder
              style={{ height: d.qty > 0 ? `${heightPercent}%` : "4px" }}
            />
            {/* Nhãn giờ */}
            <div className="text-[10px] text-gray-500 mt-2">{d.label}</div>
          </div>
        );
      })}
    </div>
  );
};

const BondingOutputPage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const stats = useMemo(() => {
    const total = bondingOutputData.reduce(
      (acc, cur) => acc + cur.goodQty + cur.defectQty,
      0
    );
    const good = bondingOutputData.reduce((acc, cur) => acc + cur.goodQty, 0);
    const defect = bondingOutputData.reduce(
      (acc, cur) => acc + cur.defectQty,
      0
    );
    const defectRate = total > 0 ? ((defect / total) * 100).toFixed(1) : "0";

    return { total, good, defect, defectRate };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <TrendingUp size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Bonding Output</h1>
            <p className="text-gray-500">
              Daily production statistics by Stage and Hour.
            </p>
          </div>
        </div>
        <Button>
          <Download size={16} className="mr-2" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Total Output Today"
          value={`${stats.total} pcs`}
          subValue="Sum of Good and Defect Qty"
          icon={<Layers className="h-4 w-4" />}
        />
        <KPICard
          title="Good Quantity"
          value={`${stats.good} pcs`}
          subValue={`${((stats.good / stats.total) * 100).toFixed(
            1
          )}% of Total`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KPICard
          title="Defect Rate"
          value={`${stats.defectRate}%`}
          subValue={`${stats.defect} pcs`}
          icon={<div className="h-2 w-2 rounded-full bg-red-500" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Hourly Production
          </CardTitle>
          <CardDescription>
            Output performance breakdown by hour (08:00 - 17:00)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HourlyChart data={bondingOutputData} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by PO, Style, Stage, Worker..."
                className="pl-10"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <CustomTable
            columns={columns}
            data={bondingOutputData}
            showCheckbox={false}
            showColumnVisibility={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BondingOutputPage;
