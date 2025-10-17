import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import FormHeader from "./components/FormHeader"; // Bỏ import FormHeader
import FileUploadZone from "./components/FileUploadZone";
import ActionToolbar from "./components/ActionToolbar";
import type { ShipmentItem } from "./types"; // ShipmentHeader không còn cần ở đây

const ImportPackingListFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bỏ state headerData
  // const [headerData, setHeaderData] = useState<ShipmentHeader>({ ... });

  // Dữ liệu items sẽ được điền từ file upload
  const [items, setItems] = useState<ShipmentItem[]>([]);

  // Bỏ hàm handleHeaderChange
  // const handleHeaderChange = (field: keyof ShipmentHeader, value: string) => { ... };

  const handleSubmit = () => {
    // Cập nhật: chỉ gửi đi items
    console.log("Submitting form:", { items });

    // Validate form before submitting
    if (items.length === 0) {
      alert("Vui lòng tải lên file chứa danh sách hàng hóa.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Cập nhật thông báo và điều hướng vì không còn packingListNo
      const newShipmentId = `PNK-${Date.now()}`; // Giả lập ID mới từ server trả về
      alert(`Đã tạo thành công phiếu nhập kho ${newShipmentId}!`);

      // Chuyển hướng đến màn hình chi tiết với ID mới
      navigate(`/shipments/${newShipmentId}`);
    }, 1500);
  };

  return (
    <div className="relative">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header của trang */}
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nhập Kho Từ File Packing List
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Tải lên file Excel hoặc CSV để tạo phiếu nhập kho hàng loạt.
            </p>
          </div>
        </div>

        {/* Bỏ hoàn toàn Form Header */}
        {/* <FormHeader data={headerData} onChange={handleHeaderChange} /> */}

        {/* Item Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Tải lên danh sách hàng hóa
          </h2>
          <div>
            <FileUploadZone onItemsChange={setItems} />
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <ActionToolbar onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default ImportPackingListFormPage;
