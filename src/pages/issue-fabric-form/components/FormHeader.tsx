// Path: src/pages/issue-fabric-form/components/FormHeader.tsx

import React from "react";

// Props sẽ bao gồm giá trị và hàm xử lý thay đổi
interface FormHeaderProps {
  productionOrder: string;
  requiredDate: string;
  notes: string;
  onFieldChange: (field: string, value: string) => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  productionOrder,
  requiredDate,
  notes,
  onFieldChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Thông tin chung
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="productionOrder"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Lệnh Sản Xuất / Mã hàng
          </label>
          <input
            type="text"
            id="productionOrder"
            value={productionOrder}
            onChange={(e) => onFieldChange("productionOrder", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="VD: PO-456"
          />
        </div>
        <div>
          <label
            htmlFor="requiredDate"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Ngày cần hàng
          </label>
          <input
            type="date"
            id="requiredDate"
            value={requiredDate}
            onChange={(e) => onFieldChange("requiredDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Ghi chú
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => onFieldChange("notes", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Yêu cầu thêm (nếu có)"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
