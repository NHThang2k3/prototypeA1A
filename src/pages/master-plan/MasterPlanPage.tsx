// Path: src/pages/master-plan/MasterPlanPage.tsx
import React, { useState } from "react";
import {
  UploadCloud,
  File,
  X,
  Loader2,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  Send,
  AlertCircle,
} from "lucide-react";

// Định nghĩa các trạng thái của quá trình upload và xử lý
type ProcessStatus = "idle" | "uploading" | "processing" | "success" | "error";

// Hàm helper để định dạng kích thước file
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const MasterPlanPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessStatus>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // computed flag to avoid impossible type-narrowed comparisons inside branches
  const isBusy = status === "uploading" || status === "processing";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/pdf"
      ) {
        setSelectedFile(file);
        setErrorMessage("");
        setStatus("idle");
      } else {
        setErrorMessage(
          "Invalid file type. Please upload an Excel (XLSX) or PDF file."
        );
        setSelectedFile(null);
      }
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/pdf"
      ) {
        setSelectedFile(file);
        setErrorMessage("");
        setStatus("idle");
      } else {
        setErrorMessage(
          "Invalid file type. Please upload an Excel (XLSX) or PDF file."
        );
        setSelectedFile(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;

    setStatus("uploading");
    setErrorMessage("");

    // --- Bắt đầu mô phỏng quá trình upload và xử lý ---
    // Trong ứng dụng thực tế, đây là nơi bạn gọi API
    setTimeout(() => {
      // Giả sử upload thành công
      setStatus("processing");
      setTimeout(() => {
        // Giả sử xử lý thành công
        setStatus("success");
      }, 2500); // Giả lập thời gian xử lý 2.5 giây
    }, 1500); // Giả lập thời gian upload 1.5 giây
    // --- Kết thúc mô phỏng ---
  };

  const handleReset = () => {
    setSelectedFile(null);
    setStatus("idle");
    setErrorMessage("");
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
                <FileSpreadsheet className="w-5 h-5" />
                Export as Excel
              </button>
              <button className="flex items-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors">
                <FileText className="w-5 h-5" />
                Export as PDF
              </button>
              <button className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                <Send className="w-5 h-5" />
                Send to Departments
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
                accept=".xlsx, .pdf"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-4"
              >
                <UploadCloud className="w-12 h-12 text-gray-400" />
                <p className="text-lg font-semibold text-gray-700">
                  Drag & drop your file here
                </p>
                <p className="text-gray-500">or</p>
                <span className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                  Browse File
                </span>
                <p className="text-sm text-gray-400 pt-2">
                  Supports: .xlsx, .pdf
                </p>
              </label>
            </div>

            {errorMessage && (
              <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-100 p-3 rounded-md">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {selectedFile && (
              <div className="mt-6 w-full bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="w-8 h-8 text-blue-500" />
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
                <button
                  onClick={handleSubmit}
                  disabled={!selectedFile || isBusy}
                  className="w-full mt-8 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  Upload and Generate Kanban
                </button>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-full flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Master Plan Processing
          </h1>
          <p className="text-md text-gray-600">
            Upload the Master Plan to automatically generate the Final Kanban
            for production.
          </p>
        </header>

        <main className="bg-white p-6 sm:p-10 rounded-xl shadow-lg flex flex-col items-center">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MasterPlanPage;
