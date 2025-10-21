// src/pages/bundle-management/ImportJobModal.tsx
import { X, FileUp, CheckCircle2 } from "lucide-react";
import { useState } from "react";

type ImportJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Giả lập tên cho 8 file cần import
const requiredFiles = [
  "Bill of Materials (BOM)",
  "Cutting Plan",
  "Marker Data",
  "Order Details",
  "Sewing Operations",
  "Packaging Spec",
  "Labeling Info",
  "Quality Control Plan",
];

const ImportJobModal = ({ isOpen, onClose }: ImportJobModalProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, File | null>
  >(requiredFiles.reduce((acc, val) => ({ ...acc, [val]: null }), {}));

  if (!isOpen) return null;

  const handleFileChange = (fileName: string, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [fileName]: file }));
  };

  const allFilesUploaded = Object.values(uploadedFiles).every(
    (file) => file !== null
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Import 8 Excel Files to Create a New JOB
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          <p className="text-sm text-gray-600 mb-6">
            Please upload all 8 required files to generate a new JOB. The system
            will process these files to gather all necessary information.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredFiles.map((fileName) => (
              <div key={fileName} className="border rounded-lg p-3">
                <label htmlFor={fileName} className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">{fileName}</p>
                      {uploadedFiles[fileName] ? (
                        <div className="flex items-center text-green-600 mt-1">
                          <CheckCircle2 size={16} className="mr-1.5" />
                          <span className="text-xs font-semibold">
                            {uploadedFiles[fileName]?.name}
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">
                          Click or drag to upload
                        </p>
                      )}
                    </div>
                    <FileUp
                      className={`transition-colors ${
                        uploadedFiles[fileName]
                          ? "text-green-500"
                          : "text-blue-500"
                      }`}
                      size={28}
                    />
                  </div>
                  <input
                    id={fileName}
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={(e) =>
                      handleFileChange(
                        fileName,
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                  />
                </label>
              </div>
            ))}
          </div>
        </main>

        <footer className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-100 mr-3"
          >
            Cancel
          </button>
          <button
            disabled={!allFilesUploaded}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
          >
            Create JOB
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ImportJobModal;
