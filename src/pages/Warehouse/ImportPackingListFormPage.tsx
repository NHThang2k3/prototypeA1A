// src/pages/import-packing-list/ImportPackingListFormPage.tsx

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileText,
  Loader2,
  XCircle,
  AlertCircle,
  CheckCircle2, // Import icon mới cho trạng thái thành công
} from "lucide-react";
import * as XLSX from "xlsx";

// --- TYPE DEFINITIONS (Không thay đổi) ---

/**
 * Định nghĩa cho một dòng hàng hóa trong file packing list excel
 */
interface PackingListItem {
  id: string; // ID tạm thời ở client, giờ sẽ bao gồm cả tên file để đảm bảo duy nhất
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

// --- LOCAL COMPONENT: ActionToolbar (Không thay đổi) ---

interface ActionToolbarProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  return (
    <div className="sticky bottom-0 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-200 p-4 z-10">
      <div className="max-w-7xl mx-auto flex justify-end items-center space-x-4">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : "Complete"}
        </button>
      </div>
    </div>
  );
};

// --- LOCAL COMPONENT: FileUploadZone (REFACTORED FOR MULTIPLE FILES) ---

// Định nghĩa trạng thái cho từng file được upload
type FileStatus = "parsing" | "success" | "error";

interface ProcessedFile {
  file: File;
  status: FileStatus;
  error?: string;
  // Giữ lại các item đã parse được để có thể xóa khỏi list tổng nếu file bị gỡ
  parsedItems: PackingListItem[];
}

interface FileUploadZoneProps {
  onFileAdded: (items: PackingListItem[]) => void;
  onFileRemoved: (fileName: string) => void;
}

// Ánh xạ từ tên cột trong Excel sang key trong object PackingListItem
const headerMapping: { [key: string]: keyof Omit<PackingListItem, "id"> } = {
  "PO Number": "poNumber",
  "Item Code": "itemCode",
  Factory: "factory",
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
}) => {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);

  const parseFile = async (file: File): Promise<PackingListItem[]> => {
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
          const json: { [key: string]: string | number }[] =
            XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" });

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
                // Tạo ID duy nhất bằng cách kết hợp tên file và chỉ số dòng
                // Rất quan trọng để có thể xóa đúng item sau này
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
                      `Invalid number at row ${
                        index + 2
                      }, column "${header}": "${value}"`
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
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFilesToProcess = acceptedFiles.filter(
        (file) =>
          !processedFiles.some(
            (processedFile) => processedFile.file.name === file.name
          )
      );

      newFilesToProcess.forEach((file) => {
        // 1. Thêm file vào state với trạng thái 'parsing' để hiển thị loading
        setProcessedFiles((prev) => [
          ...prev,
          { file, status: "parsing", parsedItems: [] },
        ]);

        // 2. Bắt đầu xử lý file
        parseFile(file)
          .then((parsedItems) => {
            // 3. Xử lý thành công
            setProcessedFiles((prev) =>
              prev.map((pf) =>
                pf.file.name === file.name
                  ? { ...pf, status: "success", parsedItems }
                  : pf
              )
            );
            // Gửi các item mới lên component cha
            onFileAdded(parsedItems);
          })
          .catch((error: Error) => {
            // 4. Xử lý thất bại
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
    [processedFiles, onFileAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: true, // CHO PHÉP CHỌN NHIỀU FILE
  });

  const handleRemoveFile = (fileName: string) => {
    setProcessedFiles((prev) => prev.filter((pf) => pf.file.name !== fileName));
    // Báo cho component cha để xóa các item tương ứng
    onFileRemoved(fileName);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Vùng Dropzone luôn hiển thị */}
      <div
        {...getRootProps()}
        className={`w-full border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${processedFiles.length > 0 ? "mb-6" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-gray-500">
          <UploadCloud className="w-10 h-10 mb-3" />
          <p className="font-semibold">
            Drag and drop files here, or click to select files
          </p>
          <p className="text-sm">
            Only Excel files (.xls, .xlsx) are supported
          </p>
        </div>
      </div>

      {/* Danh sách các file đã upload */}
      {processedFiles.length > 0 && (
        <div className="w-full space-y-3">
          {processedFiles.map(({ file, status, error }) => (
            <div
              key={file.name}
              className={`w-full p-4 rounded-md border flex items-center justify-between ${
                status === "success" && "bg-green-50 border-green-200"
              } ${status === "error" && "bg-red-50 border-red-200"}`}
            >
              <div className="flex items-center overflow-hidden">
                <FileText className="w-6 h-6 text-gray-600 mr-3 flex-shrink-0" />
                <div className="flex-grow overflow-hidden">
                  <p
                    className="font-medium text-gray-800 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  {status === "error" && (
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                {status === "parsing" && (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                )}
                {status === "success" && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                {status === "error" && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <button
                  onClick={() => handleRemoveFile(file.name)}
                  title="Remove file"
                >
                  <XCircle className="w-5 h-5 text-gray-500 hover:text-gray-800" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- LOCAL COMPONENT: PreviewTable (Không thay đổi) ---

interface PreviewTableProps {
  items: PackingListItem[];
}

const PreviewTable: React.FC<PreviewTableProps> = ({ items }) => {
  const headers = [
    "PO Number",
    "Item Code",
    "Factory",
    "Supplier",
    "Invoice No",
    "Color Code",
    "Color",
    "Roll No",
    "Lot No",
    "Yards",
    "Net Weight (Kgs)",
    "Gross Weight (Kgs)",
    "Width",
    "Location",
    "QR Code",
    "Date In House",
    "Description",
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        2. Data Preview ({items.length} total rows)
      </h2>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.poNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.itemCode}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.factory}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.supplier}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.invoiceNo}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.colorCode}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.color}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.rollNo}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.lotNo}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                  {item.yards.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                  {item.netWeight.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                  {item.grossWeight.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.width}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.location}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.qrCode}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.dateInHouse}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT (UPDATED TO HANDLE MULTIPLE FILES) ---

const ImportPackingListFormPage: React.FC = () => {
  // `items` bây giờ là tổng hợp dữ liệu từ TẤT CẢ các file đã được xử lý thành công
  const [items, setItems] = useState<PackingListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm này sẽ được gọi khi một file được xử lý thành công
  const handleFileAdded = useCallback((newItems: PackingListItem[]) => {
    // Thêm các item mới vào danh sách hiện tại
    setItems((prevItems) => [...prevItems, ...newItems]);
  }, []);

  // Hàm này sẽ được gọi khi người dùng xóa một file khỏi danh sách
  const handleFileRemoved = useCallback((fileName: string) => {
    // Lọc ra các item không thuộc về file đã bị xóa
    // Dựa vào ID đã được tạo `file.name-index`
    setItems((prevItems) =>
      prevItems.filter((item) => !item.id.startsWith(`${fileName}-`))
    );
  }, []);

  const handleSubmit = () => {
    if (items.length === 0) {
      alert("There are no valid items to submit.");
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting the following items:", items);

    setTimeout(() => {
      console.log("Submission successful!");
      setIsSubmitting(false);
      setItems([]);
      // Trong thực tế, bạn sẽ muốn xóa cả danh sách file trong `FileUploadZone`
      // Điều này cần thêm một chút logic (vd: dùng key để reset component) hoặc để user tự xóa
      alert("Inbound shipment created successfully!");
    }, 2000);
  };

  return (
    <>
      <div className="space-y-6 pb-24">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Inbound from Packing List File
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Upload one or more Excel files to create a batch inbound shipment.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1. Upload Packing List Files
          </h2>
          <div>
            <FileUploadZone
              onFileAdded={handleFileAdded}
              onFileRemoved={handleFileRemoved}
            />
          </div>
        </div>

        {items.length > 0 && <PreviewTable items={items} />}
      </div>

      {items.length > 0 && (
        <ActionToolbar onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </>
  );
};

export default ImportPackingListFormPage;
