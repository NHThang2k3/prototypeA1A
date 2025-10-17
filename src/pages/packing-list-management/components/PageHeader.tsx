// src/pages/packing-list-management/components/PageHeader.tsx

import React from "react";

interface PageHeaderProps {
  poNumber: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ poNumber }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Chi tiết Packing List: {poNumber}
        </h1>
        <p className="text-gray-500 mt-1">
          Phân rã lô hàng, quản lý và in mã QR cho từng đơn vị vật tư.
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
