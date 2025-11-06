import { Barcode, Shield, Database, Send, PlusCircle } from "lucide-react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomTable } from "@/components/ui/custom-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the data type for our table rows
type InspectedItem = {
  id: number;
  cartonId: string;
  result: "Pass" | "Fail";
  defects: string;
};

// Mock data for inspected items
const initialInspectedItems: InspectedItem[] = [
  { id: 1, cartonId: "CARTON-001", result: "Pass", defects: "" },
  { id: 2, cartonId: "CARTON-009", result: "Fail", defects: "2pcs open seam" },
];

// Define columns for the CustomTable
const columns: ColumnDef<InspectedItem>[] = [
  {
    accessorKey: "cartonId",
    header: "Carton ID",
    cell: ({ row }) => (
      <Input defaultValue={row.original.cartonId} className="w-full" />
    ),
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: ({ row }) => (
      <Select defaultValue={row.original.result}>
        <SelectTrigger>
          <SelectValue placeholder="Select result" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pass">Pass</SelectItem>
          <SelectItem value="Fail">Fail</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    accessorKey: "defects",
    header: "Defects Found / Comments",
    cell: ({ row }) => (
      <Input defaultValue={row.original.defects} className="w-full" />
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: () => (
      <Button variant="ghost" className="text-red-500 hover:text-red-700">
        Remove
      </Button>
    ),
  },
];

const SampleInspectionPage = () => {
  const [po, setPo] = useState("");
  const [poDetails, setPoDetails] = useState<{
    total: number;
    aql: string;
    sampleSize: number;
  } | null>(null);
  const [inspectedItems] = useState(initialInspectedItems);

  const handleLoadPo = () => {
    if (po) {
      setPoDetails({ total: 250, aql: "2.5 General II", sampleSize: 15 });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Carton Sample Inspection (AQL)</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Barcode className="w-6 h-6" />
            Enter PO Number
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="text"
              value={po}
              onChange={(e) => setPo(e.target.value)}
              placeholder="Enter PO Number..."
              className="flex-grow"
            />
            <Button onClick={handleLoadPo}>Load Details</Button>
          </div>
        </CardContent>
      </Card>

      {poDetails && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Cartons in PO
                </p>
                <p className="text-2xl font-bold">{poDetails.total}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AQL Level</p>
                <p className="text-2xl font-bold">{poDetails.aql}</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-md">
                <p className="text-sm text-blue-700">Suggested Sample Size</p>
                <p className="text-2xl font-bold text-blue-800">
                  {poDetails.sampleSize}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {poDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Inspection Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CustomTable
              columns={columns}
              data={inspectedItems}
              showCheckbox={false}
              showColumnVisibility={false}
            />
          </CardContent>
          <CardFooter className="bg-muted/50">
            <Button variant="link" className="p-0 h-auto">
              <PlusCircle className="w-5 h-5 mr-2" /> Add Another Carton
            </Button>
          </CardFooter>
        </Card>
      )}

      {poDetails && (
        <div className="p-4 bg-gray-100 rounded-lg flex flex-col md:flex-row justify-end items-center gap-4">
          <p className="text-sm text-muted-foreground mr-auto">
            Finalize Inspection Report:
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" className="w-full md:w-auto">
                  <Database className="w-5 h-5 mr-2" />
                  Save to Internal
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Save for internal review only. This will NOT be sent to the
                  client.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Send className="w-5 h-5 mr-2" />
                  Submit to PV88/ZDC
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Submit final report to client system (e.g., PV88/ZDC). This
                  action is irreversible.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default SampleInspectionPage;
