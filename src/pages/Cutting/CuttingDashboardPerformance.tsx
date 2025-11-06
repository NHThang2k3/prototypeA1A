// Path: src/pages/cutting-dashboard-performance/CuttingDashboardPerformance.tsx
import React, { useMemo } from "react";
import { Scissors, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { CustomTable } from "@/components/ui/custom-table";

// --- Mock Data Type ---
type CuttingJob = {
  jobNo: string;
  style: string;
  color: string;
  totalRequiredQty: number;
  requiredCompletionDate: string;
  actualCutQty: number;
  completionRate: number;
  status: string;
  actualCuttingTime: number;
  downtime: number;
  fabricUtilizationRate: number | null;
  targetUtilization: number;
  utilizationVariance: number | null;
  defectRecutQty: number;
  machine: string;
  worker: string;
};

// --- Mock Data ---
const cuttingData: CuttingJob[] = [
  {
    jobNo: "SOAD2510113/1",
    style: "L JACKET",
    color: "BLACK",
    totalRequiredQty: 8200,
    requiredCompletionDate: "15/12/2025",
    actualCutQty: 8200,
    completionRate: 100,
    status: "Completed",
    actualCuttingTime: 3500,
    downtime: 150,
    fabricUtilizationRate: 93.8,
    targetUtilization: 93.5,
    utilizationVariance: 0.3,
    defectRecutQty: 50,
    machine: "Cutter 01",
    worker: "John Doe",
  },
  {
    jobNo: "SOAD2510113/2",
    style: "L JACKET",
    color: "WHITE",
    totalRequiredQty: 4150,
    requiredCompletionDate: "15/12/2025",
    actualCutQty: 4000,
    completionRate: 96.4,
    status: "Cutting in Progress",
    actualCuttingTime: 1850,
    downtime: 100,
    fabricUtilizationRate: 92.1,
    targetUtilization: 93.0,
    utilizationVariance: -0.9,
    defectRecutQty: 40,
    machine: "Cutter 02",
    worker: "Jane Smith",
  },
  {
    jobNo: "SORB2510122/1",
    style: "MENS SHORTS",
    color: "ORANGE",
    totalRequiredQty: 7100,
    requiredCompletionDate: "18/11/2025",
    actualCutQty: 6900,
    completionRate: 97.2,
    status: "Urgent Cut",
    actualCuttingTime: 2950,
    downtime: 300,
    fabricUtilizationRate: 90.5,
    targetUtilization: 91.0,
    utilizationVariance: -0.5,
    defectRecutQty: 60,
    machine: "Cutter 02",
    worker: "Jane Smith",
  },
];

type KpiCardProps = {
  title: string;
  value: string;
  icon: React.ElementType;
  iconBgColor: string;
};

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div
        className={`p-2 rounded-full`}
        style={{ backgroundColor: `${iconBgColor}20` }}
      >
        <Icon className="h-5 w-5" style={{ color: iconBgColor }} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const CuttingDashboardPerformance: React.FC = () => {
  const totalCutQty = useMemo(
    () => cuttingData.reduce((sum, item) => sum + item.actualCutQty, 0),
    []
  );
  const totalDefects = useMemo(
    () => cuttingData.reduce((sum, item) => sum + item.defectRecutQty, 0),
    []
  );
  const totalDowntime = useMemo(
    () => cuttingData.reduce((sum, item) => sum + item.downtime, 0),
    []
  );
  const avgUtilization = useMemo(() => {
    const itemsWithUtilization = cuttingData.filter(
      (item) => item.fabricUtilizationRate != null
    );
    if (itemsWithUtilization.length === 0) return 0;
    const totalUtilization = itemsWithUtilization.reduce(
      (sum, item) => sum + item.fabricUtilizationRate!,
      0
    );
    return (totalUtilization / itemsWithUtilization.length).toFixed(2);
  }, []);

  const columns: ColumnDef<CuttingJob>[] = [
    { accessorKey: "jobNo", header: "JOB NO" },
    { accessorKey: "style", header: "Style" },
    { accessorKey: "color", header: "Color" },
    {
      accessorKey: "totalRequiredQty",
      header: "Required QTY",
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.totalRequiredQty.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "actualCutQty",
      header: "Actual Cut QTY",
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.actualCutQty.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "completionRate",
      header: "Completion Rate",
      cell: ({ row }) => (
        <div className="text-right font-semibold">
          {row.original.completionRate.toFixed(2)}%
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "secondary" | "destructive" | "outline" =
          "outline";
        if (status === "Completed") variant = "default";
        if (status === "Cutting in Progress") variant = "secondary";
        if (status === "Urgent Cut") variant = "destructive";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: "actualCuttingTime",
      header: "Cutting Time (Mins)",
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.actualCuttingTime.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "downtime",
      header: "Downtime (Mins)",
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.downtime.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "fabricUtilizationRate",
      header: "Fabric Utilization",
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.fabricUtilizationRate !== null
            ? `${row.original.fabricUtilizationRate.toFixed(2)}%`
            : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "defectRecutQty",
      header: "Defect/Recut QTY",
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.defectRecutQty.toLocaleString()}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cutting Performance Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time overview of cutting floor efficiency and status.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ToggleGroup type="single" defaultValue="daily" variant="outline">
            <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
            <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
          </ToggleGroup>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Machines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Machines</SelectItem>
              <SelectItem value="cutter-01">Cutter 01</SelectItem>
              <SelectItem value="cutter-02">Cutter 02</SelectItem>
              <SelectItem value="cutter-03">Cutter 03</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Workers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workers</SelectItem>
              <SelectItem value="john-doe">John Doe</SelectItem>
              <SelectItem value="jane-smith">Jane Smith</SelectItem>
              <SelectItem value="peter-jones">Peter Jones</SelectItem>
              <SelectItem value="sam-wilson">Sam Wilson</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Cut Quantity (PCS)"
          value={totalCutQty.toLocaleString()}
          icon={Scissors}
          iconBgColor="#4299e1"
        />
        <KpiCard
          title="Defect / Recut QTY (PCS)"
          value={totalDefects.toLocaleString()}
          icon={AlertTriangle}
          iconBgColor="#f56565"
        />
        <KpiCard
          title="Total Downtime (Mins)"
          value={totalDowntime.toLocaleString()}
          icon={Clock}
          iconBgColor="#f6ad55"
        />
        <KpiCard
          title="Avg. Fabric Utilization"
          value={`${avgUtilization}%`}
          icon={TrendingUp}
          iconBgColor="#48bb78"
        />
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cutting Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomTable
            columns={columns}
            data={cuttingData}
            showCheckbox={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CuttingDashboardPerformance;
