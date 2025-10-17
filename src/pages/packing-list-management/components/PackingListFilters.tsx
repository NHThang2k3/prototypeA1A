// src/pages/packing-list-management/components/PackingListFilters.tsx

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Search, Filter } from "lucide-react";

const PackingListFilters = () => {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <label
            htmlFor="item-search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tìm kiếm vật tư
          </label>
          <div className="relative">
            <Input
              id="item-search"
              placeholder="Nhập mã vật tư, mô tả, màu sắc..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div>
          <label
            htmlFor="status-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Trạng thái in
          </label>
          <select
            id="status-filter"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="NOT_PRINTED">Chưa in</option>
            <option value="PRINTED">Đã in</option>
          </select>
        </div>
        <div className="self-end">
          <Button className="w-full">
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackingListFilters;
