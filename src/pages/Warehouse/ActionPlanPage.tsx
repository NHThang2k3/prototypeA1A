import { PlusCircle, User, Calendar, Search } from "lucide-react";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const actionPlanData = [
  {
    id: "AP-001",
    problem: "High defect rate on STYLE-A01 (Heat Press)",
    cause: "Incorrect machine temperature",
    assignedTo: "John Doe",
    dueDate: "2023-11-05",
    status: "In Progress",
  },
  {
    id: "AP-002",
    problem: "Embroidery machine #5 downtime",
    cause: "Broken needle sensor",
    assignedTo: "Maintenance Team",
    dueDate: "2023-10-30",
    status: "Completed",
  },
  {
    id: "AP-003",
    problem: "Pad-Print ink smudging issue",
    cause: "Incorrect ink viscosity",
    assignedTo: "Jane Smith",
    dueDate: "2023-11-10",
    status: "New",
  },
  {
    id: "AP-004",
    problem: "Delay in accessory delivery to Bonding line",
    cause: "Warehouse process inefficiency",
    assignedTo: "Warehouse Manager",
    dueDate: "2023-11-15",
    status: "New",
  },
  {
    id: "AP-005",
    problem: "Bonding adhesion failure on PO12348",
    cause: "Contamination on fabric surface",
    assignedTo: "QC Team",
    dueDate: "2023-10-28",
    status: "Verified",
  },
];

type ActionStatus = "New" | "In Progress" | "Completed" | "Verified";

const StatusBadge = ({ status }: { status: ActionStatus }) => {
  const statusMap: Record<
    ActionStatus,
    { text: string; variant: "default" | "secondary" | "outline" }
  > = {
    New: { text: "New", variant: "secondary" },
    "In Progress": { text: "In Progress", variant: "outline" },
    Completed: { text: "Completed", variant: "default" },
    Verified: { text: "Verified", variant: "default" },
  };

  const { text, variant } = statusMap[status];

  // Additional custom styling for colors
  const variantClasses = {
    secondary: "bg-gray-100 text-gray-800",
    outline: "bg-blue-100 text-blue-800",
    default:
      status === "Completed"
        ? "bg-purple-100 text-purple-800"
        : "bg-green-100 text-green-800",
  };

  return (
    <Badge variant={variant} className={variantClasses[variant]}>
      {text}
    </Badge>
  );
};

const ActionPlanPage = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Action Plan Management</h1>
        <Button>
          <PlusCircle size={16} className="mr-2" /> Create Action Plan
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by problem..." className="pl-9" />
          </div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="john">John Doe</SelectItem>
              <SelectItem value="jane">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {actionPlanData.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-start">
                <div>
                  <CardDescription className="font-semibold text-blue-600">
                    {item.id}
                  </CardDescription>
                  <CardTitle className="mt-1">{item.problem}</CardTitle>
                </div>
                <div className="mt-2 md:mt-0">
                  <StatusBadge status={item.status as ActionStatus} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Root Cause:</span>{" "}
                {item.cause}
              </p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400" /> Assigned To:{" "}
                <span className="font-medium">{item.assignedTo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" /> Due Date:{" "}
                <span className="font-medium">{item.dueDate}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActionPlanPage;
