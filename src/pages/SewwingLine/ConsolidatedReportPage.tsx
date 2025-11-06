import { Filter, FileDown, Calendar, Users, BarChart } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomTable } from "@/components/ui/custom-table";
import { Table, TableFooter, TableRow, TableCell } from "@/components/ui/table";

type ReportData = {
  date: string;
  line: string;
  po: string;
  style: string;
  target: number;
  actual: number;
  efficiency: number;
  downtime: number;
  firstPassYield: number;
  defects: number;
};

const reportData: ReportData[] = [
  {
    date: "2023-11-06",
    line: "Line 05",
    po: "PO001",
    style: "T-SHIRT-01",
    target: 500,
    actual: 485,
    efficiency: 97,
    downtime: 15,
    firstPassYield: 98.5,
    defects: 7,
  },
  {
    date: "2023-11-06",
    line: "Line 06",
    po: "PO002",
    style: "JACKET-V2",
    target: 250,
    actual: 255,
    efficiency: 102,
    downtime: 5,
    firstPassYield: 99.1,
    defects: 2,
  },
  // ... other data
];

const columns: ColumnDef<ReportData>[] = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "line", header: "Line" },
  { accessorKey: "po", header: "PO" },
  { accessorKey: "style", header: "Style" },
  {
    accessorKey: "target",
    header: () => <div className="text-right">Target</div>,
    cell: ({ row }) => <div className="text-right">{row.original.target}</div>,
  },
  {
    accessorKey: "actual",
    header: () => <div className="text-right">Actual</div>,
    cell: ({ row }) => (
      <div className="text-right font-bold">{row.original.actual}</div>
    ),
  },
  {
    accessorKey: "efficiency",
    header: () => <div className="text-right">Efficiency (%)</div>,
    cell: ({ row }) => {
      const eff = row.original.efficiency;
      const color =
        eff >= 100
          ? "text-green-600"
          : eff >= 95
          ? "text-yellow-600"
          : "text-red-600";
      return <div className={`text-right font-bold ${color}`}>{eff}%</div>;
    },
  },
  {
    accessorKey: "downtime",
    header: () => <div className="text-right">Downtime (min)</div>,
    cell: ({ row }) => (
      <div className="text-right">{row.original.downtime}</div>
    ),
  },
  {
    accessorKey: "firstPassYield",
    header: () => <div className="text-right">FPY (%)</div>,
    cell: ({ row }) => {
      const fpy = row.original.firstPassYield;
      const color = fpy >= 99 ? "text-green-600" : "text-yellow-600";
      return <div className={`text-right font-bold ${color}`}>{fpy}%</div>;
    },
  },
  {
    accessorKey: "defects",
    header: () => <div className="text-right">Defects</div>,
    cell: ({ row }) => <div className="text-right">{row.original.defects}</div>,
  },
];

const ConsolidatedReportPage = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Consolidated Sewing Line Report</h1>
        <p className="text-sm text-muted-foreground">
          Detailed historical performance data for in-depth analysis.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <div className="relative">
                <Calendar className="absolute w-4 h-4 text-muted-foreground left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="date-range"
                  type="text"
                  placeholder="Select date range"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sewing-line">Sewing Line</Label>
              <div className="relative">
                <Users className="absolute w-4 h-4 text-muted-foreground left-3 top-1/2 -translate-y-1/2" />
                <Select>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="All Lines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Lines</SelectItem>
                    <SelectItem value="line5">Line 05</SelectItem>
                    <SelectItem value="line6">Line 06</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="po-style">PO / Style</Label>
              <div className="relative">
                <BarChart className="absolute w-4 h-4 text-muted-foreground left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="po-style"
                  type="text"
                  placeholder="e.g., PO001 or T-SHIRT-01"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <Button className="w-full">
                <Filter className="w-4 h-4 mr-2" /> Apply Filters
              </Button>
              <Button variant="outline">
                <FileDown className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CustomTable
          columns={columns}
          data={reportData}
          showCheckbox={false}
          showColumnVisibility={false}
        />
        <div className="border-t">
          <Table>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-right font-bold">
                  Totals / Averages
                </TableCell>
                <TableCell className="text-right font-bold">2500</TableCell>
                <TableCell className="text-right font-bold">2488</TableCell>
                <TableCell className="text-right font-bold text-green-600">
                  99.5%
                </TableCell>
                <TableCell className="text-right font-bold">75</TableCell>
                <TableCell className="text-right font-bold text-green-600">
                  98.5%
                </TableCell>
                <TableCell className="text-right font-bold">32</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ConsolidatedReportPage;
