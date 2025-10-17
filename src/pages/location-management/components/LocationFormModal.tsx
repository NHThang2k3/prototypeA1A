// Path: src/pages/location-management/components/LocationFormModal.tsx

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { LocationNode, LocationType, LocationStatus } from "../types";
import { Button } from "../../../components/ui/button"; // Giả sử bạn có component Button chung

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    locationData: Partial<LocationNode> & { parentId?: string | null }
  ) => void;
  initialData?: LocationNode | null;
  parentId?: string | null;
}

const LocationFormModal: React.FC<LocationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  parentId,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<LocationType>("BIN");
  const [status, setStatus] = useState<LocationStatus>("ACTIVE");
  const [capacity, setCapacity] = useState<number | "">("");

  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setStatus(initialData.status);
      setCapacity(initialData.capacity || "");
    } else if (isOpen && !initialData) {
      // Reset form for adding new
      setName("");
      setType("BIN");
      setStatus("ACTIVE");
      setCapacity("");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("Tên vị trí là bắt buộc.");
      return;
    }
    onSave({
      id: isEditing ? initialData!.id : Date.now().toString(), // Use existing ID or generate a new one for new item
      name,
      type,
      status,
      capacity: capacity ? Number(capacity) : undefined,
      parentId: isEditing ? undefined : parentId,
    });
  };

  const locationTypes: LocationType[] = [
    "WAREHOUSE",
    "ZONE",
    "AISLE",
    "SHELF",
    "BIN",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">
              {isEditing ? "Chỉnh sửa Vị trí" : "Thêm Vị trí Mới"}
            </h2>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Tên vị trí *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Loại vị trí
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as LocationType)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {locationTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Trạng thái
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as LocationStatus)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="LOCKED">Tạm khóa</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700"
              >
                Sức chứa (tùy chọn)
              </label>
              <input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) =>
                  setCapacity(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                min="0"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center p-4 border-t space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationFormModal;
