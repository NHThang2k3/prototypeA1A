import { useState, useMemo } from "react";
import {
  PlusCircle,
  Search,
  AlertTriangle,
  Wrench,
  FileText,
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CustomTable } from "@/components/ui/custom-table";

// Mock data for needle log
const needleLogData = [
  {
    id: "LOG-001",
    date: "2023-11-07 09:15",
    machine: "SN-101",
    worker: "W001",
    type: "Issue New",
    needleType: "DBx1 #11",
    details: "Start of shift",
  },
  {
    id: "LOG-002",
    date: "2023-11-07 10:30",
    machine: "OL-203",
    worker: "W002",
    type: "Broken",
    needleType: "DCx27 #11",
    details: "Broken needle report #BN-045 filed",
  },
  {
    id: "LOG-003",
    date: "2023-11-07 10:32",
    machine: "OL-203",
    worker: "W002",
    type: "Issue New",
    needleType: "DCx27 #11",
    details: "Replacement for #BN-045",
  },
  {
    id: "LOG-004",
    date: "2023-11-07 14:00",
    machine: "CS-301",
    worker: "W003",
    type: "Return Old",
    needleType: "UYx128 #10",
    details: "End of PO",
  },
];

type NeedleLog = (typeof needleLogData)[0];

const LogTypeBadge = ({ type }: { type: string }) => {
  const getVariant = (): "default" | "destructive" | "secondary" => {
    switch (type) {
      case "Broken":
        return "destructive";
      case "Issue New":
        return "default";
      case "Return Old":
        return "secondary";
      default:
        return "secondary";
    }
  };
  return <Badge variant={getVariant()}>{type}</Badge>;
};

const columns: ColumnDef<NeedleLog>[] = [
  { accessorKey: "date", header: "Timestamp" },
  { accessorKey: "machine", header: "Machine" },
  { accessorKey: "worker", header: "Worker" },
  { accessorKey: "needleType", header: "Needle Type" },
  {
    accessorKey: "type",
    header: "Log Type",
    cell: ({ row }) => <LogTypeBadge type={row.original.type} />,
  },
  { accessorKey: "details", header: "Details" },
  { id: "actions" }, // To enable column visibility toggle
];

const ToolStatusDashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    if (!lowercasedFilter) {
      return needleLogData;
    }
    return needleLogData.filter(
      (log) =>
        log.machine.toLowerCase().includes(lowercasedFilter) ||
        log.worker.toLowerCase().includes(lowercasedFilter) ||
        log.needleType.toLowerCase().includes(lowercasedFilter) ||
        log.details.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Metal Tool Management</h1>
          <p className="text-sm text-muted-foreground">
            Track sewing needles and manage broken needle procedures.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive">
            <AlertTriangle className="w-5 h-5 mr-2" /> Report Broken Needle
          </Button>
          <Button>
            <PlusCircle className="w-5 h-5 mr-2" /> New Log Entry
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Wrench className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Needles in Use
                </p>
                <p className="text-3xl font-bold">152</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Broken Needles (24h)
                </p>
                <p className="text-3xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Reports Pending Review
                </p>
                <p className="text-3xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Needle Control Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute w-5 h-5 text-muted-foreground left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by Machine, Worker, or Needle Type..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <CustomTable columns={columns} data={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolStatusDashboardPage;
