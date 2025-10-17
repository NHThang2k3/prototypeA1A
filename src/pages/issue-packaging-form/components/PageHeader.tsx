import { Package } from "lucide-react";

const PageHeader = () => {
  return (
    <div className="bg-white p-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
          <Package className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Tạo Phiếu Xuất Kho Đóng Gói
          </h1>
          <p className="text-sm text-gray-500">
            Trang chủ / Xuất kho / Yêu cầu xuất kho đóng gói
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
