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
      minimumFractionDigits: 0,
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

// --- MOCK DATA FOR CUTTING WEEKLY/DAILY PLAN ---

const fullHeaders = [
  "Ngày cắt",
  "JOB",
  "MÃ HÀNG\n(Style)",
  "Inform\nWarehouse FB",
  "Inform\nQC Fabric",
  "Inform\nPattern",
  "Inform\nTrimcard",
  "Inform\nMarker",
  "PO",
  "Make\nMarker",
  "SỐ LƯỢNG\n(Qty)(pcs)",
  "KẾ HOẠCH CẮT\n(Plan)",
  "MÀU\n(Color)",
  "START\nSewing",
  "Decoration",
  "Ship\nDate",
  "REMARK",
  "LINE",
  "TỔNG YDS\nVẢI",
];

// DATA UPDATED: "Inform\nMarker" is null, "PO" is "all"
const initialWeeklyDailyPlanData: ExcelRow[] = [
  {
    "Ngày cắt": "3-Sep",
    JOB: "AA2506/00013",
    "MÃ HÀNG\n(Style)": "S2506GHTT412WN",
    "Inform\nWarehouse FB": null,
    "Inform\nQC Fabric": null,
    "Inform\nPattern": null,
    "Inform\nTrimcard": null,
    "Inform\nMarker": null,
    PO: "all",
    "Make\nMarker": null,
    "SỐ LƯỢNG\n(Qty)(pcs)": 1672,
    "KẾ HOẠCH CẮT\n(Plan)": 1672,
    "MÀU\n(Color)": "all",
    "START\nSewing": "5-Sep",
    Decoration: "HE3,PD1",
    "Ship\nDate": "12-Sep",
    REMARK: null,
    LINE: "F2A18",
    "TỔNG YDS\nVẢI": 1386,
  },
  {
    "Ngày cắt": "T4",
    JOB: "AA2509/00617",
    "MÃ HÀNG\n(Style)": "S2606CHJT104W",
    "Inform\nWarehouse FB": null,
    "Inform\nQC Fabric": null,
    "Inform\nPattern": null,
    "Inform\nTrimcard": null,
    "Inform\nMarker": null,
    PO: "all",
    "Make\nMarker": null,
    "SỐ LƯỢNG\n(Qty)(pcs)": 1218,
    "KẾ HOẠCH CẮT\n(Plan)": 1218,
    "MÀU\n(Color)": "all",
    "START\nSewing": "26-Aug",
    Decoration: "HE3",
    "Ship\nDate": "13-Sep",
    REMARK: null,
    LINE: "F2A06",
    "TỔNG YDS\nVẢI": 579,
  },
];

// DATA UPDATED: "Inform\nMarker" is null, "PO" is "all"
const importedExcelData: ExcelRow[] = [
  {
    "Ngày cắt": null,
    JOB: "AA2509/01390",
    "MÃ HÀNG\n(Style)": "S2606GHTT428Y",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 3909,
    "KẾ HOẠCH CẮT\n(Plan)": 3909,
    "MÀU\n(Color)": "all",
    "START\nSewing": "30-Aug",
    Decoration: "HE1&EMB1&PD1",
    "Ship\nDate": "13-Sep",
    REMARK: "0",
    LINE: "F2A07",
    "TỔNG YDS\nVẢI": 4794,
  },
  {
    "Ngày cắt": null,
    JOB: "AA2509/01353",
    "MÃ HÀNG\n(Style)": "S2602M907P",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 66,
    "KẾ HOẠCH CẮT\n(Plan)": 66,
    "MÀU\n(Color)": "all",
    "START\nSewing": "3-Sep",
    Decoration: "bonding10&HE18&PD1&pr1&Sublimation pr1",
    "Ship\nDate": "13-Sep",
    REMARK: null,
    LINE: "F2-PPA2",
    "TỔNG YDS\nVẢI": 109,
  },
  {
    "Ngày cắt": null,
    JOB: "AA2509/00334",
    "MÃ HÀNG\n(Style)": "F2507W302",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 800,
    "KẾ HOẠCH CẮT\n(Plan)": 800,
    "MÀU\n(Color)": "all",
    "START\nSewing": "3-Sep",
    Decoration: "HE2",
    "Ship\nDate": "13-Sep",
    REMARK: null,
    LINE: "F2A17",
    "TỔNG YDS\nVẢI": 552,
  },
  {
    "Ngày cắt": null,
    JOB: "AA2509/02353",
    "MÃ HÀNG\n(Style)": "S2408MR2302A",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 2135,
    "KẾ HOẠCH CẮT\n(Plan)": 2135,
    "MÀU\n(Color)": "all",
    "START\nSewing": "5-Sep",
    Decoration: "HE4,PD1",
    "Ship\nDate": "13-Sep",
    REMARK: null,
    LINE: "F2A02",
    "TỔNG YDS\nVẢI": 2218,
  },
  {
    "Ngày cắt": null,
    JOB: "AA2509/01414",
    "MÃ HÀNG\n(Style)": "S2606LHUB400WN",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 1776,
    "KẾ HOẠCH CẮT\n(Plan)": 1776,
    "MÀU\n(Color)": "all",
    "START\nSewing": "6-Sep",
    Decoration: "HE2&EMB1&PD1&pr1",
    "Ship\nDate": "13-Sep",
    REMARK: null,
    LINE: "F2A20",
    "TỔNG YDS\nVẢI": 1429,
  },
  {
    "Ngày cắt": null,
    JOB: "AA2509/01442",
    "MÃ HÀNG\n(Style)": "S2507M508B",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 1965,
    "KẾ HOẠCH CẮT\n(Plan)": 1965,
    "MÀU\n(Color)": "all",
    "START\nSewing": "10-Sep",
    Decoration: "HE3",
    "Ship\nDate": "13-Sep",
    REMARK: "0",
    LINE: "F2A03",
    "TỔNG YDS\nVẢI": 1022,
  },
  {
    "Ngày cắt": null,
    JOB: "AA2509/02057",
    "MÃ HÀNG\n(Style)": "S2606CHAG029",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 4,
    "KẾ HOẠCH CẮT\n(Plan)": 4,
    "MÀU\n(Color)": "all",
    "START\nSewing": "6-Sep",
    Decoration: "bonding2&PD1&pr2",
    "Ship\nDate": "18-Sep",
    REMARK: null,
    LINE: "F2A15",
    "TỔNG YDS\nVẢI": 12,
  },
  {
    "Ngày cắt": null,
    JOB: "AA2509/00444",
    "MÃ HÀNG\n(Style)": "S2606GHTT508M",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 355,
    "KẾ HOẠCH CẮT\n(Plan)": 355,
    "MÀU\n(Color)": "all",
    "START\nSewing": "8-Sep",
    Decoration: "pr1",
    "Ship\nDate": "20-Sep",
    REMARK: "0",
    LINE: "F2A23",
    "TỔNG YDS\nVẢI": 1356,
  },
  {
    "Ngày cắt": null,
    JOB: "AA2509/00688",
    "MÃ HÀNG\n(Style)": "SMSUS26RUBMBPM4",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 1994,
    "KẾ HOẠCH CẮT\n(Plan)": 1994,
    "MÀU\n(Color)": "all",
    "START\nSewing": "26-Aug",
    Decoration: "HE6&PD1",
    "Ship\nDate": "27-Sep",
    REMARK: null,
    LINE: "F2A02",
    "TỔNG YDS\nVẢI": 1743,
  },
  {
    "Ngày cắt": null,
    JOB: "AA2509/00245",
    "MÃ HÀNG\n(Style)": "S2607M302",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 639,
    "KẾ HOẠCH CẮT\n(Plan)": 639,
    "MÀU\n(Color)": "all",
    "START\nSewing": "6-Sep",
    Decoration: "HE2&PD2",
    "Ship\nDate": "27-Sep",
    REMARK: null,
    LINE: "F2A24",
    "TỔNG YDS\nVẢI": 936,
  },
  {
    "Ngày cắt": null,
    JOB: "AA2509/01371",
    "MÃ HÀNG\n(Style)": "S2606CHJT104",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 337,
    "KẾ HOẠCH CẮT\n(Plan)": 337,
    "MÀU\n(Color)": "all",
    "START\nSewing": "8-Sep",
    Decoration: "HE1&EMB1&PD1",
    "Ship\nDate": "27-Sep",
    REMARK: null,
    LINE: "F2A22",
    "TỔNG YDS\nVẢI": 195,
  },
  {
    "Ngày cắt": null,
    JOB: "AA2509/00105",
    "MÃ HÀNG\n(Style)": "S2506LHSD105Y",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 581,
    "KẾ HOẠCH CẮT\n(Plan)": 581,
    "MÀU\n(Color)": "all",
    "START\nSewing": "10-Sep",
    Decoration: "HE2,EM2,PD,Inotex 1+sublimation 2",
    "Ship\nDate": "27-Sep",
    REMARK: null,
    LINE: "F2A13",
    "TỔNG YDS\nVẢI": 432,
  },
  {
    "Ngày cắt": null,
    JOB: "AA2509/01359",
    "MÃ HÀNG\n(Style)": "S2606CHAG030",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 1526,
    "KẾ HOẠCH CẮT\n(Plan)": 1526,
    "MÀU\n(Color)": "all",
    "START\nSewing": "11-Sep",
    Decoration: "pr2",
    "Ship\nDate": "27-Sep",
    REMARK: null,
    LINE: "F2A19",
    "TỔNG YDS\nVẢI": 1760,
  },
  {
    "Ngày cắt": null,
    JOB: "AA2509/00685",
    "MÃ HÀNG\n(Style)": "S2662LHME001ALM",
    "Inform\nMarker": null,
    PO: "all",
    "SỐ LƯỢNG\n(Qty)(pcs)": 1494,
    "KẾ HOẠCH CẮT\n(Plan)": 1494,
    "MÀU\n(Color)": "all",
    "START\nSewing": "12-Sep",
    Decoration: "HE4,Pr6",
    "Ship\nDate": "27-Sep",
    REMARK: null,
    LINE: "F2A01",
    "TỔNG YDS\nVẢI": 1947,
  },
];

// --- MAIN COMPONENT ---

const CuttingWeeklyDailyPlanPage = () => {
  const [planHeaders, setPlanHeaders] = useState<string[]>(fullHeaders);
  const [planData, setPlanData] = useState<ExcelRow[]>(
    initialWeeklyDailyPlanData
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
      setPlanHeaders(previewHeaders);
      setPlanData(previewData);
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
    const mockFile = new File([""], "cutting_plan_data.xlsx", {
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
                onChange={(_e) => {
                  if (_e) {
                    //
                  }
                  const mockFile = new File([""], "cutting_plan_data.xlsx", {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  });
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
            Cutting Weekly/Daily Plan
          </h1>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            <FileUp className="w-5 h-5" />
            Import Cutting Plan
          </button>
        </header>

        <main>
          <DataTable headers={planHeaders} data={planData} />
        </main>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transform transition-all duration-300">
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

export default CuttingWeeklyDailyPlanPage;
