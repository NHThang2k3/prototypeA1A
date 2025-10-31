// Path: src/pages/Cutting/MasterPlanPage.tsx

import React, { useState } from "react";
import {
  UploadCloud,
  X,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  FileUp,
} from "lucide-react";

// --- TYPES AND HELPER FUNCTIONS ---

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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (value === null || typeof value === "undefined") {
    return "";
  }
  return String(value);
};

// --- REUSABLE DATA TABLE COMPONENT ---
interface DataTableProps {
  headers: string[];
  data: ExcelRow[];
}

const DataTable: React.FC<DataTableProps> = ({ headers, data }) => {
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
                className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-pre-wrap"
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

// --- MOCK DATA ---

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

// CHANGE 1: Initial data now has all the required columns with English keys
const initialMasterPlanData: ExcelRow[] = [
  {
    "Receive\nFab date": "10-Jul",
    JOB: "INITIAL/001",
    ITEM: "70000000-00",
    "COLOR CODE": "INIT",
    Color: "INITIAL_COLOR",
    "Requested\nQty": "Deducted",
    "Qty (Inet)\n(yds)": 500.0,
    "MAY\nMORGAN": null,
    "Update's Store": "INITIAL DATA",
    "Update's QC": null,
    "Inform Marker_1": null,
    "Inform Marker_2": null,
    "Inform Pattern": null,
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
    "MAY\nMORGAN": null,
    "Update's Store": "INITIAL DATA",
    "Update's QC": null,
    "Inform Marker_1": null,
    "Inform Marker_2": null,
    "Inform Pattern": null,
    LC: new Date("2024-01-02"),
    "Fabric Arrival Date": new Date("2024-02-02"),
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
    "MAY\nMORGAN": null,
    "Update's Store": "WAIT F3",
    "Update's QC": null,
    "Inform Marker_1": null,
    "Inform Marker_2": null,
    "Inform Pattern": null,
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
    "MAY\nMORGAN": null,
    "Update's Store": "OK",
    "Update's QC": null,
    "Inform Marker_1": null,
    "Inform Marker_2": null,
    "Inform Pattern": null,
    LC: new Date("2024-11-29"),
    "Fabric Arrival Date": new Date("2025-05-16"),
  },
  {
    "Receive\nFab date": null,
    JOB: "AA2508/00331",
    ITEM: "70005507-58",
    "COLOR CODE": "095A",
    Color: "BLACK",
    "Requested\nQty": "Deducted",
    "Qty (Inet)\n(yds)": 639.55,
    "MAY\nMORGAN": null,
    "Update's Store": "OK",
    "Update's QC": null,
    "Inform Marker_1": null,
    "Inform Marker_2": null,
    "Inform Pattern": null,
    LC: new Date("2024-12-20"),
    "Fabric Arrival Date": new Date("2025-06-14"),
  },
  {
    "Receive\nFab date": null,
    JOB: "AA2508/00240",
    ITEM: "70038349-66",
    "COLOR CODE": "AAG4/046A",
    Color: "HI-RES BLUE S18/BOLD BLUE",
    "Requested\nQty": "Deducted",
    "Qty (Inet)\n(yds)": 2000.0,
    "MAY\nMORGAN": null,
    "Update's Store": "OK",
    "Update's QC": null,
    "Inform Marker_1": null,
    "Inform Marker_2": null,
    "Inform Pattern": null,
    LC: new Date("2025-04-25"),
    "Fabric Arrival Date": new Date("2025-06-30"),
  },
  {
    "Receive\nFab date": null,
    JOB: "AA2507/00369",
    ITEM: "70029953-53",
    "COLOR CODE": "001A",
    Color: "WHITE",
    "Requested\nQty": "Deducted",
    "Qty (Inet)\n(yds)": 240.04,
    "MAY\nMORGAN": null,
    "Update's Store": "WAIT QC",
    "Update's QC": "OK",
    "Inform Marker_1": null,
    "Inform Marker_2": null,
    "Inform Pattern": null,
    LC: new Date("2025-04-11"),
    "Fabric Arrival Date": new Date("2025-07-10"),
  },
  {
    "Receive\nFab date": null,
    JOB: "AA2508/00910",
    ITEM: "70030561-53",
    "COLOR CODE": "AFDE",
    Color: "SEMI LUCID RED S25",
    "Requested\nQty": "Deducted",
    "Qty (Inet)\n(yds)": 15.28,
    "MAY\nMORGAN": null,
    "Update's Store": "OK",
    "Update's QC": null,
    "Inform Marker_1": null,
    "Inform Marker_2": null,
    "Inform Pattern": null,
    LC: new Date("2025-04-25"),
    "Fabric Arrival Date": "#REF!",
  },
];

// --- MAIN COMPONENT ---

const MasterPlanPage = () => {
  const [masterPlanHeaders, setMasterPlanHeaders] =
    useState<string[]>(fullHeaders);
  const [masterPlanData, setMasterPlanData] = useState<ExcelRow[]>(
    initialMasterPlanData
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<ExcelRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const resetImportState = () => {
    setImportStatus("idle");
    setSelectedFile(null);
    setPreviewHeaders([]);
    setPreviewData([]);
    setErrorMessage("");
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(resetImportState, 300);
  };

  const parseExcel = (file: File) => {
    setImportStatus("parsing");
    setErrorMessage("");
    setTimeout(() => {
      try {
        if (file.name.includes("error"))
          throw new Error("Simulated file error.");
        setPreviewHeaders(fullHeaders);
        setPreviewData(importedExcelData);
        setImportStatus("preview");
        // FIX 2: Add '_' before 'error' as it's not used
      } catch (_error) {
        if (_error) {
          //
        }
        setErrorMessage("Could not parse the file.");
        setImportStatus("error");
      }
    }, 1500);
  };

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.name.endsWith(".xlsx")
    ) {
      setSelectedFile(file);
      parseExcel(file);
    } else {
      setErrorMessage(
        "Invalid file type. Please upload an Excel file (.xlsx)."
      );
      setImportStatus("error");
    }
  };

  const handleConfirmImport = () => {
    setImportStatus("importing");
    setTimeout(() => {
      setMasterPlanHeaders(previewHeaders);
      setMasterPlanData(previewData);
      setImportStatus("success");
      setTimeout(handleCloseModal, 2000);
    }, 2000);
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
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const mockFile = new File([""], "master_plan_real_data.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    handleFileSelect(mockFile);
  };

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
                : "Updating Master Plan..."}
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
              The Master Plan data has been updated.
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
                      {formatBytes(selectedFile.size)}
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
              <button
                onClick={handleConfirmImport}
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-semibold"
              >
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
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 w-full text-center transition-colors duration-300 ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".xlsx"
                // FIX 3: Add '_' before 'e' as it's not used
                onChange={(_e) => {
                  if (_e) {
                    //
                  }
                  const mockFile = new File(
                    [""],
                    "master_plan_real_data.xlsx",
                    {
                      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    }
                  );
                  handleFileSelect(mockFile);
                }}
              />
              <label
                htmlFor="file-upload"
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
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Master Plan
          </h1>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            <FileUp className="w-5 h-5" />
            Import Master Plan
          </button>
        </header>

        <main>
          <DataTable headers={masterPlanHeaders} data={masterPlanData} />
        </main>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transform transition-all duration-300">
            <header className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Import Master Plan Data
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

export default MasterPlanPage;
