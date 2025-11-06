// Filename: CuttingWeeklyDailyPlanPage.tsx

import React, { useState, type FC, useMemo } from "react";
import {
  UploadCloud,
  X,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  FileUp,
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

// ============================================================================
// --- SECTION 1: TYPES, HELPERS, DATA (KHÔNG THAY ĐỔI) ---
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
    const day = value.getDate().toString().padStart(2, "0");
    const month = value.toLocaleString("en-US", { month: "short" });
    const year = value.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }
  if (typeof value === "number") {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
  if (value === null || typeof value === "undefined") {
    return "";
  }
  return String(value);
};

const fullHeaders = [
  "Cut Date",
  "Job",
  "Style Code",
  "Inform Marker",
  "PO",
  "Quantity (pcs)",
  "Plan (pcs)",
  "Color",
  "Sewing Start",
  "Decoration",
  "Ship Date",
  "Remark",
  "Line",
  "Total Fabric (Yds)",
];
const initialWeeklyDailyPlanData: ExcelRow[] = [
  {
    "Cut Date": "3-Sep",
    Job: "AA2506/00013",
    "Style Code": "S2506GHTT412WN",
    "Inform Marker": null,
    PO: "all",
    "Quantity (pcs)": 1672,
    "Plan (pcs)": 1672,
    Color: "all",
    "Sewing Start": "5-Sep",
    Decoration: "HE3,PD1",
    "Ship Date": "12-Sep",
    Remark: null,
    Line: "F2A18",
    "Total Fabric (Yds)": 1386,
  },
  {
    "Cut Date": "4-Sep",
    Job: "AA2509/00617",
    "Style Code": "S2606CHJT104W",
    "Inform Marker": null,
    PO: "all",
    "Quantity (pcs)": 1218,
    "Plan (pcs)": 1218,
    Color: "all",
    "Sewing Start": "6-Sep",
    Decoration: "HE3",
    "Ship Date": "13-Sep",
    Remark: null,
    Line: "F2A06",
    "Total Fabric (Yds)": 579,
  },
];
const importedExcelData: ExcelRow[] = [
  {
    Job: "AA2509/01390",
    "Style Code": "S2606GHTT428Y",
    "Inform Marker": null,
    PO: "all",
    "Quantity (pcs)": 3909,
    "Plan (pcs)": 3909,
    Color: "all",
    "Sewing Start": "30-Aug",
    Decoration: "HE1&EMB1&PD1",
    "Ship Date": "13-Sep",
    Remark: "0",
    Line: "F2A07",
    "Total Fabric (Yds)": 4794,
  },
  {
    Job: "AA2509/01353",
    "Style Code": "S2602M907P",
    "Inform Marker": null,
    PO: "all",
    "Quantity (pcs)": 66,
    "Plan (pcs)": 66,
    Color: "all",
    "Sewing Start": "3-Sep",
    Decoration: "bonding10&HE18&PD1&pr1&Sublimation pr1",
    "Ship Date": "13-Sep",
    Remark: null,
    Line: "F2-PPA2",
    "Total Fabric (Yds)": 109,
  },
];
const mockFile = new File(["mock content"], "cutting_plan_data.xlsx", {
  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});
const generateColumns = (headers: string[]): ColumnDef<ExcelRow>[] =>
  headers.map((header) => ({
    accessorKey: header,
    header: header,
    cell: ({ getValue }) => renderCell(getValue() as ExcelCellValue),
  }));

// ============================================================================
// --- SECTION 2: NEW - MODAL CONTENT COMPONENT ---
// ============================================================================

interface ImportCuttingPlanModalContentProps {
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

const ImportCuttingPlanModalContent: FC<ImportCuttingPlanModalContentProps> = ({
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
          {" "}
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />{" "}
          <h3 className="text-xl font-semibold">
            {" "}
            {importStatus === "parsing"
              ? "Parsing file..."
              : "Updating Cutting Plan..."}{" "}
          </h3>{" "}
          <p className="text-muted-foreground">Please wait a moment.</p>{" "}
        </div>
      );
    case "success":
      return (
        <div className="text-center flex flex-col items-center justify-center space-y-4 h-64">
          {" "}
          <CheckCircle className="w-16 h-16 text-green-500" />{" "}
          <h3 className="text-xl font-semibold">Import Successful!</h3>{" "}
          <p className="text-muted-foreground">
            The Cutting Plan data has been updated.
          </p>{" "}
        </div>
      );
    case "preview":
      return (
        <div className="w-full flex flex-col space-y-4">
          {selectedFile && (
            <div className="bg-muted p-3 rounded-lg border flex items-center justify-between text-sm">
              {" "}
              <div className="flex items-center gap-3">
                {" "}
                <FileSpreadsheet className="w-6 h-6 text-green-600" />{" "}
                <div>
                  {" "}
                  <p className="font-semibold">{selectedFile.name}</p>{" "}
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(selectedFile.size)}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <Button onClick={onReset} variant="ghost" size="icon">
                {" "}
                <X className="w-4 h-4" />{" "}
              </Button>{" "}
            </div>
          )}
          <div className="max-h-[40vh] overflow-y-auto">
            {" "}
            <CustomTable
              columns={previewColumns}
              data={previewData}
              showCheckbox={false}
            />{" "}
          </div>
          <DialogFooter className="pt-4">
            {" "}
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>{" "}
            <Button onClick={onConfirm}>Confirm & Update</Button>{" "}
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
            {" "}
            <Label
              htmlFor="file-upload-cutting-plan"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              {" "}
              <UploadCloud className="w-12 h-12 text-muted-foreground" />{" "}
              <p className="text-lg font-semibold">
                Drag and drop your Excel file here
              </p>{" "}
              <p className="text-muted-foreground">or</p>{" "}
              <Button asChild>
                <span className="font-bold">Choose File</span>
              </Button>{" "}
              <Input
                id="file-upload-cutting-plan"
                type="file"
                className="hidden"
                onChange={onFileChange}
                accept=".xlsx, .xls"
              />{" "}
            </Label>{" "}
          </div>
          {importStatus === "error" && errorMessage && (
            <Alert variant="destructive" className="mt-4">
              {" "}
              <AlertCircle className="h-4 w-4" />{" "}
              <AlertTitle>Upload Error</AlertTitle>{" "}
              <AlertDescription>{errorMessage}</AlertDescription>{" "}
              <Button variant="link" className="p-0 h-auto" onClick={onReset}>
                Try Again
              </Button>{" "}
            </Alert>
          )}
        </>
      );
  }
};

// ============================================================================
// --- SECTION 3: REFACTORED - MAIN INTERACTIVE COMPONENT ---
// ============================================================================

const ControllableCuttingPlanPage: FC = () => {
  const planColumns = useMemo(() => generateColumns(fullHeaders), []);
  const [planData] = useState<ExcelRow[]>(initialWeeklyDailyPlanData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const previewColumns = useMemo(() => generateColumns(fullHeaders), []);
  const [previewData, setPreviewData] = useState<ExcelRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

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
        <header className="flex justify-between items-center mb-6">
          {" "}
          <h1 className="text-2xl sm:text-3xl font-bold">
            {" "}
            Cutting Weekly/Daily Plan{" "}
          </h1>{" "}
          <Button onClick={handleOpenModal}>
            {" "}
            <FileUp className="mr-2 w-5 h-5" /> Import Cutting Plan{" "}
          </Button>{" "}
        </header>
        <main>
          {" "}
          <CustomTable
            columns={planColumns}
            data={planData}
            showCheckbox={false}
          />{" "}
        </main>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Import Cutting Plan Data</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0 overflow-y-auto flex-grow">
            <ImportCuttingPlanModalContent
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
// --- SECTION 4: REFACTORED - THE SHOWCASE PAGE ---
// ============================================================================

const StateCard: FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <Card>
    {" "}
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>{" "}
    <CardContent>
      <div className="relative">{children}</div>
    </CardContent>{" "}
  </Card>
);

const StaticModalView: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative w-full min-h-[500px] bg-white rounded-lg flex flex-col border">
    <div className="p-6 pb-4 border-b">
      {" "}
      <h3 className="text-lg font-semibold leading-none tracking-tight">
        {" "}
        Import Cutting Plan Data{" "}
      </h3>{" "}
    </div>
    <div className="p-6 overflow-y-auto flex-grow">{children}</div>
  </div>
);

const CuttingWeeklyDailyPlanPage = () => {
  const previewColumns = useMemo(() => generateColumns(fullHeaders), []);

  return (
    <div className="bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-screen-2xl mx-auto space-y-16">
        <section>
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-blue-500">
            {" "}
            Main Page (Default State){" "}
          </h2>
          <div className="rounded-xl shadow-2xl overflow-hidden border">
            {" "}
            <ControllableCuttingPlanPage />{" "}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-green-500">
            {" "}
            Import Popup States (Static Views){" "}
          </h2>
          <div className="grid grid-cols-1  gap-8">
            <StateCard title="1. Ready to Upload (Idle)">
              {" "}
              <StaticModalView>
                {" "}
                <ImportCuttingPlanModalContent importStatus="idle" />{" "}
              </StaticModalView>{" "}
            </StateCard>
            <StateCard title="2. Dragging File Over">
              {" "}
              <StaticModalView>
                {" "}
                <ImportCuttingPlanModalContent
                  importStatus="idle"
                  isDragging={true}
                />{" "}
              </StaticModalView>{" "}
            </StateCard>
            <StateCard title="3. Upload Error (Error State)">
              {" "}
              <StaticModalView>
                {" "}
                <ImportCuttingPlanModalContent
                  importStatus="error"
                  errorMessage="File error: Invalid format. Please select an .xlsx file."
                />{" "}
              </StaticModalView>{" "}
            </StateCard>
            <StateCard title="4. Processing File (Parsing...)">
              {" "}
              <StaticModalView>
                {" "}
                <ImportCuttingPlanModalContent importStatus="parsing" />{" "}
              </StaticModalView>{" "}
            </StateCard>
            <StateCard title="5. Previewing Data (Preview)">
              {" "}
              <StaticModalView>
                {" "}
                <ImportCuttingPlanModalContent
                  importStatus="preview"
                  selectedFile={mockFile}
                  previewColumns={previewColumns}
                  previewData={importedExcelData}
                />{" "}
              </StaticModalView>{" "}
            </StateCard>
            <StateCard title="6. Updating Data (Importing...)">
              {" "}
              <StaticModalView>
                {" "}
                <ImportCuttingPlanModalContent importStatus="importing" />{" "}
              </StaticModalView>{" "}
            </StateCard>
            <StateCard title="7. Update Successful (Success)">
              {" "}
              <StaticModalView>
                {" "}
                <ImportCuttingPlanModalContent importStatus="success" />{" "}
              </StaticModalView>{" "}
            </StateCard>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CuttingWeeklyDailyPlanPage;
