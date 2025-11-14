// Filename: MasterPlanPage.tsx

import React, { useState, type FC, useMemo } from "react";
import {
  UploadCloud,
  X,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  FileUp,
  Search,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { CustomTable } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ============================================================================
// --- SECTION 1: TYPES, HELPERS, DATA ---
// ============================================================================

type ExcelCellValue = string | number | Date | null | undefined;
type ExcelRow = Record<string, ExcelCellValue>;
type ImportStatus =
  | "idle"
  | "parsing"
  | "preview"
  | "importing"
  | "success"
  | "error";

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const renderCell = (value: ExcelCellValue): React.ReactNode => {
  if (value instanceof Date) {
    return value
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .replace(/ /g, "-");
  }
  if (typeof value === "number") {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return value === null || typeof value === "undefined" ? "" : String(value);
};

const fullHeaders = [
  "Receive\nFab date",
  "JOB",
  "ITEM",
  "COLOR CODE",
  "Color",
  "Requested\nQty",
  "Qty (Inet)\n(yds)",
  "MAY\nMORGAN",
  "Update's Store",
  "Update's QC",
  "Inform Marker_1",
  "Inform Marker_2",
  "Inform Pattern",
  "LC",
  "Fabric Arrival Date",
];
const initialMasterPlanData: ExcelRow[] = [
  {
    "Receive\nFab date": "10-Jul",
    JOB: "INITIAL/001",
    ITEM: "70000000-00",
    "COLOR CODE": "INIT",
    Color: "INITIAL_COLOR",
    "Requested\nQty": "Deducted",
    "Qty (Inet)\n(yds)": 500.0,
    "Update's Store": "OK",
    LC: new Date("2024-01-01"),
    "Fabric Arrival Date": new Date("2024-02-01"),
  },
  {
    "Receive\nFab date": "11-Jul",
    JOB: "INITIAL/002",
    ITEM: "70000000-01",
    "COLOR CODE": "INIT",
    Color: "INITIAL_COLOR_2",
    "Requested\nQty": "Reserved",
    "Qty (Inet)\n(yds)": 1200.0,
    "Update's Store": "WAIT F3",
    LC: new Date("2024-01-02"),
    "Fabric Arrival Date": new Date("2024-02-02"),
  },
  {
    "Receive\nFab date": "15-Jul",
    JOB: "AA2509/00619",
    ITEM: "70016157-53",
    "COLOR CODE": "095A",
    Color: "BLACK",
    "Requested\nQty": "Deducted",
    "Qty (Inet)\n(yds)": 2000.0,
    "Update's Store": "WAIT F3",
    LC: new Date("2025-04-11"),
    "Fabric Arrival Date": "#N/A",
  },
  {
    "Receive\nFab date": "T3",
    JOB: "AA2509/00045",
    ITEM: "70038357-68",
    "COLOR CODE": "AAG4/046A",
    Color: "HI-RES BLUE S18/BOLD BLUE",
    "Requested\nQty": "Reserved physical",
    "Qty (Inet)\n(yds)": 2000.0,
    "Update's Store": "OK",
    LC: new Date("2024-11-29"),
    "Fabric Arrival Date": new Date("2025-05-16"),
  },
  {
    "Receive\nFab date": "20-Aug",
    JOB: "BB2510/00123",
    ITEM: "70045678-90",
    "COLOR CODE": "BBLK",
    Color: "BASIC BLACK",
    "Requested\nQty": "Deducted",
    "Qty (Inet)\n(yds)": 750.5,
    "Update's Store": "Pending QC",
    LC: new Date("2025-01-15"),
    "Fabric Arrival Date": new Date("2025-06-20"),
  },
];
const importedExcelData: ExcelRow[] = [
  {
    "Receive\nFab date": "15-Jul",
    JOB: "AA2509/00619",
    ITEM: "70016157-53",
    "COLOR CODE": "095A",
    Color: "BLACK",
    "Requested\nQty": "Deducted",
    "Qty (Inet)\n(yds)": 2000.0,
    "Update's Store": "WAIT F3",
    LC: new Date("2025-04-11"),
    "Fabric Arrival Date": "#N/A",
  },
  {
    "Receive\nFab date": "T3",
    JOB: "AA2509/00045",
    ITEM: "70038357-68",
    "COLOR CODE": "AAG4/046A",
    Color: "HI-RES BLUE S18/BOLD BLUE",
    "Requested\nQty": "Reserved physical",
    "Qty (Inet)\n(yds)": 2000.0,
    "Update's Store": "OK",
    LC: new Date("2024-11-29"),
    "Fabric Arrival Date": new Date("2025-05-16"),
  },
];
const mockFile = new File(["mock content"], "master_plan_data.xlsx", {
  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});
const generateColumns = (headers: string[]): ColumnDef<ExcelRow>[] =>
  headers.map((header) => ({
    accessorKey: header,
    header: () => <div className="whitespace-pre-wrap">{header}</div>,
    cell: ({ getValue }) => renderCell(getValue() as ExcelCellValue),
  }));

// ============================================================================
// --- SECTION 2: MODAL CONTENT COMPONENT ---
// ============================================================================

interface ImportModalContentProps {
  importStatus: ImportStatus;
  isDragging?: boolean;
  errorMessage?: string;
  selectedFile?: File | null;
  previewColumns?: ColumnDef<ExcelRow>[];
  previewData?: ExcelRow[];
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onReset?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const ImportModalContent: FC<ImportModalContentProps> = ({
  importStatus,
  isDragging = false,
  errorMessage = "",
  selectedFile = null,
  previewColumns = [],
  previewData = [],
  onFileChange = () => {},
  onDrop = () => {},
  onDragEnter = () => {},
  onDragLeave = () => {},
  onReset = () => {},
  onCancel = () => {},
  onConfirm = () => {},
}) => {
  switch (importStatus) {
    case "parsing":
    case "importing":
      return (
        <div className="text-center flex flex-col items-center justify-center space-y-4 h-64">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <h3 className="text-xl font-semibold">
            {importStatus === "parsing"
              ? "Parsing file..."
              : "Updating Master Plan..."}
          </h3>
          <p className="text-muted-foreground">Please wait a moment.</p>
        </div>
      );
    case "success":
      return (
        <div className="text-center flex flex-col items-center justify-center space-y-4 h-64">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <h3 className="text-xl font-semibold">Import Successful!</h3>
          <p className="text-muted-foreground">
            The Master Plan data has been updated.
          </p>
        </div>
      );
    case "preview":
      return (
        <div className="w-full flex flex-col space-y-4">
          {selectedFile && (
            <div className="bg-muted p-3 rounded-lg border flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button onClick={onReset} variant="ghost" size="icon">
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          <div className="max-h-[40vh] overflow-y-auto">
            <CustomTable
              columns={previewColumns}
              data={previewData}
              showCheckbox={false}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>Confirm & Update</Button>
          </DialogFooter>
        </div>
      );
    default: // idle or error
      return (
        <>
          <div
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`border-2 border-dashed rounded-lg p-8 w-full text-center transition-colors duration-300 ${
              isDragging
                ? "border-primary bg-primary-foreground"
                : "border-border"
            }`}
          >
            <Label
              htmlFor="file-upload-showcase"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <p className="text-lg font-semibold">
                Drag and drop your Excel file here
              </p>
              <p className="text-muted-foreground">or</p>
              <Button asChild>
                <span className="font-bold">Choose File</span>
              </Button>
              <Input
                id="file-upload-showcase"
                type="file"
                className="hidden"
                onChange={onFileChange}
                accept=".xlsx, .xls"
              />
            </Label>
          </div>
          {importStatus === "error" && errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upload Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
              <Button variant="link" className="p-0 h-auto" onClick={onReset}>
                Try Again
              </Button>
            </Alert>
          )}
        </>
      );
  }
};

// ============================================================================
// --- SECTION 3: CONTROLLABLE COMPONENT ---
// ============================================================================

const ControllableMasterPlanPage: FC = () => {
  const masterPlanColumns = useMemo(() => generateColumns(fullHeaders), []);
  const [masterPlanData] = useState<ExcelRow[]>(initialMasterPlanData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const previewColumns = useMemo(() => generateColumns(fullHeaders), []);
  const [previewData, setPreviewData] = useState<ExcelRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");

  const storeStatusOptions = useMemo(() => {
    const statuses = new Set(
      masterPlanData
        .map((row) => row["Update's Store"] as string)
        .filter(Boolean)
    );
    return ["all", ...Array.from(statuses)];
  }, [masterPlanData]);

  const filteredData = useMemo(() => {
    let data = [...masterPlanData];

    // Apply store status filter
    if (storeFilter !== "all") {
      data = data.filter((row) => row["Update's Store"] === storeFilter);
    }

    // Apply global search term
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      data = data.filter((row) =>
        Object.values(row).some((cellValue) =>
          String(cellValue).toLowerCase().includes(lowercasedTerm)
        )
      );
    }

    return data;
  }, [masterPlanData, searchTerm, storeFilter]);

  const resetImportState = () => {
    setImportStatus("idle");
    setErrorMessage("");
    setSelectedFile(null);
    setPreviewData([]);
  };
  const handleOpenModal = () => {
    resetImportState();
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      setSelectedFile(file);
      setPreviewData(importedExcelData);
      setImportStatus("preview");
    } else {
      setErrorMessage(
        "Invalid file type. Please upload an Excel file (.xlsx, .xls)."
      );
      setImportStatus("error");
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0)
      handleFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0)
      handleFile(e.target.files[0]);
  };
  const handleConfirm = () => {
    setImportStatus("importing");
    setTimeout(() => {
      setImportStatus("success");
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="w-full bg-card p-6 sm:p-8 rounded-xl">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Master Plan</h1>
          <Button onClick={handleOpenModal}>
            <FileUp className="mr-2 w-5 h-5" /> Import Master Plan
          </Button>
        </header>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label htmlFor="store-filter" className="whitespace-nowrap">
              Store Status:
            </Label>
            <Select value={storeFilter} onValueChange={setStoreFilter}>
              <SelectTrigger id="store-filter" className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {storeStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Statuses" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <main>
          <CustomTable
            columns={masterPlanColumns}
            data={filteredData}
            showCheckbox={false}
          />
        </main>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Import Master Plan Data</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0 overflow-y-auto flex-grow">
            <ImportModalContent
              importStatus={importStatus}
              isDragging={isDragging}
              errorMessage={errorMessage}
              selectedFile={selectedFile}
              previewColumns={previewColumns}
              previewData={previewData}
              onFileChange={handleFileChange}
              onDrop={handleDrop}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onReset={resetImportState}
              onCancel={handleCloseModal}
              onConfirm={handleConfirm}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ============================================================================
// --- SECTION 4: THE SHOWCASE PAGE ---
// ============================================================================

const StateCard: FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="relative">{children}</div>
    </CardContent>
  </Card>
);

// This wrapper now provides a consistent visual container for the static content
const StaticModalView: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative w-full min-h-[500px] bg-white rounded-lg flex flex-col border">
    {/* Header giả lập, không dùng DialogHeader/DialogTitle */}
    <div className="p-6 pb-4 border-b">
      <h3 className="text-lg font-semibold leading-none tracking-tight">
        Import Master Plan Data
      </h3>
    </div>
    {/* Nội dung chính */}
    <div className="p-6 overflow-y-auto flex-grow">{children}</div>
  </div>
);

const MasterPlanPage = () => {
  const previewColumns = useMemo(() => generateColumns(fullHeaders), []);

  return (
    <div className="bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-screen-2xl mx-auto space-y-16">
        <section>
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-purple-500">
            Main Page (Default State)
          </h2>
          <div className="rounded-xl shadow-2xl overflow-hidden border">
            <ControllableMasterPlanPage />
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-teal-500">
            Import Popup States (Static Views)
          </h2>
          <div className="grid grid-cols-1 gap-8">
            <StateCard title="1. Ready to Upload (Idle)">
              <StaticModalView>
                <ImportModalContent importStatus="idle" />
              </StaticModalView>
            </StateCard>
            <StateCard title="2. Dragging File Over">
              <StaticModalView>
                <ImportModalContent importStatus="idle" isDragging={true} />
              </StaticModalView>
            </StateCard>
            <StateCard title="3. Upload Error">
              <StaticModalView>
                <ImportModalContent
                  importStatus="error"
                  errorMessage="Invalid file format. Please use the template file."
                />
              </StaticModalView>
            </StateCard>
            <StateCard title="4. Processing File (Parsing...)">
              <StaticModalView>
                <ImportModalContent importStatus="parsing" />
              </StaticModalView>
            </StateCard>
            <StateCard title="5. Data Preview">
              <StaticModalView>
                <ImportModalContent
                  importStatus="preview"
                  selectedFile={mockFile}
                  previewColumns={previewColumns}
                  previewData={importedExcelData}
                />
              </StaticModalView>
            </StateCard>
            <StateCard title="6. Updating Data (Importing...)">
              <StaticModalView>
                <ImportModalContent importStatus="importing" />
              </StaticModalView>
            </StateCard>
            <StateCard title="7. Update Successful (Success)">
              <StaticModalView>
                <ImportModalContent importStatus="success" />
              </StaticModalView>
            </StateCard>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MasterPlanPage;
