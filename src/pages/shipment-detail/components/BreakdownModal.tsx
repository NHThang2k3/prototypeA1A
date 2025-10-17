// Path: src/pages/shipment-detail/components/BreakdownModal.tsx

import React, { useState, useEffect } from "react";
import type { ShipmentItem, BreakdownItem } from "../types";
import { X, PlusCircle, Trash2 } from "lucide-react";

interface BreakdownModalProps {
  item: ShipmentItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (breakdownData: BreakdownItem[]) => void;
}

const BreakdownModal: React.FC<BreakdownModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  const [breakdownItems, setBreakdownItems] = useState<
    Partial<BreakdownItem>[]
  >([]);

  useEffect(() => {
    if (item && item.breakdown && item.breakdown.length > 0) {
      setBreakdownItems(item.breakdown);
    } else if (item) {
      // Khởi tạo một dòng trống nếu chưa có dữ liệu
      setBreakdownItems([
        { parentId: item.id, itemNumber: 1, quantity: undefined },
      ]);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleAddItem = () => {
    setBreakdownItems([
      ...breakdownItems,
      {
        parentId: item.id,
        itemNumber: breakdownItems.length + 1,
        quantity: undefined,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = breakdownItems.filter((_, i) => i !== index);
    // Cập nhật lại itemNumber
    setBreakdownItems(
      newItems.map((it, idx) => ({ ...it, itemNumber: idx + 1 }))
    );
  };

  const handleQuantityChange = (index: number, value: string) => {
    const newItems = [...breakdownItems];
    const quantity = parseFloat(value);
    newItems[index].quantity = isNaN(quantity) ? undefined : quantity;
    setBreakdownItems(newItems);
  };

  const handleSaveClick = () => {
    const finalData = breakdownItems
      .filter((it) => it.quantity !== undefined && it.quantity > 0)
      .map((it, index) => ({
        ...it,
        uniqueId: it.uniqueId || `${item.id}-${index + 1}-${Date.now()}`,
        printStatus: it.printStatus || "not_printed",
      })) as BreakdownItem[];
    onSave(finalData);
  };

  const totalBreakdownQuantity = breakdownItems.reduce(
    (sum, it) => sum + (it.quantity || 0),
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Phân rã chi tiết: {item.name} ({item.sku})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-baseline mb-4 p-3 bg-gray-50 rounded-md">
            <div>
              <span className="text-sm text-gray-600">
                Tổng số lượng (Packing List):
              </span>
              <p className="font-bold text-xl text-indigo-600">
                {item.quantity.toLocaleString()} {item.uom}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Tổng đã phân rã:</span>
              <p
                className={`font-bold text-xl ${
                  totalBreakdownQuantity > item.quantity
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {totalBreakdownQuantity.toLocaleString()} {item.uom}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {breakdownItems.map((breakdown, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 border rounded-md"
              >
                <span className="font-medium text-gray-700 w-24">
                  Cuộn/Thùng {breakdown.itemNumber}:
                </span>
                <input
                  type="number"
                  placeholder={`Số lượng (${item.uom})`}
                  value={breakdown.quantity || ""}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  className="form-input flex-grow border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Xóa dòng"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddItem}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            <PlusCircle className="w-5 h-5" />
            Thêm dòng
          </button>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakdownModal;
