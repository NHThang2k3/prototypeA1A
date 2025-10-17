// D:\WATATECH\WH\src\pages\inbound-dashboard\components\ShipmentFilters.tsx

import { SlidersHorizontal, RotateCcw } from "lucide-react";

export const ShipmentFilters = () => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 flex flex-wrap gap-4 items-center">
      <h3 className="text-lg font-semibold text-gray-800 mr-4 flex items-center">
        <SlidersHorizontal className="w-5 h-5 mr-2" />
        Bộ lọc
      </h3>

      {/* Filter by Status */}
      <div className="flex-grow min-w-[150px]">
        <label
          htmlFor="status-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Trạng thái
        </label>
        <select
          id="status-filter"
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option>Tất cả</option>
          <option>Chờ nhận</option>
          <option>Đang xử lý</option>
          <option>Nhận một phần</option>
          <option>Đã nhận đủ</option>
        </select>
      </div>

      {/* Filter by Arrival Date */}
      <div className="flex-grow min-w-[200px]">
        <label
          htmlFor="arrival-date-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Ngày nhận hàng
        </label>
        <input
          type="date"
          id="arrival-date-filter"
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-end space-x-2 pt-5">
        <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 flex items-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};
