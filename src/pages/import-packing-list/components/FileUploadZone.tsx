import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText } from "lucide-react";
import type { ShipmentItem } from "../types";

interface FileUploadZoneProps {
  onItemsChange: (items: ShipmentItem[]) => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onItemsChange }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0]);
        // TODO: Xử lý file thật (dùng thư viện như papaparse, xlsx)
        // Ở đây chúng ta chỉ giả lập kết quả sau khi parse file
        console.log("Processing file:", acceptedFiles[0].name);

        // Giả lập dữ liệu sau khi đọc file thành công
        const mockParsedItems: ShipmentItem[] = [
          {
            id: "file-1",
            sku: "FAB-001-RED",
            name: "Vải Kate Đỏ",
            quantity: 1500,
            uom: "M",
            batch: "B001",
          },
          {
            id: "file-2",
            sku: "ACC-012-BLK",
            name: "Nút đen 12mm",
            quantity: 10000,
            uom: "Cái",
          },
          {
            id: "file-3",
            sku: "PCK-003",
            name: "Thùng carton 3 lớp",
            quantity: 250,
            uom: "Thùng",
          },
        ];

        // Cập nhật state ở component cha
        onItemsChange(mockParsedItems);
      }
    },
    [onItemsChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  return (
    <div className="flex flex-col items-center">
      <div
        {...getRootProps()}
        className={`w-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${
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
          <p className="text-sm">Hỗ trợ các định dạng: CSV, XLS, XLSX</p>
        </div>
      </div>
      {/* <a
        href="/templates/packing-list-template.xlsx"
        download
        className="mt-4 flex items-center text-sm font-medium text-blue-600 hover:underline"
      >
        <Download className="w-4 h-4 mr-1" />
        Tải về file mẫu
      </a> */}
      {uploadedFile && (
        <div className="mt-6 w-full max-w-md bg-gray-100 p-4 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-gray-600 mr-3" />
            <div>
              <p className="font-medium text-gray-800">{uploadedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-green-600">
            Đã tải lên và xử lý
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
