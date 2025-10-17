import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploadZone from "./components/FileUploadZone";
import ActionToolbar from "./components/ActionToolbar";
import PreviewTable from "./components/PreviewTable"; // Import component mới
import type { PackingListItem } from "./types"; // Import type mới

const ImportPackingListFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sử dụng type PackingListItem cho state
  const [items, setItems] = useState<PackingListItem[]>([]);

  const handleSubmit = () => {
    console.log("Submitting form:", { items });

    // Validate form before submitting
    if (items.length === 0) {
      alert(
        "Vui lòng tải lên và xử lý thành công file chứa danh sách hàng hóa."
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newShipmentId = `PNK-${Date.now()}`;
      alert(`Đã tạo thành công phiếu nhập kho ${newShipmentId}!`);
      navigate(`/shipments/${newShipmentId}`);
    }, 1500);
  };

  return (
    <div className="relative pb-24">
      {" "}
      {/* Thêm padding bottom để toolbar không che nội dung */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Header của trang */}
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nhập Kho Từ File Packing List
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Tải lên file Excel để tạo phiếu nhập kho hàng loạt.
            </p>
          </div>
        </div>

        {/* Vùng tải file */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1. Tải lên file Packing List
          </h2>
          <div>
            <FileUploadZone onItemsChange={setItems} />
          </div>
        </div>

        {/* Bảng xem trước dữ liệu - Hiển thị có điều kiện */}
        {items.length > 0 && <PreviewTable items={items} />}
      </div>
      {/* Action Toolbar */}
      <ActionToolbar onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default ImportPackingListFormPage;
