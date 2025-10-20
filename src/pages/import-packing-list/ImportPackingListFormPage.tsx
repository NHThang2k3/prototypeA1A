// src/pages/import-packing-list/ImportPackingListFormPage.tsx

import React from "react";

import FileUploadZone from "./components/FileUploadZone";
import PreviewTable from "./components/PreviewTable";
import type { PackingListItem } from "./types";

interface ImportPackingListFormPageProps {
  items: PackingListItem[];
  onItemsChange: (items: PackingListItem[]) => void;
}

const ImportPackingListFormPage: React.FC<ImportPackingListFormPageProps> = ({
  items,
  onItemsChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Header của trang */}
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inbound from Packing List File
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload an Excel file to create a batch inbound shipment.
          </p>
        </div>
      </div>

      {/* Vùng tải file */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          1. Upload Packing List File
        </h2>
        <div>
          <FileUploadZone onItemsChange={onItemsChange} />
        </div>
      </div>

      {/* Bảng xem trước dữ liệu - Hiển thị có điều kiện */}
      {items.length > 0 && <PreviewTable items={items} />}
    </div>
  );
};

export default ImportPackingListFormPage;
