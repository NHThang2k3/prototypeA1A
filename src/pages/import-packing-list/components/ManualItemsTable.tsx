import React from "react";
import { Trash2, PlusCircle } from "lucide-react";
// Sử dụng 'import type' để chỉ rõ ràng đây là một type import
import type { ShipmentItem } from "../types";

interface ManualItemsTableProps {
  items: ShipmentItem[];
  onItemsChange: (items: ShipmentItem[]) => void;
}

const ManualItemsTable: React.FC<ManualItemsTableProps> = ({
  items,
  onItemsChange,
}) => {
  const handleItemChange = (
    index: number,
    field: keyof ShipmentItem,
    value: string | number
  ) => {
    // Tạo một bản sao của mảng items để không thay đổi state gốc
    const newItems = [...items];

    // Tạo một đối tượng item đã được cập nhật bằng spread syntax
    const updatedItem = {
      ...newItems[index], // Sao chép tất cả thuộc tính của item cũ
      [field]: value, // Ghi đè lên thuộc tính cần thay đổi một cách linh động
    };

    // Thay thế item cũ trong mảng bằng item đã cập nhật
    newItems[index] = updatedItem;

    // TODO: Khi người dùng nhập SKU, tự động điền Tên và ĐVT từ API
    if (field === "sku") {
      newItems[index].name = `Tên cho SKU ${value}`; // Giả lập
      newItems[index].uom = "Cái"; // Giả lập
    }
    onItemsChange(newItems);
  };

  const addNewItem = () => {
    const newItem: ShipmentItem = {
      id: new Date().toISOString(), // ID tạm
      sku: "",
      name: "",
      quantity: 0,
      uom: "",
      batch: "",
    };
    onItemsChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Mã VT (SKU)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Tên vật tư
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ĐVT
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lô
              </th>
              <th className="relative px-4 py-3">
                <span className="sr-only">Xóa</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.sku}
                    onChange={(e) =>
                      handleItemChange(index, "sku", e.target.value)
                    }
                    className="form-input w-full text-sm border-gray-300 rounded-md"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.name}
                    readOnly
                    className="form-input w-full text-sm border-gray-300 rounded-md bg-gray-100"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    className="form-input w-full text-sm border-gray-300 rounded-md"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.uom}
                    readOnly
                    className="form-input w-full text-sm border-gray-300 rounded-md bg-gray-100"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    // Thêm || "" để tránh lỗi controlled-uncontrolled component khi item.batch là undefined
                    value={item.batch || ""}
                    onChange={(e) =>
                      handleItemChange(index, "batch", e.target.value)
                    }
                    className="form-input w-full text-sm border-gray-300 rounded-md"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={addNewItem}
        className="mt-4 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Thêm dòng
      </button>
    </div>
  );
};

export default ManualItemsTable;
