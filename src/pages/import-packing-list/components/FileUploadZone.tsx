import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileText,
  Loader2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import type { PackingListItem } from "../types";

interface FileUploadZoneProps {
  onItemsChange: (items: PackingListItem[]) => void;
}

// Ánh xạ từ tên cột trong Excel sang key trong object PackingListItem
const headerMapping: { [key: string]: keyof Omit<PackingListItem, "id"> } = {
  "Số PO": "poNumber",
  "Mã Item": "itemCode",
  "Màu sắc": "color",
  "Số cuộn": "rollNo",
  "Số Lô / Mẻ": "lotNo",
  "Số Yards": "yards",
  "KL Tịnh (Kgs)": "netWeight",
  "KL Cả bì (Kgs)": "grossWeight",
  "Chiều rộng khổ vải": "width",
  "Vị trí kho": "location",
};
const requiredHeaders = Object.keys(headerMapping);

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onItemsChange }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileParse = useCallback(
    (file: File) => {
      setUploadedFile(file);
      setError(null);
      setIsParsing(true);
      onItemsChange([]);

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          if (!data) throw new Error("Không thể đọc file.");

          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          if (!sheetName) throw new Error("File Excel không có sheet nào.");

          const worksheet = workbook.Sheets[sheetName];
          // FIX 1: Thay any[] bằng kiểu cụ thể hơn
          const json: { [key: string]: string | number }[] =
            XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" });

          if (json.length === 0) {
            throw new Error("File không có dữ liệu hoặc sheet đầu tiên trống.");
          }

          const fileHeaders = Object.keys(json[0] || {});
          const missingHeaders = requiredHeaders.filter(
            (h) => !fileHeaders.includes(h)
          );

          if (missingHeaders.length > 0) {
            throw new Error(
              `File thiếu các cột bắt buộc: ${missingHeaders.join(", ")}`
            );
          }

          const parsedItems: PackingListItem[] = json
            .map((row, index) => {
              if (Object.values(row).every((val) => val === "")) return null;

              // FIX 2: Thay any bằng Partial<PackingListItem>
              const newItem: Partial<PackingListItem> = {
                id: `${file.name}-${index}`,
              };
              for (const header of requiredHeaders) {
                const key = headerMapping[header];
                const value = row[header];

                if (
                  key === "yards" ||
                  key === "netWeight" ||
                  key === "grossWeight"
                ) {
                  const numValue = parseFloat(String(value));
                  if (isNaN(numValue)) {
                    throw new Error(
                      `Dữ liệu không hợp lệ ở dòng ${
                        index + 2
                      }, cột "${header}": "${value}" không phải là số.`
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
            throw new Error("Không tìm thấy dữ liệu hợp lệ trong file.");
          }

          onItemsChange(parsedItems);
          // FIX 3: Thay e: any bằng e: unknown và kiểm tra kiểu
        } catch (e: unknown) {
          let message = "Đã xảy ra lỗi khi xử lý file.";
          if (e instanceof Error) {
            message = e.message;
          }
          setError(message);
          onItemsChange([]);
          setUploadedFile(null);
        } finally {
          setIsParsing(false);
        }
      };

      reader.onerror = () => {
        setError("Không thể đọc file. Vui lòng thử lại.");
        setIsParsing(false);
        setUploadedFile(null);
      };

      reader.readAsArrayBuffer(file);
    },
    [onItemsChange]
  ); // FIX 4.1: Bọc handleFileParse bằng useCallback

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileParse(acceptedFiles[0]);
      }
    },
    [handleFileParse]
  ); // FIX 4.2: Thêm dependency còn thiếu

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
    <div className="flex flex-col items-center">
      {!uploadedFile && !isParsing && (
        <div
          {...getRootProps()}
          className={`w-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-gray-500">
            <UploadCloud className="w-12 h-12 mb-4" />
            <p className="font-semibold">
              Kéo thả file vào đây, hoặc nhấn để chọn file
            </p>
            <p className="text-sm">Chỉ hỗ trợ file Excel (.xls, .xlsx)</p>
          </div>
        </div>
      )}

      {isParsing && (
        <div className="w-full text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="flex flex-col items-center text-gray-600">
            <Loader2 className="w-12 h-12 mb-4 animate-spin" />
            <p className="font-semibold">Đang xử lý file...</p>
            <p className="text-sm">{uploadedFile?.name}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 w-full max-w-lg bg-red-50 p-4 rounded-md border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Lỗi xử lý file
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleRemoveFile}
                  type="button"
                  className="text-sm font-medium text-red-800 hover:text-red-600"
                >
                  Tải lại file khác
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadedFile && !isParsing && !error && (
        <div className="mt-6 w-full max-w-md bg-green-50 border border-green-200 p-4 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-green-700 mr-3" />
            <div>
              <p className="font-medium text-gray-800">{uploadedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <p className="text-sm font-semibold text-green-600">
              Xử lý thành công
            </p>
            <button onClick={handleRemoveFile} title="Xóa file và tải lại">
              <XCircle className="w-5 h-5 text-gray-500 hover:text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
