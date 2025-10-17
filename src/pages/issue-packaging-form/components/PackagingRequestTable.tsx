import { Trash2 } from "lucide-react";
import { availablePackagingMaterials } from "../data";
import type { RequestItem } from "../types";

interface PackagingRequestTableProps {
  items: RequestItem[];
  onItemChange: (
    id: string,
    field: keyof RequestItem,
    value: RequestItem[keyof RequestItem]
  ) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
}

const PackagingRequestTable = ({
  items,
  onItemChange,
  onRemoveItem,
  onAddItem,
}: PackagingRequestTableProps) => {
  const handleSkuChange = (id: string, newSku: string) => {
    const material = availablePackagingMaterials.find(
      (m) => m.sku.toLowerCase() === newSku.toLowerCase()
    );
    if (material) {
      onItemChange(id, "materialId", material.id);
      onItemChange(id, "sku", material.sku);
      onItemChange(id, "name", material.name);
      onItemChange(id, "uom", material.uom);
      onItemChange(id, "stock", material.stock);
    } else {
      onItemChange(id, "sku", newSku);
      onItemChange(id, "name", "Không tìm thấy vật tư");
      onItemChange(id, "uom", "");
      onItemChange(id, "stock", 0);
    }
  };

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 w-2/12"
                >
                  Mã VT (SKU)
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-4/12"
                >
                  Tên vật tư
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-1/12"
                >
                  Tồn kho
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-1/12"
                >
                  ĐVT
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-2/12"
                >
                  Số lượng yêu cầu
                </th>
                <th
                  scope="col"
                  className="relative py-3.5 pl-3 pr-4 sm:pr-0 w-1/12"
                >
                  <span className="sr-only">Xóa</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    <input
                      type="text"
                      list="skus"
                      value={item.sku}
                      onChange={(e) => handleSkuChange(item.id, e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Nhập SKU..."
                    />
                    <datalist id="skus">
                      {availablePackagingMaterials.map((m) => (
                        <option key={m.id} value={m.sku} />
                      ))}
                    </datalist>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.stock.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.uom}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        onItemChange(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={onAddItem}
            className="mt-4 px-4 py-2 border border-dashed border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            + Thêm vật tư
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackagingRequestTable;
