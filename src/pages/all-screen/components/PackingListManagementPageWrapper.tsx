import React from "react";
import PackingListManagementPage from "../../packing-list-management/PackingListManagementPage";
import SplitRollModal from "../../packing-list-management/components/SplitRollModal";
import ImportPackingListModal from "../../packing-list-management/components/ImportPackingListModal";
import { mockFabricRolls } from "../../packing-list-management/data";

const PackingListManagementPageWrapper: React.FC = () => {
  // Lấy một item mẫu từ dữ liệu giả để hiển thị trong SplitRollModal
  const dummyItemToSplit = mockFabricRolls[1]; // Lấy cuộn vải thứ hai làm ví dụ

  return (
    <div className="flex flex-col space-y-8">
      {/* 1. Render trang Quản lý Packing List như bình thường */}
      <PackingListManagementPage />

      {/* 2. Render các Modal như các thành phần tĩnh để review giao diện */}
      <div className="border-t-2 border-dashed border-gray-300 pt-8">
        <h3 className="text-xl font-bold text-center text-gray-600 mb-6">
          --- Modal Showcase ---
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Modal Chia cuộn (Split Roll) */}
          <div
            className="
              [&>div]:!static [&>div]:!inset-auto [&>div]:!z-auto 
              [&>div]:!bg-transparent [&>div]:!p-0 [&>div]:block
              [&>div>div]:mx-auto
            "
          >
            <SplitRollModal
              isOpen={true} // Luôn mở để hiển thị
              onClose={() => {}} // Hàm rỗng
              onSave={() => {}} // Hàm rỗng
              item={dummyItemToSplit}
            />
          </div>

          {/* Modal Nhập Packing List (Import) */}
          <div
            className="
              [&>div]:!static [&>div]:!inset-auto [&>div]:!z-auto 
              [&>div]:!bg-transparent [&>div]:!p-0 [&>div]:block
              [&>div>div]:mx-auto
            "
          >
            <ImportPackingListModal
              isOpen={true} // Luôn mở để hiển thị
              onClose={() => {}} // Hàm rỗng
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackingListManagementPageWrapper;
