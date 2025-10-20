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
    getInventoryByItem(itemCode, color).then((data) => {
      setInventory(data);
      setLoading(false);
    });
  }, [itemCode, color]);

  const handleSelection = (roll: InventoryRoll, isChecked: boolean) => {
    const newSelected = new Map(selected);
    if (isChecked) {
      newSelected.set(roll.QRCode, 0); // Start with 0 yards
    } else {
      newSelected.delete(roll.QRCode);
    }
    setSelected(newSelected);
  };

  const handleQuantityChange = (qrCode: string, yards: number, max: number) => {
    const newQuantity = Math.max(0, Math.min(yards, max));
    const newSelected = new Map(selected);
    if (newSelected.has(qrCode)) {
      newSelected.set(qrCode, newQuantity);
      setSelected(newSelected);
    }
  };

  useEffect(() => {
    const selectedRollsData: SelectedInventoryRoll[] = [];
    selected.forEach((issuedYards, qrCode) => {
      const originalRoll = inventory.find((r) => r.QRCode === qrCode);
      if (originalRoll) {
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
          2. Select Fabric Rolls from Inventory
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
              <th className="p-3">Select</th>
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
                  selected.has(roll.QRCode)
                    ? "bg-indigo-50"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(roll.QRCode)}
                    onChange={(e) => handleSelection(roll, e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                </td>
                {ALL_COLUMNS.map(
                  (col) =>
                    visibleColumns.has(col.key) && (
                      <td key={col.key} className="p-3 whitespace-nowrap">
                        {roll[col.key as keyof InventoryRoll]}
                      </td>
                    )
                )}
                <td className="p-2">
                  {selected.has(roll.QRCode) && (
                    <input
                      type="number"
                      value={selected.get(roll.QRCode)}
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
                    />
                  )}
                </td>
              </tr>
            ))}
            {inventory.length === 0 && (
              <tr>
                <td
                  colSpan={visibleColumns.size + 2}
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
