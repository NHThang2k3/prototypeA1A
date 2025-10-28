import React, { useState, type FC } from "react";
import AccessoryInventoryListPage from "../../accessory-inventory-list/AccessoryInventoryListPage";
import { DUMMY_ACCESSORY_DATA } from "../../accessory-inventory-list/data";
import type { AccessoryItem } from "../../accessory-inventory-list/types";

// Re-defining Modal and IssueModal as they are not exported from the original file
const Modal: FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  <div className="mt-4">
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
      </div>
      <div>{children}</div>
    </div>
  </div>
);

const IssueModal: FC<{
  item: AccessoryItem;
  onSubmit: (quantity: number) => void;
  onCancel: () => void;
}> = ({ item, onSubmit, onCancel }) => {
  const [quantity, setQuantity] = useState<number | string>("");
  return (
    <Modal title={`Issue Accessory: ${item.itemNumber}`} onClose={onCancel}>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">{item.materialName}</span> - {item.color}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Current quantity: <span className="font-bold">{item.quantity}</span>{" "}
        {item.unit}
      </p>
      <div>
        <label
          htmlFor="quantity-issue"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quantity to issue
        </label>
        <input
          type="number"
          id="quantity-issue"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={`e.g., 100`}
          min="1"
          max={item.quantity}
        />
      </div>
      <button
        onClick={() => onSubmit(Number(quantity))}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        disabled={
          !quantity || Number(quantity) <= 0 || Number(quantity) > item.quantity
        }
      >
        Confirm Issue
      </button>
    </Modal>
  );
};

const AccessoryInventoryListPageWrapper: FC = () => {
  const [showIssueModal, setShowIssueModal] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(true);

  const dummyItem = DUMMY_ACCESSORY_DATA[0]; // Use the first dummy item for modals

  const handleIssueSubmit = (quantity: number) => {
    console.log(`Issue ${quantity} of ${dummyItem.itemNumber}`);
    setShowIssueModal(false);
  };

  const handleTransferSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newLocation = (
      e.currentTarget.elements.namedItem("new-location") as HTMLInputElement
    ).value;
    console.log(`Transfer ${dummyItem.itemNumber} to ${newLocation}`);
    setShowTransferModal(false);
  };

  return (
    <div>
      <AccessoryInventoryListPage />

      {showIssueModal && dummyItem && (
        <IssueModal
          item={dummyItem}
          onSubmit={handleIssueSubmit}
          onCancel={() => setShowIssueModal(false)}
        />
      )}

      {showTransferModal && dummyItem && (
        <Modal
          title={`Transfer Location for ${dummyItem.itemNumber}`}
          onClose={() => setShowTransferModal(false)}
        >
          <form onSubmit={handleTransferSubmit}>
            <p className="mb-4">
              Current location:{" "}
              <span className="font-semibold">{dummyItem.location}</span>
            </p>
            <label
              htmlFor="new-location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New location
            </label>
            <input
              type="text"
              id="new-location"
              name="new-location"
              className="block w-full py-2 px-3 border border-gray-300 rounded-md"
              placeholder="e.g., Kệ Z-99-99"
              required
            />
            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Confirm Transfer
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AccessoryInventoryListPageWrapper;
