// src/pages/packing-list-management/components/PackingListTable.tsx

import React, { useState, useMemo } from "react";
import type { PackingListItem } from "../types";
import StatusBadge from "./StatusBadge";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { QrCode, Sprout, Undo2 } from "lucide-react";

interface PackingListTableProps {
  items: PackingListItem[];
  onBreakdown: (item: PackingListItem) => void; // Hàm mở modal
  onPrint: (itemIds: Set<string>) => void; // Hàm xử lý in/in lại
}

const PackingListTable: React.FC<PackingListTableProps> = ({
  items,
  onBreakdown,
  onPrint,
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Chỉ cho phép chọn những mục đã được phân rã hoặc đã in
      const selectableItems = items
        .filter(
          (item) =>
            item.breakdownUnits.length > 0 || item.printStatus === "PRINTED"
        )
        .map((item) => item.id);
      setSelectedItems(new Set(selectableItems));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelectedItems = new Set(selectedItems);
    if (checked) {
      newSelectedItems.add(itemId);
    } else {
      newSelectedItems.delete(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const allSelectableItems = useMemo(() => {
    return items.filter(
      (item) => item.breakdownUnits.length > 0 || item.printStatus === "PRINTED"
    );
  }, [items]);

  const isAllSelected = useMemo(() => {
    return (
      allSelectableItems.length > 0 &&
      selectedItems.size === allSelectableItems.length
    );
  }, [allSelectableItems, selectedItems]);

  const handlePrintSelected = () => {
    if (selectedItems.size === 0) {
      alert("Vui lòng chọn ít nhất một vật tư để in.");
      return;
    }
    onPrint(selectedItems);
    setSelectedItems(new Set()); // Xóa lựa chọn sau khi in
  };

  const handleReprint = (item: PackingListItem) => {
    onPrint(new Set([item.id]));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-800 flex-grow">
          Danh sách vật tư
        </h3>
        <Button
          size="sm"
          onClick={handlePrintSelected}
          disabled={selectedItems.size === 0}
        >
          <QrCode className="w-4 h-4 mr-2" />
          In QR cho mục đã chọn ({selectedItems.size})
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="p-4">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all items"
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mã Vật tư
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mô tả
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Màu sắc
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Số Lot
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Số lượng
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trạng thái
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
            {items.map((item) => {
              const isSelectable =
                item.breakdownUnits.length > 0 ||
                item.printStatus === "PRINTED";
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={(checked) =>
                        handleSelectItem(item.id, !!checked)
                      }
                      disabled={!isSelectable}
                      aria-label={`Select item ${item.itemCode}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.itemCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.color}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.lotNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={item.printStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    {item.printStatus === "PRINTED" ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReprint(item)}
                      >
                        <Undo2 className="w-4 h-4 mr-2" />
                        In lại
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onBreakdown(item)}
                      >
                        <Sprout className="w-4 h-4 mr-2" />
                        Phân rã
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackingListTable;
