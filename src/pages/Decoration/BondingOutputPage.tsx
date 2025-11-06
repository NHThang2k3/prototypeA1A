// src/pages/Decoration/BondingOutputPage.tsx

import React from "react";
import { Download, Calendar, Search, TrendingUp } from "lucide-react";
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
  worker: string;
  goodQty: number;
  defectQty: number;
  completedAt: string;
};

const bondingOutputData: BondingOutput[] = [
  {
    bundleId: "BNDL-008",
    po: "PO12348",
    style: "STYLE-D04",
    worker: "W005 - David Chen",
    goodQty: 98,
    defectQty: 2,
    completedAt: "10:30 AM",
  },
  {
    bundleId: "BNDL-012",
    po: "PO12348",
    style: "STYLE-D04",
    worker: "W006 - Emily White",
    goodQty: 100,
    defectQty: 0,
    completedAt: "11:15 AM",
  },
  {
    bundleId: "BNDL-015",
    po: "PO12350",
    style: "STYLE-F06",
    worker: "W005 - David Chen",
    goodQty: 145,
    defectQty: 5,
    completedAt: "01:45 PM",
  },
  {
    bundleId: "BNDL-019",
    po: "PO12350",
    style: "STYLE-F06",
    worker: "W006 - Emily White",
    goodQty: 150,
    defectQty: 0,
    completedAt: "03:00 PM",
  },
];

// LỖI 1: Đã xóa từ khóa "export" ở đây
const columns: ColumnDef<BondingOutput>[] = [
  { accessorKey: "bundleId", header: "Bundle ID" },
  { accessorKey: "po", header: "PO Number" },
  { accessorKey: "style", header: "Style" },
  { accessorKey: "worker", header: "Worker" },
  {
    accessorKey: "goodQty",
    header: "Good Qty",
    // LỖI 2 (Sửa tương tự): Thay đổi để code nhất quán và an toàn hơn
    cell: ({ row }) => (
      <div className="font-semibold text-green-600">{row.original.goodQty}</div>
    ),
  },
  {
    accessorKey: "defectQty",
    header: "Defect Qty",
    // LỖI 2: Đã sửa ở đây
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
};

// Component này có thể giữ nguyên vì nó không bị export
const KPICard = ({ title, value, subValue }: KPICardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <CardDescription>{title}</CardDescription>
      <CardTitle className="text-2xl">{value}</CardTitle>
    </CardHeader>
    {subValue && (
      <CardContent>
        <p className="text-xs text-muted-foreground">{subValue}</p>
      </CardContent>
    )}
  </Card>
);

const BondingOutputPage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

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
              Daily production statistics for the Bonding process.
            </p>
          </div>
        </div>
        <Button>
          <Download size={16} className="mr-2" /> Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Total Output Today"
          value="1,250 pcs"
          subValue="Sum of Good and Defect Qty"
        />
        <KPICard
          title="Good Quantity"
          value="1,235 pcs"
          subValue="98.8% of Total"
        />
        <KPICard title="Defect Rate" value="1.2%" subValue="15 pcs" />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by PO, Style, Worker..."
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
