// Path: src/pages/issue-fabric-form/components/PageHeader.tsx

import { ChevronRight } from "lucide-react";

const PageHeader = () => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800">Tạo Phiếu Xuất Vải</h1>
      <div className="flex items-center text-sm text-gray-500 mt-1">
        <span>Trang chủ</span>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span>Xuất kho</span>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="font-semibold text-gray-700">Yêu cầu xuất vải</span>
      </div>
    </div>
  );
};

export default PageHeader;
