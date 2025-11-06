import { PlusCircle, FileDown, Search } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProductionOrder = {
  id: string;
  style: string;
  color: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: "Planned" | "Waiting" | "In Progress";
  requestedLayout: boolean;
  requestedAcc: boolean;
};

// Mock data for demonstration
const productionOrders: ProductionOrder[] = [
  {
    id: "PO001",
    style: "T-SHIRT-01",
    color: "Black",
    quantity: 5000,
    startDate: "2023-10-25",
    endDate: "2023-11-05",
    status: "Planned",
    requestedLayout: true,
    requestedAcc: false,
  },
  {
    id: "PO002",
    style: "JACKET-V2",
    color: "Navy",
    quantity: 2500,
    startDate: "2023-10-28",
    endDate: "2023-11-10",
    status: "Planned",
    requestedLayout: true,
    requestedAcc: true,
  },
  {
    id: "PO003",
    style: "PANT-SLIM",
    color: "Khaki",
    quantity: 3000,
    startDate: "2023-11-01",
    endDate: "2023-11-12",
    status: "Waiting",
    requestedLayout: false,
    requestedAcc: false,
  },
  {
    id: "PO004",
    style: "T-SHIRT-01",
    color: "White",
    quantity: 5000,
    startDate: "2023-11-06",
    endDate: "2023-11-15",
    status: "Waiting",
    requestedLayout: false,
    requestedAcc: false,
  },
];

const StatusBadge = ({ status }: { status: ProductionOrder["status"] }) => {
  const statusClasses: Record<ProductionOrder["status"], string> = {
    Planned: "bg-blue-100 text-blue-800",
    Waiting: "bg-gray-100 text-gray-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
  };
  return (
    <Badge variant="outline" className={`border-0 ${statusClasses[status]}`}>
      {status}
    </Badge>
  );
};

const RequestStatus = ({
  requested,
  type,
}: {
  requested: boolean;
  type: "Layout" | "Accessories";
}) => {
  if (requested) {
    return (
      <span className="text-xs font-semibold text-green-600">Requested</span>
    );
  }
  return (
    <Button
      size="sm"
      className="h-7 text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-700"
    >
      Request {type}
    </Button>
  );
};

const ProductionPlanPage = () => {
  const columns: ColumnDef<ProductionOrder>[] = [
    {
      accessorKey: "id",
      header: "PO Number",
    },
    {
      id: "styleInfo",
      header: "Style",
      cell: ({ row }) => (
        <div>
          {row.original.style} ({row.original.color})
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => row.original.quantity.toLocaleString(),
    },
    {
      id: "plannedDates",
      header: "Planned Dates",
      cell: ({ row }) => (
        <div>
          {row.original.startDate} to {row.original.endDate}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "resources",
      header: "Resources Request",
      cell: ({ row }) => (
        <div className="flex justify-start items-center gap-4">
          <RequestStatus
            requested={row.original.requestedLayout}
            type="Layout"
          />
          <RequestStatus
            requested={row.original.requestedAcc}
            type="Accessories"
          />
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Production Plan</h1>
          <p className="text-sm text-muted-foreground">
            View overall plans and create booking kanbans for sewing lines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Booking Kanban
          </Button>
        </div>
      </header>

      <Card>
        <CardContent className="pt-6">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search by PO or Style..."
                className="w-full pl-10"
              />
            </div>
            <Button variant="outline">
              <FileDown className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Production Orders Table */}
          <CustomTable columns={columns} data={productionOrders} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionPlanPage;
