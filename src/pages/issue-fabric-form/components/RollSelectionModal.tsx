// Path: src/pages/issue-fabric-form/components/RollSelectionModal.tsx

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import type { AvailableRoll, SelectedRoll } from "../types";
import { getAvailableRollsBySku } from "../data";

interface RollSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sku: string;
  initialSelectedRolls: SelectedRoll[];
  onSave: (selectedRolls: SelectedRoll[]) => void;
}

const RollSelectionModal: React.FC<RollSelectionModalProps> = ({
  isOpen,
  onClose,
  sku,
  initialSelectedRolls,
  onSave,
}) => {
  const [availableRolls, setAvailableRolls] = useState<AvailableRoll[]>([]);
  const [selectedRolls, setSelectedRolls] =
    useState<SelectedRoll[]>(initialSelectedRolls);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && sku) {
      setLoading(true);
      // Reset state khi mở modal
      setSelectedRolls(initialSelectedRolls);
      getAvailableRollsBySku(sku).then((data) => {
        setAvailableRolls(data);
        setLoading(false);
      });
    }
  }, [isOpen, sku, initialSelectedRolls]);

  const handleToggleRoll = (roll: AvailableRoll, checked: boolean) => {
    if (checked) {
      setSelectedRolls([
        ...selectedRolls,
        {
          rollId: roll.id,
          location: roll.location,
          availableMeters: roll.availableMeters,
          quantity: 0, // Bắt đầu với số lượng 0
        },
      ]);
    } else {
      setSelectedRolls(selectedRolls.filter((r) => r.rollId !== roll.id));
    }
  };

  const handleQuantityChange = (rollId: string, quantity: number) => {
    setSelectedRolls(
      selectedRolls.map((r) =>
        r.rollId === rollId
          ? {
              ...r,
              quantity: Math.max(0, Math.min(r.availableMeters, quantity)),
            } // Đảm bảo số lượng hợp lệ
          : r
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Chọn cây vải cho SKU: {sku}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="p-3">
                    Chọn
                  </th>
                  <th scope="col" className="p-3">
                    Mã Cây Vải
                  </th>
                  <th scope="col" className="p-3">
                    Vị trí
                  </th>
                  <th scope="col" className="p-3">
                    Số mét còn lại
                  </th>
                  <th scope="col" className="p-3">
                    Số mét cần xuất
                  </th>
                </tr>
              </thead>
              <tbody>
                {availableRolls.map((roll) => {
                  const selection = selectedRolls.find(
                    (r) => r.rollId === roll.id
                  );
                  return (
                    <tr
                      key={roll.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={!!selection}
                          onChange={(e) =>
                            handleToggleRoll(roll, e.target.checked)
                          }
                          className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-3 font-medium text-gray-900">
                        {roll.id}
                      </td>
                      <td className="p-3">{roll.location}</td>
                      <td className="p-3">
                        {roll.availableMeters.toFixed(2)}m
                      </td>
                      <td className="p-3">
                        {selection && (
                          <input
                            type="number"
                            value={selection.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                roll.id,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            min="0"
                            max={roll.availableMeters}
                            step="0.1"
                            className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-end items-center p-4 border-t space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(selectedRolls.filter((r) => r.quantity > 0))} // Chỉ lưu những cây có số lượng > 0
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Lưu lựa chọn
          </button>
        </div>
      </div>
    </div>
  );
};

export default RollSelectionModal;
