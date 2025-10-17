// Path: src/pages/shipment-detail/components/ItemsToPrintTable.tsx

import React, { useState } from "react";
import type { ShipmentItem } from "../types";
import StatusBadge from "./StatusBadge";
import { Printer, Split, ChevronDown, ChevronRight } from "lucide-react";

interface ItemsToPrintTableProps {
  items: ShipmentItem[];
  selectedItems: (number | string)[]; // Can be parent ID or uniqueId of breakdown item
  onSelectionChange: (selectedIds: (number | string)[]) => void;
  onBreakdown: (item: ShipmentItem) => void; // Callback to open modal
}

const ItemsToPrintTable: React.FC<ItemsToPrintTableProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  onBreakdown,
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const handleToggleExpand = (itemId: number) => {
    setExpandedRows((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds: (number | string)[] = [];
      items.forEach((item) => {
        allIds.push(item.id);
        item.breakdown?.forEach((b) => allIds.push(b.uniqueId));
      });
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (id: number | string) => {
    const isSelected = selectedItems.includes(id);
    if (isSelected) {
      onSelectionChange(selectedItems.filter((itemId) => itemId !== id));
    } else {
      onSelectionChange([...selectedItems, id]);
    }
  };

  const allIds = items.flatMap((item) => [
    item.id,
    ...(item.breakdown?.map((b) => b.uniqueId) || []),
  ]);
  const isAllSelected =
    items.length > 0 && selectedItems.length === allIds.length;

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="relative px-6 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tên vật tư / Chi tiết
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mã VT (SKU)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Số lượng
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
                  Trạng thái in
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  {/* Parent Row */}
                  <tr
                    className={
                      selectedItems.includes(item.id) ? "bg-indigo-50" : ""
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {item.breakdown && item.breakdown.length > 0 && (
                          <button
                            onClick={() => handleToggleExpand(item.id)}
                            className="mr-2 p-1 rounded-full hover:bg-gray-200"
                          >
                            {expandedRows[item.id] ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <span
                          className={
                            !(item.breakdown && item.breakdown.length > 0)
                              ? "ml-7"
                              : ""
                          }
                        >
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-bold">
                      {item.quantity.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.uom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <StatusBadge status={item.printStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => onBreakdown(item)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 mx-auto"
                      >
                        <Split className="w-4 h-4" /> Phân rã
                      </button>
                    </td>
                  </tr>

                  {/* Child Rows (Breakdown) */}
                  {expandedRows[item.id] &&
                    item.breakdown?.map((bItem) => (
                      <tr
                        key={bItem.uniqueId}
                        className={`bg-gray-50 ${
                          selectedItems.includes(bItem.uniqueId)
                            ? "bg-indigo-100"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-3 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="ml-8 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={selectedItems.includes(bItem.uniqueId)}
                            onChange={() => handleSelectItem(bItem.uniqueId)}
                          />
                        </td>
                        <td className="pl-16 pr-6 py-3 whitespace-nowrap text-sm text-gray-700">
                          Cuộn/Thùng #{bItem.itemNumber}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500"></td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                          {bItem.quantity.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.uom}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          <StatusBadge status={bItem.printStatus} />
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-center text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 mx-auto">
                            <Printer className="w-4 h-4" /> In
                          </button>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemsToPrintTable;
