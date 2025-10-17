// Path: src/pages/location-management/components/PageHeader.tsx
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button"; // Giả sử bạn có component này

interface PageHeaderProps {
  onAddRootLocation: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onAddRootLocation }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Vị trí Kho
          </h1>
          <p className="text-sm text-gray-500">
            Thiết lập, quản lý và xem xét sơ đồ logic của kho hàng.
          </p>
        </div>
        <Button onClick={onAddRootLocation}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm Vị trí Mới
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
