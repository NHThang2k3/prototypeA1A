import React, { useState, type FC } from "react";
import InventoryListPage from "../../inventory-list/InventoryListPage";
import { DUMMY_FABRIC_DATA } from "../../inventory-list/data";
import type { FabricRoll } from "../../inventory-list/types";

// Re-defining Modal components as they are not exported from the original file
const Modal: FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}> = ({ title, children, onClose, maxWidth = "max-w-md" }) => (
  // --- THAY ĐỔI Ở ĐÂY ---
  // Bỏ các class của modal popup, biến nó thành một card bình thường
  // Thêm mt-6 (margin-top) để tạo khoảng cách
  <div className="mt-6">
    {/* Thêm mx-auto để căn giữa card và một chút style (border, shadow-md) */}
    <div
      className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full ${maxWidth} mx-auto`}
    >
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

const MultiTransferLocationModal: FC<{
  rolls: FabricRoll[];
  onSubmit: (newLocation: string) => void;
  onCancel: () => void;
}> = ({ rolls, onSubmit, onCancel }) => {
  const [newLocation, setNewLocation] = useState("");

  return (
    <Modal title={`Transfer ${rolls.length} Item(s)`} onClose={onCancel}>
      <p className="mb-2 text-sm text-gray-600">
        The following items will be moved:
      </p>
      <div className="mb-4 p-2 border rounded-md bg-gray-50 max-h-40 overflow-y-auto">
        <ul className="list-disc list-inside text-sm text-gray-800">
          {rolls.map((roll) => (
            <li key={roll.id}>
              {roll.qrCode} (Current: {roll.location})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label
          htmlFor="new-location"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          New Location
        </label>
        <input
          type="text"
          id="new-location"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., F2-10-05"
        />
      </div>
      <button
        onClick={() => onSubmit(newLocation)}
        disabled={!newLocation}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        Confirm Transfer
      </button>
    </Modal>
  );
};

const MultiLocationHistoryModal: FC<{
  rolls: FabricRoll[];
  onClose: () => void;
}> = ({ rolls, onClose }) => {
  return (
    <Modal
      title={`Location History for ${rolls.length} Item(s)`}
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {rolls.map((roll) => (
          <div key={roll.id}>
            <h4 className="font-semibold text-lg text-gray-800 mb-2 border-b pb-1">
              {roll.qrCode}
            </h4>
            {roll.locationHistory.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Date Time
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      From
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      To
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...roll.locationHistory].reverse().map((entry, index) => (
                    <tr key={index}>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                        {new Date(entry.dateTime).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {entry.from}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {entry.to}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {entry.changedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-sm text-gray-500 py-2">
                No location history.
              </p>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

const InventoryListPageWrapper: React.FC = () => {
  const dummyRolls: FabricRoll[] = DUMMY_FABRIC_DATA.slice(0, 2).map(
    (roll) => ({
      ...roll,
      locationHistory: [
        {
          dateTime: new Date().toISOString(),
          from: "WH-A1-01",
          to: roll.location,
          changedBy: "System",
        },
      ],
    })
  );

  const handleTransferSubmit = (newLocation: string) => {
    console.log("Transferring to:", newLocation);
  };

  return (
    // Sử dụng flex flex-col để các component con xếp chồng lên nhau
    <div className="flex flex-col">
      <InventoryListPage />

      {/* Các modals này giờ sẽ hiển thị như các component bình thường bên dưới */}
      {dummyRolls.length > 0 && (
        <MultiTransferLocationModal
          rolls={dummyRolls}
          onCancel={() => {}}
          onSubmit={handleTransferSubmit}
        />
      )}
      {dummyRolls.length > 0 && (
        <MultiLocationHistoryModal rolls={dummyRolls} onClose={() => {}} />
      )}
    </div>
  );
};

export default InventoryListPageWrapper;
