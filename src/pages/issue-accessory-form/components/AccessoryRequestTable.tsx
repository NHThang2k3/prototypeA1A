// Path: src/pages/issue-accessory-form/components/AccessoryRequestTable.tsx

import React from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { mockAccessories } from "../data";
import type { AccessoryRequestItem } from "../types";

interface AccessoryRequestTableProps {
  items: AccessoryRequestItem[];
  handleAddItem: () => void;
  handleItemChange: (
    id: string,
    field: keyof AccessoryRequestItem,
    value: AccessoryRequestItem[keyof AccessoryRequestItem]
  ) => void;
  handleRemoveItem: (id: string) => void;
}

const AccessoryRequestTable: React.FC<AccessoryRequestTableProps> = ({
  items,
  handleAddItem,
  handleItemChange,
  handleRemoveItem,
}) => {
  const handleSkuBlur = (id: string, sku: string) => {
    const accessory = mockAccessories.find(
      (acc) => acc.sku.toLowerCase() === sku.toLowerCase()
    );
    if (accessory) {
      handleItemChange(id, "name", accessory.name);
      handleItemChange(id, "uom", accessory.uom);
      handleItemChange(id, "stock", accessory.stock);
    } else {
      // Nếu không tìm thấy, xóa thông tin cũ
      handleItemChange(id, "name", "Không tìm thấy");
      handleItemChange(id, "uom", "");
      handleItemChange(id, "stock", 0);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
        Chi tiết phụ liệu yêu cầu
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"
              >
                Mã VT (SKU)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5"
              >
                Tên vật tư
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ĐVT
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tồn kho
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                SL Yêu cầu
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Xóa</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => {
              const quantityExceedsStock =
                item.quantity > item.stock && item.stock > 0;
              return (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      list="sku-datalist"
                      value={item.sku}
                      onChange={(e) =>
                        handleItemChange(item.id, "sku", e.target.value)
                      }
                      onBlur={(e) => handleSkuBlur(item.id, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      placeholder="Nhập mã SKU"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.uom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.stock.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className={`w-28 px-2 py-1 border rounded-md ${
                        quantityExceedsStock
                          ? "border-red-500 text-red-600"
                          : "border-gray-300"
                      }`}
                    />
                    {quantityExceedsStock && (
                      <p className="text-xs text-red-500 mt-1">Vượt tồn kho!</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Datalist để gợi ý SKU */}
        <datalist id="sku-datalist">
          {mockAccessories.map((acc) => (
            <option key={acc.sku} value={acc.sku} />
          ))}
        </datalist>
      </div>
      <div className="mt-4">
        <button
          onClick={handleAddItem}
          className="flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Thêm dòng</span>
        </button>
      </div>
    </div>
  );
};

export default AccessoryRequestTable;
