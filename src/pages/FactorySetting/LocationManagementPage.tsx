import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Printer,
  Trash2,
  Edit,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button"; // Assuming this path is correct for the final project structure

// --- TYPE DEFINITIONS (from types.ts) ---

// Cấu trúc một vị trí kho (dạng phẳng)
export interface LocationItem {
  id: string; // Ví dụ: 'F1-01-01'
  country: "Vietnam" | "Cambodia" | "Thailand"; // Quốc gia
  factory: string; // Nhà máy
  warehouse: string;
  shelf: number;
  pallet: number;
  capacity: number;
  currentOccupancy: number;
  lastUpdated: string; // Giữ dạng string để đơn giản
  description: string;
  qrCode: string; // Mã QR Code định danh
  isQrPrinted: boolean; // Trạng thái đã in QR Code hay chưa
  purpose: "fabric" | "accessories" | "packaging"; // Mục đích sử dụng của kho
  enabled: boolean; // Trạng thái hoạt động
}

// Cấu trúc một cuộn vải trong kho
export interface FabricRoll {
  id: string; // Mã cuộn vải (Item Code)
  locationId: string; // Mã vị trí kho đang chứa nó
  colorCode: string;
  yards: number; // Chiều dài
  rollNo: string;
  lotNo: string;
}

// --- DATA (from data.ts) ---

const locationListData: LocationItem[] = [
  // --- Vietnam, Factory A ---
  {
    id: "F1-01-01",
    country: "Vietnam",
    factory: "Factory A",
    warehouse: "F1",
    shelf: 1,
    pallet: 1,
    capacity: 100,
    currentOccupancy: 85,
    lastUpdated: "10/18/2025",
    description: "Khu vực vải cotton",
    qrCode: "LOC-F1-01-01",
    isQrPrinted: true,
    purpose: "fabric",
    enabled: true,
  },
  {
    id: "F1-01-02",
    country: "Vietnam",
    factory: "Factory A",
    warehouse: "F1",
    shelf: 1,
    pallet: 2,
    capacity: 100,
    currentOccupancy: 95,
    lastUpdated: "10/19/2025",
    description: "Khu vực vải cotton",
    qrCode: "LOC-F1-01-02",
    isQrPrinted: true,
    purpose: "fabric",
    enabled: true,
  },
  {
    id: "F1-02-02",
    country: "Vietnam",
    factory: "Factory A",
    warehouse: "F1",
    shelf: 2,
    pallet: 2,
    capacity: 80,
    currentOccupancy: 50,
    lastUpdated: "10/18/2025",
    description: "Khu vực vải lụa",
    qrCode: "LOC-F1-02-02",
    isQrPrinted: false,
    purpose: "fabric",
    enabled: true,
  },
  // --- Vietnam, Factory B ---
  {
    id: "F2-05-03",
    country: "Vietnam",
    factory: "Factory B",
    warehouse: "F2",
    shelf: 5,
    pallet: 3,
    capacity: 120,
    currentOccupancy: 110,
    lastUpdated: "10/17/2025",
    description: "Khu vực vải kaki màu",
    qrCode: "LOC-F2-05-03",
    isQrPrinted: true,
    purpose: "fabric",
    enabled: true,
  },
  {
    id: "F2-03-05",
    country: "Vietnam",
    factory: "Factory B",
    warehouse: "F2",
    shelf: 3,
    pallet: 5,
    capacity: 100,
    currentOccupancy: 75,
    lastUpdated: "10/18/2025",
    description: "Khu vực vải voan",
    qrCode: "LOC-F2-03-05",
    isQrPrinted: false,
    purpose: "fabric",
    enabled: true,
  },
  // --- Cambodia, Factory C ---
  {
    id: "F3-10-08",
    country: "Cambodia",
    factory: "Factory C",
    warehouse: "F3",
    shelf: 10,
    pallet: 8,
    capacity: 150,
    currentOccupancy: 150,
    lastUpdated: "10/16/2025",
    description: "Khu vực vải denim (jean)",
    qrCode: "LOC-F3-10-08",
    isQrPrinted: true,
    purpose: "fabric",
    enabled: false,
  },
  {
    id: "A1-R1-B1",
    country: "Cambodia",
    factory: "Factory C",
    warehouse: "A1",
    shelf: 1, // Row
    pallet: 1, // Bin
    capacity: 500,
    currentOccupancy: 250,
    lastUpdated: "10/20/2025",
    description: "Zippers and Buttons",
    qrCode: "LOC-A1-R1-B1",
    isQrPrinted: true,
    purpose: "accessories",
    enabled: true,
  },
  {
    id: "A1-R1-B2",
    country: "Cambodia",
    factory: "Factory C",
    warehouse: "A1",
    shelf: 1, // Row
    pallet: 2, // Bin
    capacity: 500,
    currentOccupancy: 450,
    lastUpdated: "10/21/2025",
    description: "Thread Spools - Various Colors",
    qrCode: "LOC-A1-R1-B2",
    isQrPrinted: false,
    purpose: "accessories",
    enabled: true,
  },
  // --- Thailand, Factory D ---
  {
    id: "P1-S1-P1",
    country: "Thailand",
    factory: "Factory D",
    warehouse: "P1",
    shelf: 1, // Section
    pallet: 1, // Position
    capacity: 1000,
    currentOccupancy: 800,
    lastUpdated: "10/21/2025",
    description: "Cardboard Boxes - Size M",
    qrCode: "LOC-P1-S1-P1",
    isQrPrinted: false,
    purpose: "packaging",
    enabled: true,
  },
  {
    id: "P1-S2-P1",
    country: "Thailand",
    factory: "Factory D",
    warehouse: "P1",
    shelf: 2, // Section
    pallet: 1, // Position
    capacity: 800,
    currentOccupancy: 800,
    lastUpdated: "10/22/2025",
    description: "Plastic Bags - Size L",
    qrCode: "LOC-P1-S2-P1",
    isQrPrinted: true,
    purpose: "packaging",
    enabled: false,
  },
];

const fabricRollData: FabricRoll[] = [
  {
    id: "ROLL-C001",
    locationId: "F1-01-01",
    colorCode: "BLUE-01",
    yards: 50.5,
    rollNo: "R1",
    lotNo: "LOT-2025-A",
  },
  {
    id: "ROLL-C002",
    locationId: "F1-01-01",
    colorCode: "BLUE-01",
    yards: 48.2,
    rollNo: "R2",
    lotNo: "LOT-2025-A",
  },
  {
    id: "ROLL-C003",
    locationId: "F1-01-01",
    colorCode: "RED-05",
    yards: 55.0,
    rollNo: "R3",
    lotNo: "LOT-2025-B",
  },
  {
    id: "ROLL-K011",
    locationId: "F2-05-03",
    colorCode: "GREEN-02",
    yards: 60.0,
    rollNo: "R11",
    lotNo: "LOT-2025-C",
  },
  {
    id: "ROLL-S025",
    locationId: "F1-02-02",
    colorCode: "WHITE-01",
    yards: 100.0,
    rollNo: "R25",
    lotNo: "LOT-2025-D",
  },
  {
    id: "ROLL-C004",
    locationId: "F1-01-02",
    colorCode: "BLACK-01",
    yards: 52.0,
    rollNo: "R4",
    lotNo: "LOT-2025-E",
  },
  {
    id: "ROLL-C005",
    locationId: "F1-01-02",
    colorCode: "BLACK-01",
    yards: 51.5,
    rollNo: "R5",
    lotNo: "LOT-2025-E",
  },
];

// Hàm giả lập API để lấy các cuộn vải theo vị trí
const getRollsByLocationId = (locationId: string): Promise<FabricRoll[]> => {
  console.log(`Fetching rolls for location: ${locationId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const rolls = fabricRollData.filter(
        (roll) => roll.locationId === locationId
      );
      resolve(rolls);
    }, 300); // Giả lập độ trễ mạng
  });
};

// --- SKELETON COMPONENTS (from skeletons folder) ---

const DetailSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full overflow-y-auto animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="h-7 w-48 bg-gray-300 rounded-md mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 mb-4">
        <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
        <div className="h-10 w-20 bg-gray-300 rounded-md"></div>
      </div>

      {/* Details */}
      <div className="border-t pt-4 space-y-3">
        <div className="h-5 w-24 bg-gray-300 rounded-md"></div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-28 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-36 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Usage */}
      <div className="border-t pt-4 mt-4 space-y-3">
        <div className="h-5 w-32 bg-gray-300 rounded-md"></div>
        <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
      </div>

      {/* Item List */}
      <div className="border-t pt-4 mt-4 space-y-3">
        <div className="h-5 w-40 bg-gray-300 rounded-md"></div>
        <div className="h-10 w-full bg-gray-200 rounded-md"></div>
        <div className="h-10 w-full bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
};

// --- UI COMPONENTS (from components folder) ---

interface PageHeaderProps {
  onAddLocation: () => void;
  onPrintSelected: () => void;
  onDeleteSelected: () => void;
  selectedCount: number;
  allLocations: LocationItem[];
  currentFilter: { country: string; factory: string };
  onFilterChange: (newFilter: { country: string; factory: string }) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  onAddLocation,
  onPrintSelected,
  onDeleteSelected,
  selectedCount,
  allLocations,
  currentFilter,
  onFilterChange,
}) => {
  const hasSelection = selectedCount > 0;

  const filterOptions = useMemo(() => {
    const options: { [country: string]: Set<string> } = {};
    allLocations.forEach((loc) => {
      if (!options[loc.country]) {
        options[loc.country] = new Set();
      }
      options[loc.country].add(loc.factory);
    });
    return options;
  }, [allLocations]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [country, factory] = e.target.value.split(":");
    onFilterChange({ country, factory });
  };

  const filterValue = `${currentFilter.country}:${currentFilter.factory}`;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Warehouse Location Management
          </h1>
          <p className="text-sm text-gray-500">
            View, manage, and organize all warehouse storage locations.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Filter Dropdown */}
          <select
            onChange={handleFilterChange}
            value={filterValue}
            className="block w-56 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all:all">All Countries & Factories</option>
            {Object.entries(filterOptions).map(([country, factories]) => (
              <optgroup label={country} key={country}>
                <option value={`${country}:all`}>
                  All Factories in {country}
                </option>
                {Array.from(factories).map((factory) => (
                  <option key={factory} value={`${country}:${factory}`}>
                    {factory}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {hasSelection && (
            <>
              <Button variant="outline" onClick={onPrintSelected}>
                <Printer className="w-4 h-4 mr-2" />
                Print QR ({selectedCount})
              </Button>
              <Button variant="destructive" onClick={onDeleteSelected}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedCount})
              </Button>
            </>
          )}
          <Button onClick={onAddLocation}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Location
          </Button>
        </div>
      </div>
    </div>
  );
};

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (locationData: LocationItem) => void;
  initialData?: LocationItem | null;
  defaultPurpose: "fabric" | "accessories" | "packaging";
}

const COUNTRIES: LocationItem["country"][] = [
  "Vietnam",
  "Cambodia",
  "Thailand",
];

const LocationFormModal: React.FC<LocationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultPurpose,
}) => {
  const [country, setCountry] = useState<LocationItem["country"]>("Vietnam");
  const [factory, setFactory] = useState("");
  const [warehouse, setWarehouse] = useState("F1");
  const [shelf, setShelf] = useState<number | "">("");
  const [pallet, setPallet] = useState<number | "">("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [currentOccupancy, setCurrentOccupancy] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState(defaultPurpose);
  const [enabled, setEnabled] = useState(true);

  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen && initialData) {
      setCountry(initialData.country);
      setFactory(initialData.factory);
      setWarehouse(initialData.warehouse);
      setShelf(initialData.shelf);
      setPallet(initialData.pallet);
      setCapacity(initialData.capacity);
      setCurrentOccupancy(initialData.currentOccupancy);
      setDescription(initialData.description);
      setPurpose(initialData.purpose);
      setEnabled(initialData.enabled);
    } else if (isOpen && !initialData) {
      // Reset form
      setCountry("Vietnam");
      setFactory("");
      setWarehouse("F1");
      setShelf("");
      setPallet("");
      setCapacity("");
      setCurrentOccupancy(0);
      setDescription("");
      setPurpose(defaultPurpose);
      setEnabled(true);
    }
  }, [isOpen, initialData, defaultPurpose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !factory ||
      !warehouse ||
      shelf === "" ||
      pallet === "" ||
      capacity === ""
    ) {
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
      country,
      factory,
      warehouse,
      shelf: Number(shelf),
      pallet: Number(pallet),
      capacity: Number(capacity),
      currentOccupancy: Number(currentOccupancy),
      description,
      lastUpdated: new Date().toLocaleDateString("en-US"), // Update date
      qrCode: isEditing ? initialData!.qrCode : `LOC-${locationId}`,
      isQrPrinted: isEditing ? initialData!.isQrPrinted : false,
      purpose,
      enabled,
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
            {/* Purpose */}
            <div className="col-span-2">
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-gray-700"
              >
                Purpose *
              </label>
              <select
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as typeof purpose)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
                required
              >
                <option value="fabric">Fabric</option>
                <option value="accessories">Accessories</option>
                <option value="packaging">Packaging</option>
              </select>
            </div>
            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country *
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value as typeof country)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
                required
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {/* Factory */}
            <div>
              <label
                htmlFor="factory"
                className="block text-sm font-medium text-gray-700"
              >
                Factory *
              </label>
              <input
                id="factory"
                type="text"
                value={factory}
                onChange={(e) => setFactory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            {/* Warehouse, Shelf, Pallet, Capacity etc. */}
            <div>
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
                rows={2}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              ></textarea>
            </div>
            <div className="col-span-2 flex items-center">
              <input
                id="enabled"
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor="enabled"
                className="ml-2 block text-sm text-gray-900"
              >
                Enable this location for use
              </label>
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

interface LocationTableProps {
  locations: LocationItem[];
  onEdit: (location: LocationItem) => void;
  onDelete: (locationId: string) => void;
  onViewItems: (location: LocationItem) => void;
  selectedIds: Set<string>;
  onSelectionChange: (newSelectedIds: Set<string>) => void;
}

const LocationTable: React.FC<LocationTableProps> = ({
  locations,
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const groupedData = useMemo(() => {
    const warehouses: {
      [key: string]: {
        shelves: { [key: number]: LocationItem[] };
        totals: { capacity: number; occupancy: number };
      };
    } = {};

    locations.forEach((location) => {
      if (!warehouses[location.warehouse]) {
        warehouses[location.warehouse] = {
          shelves: {},
          totals: { capacity: 0, occupancy: 0 },
        };
      }
      if (!warehouses[location.warehouse].shelves[location.shelf]) {
        warehouses[location.warehouse].shelves[location.shelf] = [];
      }
      warehouses[location.warehouse].shelves[location.shelf].push(location);
      warehouses[location.warehouse].totals.capacity += location.capacity;
      warehouses[location.warehouse].totals.occupancy +=
        location.currentOccupancy;
    });

    return warehouses;
  }, [locations]);

  useEffect(() => {
    // Expand all warehouses by default whenever the locations data changes
    const initialExpanded = new Set(
      Object.keys(groupedData).map((w) => `wh-${w}`)
    );
    setExpandedRows(initialExpanded);
  }, [groupedData]);

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedIds = new Set<string>();
    if (e.target.checked) {
      locations.forEach((loc) => newSelectedIds.add(loc.id));
    }
    onSelectionChange(newSelectedIds);
  };

  const handleSelectOne = (id: string, isChecked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (isChecked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    onSelectionChange(newSelectedIds);
  };

  const handleSelectGroup = (locationIds: string[], select: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (select) {
      locationIds.forEach((id) => newSelectedIds.add(id));
    } else {
      locationIds.forEach((id) => newSelectedIds.delete(id));
    }
    onSelectionChange(newSelectedIds);
  };

  const handlePrintQr = (location: LocationItem) => {
    alert(
      `Printing QR Code for ${location.id}...\nContent: ${location.qrCode}`
    );
  };

  const renderOccupancy = (occupancy: number, capacity: number) => {
    const percentage = capacity > 0 ? (occupancy / capacity) * 100 : 0;
    return (
      <div className="flex items-center">
        <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600">
          {occupancy} / {capacity}
        </span>
      </div>
    );
  };

  const isAllSelected =
    locations.length > 0 && selectedIds.size === locations.length;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className=" py-3 ">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all locations"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Occupancy / Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QR Printed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(groupedData).map(([warehouseId, warehouseData]) => {
              const whKey = `wh-${warehouseId}`;
              const isWhExpanded = expandedRows.has(whKey);

              const warehouseLocationIds = Object.values(warehouseData.shelves)
                .flat()
                .map((loc) => loc.id);
              const selectedInWarehouseCount = warehouseLocationIds.filter(
                (id) => selectedIds.has(id)
              ).length;
              const isAllInWarehouseSelected =
                warehouseLocationIds.length > 0 &&
                selectedInWarehouseCount === warehouseLocationIds.length;
              const isSomeInWarehouseSelected =
                selectedInWarehouseCount > 0 && !isAllInWarehouseSelected;

              return (
                <React.Fragment key={whKey}>
                  {/* Warehouse Row */}
                  <tr className="bg-gray-100 font-bold">
                    <td className="px-6 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        ref={(el) => {
                          if (el) el.indeterminate = isSomeInWarehouseSelected;
                        }}
                        checked={isAllInWarehouseSelected}
                        onChange={() =>
                          handleSelectGroup(
                            warehouseLocationIds,
                            !isAllInWarehouseSelected
                          )
                        }
                      />
                    </td>
                    <td
                      className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 hover:bg-gray-200 cursor-pointer"
                      onClick={() => toggleRow(whKey)}
                    >
                      <div className="flex items-center">
                        {isWhExpanded ? (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-2" />
                        )}
                        Warehouse {warehouseId}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {renderOccupancy(
                        warehouseData.totals.occupancy,
                        warehouseData.totals.capacity
                      )}
                    </td>
                    <td colSpan={4} className="px-6 py-3"></td>
                  </tr>

                  {isWhExpanded &&
                    Object.entries(warehouseData.shelves).map(
                      ([shelfId, locationsOnShelf]) => {
                        const shelfKey = `${whKey}-sh-${shelfId}`;
                        const isShelfExpanded = expandedRows.has(shelfKey);
                        const shelfTotals = locationsOnShelf.reduce(
                          (acc, loc) => ({
                            capacity: acc.capacity + loc.capacity,
                            occupancy: acc.occupancy + loc.currentOccupancy,
                          }),
                          { capacity: 0, occupancy: 0 }
                        );

                        const shelfLocationIds = locationsOnShelf.map(
                          (loc) => loc.id
                        );
                        const selectedInShelfCount = shelfLocationIds.filter(
                          (id) => selectedIds.has(id)
                        ).length;
                        const isAllInShelfSelected =
                          shelfLocationIds.length > 0 &&
                          selectedInShelfCount === shelfLocationIds.length;
                        const isSomeInShelfSelected =
                          selectedInShelfCount > 0 && !isAllInShelfSelected;

                        return (
                          <React.Fragment key={shelfKey}>
                            {/* Shelf Row */}
                            <tr className="bg-gray-50">
                              <td className="px-6 py-3">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded ml-6"
                                  ref={(el) => {
                                    if (el)
                                      el.indeterminate = isSomeInShelfSelected;
                                  }}
                                  checked={isAllInShelfSelected}
                                  onChange={() =>
                                    handleSelectGroup(
                                      shelfLocationIds,
                                      !isAllInShelfSelected
                                    )
                                  }
                                />
                              </td>
                              <td
                                className="pl-12 pr-6 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold hover:bg-gray-100 cursor-pointer"
                                onClick={() => toggleRow(shelfKey)}
                              >
                                <div className="flex items-center">
                                  {isShelfExpanded ? (
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                  )}
                                  Shelf {shelfId}
                                </div>
                              </td>
                              <td className="px-6 py-3">
                                {renderOccupancy(
                                  shelfTotals.occupancy,
                                  shelfTotals.capacity
                                )}
                              </td>
                              <td colSpan={4} className="px-6 py-3"></td>
                            </tr>

                            {isShelfExpanded &&
                              locationsOnShelf.map((location) => (
                                // Pallet/Location Row
                                <tr
                                  key={location.id}
                                  className="hover:bg-blue-50"
                                >
                                  <td className="px-6 py-3">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 text-blue-600 border-gray-300 rounded ml-12"
                                      checked={selectedIds.has(location.id)}
                                      onChange={(e) =>
                                        handleSelectOne(
                                          location.id,
                                          e.target.checked
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="pl-20 pr-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer">
                                    {location.id}
                                  </td>
                                  <td className="px-6 py-3">
                                    {renderOccupancy(
                                      location.currentOccupancy,
                                      location.capacity
                                    )}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {location.isQrPrinted ? (
                                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Yes
                                      </span>
                                    ) : (
                                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        No
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {location.enabled ? (
                                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Enabled
                                      </span>
                                    ) : (
                                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                        Disabled
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                                    {location.description}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handlePrintQr(location)}
                                      title="Print QR Code"
                                    >
                                      <Printer className="h-4 w-4" />
                                    </Button>

                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => onEdit(location)}
                                      title="Edit Location"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => onDelete(location.id)}
                                      title="Delete Location"
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600 hover:text-red-800" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                          </React.Fragment>
                        );
                      }
                    )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const TABS = {
  fabric: "Fabric Warehouse",
  accessories: "Accessories Warehouse",
  packaging: "Packaging Warehouse",
};
type TabKey = keyof typeof TABS;

const LocationManagementPage = () => {
  const [locations, setLocations] = useState<LocationItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("fabric");
  const [selectedLocationIds, setSelectedLocationIds] = useState<Set<string>>(
    new Set()
  );

  // State for Country/Factory filter
  const [filter, setFilter] = useState({ country: "all", factory: "all" });

  // State to manage edit/add location modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<LocationItem | null>(
    null
  );

  // State to manage view items modal
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [selectedLocationForItems, setSelectedLocationForItems] = useState<{
    location: LocationItem;
    items: FabricRoll[];
  } | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setLocations(locationListData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Reset selection when tab or filter changes
  useEffect(() => {
    setSelectedLocationIds(new Set());
  }, [activeTab, filter]);

  // --- Handlers for Location Form Modal ---
  const handleOpenAddModal = () => {
    setModalInitialData(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (location: LocationItem) => {
    setModalInitialData(location);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setModalInitialData(null);
  };

  const handleSaveLocation = (data: LocationItem) => {
    setLocations((prevLocations) => {
      if (!prevLocations) return [data];
      const isEditing = prevLocations.some((loc) => loc.id === data.id);
      if (isEditing) {
        return prevLocations.map((loc) => (loc.id === data.id ? data : loc));
      } else {
        return [...prevLocations, data];
      }
    });
    handleCloseFormModal();
  };

  // --- Handlers for Viewing Items in a Location ---
  const handleViewItems = async (location: LocationItem) => {
    // This feature is primarily for fabric rolls, but can be adapted.
    // For now, we show an alert for non-fabric locations.
    if (location.purpose !== "fabric") {
      alert(
        `Item viewing is currently implemented for Fabric Warehouse locations.\nLocation ${location.id} is for ${location.purpose}.`
      );
      return;
    }
    const rolls = await getRollsByLocationId(location.id);
    setSelectedLocationForItems({ location, items: rolls });
    setIsItemsModalOpen(true);
  };

  const handleCloseItemsModal = () => {
    setIsItemsModalOpen(false);
    setSelectedLocationForItems(null);
  };

  const handleMoveRoll = (
    rollId: string,
    oldLocationId: string,
    newLocationId: string
  ) => {
    console.log(
      `ACTION: Moving roll ${rollId} from ${oldLocationId} to ${newLocationId}`
    );
    alert(
      `Roll ${rollId} will be moved to ${newLocationId}.\n(This is a simulation. Data will not be permanently changed.)`
    );
    handleCloseItemsModal();
  };

  // --- Handlers for Single and Bulk Actions ---
  const handleDeleteLocation = (locationId: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete location ${locationId}? This action cannot be undone.`
      )
    ) {
      setLocations((prev) => {
        if (!prev) return null;
        return prev.filter((loc) => loc.id !== locationId);
      });
      setSelectedLocationIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(locationId);
        return newSet;
      });
      console.log(`ACTION: Deleting location ${locationId}`);
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedLocationIds.size} selected locations? This action cannot be undone.`
      )
    ) {
      setLocations((prev) => {
        if (!prev) return null;
        return prev.filter((loc) => !selectedLocationIds.has(loc.id));
      });
      setSelectedLocationIds(new Set());
      console.log(`ACTION: Deleting ${selectedLocationIds.size} locations.`);
    }
  };

  const handleBulkPrint = () => {
    const selectedLocations =
      locations?.filter((loc) => selectedLocationIds.has(loc.id)) || [];
    alert(
      `Printing QR Codes for ${
        selectedLocations.length
      } locations:\n${selectedLocations.map((l) => l.id).join(", ")}`
    );
    console.log(
      `ACTION: Printing QR Codes for ${selectedLocations.length} locations.`
    );
  };

  const filteredLocations = useMemo(() => {
    if (!locations) return [];
    return locations.filter((loc) => {
      const matchPurpose = loc.purpose === activeTab;
      const matchCountry =
        filter.country === "all" || loc.country === filter.country;
      const matchFactory =
        filter.factory === "all" || loc.factory === filter.factory;
      return matchPurpose && matchCountry && matchFactory;
    });
  }, [locations, activeTab, filter]);

  if (isLoading || !locations) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 h-24 animate-pulse"></div>
        <div style={{ height: "calc(100vh - 160px)" }}>
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <PageHeader
        onAddLocation={handleOpenAddModal}
        onDeleteSelected={handleBulkDelete}
        onPrintSelected={handleBulkPrint}
        selectedCount={selectedLocationIds.size}
        allLocations={locations}
        currentFilter={filter}
        onFilterChange={setFilter}
      />

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {(Object.keys(TABS) as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
              >
                {TABS[tab]}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div style={{ height: "calc(100vh - 240px)" }}>
        <LocationTable
          locations={filteredLocations}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteLocation}
          onViewItems={handleViewItems}
          selectedIds={selectedLocationIds}
          onSelectionChange={setSelectedLocationIds}
        />
      </div>

      <LocationFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSave={handleSaveLocation}
        initialData={modalInitialData}
        defaultPurpose={activeTab}
      />

      <LocationItemsModal
        isOpen={isItemsModalOpen}
        onClose={handleCloseItemsModal}
        location={selectedLocationForItems?.location ?? null}
        items={selectedLocationForItems?.items ?? []}
        onMoveRoll={handleMoveRoll}
      />
    </div>
  );
};

export default LocationManagementPage;
