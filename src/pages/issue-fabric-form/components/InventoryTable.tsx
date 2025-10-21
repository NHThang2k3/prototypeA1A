// Path: src/pages/issue-fabric-form/components/InventoryTable.tsx

import React, { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import type { InventoryRoll, SelectedInventoryRoll } from "../types";
import { getInventoryByItem } from "../data";
import ColumnSelector from "./ColumnSelector";

interface Props {
  itemCode: string;
  color: string;
  onSelectionChange: (rolls: SelectedInventoryRoll[]) => void;
  requestQuantity: number;
}

const ALL_COLUMNS = [
  { key: "QRCode", label: "QR Code" },
  { key: "RollNo", label: "Roll No" },
  { key: "Location", label: "Location" },
  { key: "Color", label: "Color" },
  { key: "LotNo", label: "Lot No" },
  { key: "Width", label: "Width" },
  { key: "BalanceYards", label: "Balance Yards" },
  { key: "QCStatus", label: "QC Status" },
  { key: "Supplier", label: "Supplier" },
  { key: "PONumber", label: "PO Number" },
];

const DEFAULT_VISIBLE_COLUMNS = new Set([
  "QRCode",
  "RollNo",
  "Location",
  "Width",
  "BalanceYards",
  "QCStatus",
]);

const InventoryTable: React.FC<Props> = ({
  itemCode,
  color,
  onSelectionChange,
  requestQuantity,
}) => {
  const [inventory, setInventory] = useState<InventoryRoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Map<string, number>>(new Map());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    DEFAULT_VISIBLE_COLUMNS
  );

  useEffect(() => {
    setLoading(true);
    setSelected(new Map());
    getInventoryByItem(itemCode, color).then((availableRolls) => {
      setInventory(availableRolls);

      const sortedRolls = [...availableRolls].sort(
        (a, b) => a.BalanceYards - b.BalanceYards
      );

      const newSelected = new Map<string, number>();
      let yardsStillNeeded = requestQuantity;

      for (const roll of sortedRolls) {
        if (yardsStillNeeded <= 0) break;

        const yardsToIssue = Math.min(roll.BalanceYards, yardsStillNeeded);
        newSelected.set(roll.QRCode, yardsToIssue);
        yardsStillNeeded -= yardsToIssue;
      }
      setSelected(newSelected);

      setLoading(false);
    });
  }, [itemCode, color, requestQuantity]);

  // Hàm handleSelection không còn cần thiết vì không còn checkbox

  const handleQuantityChange = (qrCode: string, yards: number, max: number) => {
    const newQuantity = Math.max(0, Math.min(yards, max));
    const newSelected = new Map(selected);

    // Cập nhật số lượng cho cuộn đã có trong danh sách chọn
    // Hoặc thêm mới nếu người dùng nhập số cho một cuộn chưa được chọn tự động
    if (newSelected.has(qrCode) || newQuantity > 0) {
      newSelected.set(qrCode, newQuantity);
    }

    // Nếu số lượng về 0, ta có thể xóa khỏi map để giao diện gọn hơn
    if (newQuantity === 0) {
      newSelected.delete(qrCode);
    }

    setSelected(newSelected);
  };

  useEffect(() => {
    const selectedRollsData: SelectedInventoryRoll[] = [];
    selected.forEach((issuedYards, qrCode) => {
      const originalRoll = inventory.find((r) => r.QRCode === qrCode);
      // Chỉ thêm vào danh sách cuối cùng nếu số yard xuất > 0
      if (originalRoll && issuedYards > 0) {
        selectedRollsData.push({ ...originalRoll, issuedYards });
      }
    });
    onSelectionChange(selectedRollsData);
  }, [selected, inventory, onSelectionChange]);

  const totalSelectedYards = useMemo(() => {
    return Array.from(selected.values()).reduce((sum, yards) => sum + yards, 0);
  }, [selected]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm border">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <span className="ml-3 text-gray-600">
          Loading available rolls for {itemCode}...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          2. Fabric Rolls from Inventory (Auto-Selected)
        </h2>
        <ColumnSelector
          allColumns={ALL_COLUMNS}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />
      </div>

      <div className="overflow-x-auto max-h-[60vh]">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
            <tr>
              {/* CỘT SELECT ĐÃ BỊ XÓA */}
              {ALL_COLUMNS.map(
                (col) =>
                  visibleColumns.has(col.key) && (
                    <th key={col.key} className="p-3">
                      {col.label}
                    </th>
                  )
              )}
              <th className="p-3 min-w-[150px]">Yards to Issue</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((roll) => (
              <tr
                key={roll.QRCode}
                className={`border-b ${
                  selected.has(roll.QRCode) &&
                  (selected.get(roll.QRCode) || 0) > 0
                    ? "bg-indigo-50"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {/* CHECKBOX ĐÃ BỊ XÓA */}
                {ALL_COLUMNS.map(
                  (col) =>
                    visibleColumns.has(col.key) && (
                      <td key={col.key} className="p-3 whitespace-nowrap">
                        {roll[col.key as keyof InventoryRoll]}
                      </td>
                    )
                )}
                <td className="p-2">
                  {/* Hiển thị input cho tất cả các dòng, nhưng chỉ có giá trị cho dòng được chọn */}
                  <input
                    type="number"
                    value={selected.get(roll.QRCode) || 0}
                    onChange={(e) =>
                      handleQuantityChange(
                        roll.QRCode,
                        parseFloat(e.target.value) || 0,
                        roll.BalanceYards
                      )
                    }
                    min="0"
                    max={roll.BalanceYards}
                    step="0.1"
                    className="w-28 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    // Thêm placeholder để gợi ý cho các cuộn chưa được chọn
                    placeholder="0"
                  />
                </td>
              </tr>
            ))}
            {inventory.length === 0 && (
              <tr>
                <td
                  // Cập nhật colSpan sau khi xóa 1 cột
                  colSpan={visibleColumns.size + 1}
                  className="text-center py-10 text-gray-500"
                >
                  No available inventory found for Item Code:{" "}
                  <strong>{itemCode}</strong> and Color:{" "}
                  <strong>{color}</strong>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 font-semibold text-right">
        Total Yards to Issue:{" "}
        <span className="text-indigo-600 text-lg">
          {totalSelectedYards.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default InventoryTable;
