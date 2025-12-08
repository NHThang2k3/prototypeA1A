import React, { useState, useMemo, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Wrench,
  Armchair,
  AlertCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- TYPES ---

export type MachineStatus = "RUNNING" | "DOWNTIME" | "MAINTENANCE" | "IDLE";

export interface Machine {
  id: string;
  name: string;
  type: string; // e.g., "Heat Press", "Bonding", "Embroidery"
  status: MachineStatus;
  line: string;
  uptimePercentage: number;
  lastMaintenance?: string;
  downtimeInfo?: {
    startTime: string; // ISO string
    reason: string;
    assignee?: {
      name: string;
      avatar?: string;
    };
    estimatedCompletion?: string; // ISO string
  };
}

// --- MOCK DATA ---

const MOCK_MACHINES: Machine[] = [
  {
    id: "M-001",
    name: "Bonding Machine 01",
    type: "Bonding",
    status: "RUNNING",
    line: "Line A",
    uptimePercentage: 98,
  },
  {
    id: "M-002",
    name: "Bonding Machine 02",
    type: "Bonding",
    status: "DOWNTIME",
    line: "Line A",
    uptimePercentage: 85,
    downtimeInfo: {
      startTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
      reason: "Temperature Sensor Failure",
    },
  },
  {
    id: "M-003",
    name: "Heat Press 01",
    type: "Heat Press",
    status: "MAINTENANCE",
    line: "Line B",
    uptimePercentage: 92,
    downtimeInfo: {
      startTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      reason: "Scheduled Belt Replacement",
      assignee: {
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?u=john",
      },
      estimatedCompletion: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // in 30 mins
    },
  },
  {
    id: "M-004",
    name: "Embroidery St-X",
    type: "Embroidery",
    status: "RUNNING",
    line: "Line C",
    uptimePercentage: 99,
  },
  {
    id: "M-005",
    name: "Cutter Pro 2000",
    type: "Cutting",
    status: "DOWNTIME",
    line: "Line D",
    uptimePercentage: 70,
    downtimeInfo: {
      startTime: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
      reason: "Blade Jammed",
      assignee: {
        name: "Mike Smith",
      },
    },
  },
  {
    id: "M-006",
    name: "Bonding Machine 03",
    type: "Bonding",
    status: "IDLE",
    line: "Line A",
    uptimePercentage: 100,
  },
  {
    id: "M-007",
    name: "Heat Press 02",
    type: "Heat Press",
    status: "RUNNING",
    line: "Line B",
    uptimePercentage: 95,
  },
  {
    id: "M-008",
    name: "Embroidery Pro",
    type: "Embroidery",
    status: "RUNNING",
    line: "Line C",
    uptimePercentage: 97,
  },
];

// --- HELPER FUNCTIONS ---

const getStatusColor = (status: MachineStatus) => {
  switch (status) {
    case "RUNNING":
      return "text-green-600 bg-green-50 border-green-200";
    case "DOWNTIME":
      return "text-red-600 bg-red-50 border-red-200";
    case "MAINTENANCE":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "IDLE":
      return "text-gray-600 bg-gray-50 border-gray-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getStatusIcon = (status: MachineStatus) => {
  switch (status) {
    case "RUNNING":
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case "DOWNTIME":
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    case "MAINTENANCE":
      return <Wrench className="w-5 h-5 text-orange-600" />;
    case "IDLE":
      return <Armchair className="w-5 h-5 text-gray-400" />;
  }
};

const formatDuration = (startTime: string) => {
  const start = new Date(startTime);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

// --- COMPONENTS ---

const StatusCard = ({
  title,
  value,
  icon,
  trend,
  colorClass,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  colorClass?: string;
}) => (
  <Card>
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <h2 className={`text-3xl font-bold ${colorClass}`}>{value}</h2>
          {trend && <span className="text-xs text-muted-foreground">{trend}</span>}
        </div>
      </div>
      <div className="p-3 bg-slate-100 rounded-full">{icon}</div>
    </CardContent>
  </Card>
);

const MachineCard = ({ machine }: { machine: Machine }) => {
  return (
    <Card className="hover:shadow-md transition-shadow border-l-4 overflow-hidden" 
          style={{ 
            borderLeftColor: 
              machine.status === "RUNNING" ? "#22c55e" : 
              machine.status === "DOWNTIME" ? "#ef4444" : 
              machine.status === "MAINTENANCE" ? "#f97316" : "#9ca3af" 
          }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            {getStatusIcon(machine.status)}
            {machine.name}
          </CardTitle>
          <CardDescription className="text-xs">{machine.type} • {machine.line}</CardDescription>
        </div>
        <Badge variant="outline" className={`${getStatusColor(machine.status)}`}>
          {machine.status}
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span>Uptime</span>
          </div>
          <span className="font-bold text-sm">{machine.uptimePercentage}%</span>
        </div>
        <Progress value={machine.uptimePercentage} className="h-2 mb-4" />
        
        {machine.status !== "RUNNING" && machine.status !== "IDLE" && machine.downtimeInfo && (
          <div className="bg-slate-50 p-3 rounded-lg text-sm space-y-2 border">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 mt-0.5 text-red-500" />
              <div>
                <span className="font-semibold text-red-600 block">
                  Down for {formatDuration(machine.downtimeInfo.startTime)}
                </span>
                <span className="text-muted-foreground text-xs">
                   {new Date(machine.downtimeInfo.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-500" />
                <span className="text-gray-700">{machine.downtimeInfo.reason}</span>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t mt-2">
              <span className="text-xs text-muted-foreground">Technician:</span>
              {machine.downtimeInfo.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar className="w-5 h-5">
                    {machine.downtimeInfo.assignee.avatar && <AvatarImage src={machine.downtimeInfo.assignee.avatar} />}
                    <AvatarFallback className="text-[10px] bg-slate-200">
                      {machine.downtimeInfo.assignee.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">{machine.downtimeInfo.assignee.name}</span>
                </div>
              ) : (
                 <Badge variant="secondary" className="text-[10px] h-5 bg-gray-200 text-gray-500 hover:bg-gray-300">
                    Unassigned
                 </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- MAIN PAGE ---

const DowntimeDashboardPage = () => {
  const [machines, setMachines] = useState<Machine[]>(MOCK_MACHINES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Stats
  const stats = useMemo(() => {
    return {
      total: machines.length,
      running: machines.filter((m) => m.status === "RUNNING").length,
      downtime: machines.filter((m) => m.status === "DOWNTIME").length,
      maintenance: machines.filter((m) => m.status === "MAINTENANCE").length,
    };
  }, [machines]);

  // Filtering
  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      const matchesSearch =
        machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || machine.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [machines, searchTerm, statusFilter]);

  // Auto-update duration for demo purposes (every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update relative time
      setMachines((prev) => [...prev]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 bg-gray-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Machine Downtime Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring of machine availability and maintenance status.
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Reports
           </Button>
           <Button>
              <Activity className="w-4 h-4 mr-2" />
              Live View
           </Button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Total Machines"
          value={stats.total}
          icon={<Activity className="text-blue-500" />}
          colorClass="text-blue-700"
        />
        <StatusCard
          title="Running"
          value={stats.running}
          icon={<CheckCircle2 className="text-green-500" />}
          trend={`${Math.round((stats.running / stats.total) * 100)}% Operational`}
          colorClass="text-green-600"
        />
        <StatusCard
          title="Downtime"
          value={stats.downtime}
          icon={<AlertCircle className="text-red-500" />}
          trend="Critical Attention"
          colorClass="text-red-600"
        />
        <StatusCard
          title="Maintenance"
          value={stats.maintenance}
          icon={<Wrench className="text-orange-500" />}
          trend="Scheduled Work"
          colorClass="text-orange-600"
        />
      </div>

      {/* FILTERS & CONTENT */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
          
          <Tabs defaultValue="ALL" className="w-full sm:w-auto" onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value="RUNNING" className="text-green-700 data-[state=active]:bg-green-50">Running</TabsTrigger>
              <TabsTrigger value="DOWNTIME" className="text-red-700 data-[state=active]:bg-red-50">Downtime</TabsTrigger>
              <TabsTrigger value="MAINTENANCE" className="text-orange-700 data-[state=active]:bg-orange-50">Maintenance</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search machine..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="all_lines">
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Line" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all_lines">All Lines</SelectItem>
                    <SelectItem value="line_a">Line A</SelectItem>
                    <SelectItem value="line_b">Line B</SelectItem>
                    <SelectItem value="line_c">Line C</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>

        {/* MACHINE GRID */}
        {filteredMachines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMachines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-gray-50">
             <Search className="h-10 w-10 text-muted-foreground mb-4" />
             <h3 className="text-lg font-semibold">No machines found</h3>
             <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DowntimeDashboardPage;
