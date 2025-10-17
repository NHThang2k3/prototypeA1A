// Path: src/pages/issue-transaction-reports/components/PageHeader.tsx

import React from "react";
import { Download } from "lucide-react";

const PageHeader = () => {
  return (
    <div className="bg-white p-4 shadow-sm mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Báo cáo Xuất Kho</h1>
          <p className="text-sm text-gray-500">
            Xem và quản lý lịch sử các giao dịch xuất kho.
          </p>
        </div>
        <button
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => alert("Chức năng xuất Excel đang được phát triển!")}
        >
          <Download className="w-4 h-4 mr-2" />
          Xuất Excel
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
