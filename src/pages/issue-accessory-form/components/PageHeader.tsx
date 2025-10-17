// Path: src/pages/issue-accessory-form/components/PageHeader.tsx

import { Boxes } from "lucide-react";

const PageHeader = () => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-6">
      <div className="flex items-center space-x-3">
        <Boxes className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Tạo Phiếu Yêu Cầu Xuất Phụ Liệu
          </h1>
          <p className="text-sm text-gray-500">
            Trang chủ / Xuất kho / Yêu cầu xuất phụ liệu
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
