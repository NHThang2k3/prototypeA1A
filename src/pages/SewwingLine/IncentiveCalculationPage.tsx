import { FileDown, Filter } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CustomTable } from "@/components/ui/custom-table";

type Incentive = {
  id: string;
  name: string;
  efficiency: number;
  base: number;
  incentive: number;
  ot: number;
  total: number;
};

const incentiveData: Incentive[] = [
  {
    id: "W001",
    name: "Nguyen Van A",
    efficiency: 105,
    base: 250,
    incentive: 50,
    ot: 25,
    total: 325,
  },
  {
    id: "W002",
    name: "Tran Thi B",
    efficiency: 98,
    base: 250,
    incentive: 50,
    ot: 25,
    total: 325,
  },
  {
    id: "W002",
    name: "Tran Thi B",
    efficiency: 98,
    base: 250,
    incentive: 20,
    ot: 0,
    total: 270,
  },
  {
    id: "W003",
    name: "Le Van C",
    efficiency: 110,
    base: 250,
    incentive: 65,
    ot: 25,
    total: 340,
  },
  {
    id: "W004",
    name: "Pham Thi D",
    efficiency: 89,
    base: 250,
    incentive: 0,
    ot: 0,
    total: 250,
  },
];

const columns: ColumnDef<Incentive>[] = [
  {
    accessorKey: "id",
    header: "Worker ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "efficiency",
    header: "Efficiency (%)",
    cell: ({ row }) => {
      const efficiency = row.original.efficiency;
      const color = efficiency >= 100 ? "text-green-600" : "text-yellow-600";
      return <div className={`font-bold ${color}`}>{efficiency}%</div>;
    },
  },
  {
    accessorKey: "base",
    header: "Base Pay ($)",
    cell: ({ row }) => <div>{row.original.base.toFixed(2)}</div>,
  },
  {
    accessorKey: "incentive",
    header: "Incentive ($)",
    cell: ({ row }) => (
      <div className="font-medium text-green-600">
        {row.original.incentive.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "ot",
    header: "OT Pay ($)",
    cell: ({ row }) => <div>{row.original.ot.toFixed(2)}</div>,
  },
  {
    accessorKey: "total",
    header: "Total Earnings ($)",
    cell: ({ row }) => (
      <div className="text-base font-bold text-blue-600">
        ${row.original.total.toFixed(2)}
      </div>
    ),
  },
];

const IncentiveCalculationPage = () => (
  <div className="space-y-6">
    <header className="flex flex-wrap justify-between items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Incentive & OT Calculation</h1>
        <p className="text-sm text-muted-foreground">
          Review automated incentive and overtime pay for workers.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Input type="month" defaultValue="2023-11" className="w-auto" />
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" /> Line
        </Button>
        <Button>
          <FileDown className="w-5 h-5 mr-2" /> Export
        </Button>
      </div>
    </header>

    <Card>
      <CardContent className="p-0">
        <CustomTable
          columns={columns}
          data={incentiveData}
          showCheckbox={false}
          showColumnVisibility={false}
        />
      </CardContent>
    </Card>
  </div>
);
export default IncentiveCalculationPage;
