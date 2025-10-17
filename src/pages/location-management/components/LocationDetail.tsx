// Path: src/pages/location-management/components/LocationDetail.tsx

import React from "react";
import type { LocationNode, LocationStatus } from "../types";
import { Button } from "../../../components/ui/button"; // Giả sử bạn có component Button chung

const StatusBadge: React.FC<{ status: LocationStatus }> = ({ status }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
  const colorClasses =
    status === "ACTIVE"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      {status === "ACTIVE" ? "Hoạt động" : "Tạm khóa"}
    </span>
  );
};

interface LocationDetailProps {
  location: LocationNode | null;
  onEdit: (location: LocationNode) => void;
  onAddChild: (parentId: string) => void;
}

const LocationDetail: React.FC<LocationDetailProps> = ({
  location,
  onEdit,
  onAddChild,
}) => {
  if (!location) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">
            Chọn một vị trí từ cây cấu trúc để xem chi tiết.
          </p>
        </div>
      </div>
    );
  }

  const usagePercentage = location.capacity
    ? (location.items.length / location.capacity) * 100
    : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{location.name}</h2>
          <p className="text-sm text-gray-500">Mã vị trí: {location.id}</p>
        </div>
        <StatusBadge status={location.status} />
      </div>

      <div className="space-y-4">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onAddChild(location.id)}>
            Thêm vị trí con
          </Button>
          <Button onClick={() => onEdit(location)}>Sửa</Button>
        </div>

        {/* Thông tin chi tiết */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Thông tin chi tiết</h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <dt className="text-sm font-medium text-gray-500">Loại vị trí</dt>
            <dd className="text-sm text-gray-900">{location.type}</dd>
            <dt className="text-sm font-medium text-gray-500">Sức chứa</dt>
            <dd className="text-sm text-gray-900">
              {location.capacity || "Không giới hạn"}
            </dd>
          </dl>
        </div>

        {/* Sức chứa */}
        {location.capacity && (
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Tình trạng sử dụng</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-right mt-1 text-gray-600">
              {location.items.length} / {location.capacity} (
              {usagePercentage.toFixed(1)}%)
            </p>
          </div>
        )}

        {/* Danh sách mặt hàng */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">
            Hàng hóa trong vị trí ({location.items.length})
          </h3>
          {location.items.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {location.items.map((item) => (
                <li
                  key={item.id}
                  className="py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  </div>
                  <p className="text-gray-700">
                    {item.quantity} {item.uom}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Vị trí này đang trống.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;
