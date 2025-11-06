import { UploadCloud, FileText, Download, History, Ship } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTable } from "@/components/ui/custom-table";
import { Input } from "@/components/ui/input";

// Define the data type for our table rows
type UploadHistory = {
  id: number;
  fileName: string;
  uploadedBy: string;
  date: string;
  status: "Success" | "Failed";
};

// Mock data for upload history
const uploadHistory: UploadHistory[] = [
  {
    id: 1,
    fileName: "Planload_Container_C123.xlsx",
    uploadedBy: "Export Dept",
    date: "2023-10-27 09:30 AM",
    status: "Success",
  },
  {
    id: 2,
    fileName: "Final_Load_Adidas_W44.csv",
    uploadedBy: "Export Dept",
    date: "2023-10-26 02:00 PM",
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
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <Button variant="link" className="p-0 h-auto">
        View Details
      </Button>
    ),
  },
];

const UploadPlanloadPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upload Final Plan Load</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="w-6 h-6" />
            Upload New Plan Load
          </CardTitle>
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
              Excel (.xlsx) or CSV (.csv) files only. This will generate the
              final shipment order.
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
            Plan Load Upload History
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

export default UploadPlanloadPage;
