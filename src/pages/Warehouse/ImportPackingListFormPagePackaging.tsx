// src/pages/import-packing-list/ImportPackingListFormPagePackaging.tsx

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// --- TYPE DEFINITIONS (Unchanged) ---
interface PackingListItem {
  id: string;
  poNumber: string;
  itemCode: string;
  supplier: string;
  invoiceNo: string;
  boxNo: string;
  lotNo: string;
  quantity: number;
  unit: string;
  netWeight: number;
  grossWeight: number;
  dimensions: string;
  location: string;
  qrCode: string;
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

// --- LOCAL COMPONENT: FileUploadZone (Refactored) ---
interface FileUploadZoneProps {
  onItemsChange: (items: PackingListItem[]) => void;
}

const headerMapping: { [key: string]: keyof Omit<PackingListItem, "id"> } = {
  "PO Number": "poNumber",
  "Item Code": "itemCode",
  Supplier: "supplier",
  "Invoice No": "invoiceNo",
  "Box No": "boxNo",
  "Lot No": "lotNo",
  Quantity: "quantity",
  Unit: "unit",
  "Net Weight (Kgs)": "netWeight",
  "Gross Weight (Kgs)": "grossWeight",
  Dimensions: "dimensions",
  Location: "location",
  "QR Code": "qrCode",
  Description: "description",
};
const requiredHeaders = Object.keys(headerMapping);

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onItemsChange }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileParse = useCallback(
    // Parsing logic remains unchanged
    (file: File) => {
      setUploadedFile(file);
      setError(null);
      setIsParsing(true);
      onItemsChange([]);
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
              `File is missing required columns: ${missingHeaders.join(", ")}`
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
                  key === "quantity" ||
                  key === "netWeight" ||
                  key === "grossWeight"
                ) {
                  const numValue = parseFloat(String(value));
                  if (isNaN(numValue)) {
                    throw new Error(
                      `Invalid data at row ${
                        index + 2
                      }, column "${header}": "${value}" is not a number.`
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
          onItemsChange(parsedItems);
        } catch (e: unknown) {
          let message = "An error occurred while processing the file.";
          if (e instanceof Error) message = e.message;
          setError(message);
          onItemsChange([]);
          setUploadedFile(null);
        } finally {
          setIsParsing(false);
        }
      };
      reader.onerror = () => {
        setError("Could not read the file. Please try again.");
        setIsParsing(false);
        setUploadedFile(null);
      };
      reader.readAsArrayBuffer(file);
    },
    [onItemsChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) handleFileParse(acceptedFiles[0]);
    },
    [handleFileParse]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
    disabled: isParsing || (!!uploadedFile && !error),
  });

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError(null);
    onItemsChange([]);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {!uploadedFile && !isParsing && !error && (
        <div
          {...getRootProps()}
          className={cn(
            "w-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary-foreground"
              : "border-input hover:border-muted-foreground"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-muted-foreground">
            <UploadCloud className="w-12 h-12 mb-4" />
            <p className="font-semibold">
              Drag and drop a file here, or click to select
            </p>
            <p className="text-sm">
              Only Excel files (.xls, .xlsx) are supported
            </p>
          </div>
        </div>
      )}

      {isParsing && (
        <div className="w-full text-center p-12 border-2 border-dashed border-input rounded-lg">
          <div className="flex flex-col items-center text-muted-foreground">
            <Loader2 className="w-12 h-12 mb-4 animate-spin" />
            <p className="font-semibold">Processing file...</p>
            <p className="text-sm">{uploadedFile?.name}</p>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>File Processing Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-2">
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={handleRemoveFile}
              >
                Upload another file
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {uploadedFile && !isParsing && !error && (
        <div className="mt-6 w-full max-w-md bg-green-50 border border-green-200 p-4 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle2 className="w-6 h-6 text-green-700 mr-3" />
            <div>
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemoveFile}
            title="Remove and re-upload"
          >
            <XCircle className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

// --- LOCAL COMPONENT: PreviewTable (Refactored) ---
const columns: ColumnDef<PackingListItem>[] = [
  { accessorKey: "poNumber", header: "PO Number" },
  { accessorKey: "itemCode", header: "Item Code" },
  { accessorKey: "supplier", header: "Supplier" },
  { accessorKey: "invoiceNo", header: "Invoice No" },
  { accessorKey: "boxNo", header: "Box No" },
  { accessorKey: "lotNo", header: "Lot No" },
  { accessorKey: "quantity", header: "Quantity" },
  { accessorKey: "unit", header: "Unit" },
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
  { accessorKey: "dimensions", header: "Dimensions" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "qrCode", header: "QR Code" },
  { accessorKey: "description", header: "Description" },
];

interface PreviewTableProps {
  items: PackingListItem[];
}

const PreviewTable: React.FC<PreviewTableProps> = ({ items }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Data Preview ({items.length} rows)</CardTitle>
      </CardHeader>
      <CardContent>
        <CustomTable columns={columns} data={items} showCheckbox={false} />
      </CardContent>
    </Card>
  );
};

// --- MAIN PAGE COMPONENT (Refactored) ---
const ImportPackingListFormPagePackaging: React.FC = () => {
  const [items, setItems] = useState<PackingListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleItemsChange = useCallback((newItems: PackingListItem[]) => {
    setItems(newItems);
  }, []);

  const handleSubmit = () => {
    // Business logic remains unchanged
    if (items.length === 0) {
      alert("There are no items to submit.");
      return;
    }
    setIsSubmitting(true);
    console.log("Submitting the following packaging items:", items);
    setTimeout(() => {
      console.log("Submission successful!");
      setIsSubmitting(false);
      setItems([]);
      alert("Inbound packaging shipment created successfully!");
    }, 2000);
  };

  return (
    <>
      <div className="space-y-6 pb-24">
        <div>
          <h1 className="text-2xl font-bold">
            Inbound Packaging from Packing List
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload an Excel file to create a batch inbound packaging shipment.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>1. Upload Packaging Packing List File</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploadZone onItemsChange={handleItemsChange} />
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

export default ImportPackingListFormPagePackaging;
