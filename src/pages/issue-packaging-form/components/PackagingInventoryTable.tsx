// Path: src/pages/issue-packaging-form/components/PackagingInventoryTable.tsx

import React, { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import type { PackagingInventoryItem, SelectedPackagingItem } from "../types";
import { getPackagingInventory } from "../data";
import ColumnSelector from "./ColumnSelector";

interface Props {
  bomId: string; // Used to fetch relevant items
  onSelectionChange: (items: SelectedPackagingItem[]) => void;
}

const ALL_COLUMNS = [
  { key: "QRCode", label: "QR Code" },
  { key: "ItemNumber", label: "Item Number" },
  { key: "MaterialName", label: "Material Name" },
  { key: "Color", label: "Color" },
  { key: "Size", label: "Size" },
  { key: "Quantity", label: "Balance Qty" },
  { key: "Unit", label: "Unit" },
  { key: "Location", label: "Location" },
  { key: "Supplier", label: "Supplier" },
];

const DEFAULT_VISIBLE_COLUMNS = new Set([
  "QRCode",
  "ItemNumber",
  "MaterialName",
  "Color",
  "Quantity",
  "Unit",
  "Location",
]);

const PackagingInventoryTable: React.FC<Props> = ({
  bomId,
  onSelectionChange,
}) => {
  const [inventory, setInventory] = useState<PackagingInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Map<string, number>>(new Map());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    DEFAULT_VISIBLE_COLUMNS
  );

  useEffect(() => {
    setLoading(true);
    setSelected(new Map());
    getPackagingInventory(bomId).then((data) => {
      setInventory(data);
      setLoading(false);
    });
  }, [bomId]);

  const handleSelection = (
    item: PackagingInventoryItem,
    isChecked: boolean
  ) => {
    const newSelected = new Map(selected);
    if (isChecked) {
      newSelected.set(item.QRCode, 0);
    } else {
      newSelected.delete(item.QRCode);
    }
    setSelected(newSelected);
  };

  const handleQuantityChange = (qrCode: string, qty: number, max: number) => {
    const newQuantity = Math.max(0, Math.min(qty, max));
    const newSelected = new Map(selected);
    if (newSelected.has(qrCode)) {
      newSelected.set(qrCode, newQuantity);
      setSelected(newSelected);
    }
  };

  useEffect(() => {
    const selectedItemsData: SelectedPackagingItem[] = [];
    selected.forEach((issuedQuantity, qrCode) => {
      const originalItem = inventory.find((i) => i.QRCode === qrCode);
      if (originalItem) {
        selectedItemsData.push({ ...originalItem, issuedQuantity });
      }
    });
    onSelectionChange(selectedItemsData);
  }, [selected, inventory, onSelectionChange]);

  const totalSelectedQuantity = useMemo(
    () => Array.from(selected.values()).reduce((sum, qty) => sum + qty, 0),
    [selected]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm border">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <span className="ml-3 text-gray-600">
          Loading available packaging...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          2. Select Packaging from Inventory
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
              <th className="p-3 min-w-[150px]">Qty to Issue</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr
                key={item.QRCode}
                className={`border-b ${
                  selected.has(item.QRCode)
                    ? "bg-indigo-50"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(item.QRCode)}
                    onChange={(e) => handleSelection(item, e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                </td>
                {ALL_COLUMNS.map(
                  (col) =>
                    visibleColumns.has(col.key) && (
                      <td key={col.key} className="p-3 whitespace-nowrap">
                        {item[col.key as keyof PackagingInventoryItem]}
                      </td>
                    )
                )}
                <td className="p-2">
                  {selected.has(item.QRCode) && (
                    <input
                      type="number"
                      value={selected.get(item.QRCode)}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.QRCode,
                          parseInt(e.target.value) || 0,
                          item.Quantity
                        )
                      }
                      min="0"
                      max={item.Quantity}
                      step="1"
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
                  No available inventory found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 font-semibold text-right">
        Total Quantity to Issue:{" "}
        <span className="text-indigo-600 text-lg">
          {totalSelectedQuantity.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default PackagingInventoryTable;
