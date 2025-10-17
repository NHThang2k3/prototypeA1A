import React from "react";
import type { ShipmentHeader } from "../types";

interface FormHeaderProps {
  data: ShipmentHeader;
  onChange: (field: keyof ShipmentHeader, value: string) => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ data, onChange }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange(name as keyof ShipmentHeader, value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        1. Thông tin chung
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nhà cung cấp */}
        <div>
          <label
            htmlFor="supplier"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nhà cung cấp <span className="text-red-500">*</span>
          </label>
          {/* TODO: Chuyển thành component Autocomplete để tìm kiếm NCC */}
          <input
            type="text"
            id="supplier"
            name="supplier"
            value={data.supplier}
            onChange={handleChange}
            className="form-input w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Nhập tên hoặc mã nhà cung cấp"
          />
        </div>

        {/* Số PO */}
        <div>
          <label
            htmlFor="poNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Số PO
          </label>
          <input
            type="text"
            id="poNumber"
            name="poNumber"
            value={data.poNumber}
            onChange={handleChange}
            className="form-input w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Số Packing List */}
        <div>
          <label
            htmlFor="packingListNo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Số Packing List <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="packingListNo"
            name="packingListNo"
            value={data.packingListNo}
            onChange={handleChange}
            className="form-input w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Ngày dự kiến đi (ETD) */}
        <div>
          <label
            htmlFor="etd"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ngày dự kiến đi (ETD)
          </label>
          <input
            type="date"
            id="etd"
            name="etd"
            value={data.etd}
            onChange={handleChange}
            className="form-input w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Ngày dự kiến đến (ETA) */}
        <div>
          <label
            htmlFor="eta"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ngày dự kiến đến (ETA) <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="eta"
            name="eta"
            value={data.eta}
            onChange={handleChange}
            className="form-input w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Ghi chú */}
        <div className="md:col-span-2">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ghi chú
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={data.notes}
            onChange={handleChange}
            className="form-textarea w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Thêm ghi chú cho lô hàng..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
