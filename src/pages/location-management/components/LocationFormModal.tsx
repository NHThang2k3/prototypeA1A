// Path: src/pages/location-management/components/LocationFormModal.tsx

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { LocationItem } from "../types";
import { Button } from "../../../components/ui/button";

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (locationData: LocationItem) => void;
  initialData?: LocationItem | null;
}

const LocationFormModal: React.FC<LocationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [warehouse, setWarehouse] = useState("F1");
  const [shelf, setShelf] = useState<number | "">("");
  const [pallet, setPallet] = useState<number | "">("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [currentOccupancy, setCurrentOccupancy] = useState<number | "">("");
  const [description, setDescription] = useState("");

  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen && initialData) {
      setWarehouse(initialData.warehouse);
      setShelf(initialData.shelf);
      setPallet(initialData.pallet);
      setCapacity(initialData.capacity);
      setCurrentOccupancy(initialData.currentOccupancy);
      setDescription(initialData.description);
    } else if (isOpen && !initialData) {
      // Reset form
      setWarehouse("F1");
      setShelf("");
      setPallet("");
      setCapacity("");
      setCurrentOccupancy(0);
      setDescription("");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouse || shelf === "" || pallet === "" || capacity === "") {
      alert("Please fill in all required fields.");
      return;
    }

    const locationId = isEditing
      ? initialData!.id
      : `${warehouse}-${String(shelf).padStart(2, "0")}-${String(
          pallet
        ).padStart(2, "0")}`;

    onSave({
      id: locationId,
      warehouse,
      shelf: Number(shelf),
      pallet: Number(pallet),
      capacity: Number(capacity),
      currentOccupancy: Number(currentOccupancy),
      description,
      lastUpdated: new Date().toLocaleDateString("en-US"), // Update date
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">
              {isEditing ? "Edit Location" : "Add New Location"}
            </h2>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Body */}
          <div className="p-6 grid grid-cols-2 gap-4">
            {/* Warehouse */}
            <div className="col-span-2">
              <label
                htmlFor="warehouse"
                className="block text-sm font-medium text-gray-700"
              >
                Warehouse *
              </label>
              <input
                id="warehouse"
                type="text"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            {/* Shelf */}
            <div>
              <label
                htmlFor="shelf"
                className="block text-sm font-medium text-gray-700"
              >
                Shelf *
              </label>
              <input
                id="shelf"
                type="number"
                min="1"
                value={shelf}
                onChange={(e) => setShelf(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            {/* Pallet */}
            <div>
              <label
                htmlFor="pallet"
                className="block text-sm font-medium text-gray-700"
              >
                Pallet *
              </label>
              <input
                id="pallet"
                type="number"
                min="1"
                value={pallet}
                onChange={(e) => setPallet(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            {/* Capacity */}
            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700"
              >
                Capacity *
              </label>
              <input
                id="capacity"
                type="number"
                min="0"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            {/* Current Occupancy */}
            <div>
              <label
                htmlFor="currentOccupancy"
                className="block text-sm font-medium text-gray-700"
              >
                Current Occupancy
              </label>
              <input
                id="currentOccupancy"
                type="number"
                min="0"
                value={currentOccupancy}
                onChange={(e) => setCurrentOccupancy(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            {/* Description */}
            <div className="col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              ></textarea>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center p-4 border-t space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationFormModal;
