// Path: src/pages/master-plan/MasterPlanPage.tsx
// Đã sửa lỗi và thêm giả lập tải file
import React, { useState, useEffect } from "react";
import {
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  Send,
  AlertCircle,
} from "lucide-react";
import * as XLSX from "xlsx";

// Định nghĩa các trạng thái của quá trình upload và xử lý
type ProcessStatus = "idle" | "uploading" | "processing" | "success" | "error";

// SỬA LỖI 1: Thay thế `any` bằng kiểu cụ thể hơn
type ExcelCellValue = string | number | Date | null | undefined;
type ExcelRow = Record<string, ExcelCellValue>;

// Hàm helper để định dạng kích thước file
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// SỬA LỖI 2: Thay thế `any` bằng kiểu cụ thể hơn
const renderCell = (value: ExcelCellValue): React.ReactNode => {
  if (value instanceof Date) {
    // Định dạng ngày tháng theo dd-mmm-yy, ví dụ: 15-Jul-24
    const day = value.getDate().toString().padStart(2, "0");
    const month = value.toLocaleString("en-US", { month: "short" });
    const year = value.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }
  if (typeof value === "number") {
    // Định dạng số có dấu phẩy ngăn cách hàng nghìn
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

const MasterPlanPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessStatus>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [tableData, setTableData] = useState<ExcelRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const isBusy = status === "uploading" || status === "processing";

  // --- BẮT ĐẦU PHẦN GIẢ LẬP ---
  useEffect(() => {
    // Dữ liệu mẫu dựa trên yêu cầu của bạn
    const mockHeaders = [
      "Receive\nFab date",
      "JOB",
      "ITEM",
      "CODE MAU",
      "Color",
      "Qty (Inet)\n(yds)",
      "Requested\nQty",
      "MAY\nMORGAN",
      "Update's Store",
      "Update's QC",
      "Infrom Marker",
      "Infrom Marker",
      "Infrom Pattern",
      "LC",
      "Ngày vải về",
    ];
    const mockData: ExcelRow[] = [
      {
        "Receive\nFab date": new Date("2025-07-15"),
        JOB: "AA2509/00619",
        ITEM: "70016157-53",
        "CODE MAU": "095A",
        Color: "BLACK",
        "Qty (Inet)\n(yds)": 2000.0,
        "Requested\nQty": "Deducted",
        "MAY\nMORGAN": null,
        "Update's Store": "WAIT F3",
        "Update's QC": null,
        "Infrom Marker": null,
        "Infrom Pattern": null,
        LC: new Date("2025-04-11"),
        "Ngày vải về": "#N/A",
      },
      {
        "Receive\nFab date": "T3",
        JOB: "AA2509/00045",
        ITEM: "70038357-68",
        "CODE MAU": "AAG4/046A",
        Color: "HI-RES BLUE S18/BOLD BLUE",
        "Qty (Inet)\n(yds)": 2000.0,
        "Requested\nQty": "Reserved physical",
        "MAY\nMORGAN": null,
        "Update's Store": "OK",
        "Update's QC": null,
        "Infrom Marker": null,
        "Infrom Pattern": null,
        LC: new Date("2024-11-29"),
        "Ngày vải về": new Date("2025-05-16"),
      },
      {
        "Receive\nFab date": null,
        JOB: "AA2508/00331",
        ITEM: "70005507-58",
        "CODE MAU": "095A",
        Color: "BLACK",
        "Qty (Inet)\n(yds)": 639.55,
        "Requested\nQty": "Deducted",
        "MAY\nMORGAN": null,
        "Update's Store": "OK",
        "Update's QC": null,
        "Infrom Marker": null,
        "Infrom Pattern": null,
        LC: new Date("2024-12-20"),
        "Ngày vải về": new Date("2025-06-14"),
      },
      {
        "Receive\nFab date": null,
        JOB: "AA2508/00331",
        ITEM: "70029659-64",
        "CODE MAU": "095A",
        Color: "BLACK",
        "Qty (Inet)\n(yds)": 18.26,
        "Requested\nQty": "Deducted",
        "MAY\nMORGAN": null,
        "Update's Store": "OK",
        "Update's QC": null,
        "Infrom Marker": null,
        "Infrom Pattern": null,
        LC: new Date("2024-12-20"),
        "Ngày vải về": new Date("2025-06-14"),
      },
      {
        "Receive\nFab date": null,
        JOB: "AA2508/00910",
        ITEM: "70030561-53",
        "CODE MAU": "AFDE",
        Color: "SEMI LUCID RED S25",
        "Qty (Inet)\n(yds)": 15.28,
        "Requested\nQty": "Deducted",
        "MAY\nMORGAN": null,
        "Update's Store": "OK",
        "Update's QC": null,
        "Infrom Marker": null,
        "Infrom Pattern": null,
        LC: new Date("2025-04-25"),
        "Ngày vải về": "#REF!",
      },
      // Thêm các dòng dữ liệu khác ở đây nếu cần
    ];

    // Tạo một file giả để hiển thị thông tin
    const mockFile = new File([""], "master_plan_sample.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Cập nhật state để hiển thị bảng
    setHeaders(mockHeaders);
    setTableData(mockData);
    setSelectedFile(mockFile);
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần
  // --- KẾT THÚC PHẦN GIẢ LẬP ---

  const resetState = () => {
    setSelectedFile(null);
    setTableData([]);
    setHeaders([]);
    setErrorMessage("");
    setStatus("idle");
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, {
          raw: false,
        }); // raw: false để format ngày tháng

        if (json.length > 0) {
          const fileHeaders = Object.keys(json[0]);
          setHeaders(fileHeaders);
          setTableData(json);
          setErrorMessage("");
        } else {
          setErrorMessage(
            "The selected Excel file is empty or in an invalid format."
          );
        }
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        setErrorMessage(
          "Failed to parse the Excel file. Please ensure it's a valid XLSX file."
        );
        resetState();
      }
    };
    reader.onerror = () => {
      setErrorMessage("Error reading file.");
      resetState();
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setSelectedFile(file);
        parseExcel(file);
      } else {
        setErrorMessage(
          "Invalid file type. Please upload an Excel (XLSX) file."
        );
        resetState();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0]);
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
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  const handleRemoveFile = () => {
    resetState();
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    setStatus("uploading");
    setErrorMessage("");
    setTimeout(() => {
      setStatus("processing");
      setTimeout(() => {
        setStatus("success");
      }, 2500);
    }, 1500);
  };

  const handleReset = () => {
    resetState();
  };

  const renderContent = () => {
    switch (status) {
      case "uploading":
      case "processing":
        return (
          <div className="text-center flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            <h3 className="text-2xl font-semibold text-gray-700">
              {status === "uploading"
                ? "Uploading Master Plan..."
                : "Generating Final Kanban..."}
            </h3>
            <p className="text-gray-500">
              Please wait, this may take a moment.
            </p>
          </div>
        );
      case "success":
        return (
          <div className="text-center flex flex-col items-center justify-center space-y-6">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
            <h3 className="text-3xl font-bold text-gray-800">
              Final Kanban Generated Successfully!
            </h3>
            <p className="text-gray-600 max-w-md">
              The Master Plan has been processed. You can now export the final
              Kanban or send it to the relevant departments.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button className="flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors">
                <FileSpreadsheet className="w-5 h-5" /> Export as Excel
              </button>
              <button className="flex items-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors">
                <FileText className="w-5 h-5" /> Export as PDF
              </button>
              <button className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                <Send className="w-5 h-5" /> Send to Departments
              </button>
            </div>
            <button
              onClick={handleReset}
              className="mt-8 text-blue-600 hover:underline font-medium"
            >
              Upload Another Master Plan
            </button>
          </div>
        );
      case "idle":
      case "error":
      default:
        if (!selectedFile) {
          return (
            <>
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 w-full text-center transition-colors duration-300 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".xlsx"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <UploadCloud className="w-12 h-12 text-gray-400" />
                  <p className="text-lg font-semibold text-gray-700">
                    Drag & drop your Excel file here
                  </p>
                  <p className="text-gray-500">or</p>
                  <span className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                    Browse File
                  </span>
                  <p className="text-sm text-gray-400 pt-2">Supports: .xlsx</p>
                </label>
              </div>
              {errorMessage && (
                <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-100 p-3 rounded-md w-full">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}
            </>
          );
        }
        return (
          <div className="w-full flex flex-col items-center">
            <div className="w-full bg-gray-50 p-4 mb-6 rounded-lg border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatBytes(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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
                        {header.replace(/\n/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((row, rowIndex) => (
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
            <button
              onClick={handleSubmit}
              disabled={isBusy}
              className="w-full max-w-md mt-8 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Upload and Generate Kanban
            </button>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-full flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Master Plan
          </h1>
        </header>
        <main className="bg-white p-6 sm:p-10 rounded-xl shadow-lg flex flex-col items-center">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MasterPlanPage;
