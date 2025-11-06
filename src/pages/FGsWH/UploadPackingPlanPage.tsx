import {
  UploadCloud,
  FileText,
  Download,
  History,
  AlertCircle,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTable } from "@/components/ui/custom-table";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the data type for our table rows
type UploadHistory = {
  id: number;
  fileName: string;
  uploadedBy: string;
  date: string;
  status: "Success" | "Failed";
  error?: string;
};

// Mock data for upload history
const uploadHistory: UploadHistory[] = [
  {
    id: 1,
    fileName: "PKL_PO12345_Adidas.xlsx",
    uploadedBy: "Planner A",
    date: "2023-10-26 10:15 AM",
    status: "Success",
  },
  {
    id: 2,
    fileName: "PackingPlan_Puma_Fall23.csv",
    uploadedBy: "Planner B",
    date: "2023-10-25 04:30 PM",
    status: "Success",
  },
  {
    id: 3,
    fileName: "PKL_PO67890_Nike.xlsx",
    uploadedBy: "Planner A",
    date: "2023-10-25 09:00 AM",
    status: "Failed",
    error: "PO number 67890 not found in the system.",
  },
  {
    id: 4,
    fileName: "PackList_NB_Winter.xlsx",
    uploadedBy: "Planner C",
    date: "2023-10-24 11:45 AM",
    status: "Success",
  },
];

// Define columns for the CustomTable
const columns: ColumnDef<UploadHistory>[] = [
  {
    accessorKey: "fileName",
    header: "File Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 font-medium">
        <FileText className="w-4 h-4 text-muted-foreground" />
        {row.original.fileName}
      </div>
    ),
  },
  {
    accessorKey: "uploadedBy",
    header: "Uploaded By",
  },
  {
    accessorKey: "date",
    header: "Date & Time",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "Success" ? "default" : "destructive"}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      if (row.original.status === "Failed") {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="link" className="text-destructive p-0 h-auto">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  View Error
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.original.error}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      return <span className="text-muted-foreground">-</span>;
    },
  },
];

const UploadPackingPlanPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upload Packing Plan</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-all">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Excel (.xlsx) or CSV (.csv) files only. Max 10MB.
            </p>
            <Input type="file" className="hidden" />
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-6 h-6" />
            Upload History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomTable
            columns={columns}
            data={uploadHistory}
            showCheckbox={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPackingPlanPage;
