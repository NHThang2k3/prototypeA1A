import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileText,
  Loader2,
  XCircle,

} from "lucide-react";
import * as XLSX from "xlsx";
import { ColumnDef } from "@tanstack/react-table";

// --- UI COMPONENTS ---
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CustomTable } from "@/components/ui/custom-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// --- CONSTANTS ---
const FACTORY_OPTIONS = [
  { value: "Factory A", label: "Factory A" },
  { value: "Factory B", label: "Factory B" },
  { value: "Factory C", label: "Factory C" },
  { value: "Factory D", label: "Factory D" },
];

// --- TYPE DEFINITIONS ---
export interface PackingListItem {
  id: string;
  factory: string;
  // Các cột theo yêu cầu
  p: string;           // p
  invoiceNo: string;   // INVOICE
  supplier: string;    // SUP
  poNumber: string;    // Po
  itemCode: string;    // Item
  color: string;       // Color
  lotNo: string;       // Batch
  rollNo: string;      // ROLL
  yards: number;       // YDS
  netWeight: number;   // N.W
  width: string;       // Width Sticker
  foc: string;         // FOC
  qc: string;          // QC
  netWeight2: number;  // N.W2
  grossWeight: number; // G.W
  dateInHouse: string; // Date
}

// --- SUB-COMPONENT: ACTION TOOLBAR ---
const ActionToolbar: React.FC<{
  onSubmit: () => void;
  isSubmitting: boolean;
  totalItems: number;
}> = ({ onSubmit, isSubmitting, totalItems }) => {
  return (
    <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t p-4 z-10 mt-auto">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Total items to import:{" "}
          <span className="font-medium text-foreground">{totalItems}</span>
        </div>
        <Button onClick={onSubmit} disabled={isSubmitting || totalItems === 0}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Importing..." : "Confirm Import"}
        </Button>
      </div>
    </div>
  );
};

// --- CONFIG MAPPING ---
// Key: Tên biến - Value: Mảng các tên header trong Excel có thể chấp nhận
const columnConfig: Record<keyof Omit<PackingListItem, "id" | "factory">, string[]> = {
  p: ["p", "P"],
  invoiceNo: ["INVOICE", "Invoice No"],
  supplier: ["SUP", "Supplier"],
  poNumber: ["Po", "PO", "Po No"],
  itemCode: ["Item", "Item Code"],
  color: ["Color", "Colour"],
  lotNo: ["Batch", "Lot No", "Lot"],
  rollNo: ["ROLL", "Roll No"],
  yards: ["YDS", "Yds", "Yards"],
  netWeight: ["N.W", "Net Weight"],
  width: ["Width Sticker", "Width", "WIDTH"],
  foc: ["FOC", "Foc"],
  qc: ["QC", "Qc"],
  netWeight2: ["N.W2", "NW2"],
  grossWeight: ["G.W", "Gross Weight"],
  dateInHouse: ["Date", "Date In House"],
};

const FileUploadZone: React.FC<{
  onFileAdded: (items: PackingListItem[]) => void;
  onFileRemoved: (fileName: string) => void;
  selectedFactory: string;
}> = ({ onFileAdded, onFileRemoved, selectedFactory }) => {
  const [processedFiles, setProcessedFiles] = useState<any[]>([]);

  const parseFile = useCallback(
    async (file: File, factoryToUse: string): Promise<PackingListItem[]> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = event.target?.result;
            if (!data) throw new Error("Could not read file.");
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const json: any[] = XLSX.utils.sheet_to_json(worksheet, {
              raw: false,
              defval: "",
            });

            if (json.length === 0) throw new Error("File has no data.");

            const fileHeaders = Object.keys(json[0] || {});

            // Helper tìm header
            const findHeaderInFile = (possibleHeaders: string[]) => {
              return fileHeaders.find(
                (fh) =>
                  possibleHeaders.some(
                    (ph) => fh.trim().toLowerCase() === ph.toLowerCase()
                  ) ||
                  (possibleHeaders.includes("Width Sticker") &&
                    fh.includes("Width"))
              );
            };

            const parsedItems: PackingListItem[] = json
              .map((row: any, index) => {
                // Bỏ qua dòng trống
                if (Object.values(row).every((val) => !val)) return null;

                const newItem: any = {
                  id: `${file.name}-${index}-${Date.now()}`,
                  factory: factoryToUse,
                };

                // Mapping fields
                (Object.keys(columnConfig) as (keyof typeof columnConfig)[]).forEach(
                  (key) => {
                    const headerInFile = findHeaderInFile(columnConfig[key]);
                    const value = headerInFile ? row[headerInFile] : "";

                    // Xử lý dữ liệu số
                    if (
                      ["yards", "netWeight", "netWeight2", "grossWeight"].includes(key)
                    ) {
                      const numValue = parseFloat(String(value).replace(/,/g, ""));
                      newItem[key] = isNaN(numValue) ? 0 : numValue;
                    } else {
                      newItem[key] = String(value ?? "").trim();
                    }
                  }
                );

                return newItem as PackingListItem;
              })
              .filter((item): item is PackingListItem => item !== null);

            resolve(parsedItems);
          } catch (e: unknown) {
            reject(new Error(e instanceof Error ? e.message : "Error parsing file"));
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    []
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!selectedFactory) return;
      const newFiles = acceptedFiles.filter(
        (f) => !processedFiles.some((pf) => pf.file.name === f.name)
      );

      newFiles.forEach((file) => {
        setProcessedFiles((prev) => [
          ...prev,
          { file, status: "parsing", parsedItems: [] },
        ]);
        parseFile(file, selectedFactory)
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
          .catch((error) => {
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
    [processedFiles, onFileAdded, selectedFactory, parseFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    disabled: !selectedFactory,
  });

  const handleRemove = (name: string) => {
    setProcessedFiles((prev) => prev.filter((pf) => pf.file.name !== name));
    onFileRemoved(name);
  };

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors bg-muted/20",
          !selectedFactory ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          isDragActive && selectedFactory
            ? "border-primary bg-primary/10"
            : "border-input hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-muted-foreground">
          <UploadCloud className="w-10 h-10 mb-3" />
          <p className="font-semibold text-foreground">
            {!selectedFactory
              ? "Select Factory first"
              : "Drag & drop Excel file here"}
          </p>
        </div>
      </div>
      {processedFiles.length > 0 && (
        <div className="w-full space-y-2">
          {processedFiles.map(({ file, status, error }) => (
            <div
              key={file.name}
              className={cn(
                "w-full p-2 px-3 rounded-md border flex items-center justify-between text-sm",
                status === "error" && "bg-red-50 border-red-200",
                status === "success" && "bg-green-50 border-green-200"
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="truncate">{file.name}</span>
                {status === "error" && (
                  <span className="text-red-600 text-xs">({error})</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleRemove(file.name)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- PREVIEW TABLE (Strict Order) ---
const columns: ColumnDef<PackingListItem>[] = [
  { accessorKey: "p", header: "p" },
  { accessorKey: "invoiceNo", header: "INVOICE" },
  { accessorKey: "supplier", header: "SUP" },
  { accessorKey: "poNumber", header: "Po" },
  { accessorKey: "itemCode", header: "Item" },
  { accessorKey: "color", header: "Color" },
  { accessorKey: "lotNo", header: "Batch" },
  { accessorKey: "rollNo", header: "ROLL" },
  {
    accessorKey: "yards",
    header: "YDS",
    cell: ({ row }) => row.original.yards.toFixed(2),
  },
  {
    accessorKey: "netWeight",
    header: "N.W",
    cell: ({ row }) => row.original.netWeight.toFixed(2),
  },
  { accessorKey: "width", header: "Width Sticker" },
  { accessorKey: "foc", header: "FOC" },
  { accessorKey: "qc", header: "QC" },
  {
    accessorKey: "netWeight2",
    header: "N.W2",
    cell: ({ row }) => row.original.netWeight2.toFixed(2),
  },
  {
    accessorKey: "grossWeight",
    header: "G.W",
    cell: ({ row }) => row.original.grossWeight.toFixed(2),
  },
  { accessorKey: "dateInHouse", header: "Date" },
];

const ImportPackingListFormPage: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const [items, setItems] = useState<PackingListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState<string>("");

  const handleFileAdded = useCallback((newItems: PackingListItem[]) => {
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const handleFileRemoved = useCallback((fileName: string) => {
    setItems((prev) =>
      prev.filter((item) => !item.id.startsWith(`${fileName}-`))
    );
  }, []);

  const handleSubmit = () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      console.log(items);
      setIsSubmitting(false);
      setItems([]);
      alert("Import Success!");
      if (onSuccess) onSuccess();
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">
            1. Select Factory & Upload
          </h2>
          <div className="mb-4 max-w-xs space-y-2">
            <Label>Target Factory *</Label>
            <Select value={selectedFactory} onValueChange={setSelectedFactory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a factory..." />
              </SelectTrigger>
              <SelectContent>
                {FACTORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <FileUploadZone
            onFileAdded={handleFileAdded}
            onFileRemoved={handleFileRemoved}
            selectedFactory={selectedFactory}
          />
        </div>
        {items.length > 0 && (
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">Data Preview</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <CustomTable columns={columns} data={items} showCheckbox={false} />
            </CardContent>
          </Card>
        )}
      </div>
      <ActionToolbar
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        totalItems={items.length}
      />
    </div>
  );
};

export default ImportPackingListFormPage;