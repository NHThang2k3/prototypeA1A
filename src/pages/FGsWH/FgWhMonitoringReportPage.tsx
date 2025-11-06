// src/pages/FgWhMonitoringReportPage.tsx

import { Search, List, MapPin } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

import { CustomTable } from "@/components/ui/custom-table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

// Data type definition
type Inventory = {
  id: string;
  po: string;
  style: string;
  color: string;
  size: string;
  qty: number;
  location: string;
  status: "QC Pass" | "Awaiting Shipment" | "Packed";
};

// Mock data
const inventory: Inventory[] = [
  {
    id: "CARTON-001",
    po: "PO77881",
    style: "A-STYLE-01",
    color: "Black",
    size: "M",
    qty: 50,
    location: "A-01-03",
    status: "QC Pass",
  },
  {
    id: "CARTON-002",
    po: "PO77881",
    style: "A-STYLE-01",
    color: "Black",
    size: "L",
    qty: 50,
    location: "A-01-04",
    status: "Awaiting Shipment",
  },
  {
    id: "CARTON-003",
    po: "PO77882",
    style: "P-STYLE-02",
    color: "Red",
    size: "S",
    qty: 30,
    location: "B-05-11",
    status: "Packed",
  },
  {
    id: "CARTON-004",
    po: "PO77884",
    style: "A-STYLE-04",
    color: "White",
    size: "M",
    qty: 40,
    location: "C-02-01",
    status: "QC Pass",
  },
  {
    id: "CARTON-005",
    po: "PO77884",
    style: "A-STYLE-04",
    color: "White",
    size: "M",
    qty: 40,
    location: "C-02-02",
    status: "QC Pass",
  },
];

const getStatusBadgeClass = (status: Inventory["status"]) => {
  switch (status) {
    case "QC Pass":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Awaiting Shipment":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "Packed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const columns: ColumnDef<Inventory>[] = [
  { accessorKey: "id", header: "Carton ID" },
  { accessorKey: "po", header: "PO" },
  { accessorKey: "style", header: "Style" },
  { accessorKey: "color", header: "Color" },
  { accessorKey: "size", header: "Size" },
  { accessorKey: "qty", header: "Qty" },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-mono text-blue-700">{row.original.location}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={getStatusBadgeClass(row.original.status)}>
        {row.original.status}
      </Badge>
    ),
  },
];

const WarehouseMap = () => {
  // Simplified representation of a warehouse layout
  const layout = Array.from({ length: 5 }, (_, rack) =>
    Array.from({ length: 10 }, (_, shelf) => ({
      id: `R${rack + 1}-S${shelf + 1}`,
      status: Math.random() > 0.4 ? "Occupied" : "Empty",
    }))
  );

  return (
    <div className="p-4 bg-muted rounded-lg">
      <h3 className="font-semibold mb-4 text-lg">Warehouse Visual Map</h3>
      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>Occupied
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-300 rounded-sm"></div>Empty
        </div>
      </div>
      <div className="grid grid-cols-10 gap-1">
        {layout.flat().map((loc) => (
          <div
            key={loc.id}
            title={`${loc.id} - ${loc.status}`}
            className={`h-12 w-full rounded-md cursor-pointer transition-transform hover:scale-110 ${
              loc.status === "Occupied" ? "bg-blue-500" : "bg-green-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

const FgWhMonitoringReportPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">FG Warehouse Monitoring</h1>
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="list" className="w-full">
            <div className="px-6 border-b">
              <TabsList className="bg-transparent p-0">
                <TabsTrigger
                  value="list"
                  className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 rounded-none -mb-px data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:text-primary"
                >
                  <List className="w-5 h-5" /> Inventory List
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 rounded-none -mb-px data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:text-primary"
                >
                  <MapPin className="w-5 h-5" /> Warehouse Map
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="p-6">
              <TabsContent value="list">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by Carton ID, PO, Style, Location..."
                    className="w-full pl-10 py-3"
                  />
                </div>
                <CustomTable
                  columns={columns}
                  data={inventory}
                  showCheckbox={false}
                  showColumnVisibility={false}
                />
              </TabsContent>
              <TabsContent value="map">
                <WarehouseMap />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FgWhMonitoringReportPage;
