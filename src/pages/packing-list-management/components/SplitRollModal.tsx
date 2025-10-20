// src/pages/packing-list-management/components/SplitRollModal.tsx

import React, { useState, useEffect } from "react";
import type { FabricRollItem } from "../types";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { X } from "lucide-react";

interface SplitRollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemId: string, splitYards: number) => void;
  item: FabricRollItem | null;
}

const SplitRollModal: React.FC<SplitRollModalProps> = ({
  isOpen,
  onClose,
  onSave,
  item,
}) => {
  const [splitYards, setSplitYards] = useState("");

  useEffect(() => {
    // Reset input when modal opens for a new item
    if (isOpen) {
      setSplitYards("");
    }
  }, [isOpen]);

  const newYardsValue = parseFloat(splitYards);
  const isInputValid =
    !isNaN(newYardsValue) &&
    newYardsValue > 0 &&
    newYardsValue < (item?.yards ?? 0);

  const handleSave = () => {
    if (!item || !isInputValid) {
      alert("Please enter a valid number of yards to split.");
      return;
    }
    onSave(item.id, newYardsValue);
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Split Roll: {item.itemCode}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <p>
              <span className="font-medium text-gray-600">
                Original Yards:{" "}
              </span>
              <span className="text-lg font-bold text-blue-600">
                {item.yards}
              </span>
            </p>
          </div>

          <div>
            <label
              htmlFor="split-yards"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Yards for NEW Roll
            </label>
            <Input
              id="split-yards"
              type="number"
              placeholder={`Enter value less than ${item.yards}`}
              value={splitYards}
              onChange={(e) => setSplitYards(e.target.value)}
              className={!isInputValid && splitYards ? "border-red-500" : ""}
            />
            {!isInputValid && splitYards && (
              <p className="text-xs text-red-600 mt-1">
                Please enter a number greater than 0 and less than {item.yards}.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end items-center p-4 border-t gap-2 bg-gray-50">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isInputValid}>
            Split Roll
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SplitRollModal;
