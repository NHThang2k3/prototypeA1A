// Filename: CuttingWeeklyDailyPlanPage.tsx
// Dependencies: react, lucide-react, tailwindcss

import React, { useState, type FC } from "react";
import {
  UploadCloud,
  X,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  FileUp,
} from "lucide-react";

// ============================================================================
// --- SECTION 1: TYPES, HELPERS, DATA & REUSABLE COMPONENTS ---
// ============================================================================

// --- Types ---
type ExcelCellValue = string | number | Date | null | undefined;
type ExcelRow = Record<string, ExcelCellValue>;
type ImportStatus =
  | "idle"
  | "parsing"
  | "preview"
  | "importing"
  | "success"
  | "error";

// --- Helper Functions ---
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

// --- Reusable DataTable Component ---
interface DataTableProps {
  headers: string[];
  data: ExcelRow[];
}

const DataTable: FC<DataTableProps> = ({ headers, data }) => {
  if (headers.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">No data to display.</p>
    );
  }
  return (
    <div className="w-full overflow-x-auto border border-gray-200 rounded-lg max-h-[60vh]">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {headers.map((header, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-800"
                >
                  {renderCell(row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Mock Data ---
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
  {
    Job: "AA2509/00334",
    "Style Code": "F2507W302",
    "Inform Marker": null,
    PO: "all",
    "Quantity (pcs)": 800,
    "Plan (pcs)": 800,
    Color: "all",
    "Sewing Start": "3-Sep",
    Decoration: "HE2",
    "Ship Date": "13-Sep",
    Remark: null,
    Line: "F2A17",
    "Total Fabric (Yds)": 552,
  },
  {
    Job: "AA2509/02353",
    "Style Code": "S2408MR2302A",
    "Inform Marker": null,
    PO: "all",
    "Quantity (pcs)": 2135,
    "Plan (pcs)": 2135,
    Color: "all",
    "Sewing Start": "5-Sep",
    Decoration: "HE4,PD1",
    "Ship Date": "13-Sep",
    Remark: null,
    Line: "F2A02",
    "Total Fabric (Yds)": 2218,
  },
  {
    Job: "AA2509/01414",
    "Style Code": "S2606LHUB400WN",
    "Inform Marker": null,
    PO: "all",
    "Quantity (pcs)": 1776,
    "Plan (pcs)": 1776,
    Color: "all",
    "Sewing Start": "6-Sep",
    Decoration: "HE2&EMB1&PD1&pr1",
    "Ship Date": "13-Sep",
    Remark: null,
    Line: "F2A20",
    "Total Fabric (Yds)": 1429,
  },
];

const mockFile = new File(["mock content"], "cutting_plan_data.xlsx", {
  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});

// ============================================================================
// --- SECTION 2: REFACTORED, CONTROLLABLE COMPONENT ---
// ============================================================================

interface ControllableCuttingPlanProps {
  initialModalOpen?: boolean;
  initialImportStatus?: ImportStatus;
  initialErrorMessage?: string;
  initialIsDragging?: boolean;
}

const ControllableCuttingPlanPage: FC<ControllableCuttingPlanProps> = ({
  initialModalOpen = false,
  initialImportStatus = "idle",
  initialErrorMessage = "",
  initialIsDragging = false,
}) => {
  const [planHeaders] = useState<string[]>(fullHeaders);
  const [planData] = useState<ExcelRow[]>(initialWeeklyDailyPlanData);
  const [isModalOpen, setIsModalOpen] = useState(initialModalOpen);
  const [importStatus, setImportStatus] =
    useState<ImportStatus>(initialImportStatus);
  const [selectedFile] = useState<File | null>(
    initialImportStatus === "preview" ? mockFile : null
  );
  const [previewHeaders] = useState<string[]>(
    initialImportStatus === "preview" ? fullHeaders : []
  );
  const [previewData] = useState<ExcelRow[]>(
    initialImportStatus === "preview" ? importedExcelData : []
  );
  // --- FIX START ---
  // The setter functions setErrorMessage and setIsDragging were removed
  // because they were declared but never used in this component.
  const [errorMessage] = useState<string>(initialErrorMessage);
  const [isDragging] = useState(initialIsDragging);
  // --- FIX END ---

  const resetImportState = () => setImportStatus("idle");
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Render function for modal content based on state
  const renderModalContent = () => {
    switch (importStatus) {
      case "parsing":
      case "importing":
        return (
          <div className="text-center flex flex-col items-center justify-center space-y-4 h-64">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-700">
              {importStatus === "parsing"
                ? "Parsing file..."
                : "Updating Cutting Plan..."}
            </h3>
            <p className="text-gray-500">Please wait a moment.</p>
          </div>
        );
      case "success":
        return (
          <div className="text-center flex flex-col items-center justify-center space-y-4 h-64">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-800">
              Import Successful!
            </h3>
            <p className="text-gray-600">
              The Cutting Plan data has been updated.
            </p>
          </div>
        );
      case "preview":
        return (
          <div className="w-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Preview Import Data
            </h3>
            {selectedFile && (
              <div className="w-full bg-gray-50 p-3 mb-4 rounded-lg border flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatBytes(128000)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetImportState}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <DataTable headers={previewHeaders} data={previewData} />
            <div className="flex justify-end items-center gap-4 mt-6 pt-4 border-t">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-semibold">
                Confirm & Update
              </button>
            </div>
          </div>
        );
      case "idle":
      case "error":
      default:
        return (
          <>
            <div
              className={`border-2 border-dashed rounded-lg p-8 w-full text-center transition-colors duration-300 ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <label
                htmlFor="file-upload-showcase"
                className="cursor-pointer flex flex-col items-center space-y-4"
              >
                <UploadCloud className="w-12 h-12 text-gray-400" />
                <p className="text-lg font-semibold text-gray-700">
                  Drag and drop your Excel file here
                </p>
                <p className="text-gray-500">or</p>
                <span className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                  Choose File
                </span>
              </label>
            </div>
            {errorMessage && (
              <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-100 p-3 rounded-md w-full">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{errorMessage}</span>
                <button
                  onClick={resetImportState}
                  className="ml-auto text-sm font-semibold hover:underline"
                >
                  Try Again
                </button>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full bg-white p-6 sm:p-8 rounded-xl">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Cutting Weekly/Daily Plan
          </h1>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            <FileUp className="w-5 h-5" /> Import Cutting Plan
          </button>
        </header>
        <main>
          <DataTable headers={planHeaders} data={planData} />
        </main>
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <header className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Import Cutting Plan Data
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </header>
            <div className="p-6 overflow-y-auto">{renderModalContent()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// --- SECTION 3: THE SHOWCASE PAGE ---
// ============================================================================

const StateCard: FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
    <h3 className="text-lg font-bold text-gray-800 p-4 bg-gray-50 border-b">
      {title}
    </h3>
    <div className="p-6 relative">{children}</div>
  </div>
);

const ModalStateWrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative w-full h-[650px] bg-gray-200 p-4 rounded-lg flex items-center justify-center overflow-hidden border">
    {children}
  </div>
);

const CuttingWeeklyDailyPlanPage = () => {
  return (
    <div className="bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-screen-2xl mx-auto">
        {/* --- Default State --- */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-500">
            Main Page (Default State)
          </h2>
          <div className="rounded-xl shadow-2xl overflow-hidden border">
            <ControllableCuttingPlanPage />
          </div>
        </section>

        {/* --- Modal States --- */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-green-500">
            Import Popup States
          </h2>
          <div className="grid grid-cols-1 gap-8">
            <StateCard title="1. Ready to Upload (Idle)">
              <ModalStateWrapper>
                <ControllableCuttingPlanPage
                  initialModalOpen={true}
                  initialImportStatus="idle"
                />
              </ModalStateWrapper>
            </StateCard>

            <StateCard title="2. Dragging File Over">
              <ModalStateWrapper>
                <ControllableCuttingPlanPage
                  initialModalOpen={true}
                  initialImportStatus="idle"
                  initialIsDragging={true}
                />
              </ModalStateWrapper>
            </StateCard>

            <StateCard title="3. Upload Error (Error State)">
              <ModalStateWrapper>
                <ControllableCuttingPlanPage
                  initialModalOpen={true}
                  initialImportStatus="error"
                  initialErrorMessage="File error: Invalid format. Please select an .xlsx file."
                />
              </ModalStateWrapper>
            </StateCard>

            <StateCard title="4. Processing File (Parsing...)">
              <ModalStateWrapper>
                <ControllableCuttingPlanPage
                  initialModalOpen={true}
                  initialImportStatus="parsing"
                />
              </ModalStateWrapper>
            </StateCard>

            <StateCard title="5. Previewing Data (Preview)">
              <ModalStateWrapper>
                <ControllableCuttingPlanPage
                  initialModalOpen={true}
                  initialImportStatus="preview"
                />
              </ModalStateWrapper>
            </StateCard>

            <StateCard title="6. Updating Data (Importing...)">
              <ModalStateWrapper>
                <ControllableCuttingPlanPage
                  initialModalOpen={true}
                  initialImportStatus="importing"
                />
              </ModalStateWrapper>
            </StateCard>

            <StateCard title="7. Update Successful (Success)">
              <ModalStateWrapper>
                <ControllableCuttingPlanPage
                  initialModalOpen={true}
                  initialImportStatus="success"
                />
              </ModalStateWrapper>
            </StateCard>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CuttingWeeklyDailyPlanPage;
