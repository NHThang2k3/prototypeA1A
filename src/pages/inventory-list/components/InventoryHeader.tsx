// Path: src/pages/inventory-list/components/InventoryHeader.tsx

import React from "react";
import { ChevronRight, FileDown, ClipboardList } from "lucide-react";

export const InventoryHeader = () => (
  <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
    <div>
      <nav className="text-sm mb-2" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex items-center">
          <li className="flex items-center">
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Trang chủ
            </a>
            <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
          </li>
          <li className="flex items-center">
            <span className="text-gray-500">Tồn kho</span>
            <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
          </li>
          <li className="flex items-center">
            <span className="font-semibold text-gray-800">
              Danh sách tồn kho
            </span>
          </li>
        </ol>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900">Quản lý Tồn Kho</h1>
    </div>
    <div className="flex space-x-2 mt-4 md:mt-0">
      <button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
        <ClipboardList className="w-5 h-5 mr-2 text-gray-500" />
        Kiểm kê
      </button>
      <button className="flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">
        <FileDown className="w-5 h-5 mr-2" />
        Xuất Báo cáo
      </button>
    </div>
  </div>
);
