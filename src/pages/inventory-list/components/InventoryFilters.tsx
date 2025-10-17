// Path: src/pages/inventory-list/components/InventoryFilters.tsx

import { Search, SlidersHorizontal } from "lucide-react";

export const InventoryFilters = () => {
  // NOTE: For a real application, the state and onChange handlers would be passed via props.
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
        <SlidersHorizontal className="w-5 h-5 mr-3 text-gray-500" />
        Bộ lọc
      </h3>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tìm kiếm
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Mã VT, Tên vật tư..."
            />
          </div>
        </div>

        {/* Warehouse Filter */}
        <div>
          <label
            htmlFor="warehouse"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Kho
          </label>
          <select
            id="warehouse"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>Tất cả kho</option>
            <option>Fabric WH</option>
            <option>Accessory WH</option>
            <option>Packing WH</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Vị trí
          </label>
          {/* In a real app, this would be a complex Tree Select component.
              For this example, a simple input is used as a placeholder. */}
          <input
            type="text"
            id="location"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Khu A > Dãy 01..."
          />
        </div>

        {/* Supplier Filter */}
        <div>
          <label
            htmlFor="supplier"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nhà cung cấp
          </label>
          <select
            id="supplier"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>Tất cả NCC</option>
            <option>Nhà cung cấp A</option>
            <option>Nhà cung cấp B</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Trạng thái tồn kho
          </label>
          <select
            id="status"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>Tất cả trạng thái</option>
            <option>Dưới mức tối thiểu</option>
            <option>Vượt mức tối đa</option>
          </select>
        </div>
      </div>

      <button className="mt-8 w-full bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-200">
        Đặt lại bộ lọc
      </button>
    </div>
  );
};
