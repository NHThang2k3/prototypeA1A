// Path: src/pages/location-management/components/LocationItemsModal.tsx

import React from "react";
import { X } from "lucide-react";
import type { LocationItem, FabricRoll } from "../types";
import { Button } from "../../../components/ui/button";

interface LocationItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationItem | null;
  items: FabricRoll[];
  onMoveRoll: (
    rollId: string,
    oldLocationId: string,
    newLocationId: string
  ) => void;
}

const LocationItemsModal: React.FC<LocationItemsModalProps> = ({
  isOpen,
  onClose,
  location,
  items,
  onMoveRoll,
}) => {
  if (!isOpen || !location) return null;

  const handleMoveClick = (roll: FabricRoll) => {
    const newLocationId = prompt(
      `Enter new location ID for roll ${roll.id}:`,
      roll.locationId
    );
    if (newLocationId && newLocationId !== roll.locationId) {
      onMoveRoll(roll.id, roll.locationId, newLocationId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 h-3/4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            Items in Location:{" "}
            <span className="text-blue-600">{location.id}</span>
          </h2>
          <Button variant="ghost" size="icon" type="button" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {items.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Color
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Yards
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Roll No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Lot No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    QR Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {item.colorCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {item.yards.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {item.rollNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {item.lotNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                      QR-{item.id}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveClick(item)}
                      >
                        Move
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">This location is empty.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-4 border-t">
          <Button variant="outline" type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationItemsModal;
