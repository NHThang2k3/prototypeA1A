// Path: src/pages/issue-fabric-form/components/FabricRequestTable.tsx

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { FabricRequestItem, SelectedRoll } from "../types";
import { MOCK_FABRIC_SKUS } from "../data";
import RollSelectionModal from "./RollSelectionModal";

interface FabricRequestTableProps {
  items: FabricRequestItem[];
  onItemsChange: (items: FabricRequestItem[]) => void;
}

const FabricRequestTable: React.FC<FabricRequestTableProps> = ({
  items,
  onItemsChange,
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    itemToEditId: string | null;
  }>({ isOpen: false, itemToEditId: null });

  const handleAddItem = () => {
    const newItem: FabricRequestItem = {
      id: Date.now().toString(),
      sku: "",
      name: "",
      color: "",
      width: "",
      availableQty: 0,
      requestedRolls: [],
    };
    onItemsChange([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const handleSkuChange = (id: string, newSku: string) => {
    const selectedFabric = MOCK_FABRIC_SKUS.find((f) => f.sku === newSku);
    onItemsChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              sku: newSku,
              name: selectedFabric?.name || "",
              color: selectedFabric?.color || "",
              width: selectedFabric?.width || "",
              availableQty: selectedFabric?.availableQty || 0,
              requestedRolls: [], // Reset lựa chọn cây vải khi đổi SKU
            }
          : item
      )
    );
  };

  const handleOpenModal = (itemId: string) => {
    setModalState({ isOpen: true, itemToEditId: itemId });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, itemToEditId: null });
  };

  const handleSaveRolls = (selectedRolls: SelectedRoll[]) => {
    if (modalState.itemToEditId) {
      onItemsChange(
        items.map((item) =>
          item.id === modalState.itemToEditId
            ? { ...item, requestedRolls: selectedRolls }
            : item
        )
      );
    }
    handleCloseModal();
  };

  const itemToEdit = items.find((item) => item.id === modalState.itemToEditId);
  const totalRequestedMeters = (rolls: SelectedRoll[]) =>
    rolls.reduce((sum, roll) => sum + roll.quantity, 0).toFixed(2);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Chi tiết vật tư yêu cầu
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="p-3 min-w-[200px]">Mã Vải (SKU)</th>
              <th className="p-3">Tên Vải</th>
              <th className="p-3">Màu</th>
              <th className="p-3">Khổ</th>
              <th className="p-3">Tồn kho</th>
              <th className="p-3">Số lượng yêu cầu</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="bg-white border-b">
                <td className="p-2">
                  <select
                    value={item.sku}
                    onChange={(e) => handleSkuChange(item.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Chọn mã vải...</option>
                    {MOCK_FABRIC_SKUS.map((f) => (
                      <option key={f.sku} value={f.sku}>
                        {f.sku}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.color}</td>
                <td className="p-3">{item.width}</td>
                <td className="p-3">{item.availableQty}m</td>
                <td className="p-3">
                  {item.sku ? (
                    <div className="flex flex-col">
                      <span className="font-semibold text-indigo-600">
                        {totalRequestedMeters(item.requestedRolls)}m
                      </span>
                      <button
                        onClick={() => handleOpenModal(item.id)}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        ({item.requestedRolls.length} cây vải)
                      </button>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleAddItem}
        className="mt-4 flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
      >
        <Plus size={16} className="mr-2" />
        Thêm Vải
      </button>

      {itemToEdit && (
        <RollSelectionModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          sku={itemToEdit.sku}
          initialSelectedRolls={itemToEdit.requestedRolls}
          onSave={handleSaveRolls}
        />
      )}
    </div>
  );
};

export default FabricRequestTable;
