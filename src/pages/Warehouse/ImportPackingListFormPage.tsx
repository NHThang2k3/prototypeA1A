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

// --- UI COMPONENTS (Giả định đường dẫn) ---
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

// --- CONSTANTS (Định nghĩa nội bộ để tránh lỗi Fast Refresh) ---
const FACTORY_OPTIONS = [
  { value: "Factory A", label: "Factory A" },
  { value: "Factory B", label: "Factory B" },
  { value: "Factory C", label: "Factory C" },
  { value: "Factory D", label: "Factory D" },
];

// --- TYPE DEFINITIONS (Export type vẫn an toàn với Fast Refresh) ---
export interface PackingListItem {
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

// --- SUB-COMPONENT: ACTION TOOLBAR ---
interface ActionToolbarProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  totalItems: number;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onSubmit,
  isSubmitting,
  totalItems,
}) => {
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

// --- SUB-COMPONENT: FILE UPLOAD ZONE ---
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
  selectedFactory: string;
}

const headerMapping: {
  [key: string]: keyof Omit<PackingListItem, "id" | "factory">;
} = {
  "PO Number": "poNumber",
  "Item Code": "itemCode",
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
  selectedFactory,
}) => {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);

  // Fix ESLint: Truyền factory vào tham số để hàm không phụ thuộc state bên ngoài
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
            if (!sheetName) throw new Error("Excel file has no sheets.");
            const worksheet = workbook.Sheets[sheetName];

            // Fix ESLint: Loại bỏ eslint-disable thừa
            const json: Record<string, unknown>[] = XLSX.utils.sheet_to_json(
              worksheet,
              {
                raw: false,
                defval: "",
              }
            );

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
                  id: `${file.name}-${index}-${Date.now()}`,
                  factory: factoryToUse,
                };

                for (const header of requiredHeaders) {
                  const key = headerMapping[header] as keyof PackingListItem;
                  const value = row[header];

                  if (
                    key === "yards" ||
                    key === "netWeight" ||
                    key === "grossWeight"
                  ) {
                    const numValue = parseFloat(String(value));
                    newItem[key] = isNaN(numValue) ? 0 : numValue;
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
    },
    [] // Không còn phụ thuộc vào selectedFactory
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!selectedFactory) {
        return;
      }

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
        // Truyền selectedFactory vào hàm parseFile tại thời điểm gọi
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
    multiple: true,
    disabled: !selectedFactory,
  });

  const handleRemoveFile = (fileName: string) => {
    setProcessedFiles((prev) => prev.filter((pf) => pf.file.name !== fileName));
    onFileRemoved(fileName);
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
            : "border-input hover:border-primary/50",
          processedFiles.length > 0 && "mb-0"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-muted-foreground">
          <UploadCloud className="w-10 h-10 mb-3" />
          <p className="font-semibold text-foreground">
            {!selectedFactory
              ? "Please select a Factory first"
              : "Drag & drop files here, or click to select"}
          </p>
          <p className="text-xs mt-1">Supports .xlsx, .xls</p>
        </div>
      </div>

      {processedFiles.length > 0 && (
        <div className="w-full space-y-3">
          {processedFiles.map(({ file, status, error }) => (
            <div
              key={file.name}
              className={cn(
                "w-full p-3 rounded-md border flex items-center justify-between text-sm",
                status === "success" && "bg-green-50/50 border-green-200",
                status === "error" && "bg-red-50/50 border-red-200"
              )}
            >
              <div className="flex items-center overflow-hidden gap-3">
                <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-grow overflow-hidden">
                  <p className="font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  {status === "error" && (
                    <p className="text-xs text-red-600 mt-0.5">{error}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {status === "parsing" && (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                )}
                {status === "success" && (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                )}
                {status === "error" && (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleRemoveFile(file.name)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- PREVIEW TABLE ---
const columns: ColumnDef<PackingListItem>[] = [
  { accessorKey: "poNumber", header: "PO Number" },
  { accessorKey: "itemCode", header: "Item Code" },
  { accessorKey: "factory", header: "Factory" },
  { accessorKey: "invoiceNo", header: "Invoice No" },
  { accessorKey: "color", header: "Color" },
  {
    accessorKey: "yards",
    header: "Yards",
    cell: ({ row }) => row.original.yards.toFixed(2),
  },
  {
    accessorKey: "netWeight",
    header: "Net (Kgs)",
    cell: ({ row }) => row.original.netWeight.toFixed(2),
  },
  { accessorKey: "dateInHouse", header: "Date In House" },
];

const PreviewTable: React.FC<{ items: PackingListItem[] }> = ({ items }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg">Data Preview</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <CustomTable columns={columns} data={items} showCheckbox={false} />
      </CardContent>
    </Card>
  );
};

// --- MAIN PAGE COMPONENT ---
interface ImportPackingListFormPageProps {
  onSuccess?: () => void;
}

const ImportPackingListFormPage: React.FC<ImportPackingListFormPageProps> = ({
  onSuccess,
}) => {
  const [items, setItems] = useState<PackingListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState<string>("");

  const handleFileAdded = useCallback((newItems: PackingListItem[]) => {
    setItems((prevItems) => [...prevItems, ...newItems]);
  }, []);

  const handleFileRemoved = useCallback((fileName: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !item.id.startsWith(`${fileName}-`))
    );
  }, []);

  const handleSubmit = () => {
    if (items.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Submitting items to API:", items);
      setIsSubmitting(false);
      setItems([]);
      alert(
        `Successfully imported ${items.length} items for ${selectedFactory}!`
      );
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">
            1. Select Factory & Upload
          </h2>

          <div className="mb-4 max-w-xs space-y-2">
            <Label>
              Target Factory <span className="text-red-500">*</span>
            </Label>
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
          <div>
            <PreviewTable items={items} />
          </div>
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
