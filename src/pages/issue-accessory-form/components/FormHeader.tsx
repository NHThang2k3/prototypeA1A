// Path: src/pages/issue-accessory-form/components/FormHeader.tsx

import React from "react";
import { mockProductionOrders } from "../data";
import type { AccessoryRequestFormState } from "../types";

interface FormHeaderProps {
  formData: AccessoryRequestFormState;
  handleFieldChange: <K extends keyof AccessoryRequestFormState>(
    field: K,
    value: AccessoryRequestFormState[K]
  ) => void;
  handleProductionOrderChange: (po: string) => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  formData,
  handleFieldChange,
  handleProductionOrderChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
        Thông tin chung
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="productionOrder"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Lệnh sản xuất (PO)
          </label>
          <select
            id="productionOrder"
            value={formData.productionOrder}
            onChange={(e) => handleProductionOrderChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Chọn Lệnh Sản Xuất --</option>
            {mockProductionOrders.map((po) => (
              <option key={po} value={po}>
                {po}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Chọn Lệnh SX sẽ tự động điền các phụ liệu theo BOM (nếu có).
          </p>
        </div>
        <div>
          <label
            htmlFor="requiredDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ngày cần hàng
          </label>
          <input
            type="date"
            id="requiredDate"
            value={formData.requiredDate || ""}
            onChange={(e) => handleFieldChange("requiredDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="requestor"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Người yêu cầu
          </label>
          <input
            type="text"
            id="requestor"
            value={formData.requestor}
            readOnly
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bộ phận yêu cầu
          </label>
          <input
            type="text"
            id="department"
            value={formData.department}
            onChange={(e) => handleFieldChange("department", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ghi chú
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => handleFieldChange("notes", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Thêm ghi chú cho phiếu yêu cầu..."
          />
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
