// src/pages/import-packing-list/ImportPackingListFormPagePackaging.tsx

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

// --- TYPE DEFINITIONS ---

interface PackingListItem {
  id: string; // Client-side temporary ID
  poNumber: string;
  itemCode: string;
  supplier: string;
  invoiceNo: string;
  boxNo: string;
  lotNo: string;
  quantity: number;
  unit: string; // e.g., PCS, SET, BOX
  netWeight: number;
  grossWeight: number;
  dimensions: string; // Packaging specific
  location: string;
  qrCode: string;
  description: string;
}

// --- LOCAL COMPONENT: ActionToolbar ---

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

// --- LOCAL COMPONENT: FileUploadZone ---

interface FileUploadZoneProps {
  onItemsChange: (items: PackingListItem[]) => void;
}

// Mapping from Excel column names to PackingListItem keys
const headerMapping: { [key: string]: keyof Omit<PackingListItem, "id"> } = {
  "PO Number": "poNumber",
  "Item Code": "itemCode",
  Supplier: "supplier",
  "Invoice No": "invoiceNo",
  "Box No": "boxNo",
  "Lot No": "lotNo",
  Quantity: "quantity",
  Unit: "unit",
  "Net Weight (Kgs)": "netWeight",
  "Gross Weight (Kgs)": "grossWeight",
  Dimensions: "dimensions",
  Location: "location",
  "QR Code": "qrCode",
  Description: "description",
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
              `File is missing required columns: ${missingHeaders.join(", ")}`
            );
          }

          const parsedItems: PackingListItem[] = json
            .map((row, index) => {
              if (Object.values(row).every((val) => val === "")) return null;

              const newItem: Partial<PackingListItem> = {
                id: `${file.name}-${index}`,
              };
              for (const header of requiredHeaders) {
                const key = headerMapping[header];
                const value = row[header];

                if (
                  key === "quantity" ||
                  key === "netWeight" ||
                  key === "grossWeight"
                ) {
                  const numValue = parseFloat(String(value));
                  if (isNaN(numValue)) {
                    throw new Error(
                      `Invalid data at row ${
                        index + 2
                      }, column "${header}": "${value}" is not a number.`
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

          onItemsChange(parsedItems);
        } catch (e: unknown) {
          let message = "An error occurred while processing the file.";
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
        setError("Could not read the file. Please try again.");
        setIsParsing(false);
        setUploadedFile(null);
      };
      reader.readAsArrayBuffer(file);
    },
    [onItemsChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileParse(acceptedFiles[0]);
      }
    },
    [handleFileParse]
  );

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
              Drag and drop the file here, or click to select a file
            </p>
            <p className="text-sm">
              Only Excel files (.xls, .xlsx) are supported
            </p>
          </div>
        </div>
      )}

      {isParsing && (
        <div className="w-full text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="flex flex-col items-center text-gray-600">
            <Loader2 className="w-12 h-12 mb-4 animate-spin" />
            <p className="font-semibold">Processing file...</p>
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
                File Processing Error
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
                  Upload another file
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
              Processed successfully
            </p>
            <button
              onClick={handleRemoveFile}
              title="Remove file and re-upload"
            >
              <XCircle className="w-5 h-5 text-gray-500 hover:text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- LOCAL COMPONENT: PreviewTable ---

interface PreviewTableProps {
  items: PackingListItem[];
}

const PreviewTable: React.FC<PreviewTableProps> = ({ items }) => {
  const headers = [
    "PO Number",
    "Item Code",
    "Supplier",
    "Invoice No",
    "Box No",
    "Lot No",
    "Quantity",
    "Unit",
    "Net Weight (Kgs)",
    "Gross Weight (Kgs)",
    "Dimensions",
    "Location",
    "QR Code",
    "Description",
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        2. Data Preview ({items.length} rows)
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
                  {item.supplier}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.invoiceNo}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.boxNo}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.lotNo}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                  {item.quantity}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.unit}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                  {item.netWeight.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                  {item.grossWeight.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.dimensions}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.location}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.qrCode}
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

// --- MAIN PAGE COMPONENT ---

const ImportPackingListFormPagePackaging: React.FC = () => {
  const [items, setItems] = useState<PackingListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleItemsChange = useCallback((newItems: PackingListItem[]) => {
    setItems(newItems);
  }, []);

  const handleSubmit = () => {
    if (items.length === 0) {
      alert("There are no items to submit.");
      return;
    }
    setIsSubmitting(true);
    console.log("Submitting the following packaging items:", items);
    setTimeout(() => {
      console.log("Submission successful!");
      setIsSubmitting(false);
      setItems([]);
      alert("Inbound packaging shipment created successfully!");
    }, 2000);
  };

  return (
    <>
      <div className="space-y-6 pb-24">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Inbound Packaging from Packing List
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Upload an Excel file to create a batch inbound packaging shipment.
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1. Upload Packaging Packing List File
          </h2>
          <div>
            <FileUploadZone onItemsChange={handleItemsChange} />
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

export default ImportPackingListFormPagePackaging;
