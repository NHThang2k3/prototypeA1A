// Path: src/pages/issue-transaction-reports/components/ReportFilters.tsx

import React, { useState } from "react";
import { Search } from "lucide-react";
import type { Filters } from "../types"; // <-- IMPORT TỪ ĐÂY

// Giả sử bạn có prop onFilterChange để cập nhật state ở component cha
// interface Filters { // <-- XÓA ĐỊNH NGHĨA CỤC BỘ NÀY
//   query?: string;
//   type?: string;
//   status?: string;
//   dateFrom?: string;
//   dateTo?: string;
// }

interface ReportFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ onFilterChange }) => {
  // Sử dụng state để quản lý giá trị của các input và gọi onFilterChange khi có thay đổi.
  const [filters, setFilters] = useState<Filters>({
    query: "",
    type: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleChange = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    onFilterChange(next);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      {/* ...Phần còn lại của component không thay đổi... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Tìm kiếm Lệnh SX
          </label>
          <input
            type="text"
            placeholder="VD: PO-12345"
            value={filters.query}
            onChange={(e) => handleChange({ query: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
        </div>

        {/* Filter by Type */}
        <div>
          <label
            htmlFor="type"
            className="text-sm font-medium text-gray-600 block mb-1"
          >
            Loại phiếu
          </label>
          <select
            id="type"
            value={filters.type}
            onChange={(e) => handleChange({ type: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tất cả</option>
            <option value="Xuất vải">Xuất vải</option>
            <option value="Xuất phụ liệu">Xuất phụ liệu</option>
            <option value="Xuất đóng gói">Xuất đóng gói</option>
          </select>
        </div>

        {/* Filter by Status */}
        <div>
          <label
            htmlFor="status"
            className="text-sm font-medium text-gray-600 block mb-1"
          >
            Trạng thái
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleChange({ status: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tất cả</option>
            <option value="Mới yêu cầu">Mới yêu cầu</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đã hoàn tất">Đã hoàn tất</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>

        {/* Date Range Picker (giả lập bằng 2 input) */}
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Ngày xuất
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleChange({ dateFrom: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleChange({ dateTo: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
