// Path: src/pages/qr-scan/components/IssueQuantityInput.tsx

import React, { useState } from "react";
import type { ScannedItem, PickingListItem } from "../types";
import { Check, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface IssueQuantityInputProps {
  item: ScannedItem;
  pickingInfo: PickingListItem;
  onSubmit: (quantity: number) => void;
  onCancel: () => void;
}

const IssueQuantityInput: React.FC<IssueQuantityInputProps> = ({
  item,
  pickingInfo,
  onSubmit,
  onCancel,
}) => {
  const [quantity, setQuantity] = useState("");

  const remainingNeeded =
    pickingInfo.requiredQuantity - pickingInfo.pickedQuantity;
  const maxCanTake = Math.min(item.quantity, remainingNeeded);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numQuantity = parseFloat(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      toast.error("Vui lòng nhập số lượng hợp lệ.");
      return;
    }
    if (numQuantity > maxCanTake) {
      toast.error(`Số lượng không được vượt quá ${maxCanTake} ${item.uom}.`);
      return;
    }
    onSubmit(numQuantity);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Xác nhận số lượng xuất
        </h2>
        <p className="text-gray-600 mb-4">
          Mặt hàng: <strong>{item.name}</strong>
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md mb-4 text-sm">
          <p>
            Cần lấy:{" "}
            <strong className="text-red-600">
              {remainingNeeded.toLocaleString()} {pickingInfo.uom}
            </strong>
          </p>
          <p>
            Tồn kho của cuộn/thùng này:{" "}
            <strong>
              {item.quantity.toLocaleString()} {item.uom}
            </strong>
          </p>
          <p className="font-bold mt-1">
            {" "}
            == Tối đa có thể lấy: {maxCanTake.toLocaleString()} {item.uom}
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Số lượng thực tế xuất đi ({item.uom})
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Nhập số ${item.uom.toLowerCase()}...`}
            autoFocus
            step="any"
          />
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-lg bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center shadow-md"
          >
            <X className="mr-2" /> Hủy
          </button>
          <button
            type="submit"
            className="w-full text-lg bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center shadow-md"
          >
            <Check className="mr-2" /> Xác Nhận
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueQuantityInput;
