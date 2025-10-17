// path: src/pages/packing-list-management/components/BreakdownModal.tsx

import React, { useState, useEffect, useMemo } from "react";
import type { PackingListItem, BreakdownUnit } from "../types";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { X, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid"; // Cần cài đặt thư viện: npm install uuid

interface BreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemId: string, units: BreakdownUnit[]) => void;
  item: PackingListItem | null;
}

const BreakdownModal: React.FC<BreakdownModalProps> = ({
  isOpen,
  onClose,
  onSave,
  item,
}) => {
  const [units, setUnits] = useState<BreakdownUnit[]>([]);
  const [newUnitQty, setNewUnitQty] = useState("");

  useEffect(() => {
    // Khởi tạo danh sách units khi modal mở hoặc item thay đổi
    if (item) {
      setUnits(item.breakdownUnits || []);
    } else {
      setUnits([]);
    }
    setNewUnitQty("");
  }, [item]);

  const totalBrokenDownQty = useMemo(() => {
    return units.reduce((total, unit) => total + unit.quantity, 0);
  }, [units]);

  const remainingQty = useMemo(() => {
    if (!item) return 0;
    return item.quantity - totalBrokenDownQty;
  }, [item, totalBrokenDownQty]);

  const handleAddUnit = () => {
    const quantity = parseFloat(newUnitQty);
    if (!item || isNaN(quantity) || quantity <= 0 || quantity > remainingQty) {
      alert("Số lượng không hợp lệ hoặc vượt quá số lượng còn lại.");
      return;
    }

    const newUnit: BreakdownUnit = {
      id: uuidv4(),
      parentItemId: item.id,
      name: `${item.unit === "m" ? "Cuộn" : "Thùng"} ${units.length + 1}`,
      quantity: quantity,
      qrCode: null,
    };

    setUnits([...units, newUnit]);
    setNewUnitQty("");
  };

  const handleRemoveUnit = (unitId: string) => {
    setUnits(units.filter((unit) => unit.id !== unitId));
  };

  const handleSave = () => {
    if (!item) return;
    if (remainingQty < 0) {
      alert("Tổng số lượng phân rã không được lớn hơn số lượng ban đầu.");
      return;
    }
    onSave(item.id, units);
    onClose();
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Phân rã Lô hàng: {item.itemCode}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-md">
            <div>
              <span className="font-medium">Mô tả:</span> {item.description}
            </div>
            <div>
              <span className="font-medium">Tổng SL:</span> {item.quantity}{" "}
              {item.unit}
            </div>
            <div
              className={remainingQty < 0 ? "text-red-600" : "text-green-600"}
            >
              <span className="font-medium">SL còn lại:</span>{" "}
              {remainingQty.toFixed(2)} {item.unit}
            </div>
          </div>

          {/* Form thêm mới */}
          <div className="flex items-end gap-2 mb-4">
            <div className="flex-grow">
              <label className="text-sm font-medium text-gray-700">
                Số lượng cho đơn vị mới
              </label>
              <Input
                type="number"
                placeholder={`VD: 150.5`}
                value={newUnitQty}
                onChange={(e) => setNewUnitQty(e.target.value)}
              />
            </div>
            <Button onClick={handleAddUnit} disabled={!newUnitQty}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm đơn vị
            </Button>
          </div>

          {/* Bảng các đơn vị đã phân rã */}
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Tên Đơn vị
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Số lượng
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {units.map((unit) => (
                  <tr key={unit.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                      {unit.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {unit.quantity} {item.unit}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveUnit(unit.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {units.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      Chưa có đơn vị nào được phân rã.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end items-center p-4 border-t gap-2">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={remainingQty < 0}>
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BreakdownModal;
