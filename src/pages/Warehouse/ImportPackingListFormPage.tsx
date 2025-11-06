// src/pages/import-packing-list/ImportPackingListFormPage.tsx

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileText,
  Loader2,
  XCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import * as XLSX from "xlsx";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/ui/custom-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// --- TYPE DEFINITIONS (Unchanged) ---
interface PackingListItem {
  id: string;
  poNumber: string;
  itemCode: string;
  factory: string;
  supplier: string;
  invoiceNo: string;
  colorCode: string;
  color: string;
  rollNo: string;
  lotNo: string;
  yards: number;
  netWeight: number;
  grossWeight: number;
  width: string;
  location: string;
  qrCode: string;
  dateInHouse: string;
  description: string;
}

// --- LOCAL COMPONENT: ActionToolbar (Refactored) ---
interface ActionToolbarProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  return (
    <div className="sticky bottom-0 bg-background/90 backdrop-blur-sm border-t p-4 z-10">
      <div className="max-w-7xl mx-auto flex justify-end items-center">
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Processing..." : "Complete"}
        </Button>
      </div>
    </div>
  );
};

// --- LOCAL COMPONENT: FileUploadZone (Refactored for Multiple Files) ---
type FileStatus = "parsing" | "success" | "error";

interface ProcessedFile {
  file: File;
  status: FileStatus;
  error?: string;
  parsedItems: PackingListItem[];
}

interface FileUploadZoneProps {
  onFileAdded: (items: PackingListItem[]) => void;
  onFileRemoved: (fileName: string) => void;
}

const headerMapping: { [key: string]: keyof Omit<PackingListItem, "id"> } = {
  "PO Number": "poNumber",
  "Item Code": "itemCode",
  Factory: "factory",
  Supplier: "supplier",
  "Invoice No": "invoiceNo",
  "Color Code": "colorCode",
  Color: "color",
  "Roll No": "rollNo",
  "Lot No": "lotNo",
  Yards: "yards",
  "Net Weight (Kgs)": "netWeight",
  "Gross Weight (Kgs)": "grossWeight",
  Width: "width",
  Location: "location",
  "QR Code": "qrCode",
  "Date In House": "dateInHouse",
  Description: "description",
};
const requiredHeaders = Object.keys(headerMapping);

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileAdded,
  onFileRemoved,
}) => {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);

  const parseFile = async (file: File): Promise<PackingListItem[]> => {
    // Parsing logic remains unchanged
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          if (!data) throw new Error("Could not read file.");
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          if (!sheetName) throw new Error("Excel file has no sheets.");
          const worksheet = workbook.Sheets[sheetName];
          const json: { [key: string]: string | number }[] =
            XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" });
          if (json.length === 0) {
            throw new Error("File has no data or the first sheet is empty.");
          }
          const fileHeaders = Object.keys(json[0] || {});
          const missingHeaders = requiredHeaders.filter(
            (h) => !fileHeaders.includes(h)
          );
          if (missingHeaders.length > 0) {
            throw new Error(
              `Missing required columns: ${missingHeaders.join(", ")}`
            );
          }
          const parsedItems: PackingListItem[] = json
            .map((row, index) => {
              if (Object.values(row).every((val) => val === "")) return null;
              const newItem: Partial<PackingListItem> = {
                id: `${file.name}-${index}`,
              };
              for (const header of requiredHeaders) {
                const key = headerMapping[header];
                const value = row[header];
                if (
                  key === "yards" ||
                  key === "netWeight" ||
                  key === "grossWeight"
                ) {
                  const numValue = parseFloat(String(value));
                  if (isNaN(numValue)) {
                    throw new Error(
                      `Invalid number at row ${
                        index + 2
                      }, column "${header}": "${value}"`
                    );
                  }
                  newItem[key] = numValue;
                } else {
                  newItem[key] = String(value ?? "");
                }
              }
              return newItem as PackingListItem;
            })
            .filter((item): item is PackingListItem => item !== null);
          if (parsedItems.length === 0) {
            throw new Error("No valid data found in the file.");
          }
          resolve(parsedItems);
        } catch (e: unknown) {
          let message = "An error occurred while processing the file.";
          if (e instanceof Error) message = e.message;
          reject(new Error(message));
        }
      };
      reader.onerror = () => {
        reject(new Error("Could not read the file. Please try again."));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Logic remains unchanged
      const newFilesToProcess = acceptedFiles.filter(
        (file) =>
          !processedFiles.some(
            (processedFile) => processedFile.file.name === file.name
          )
      );
      newFilesToProcess.forEach((file) => {
        setProcessedFiles((prev) => [
          ...prev,
          { file, status: "parsing", parsedItems: [] },
        ]);
        parseFile(file)
          .then((parsedItems) => {
            setProcessedFiles((prev) =>
              prev.map((pf) =>
                pf.file.name === file.name
                  ? { ...pf, status: "success", parsedItems }
                  : pf
              )
            );
            onFileAdded(parsedItems);
          })
          .catch((error: Error) => {
            setProcessedFiles((prev) =>
              prev.map((pf) =>
                pf.file.name === file.name
                  ? { ...pf, status: "error", error: error.message }
                  : pf
              )
            );
          });
      });
    },
    [processedFiles, onFileAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: true,
  });

  const handleRemoveFile = (fileName: string) => {
    setProcessedFiles((prev) => prev.filter((pf) => pf.file.name !== fileName));
    onFileRemoved(fileName);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        {...getRootProps()}
        className={cn(
          "w-full border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary-foreground"
            : "border-input hover:border-muted-foreground",
          processedFiles.length > 0 && "mb-6"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-muted-foreground">
          <UploadCloud className="w-10 h-10 mb-3" />
          <p className="font-semibold">
            Drag and drop files here, or click to select files
          </p>
          <p className="text-sm">
            Only Excel files (.xls, .xlsx) are supported
          </p>
        </div>
      </div>

      {processedFiles.length > 0 && (
        <div className="w-full space-y-3">
          {processedFiles.map(({ file, status, error }) => (
            <div
              key={file.name}
              className={cn(
                "w-full p-4 rounded-md border flex items-center justify-between",
                status === "success" && "bg-green-50 border-green-200",
                status === "error" &&
                  "bg-destructive-foreground border-destructive"
              )}
            >
              <div className="flex items-center overflow-hidden">
                <FileText className="w-6 h-6 text-muted-foreground mr-3 flex-shrink-0" />
                <div className="flex-grow overflow-hidden">
                  <p
                    className="font-medium text-foreground truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  {status === "error" && (
                    <p className="text-sm text-destructive mt-1">{error}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                {status === "parsing" && (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                )}
                {status === "success" && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                {status === "error" && (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(file.name)}
                  title="Remove file"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- LOCAL COMPONENT: PreviewTable (Refactored) ---
const columns: ColumnDef<PackingListItem>[] = [
  { accessorKey: "poNumber", header: "PO Number" },
  { accessorKey: "itemCode", header: "Item Code" },
  { accessorKey: "factory", header: "Factory" },
  { accessorKey: "supplier", header: "Supplier" },
  { accessorKey: "invoiceNo", header: "Invoice No" },
  { accessorKey: "colorCode", header: "Color Code" },
  { accessorKey: "color", header: "Color" },
  { accessorKey: "rollNo", header: "Roll No" },
  { accessorKey: "lotNo", header: "Lot No" },
  {
    accessorKey: "yards",
    header: "Yards",
    cell: ({ row }) => row.original.yards.toFixed(2),
  },
  {
    accessorKey: "netWeight",
    header: "Net Weight (Kgs)",
    cell: ({ row }) => row.original.netWeight.toFixed(2),
  },
  {
    accessorKey: "grossWeight",
    header: "Gross Weight (Kgs)",
    cell: ({ row }) => row.original.grossWeight.toFixed(2),
  },
  { accessorKey: "width", header: "Width" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "qrCode", header: "QR Code" },
  { accessorKey: "dateInHouse", header: "Date In House" },
  { accessorKey: "description", header: "Description" },
];

interface PreviewTableProps {
  items: PackingListItem[];
}

const PreviewTable: React.FC<PreviewTableProps> = ({ items }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Data Preview ({items.length} total rows)</CardTitle>
      </CardHeader>
      <CardContent>
        <CustomTable columns={columns} data={items} showCheckbox={false} />
      </CardContent>
    </Card>
  );
};

// --- MAIN PAGE COMPONENT (Refactored) ---
const ImportPackingListFormPage: React.FC = () => {
  const [items, setItems] = useState<PackingListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileAdded = useCallback((newItems: PackingListItem[]) => {
    setItems((prevItems) => [...prevItems, ...newItems]);
  }, []);

  const handleFileRemoved = useCallback((fileName: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !item.id.startsWith(`${fileName}-`))
    );
  }, []);

  const handleSubmit = () => {
    // Business logic remains unchanged
    if (items.length === 0) {
      alert("There are no valid items to submit.");
      return;
    }
    setIsSubmitting(true);
    console.log("Submitting the following items:", items);
    setTimeout(() => {
      console.log("Submission successful!");
      setIsSubmitting(false);
      setItems([]);
      alert("Inbound shipment created successfully!");
    }, 2000);
  };

  return (
    <>
      <div className="space-y-6 pb-24">
        <div>
          <h1 className="text-2xl font-bold">Inbound from Packing List File</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload one or more Excel files to create a batch inbound shipment.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Upload Packing List Files</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploadZone
              onFileAdded={handleFileAdded}
              onFileRemoved={handleFileRemoved}
            />
          </CardContent>
        </Card>

        {items.length > 0 && <PreviewTable items={items} />}
      </div>

      {items.length > 0 && (
        <ActionToolbar onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </>
  );
};

export default ImportPackingListFormPage;
