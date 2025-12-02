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
import { Button } from "../../components/ui/button";

// --- TYPE DEFINITIONS ---

export interface LocationItem {
  id: string; // Ví dụ: 'F1-01' (Chỉ tới Shelf)
  country: "Vietnam" | "Cambodia" | "Thailand";
  factory: string;
  warehouse: string;
  type: "Shelf" | "Machine";
  shelf: number | string; // Shelf number hoặc Machine Name
  // REMOVED: pallet property
  capacity: number; 
  currentOccupancy: number;
  lastUpdated: string;
  description: string;
  qrCode: string;
  isQrPrinted: boolean;
  purpose: "fabric" | "accessories" | "packaging";
  enabled: boolean;
}

export interface FabricRoll {
  id: string;
  locationId: string;
  colorCode: string;
  yards: number;
  rollNo: string;
  lotNo: string;
}

// --- DATA ---

const locationListData: LocationItem[] = [
  // --- Vietnam, Factory A ---
  {
    id: "F1-01", // ID ngắn hơn, chỉ tới kệ
    country: "Vietnam",
    factory: "Factory A",
    warehouse: "F1",
    type: "Shelf",
    shelf: 1,
    capacity: 200, // Capacity tổng của kệ
    currentOccupancy: 180,
    lastUpdated: "10/18/2025",
    description: "Khu vực vải cotton",
    qrCode: "LOC-F1-01",
    isQrPrinted: true,
    purpose: "fabric",
    enabled: true,
  },
  {
    id: "F1-02",
    country: "Vietnam",
    factory: "Factory A",
    warehouse: "F1",
    type: "Shelf",
    shelf: 2,
    capacity: 160,
    currentOccupancy: 50,
    lastUpdated: "10/18/2025",
    description: "Khu vực vải lụa",
    qrCode: "LOC-F1-02",
    isQrPrinted: false,
    purpose: "fabric",
    enabled: true,
  },
  // --- Vietnam, Factory B ---
  {
    id: "F2-05",
    country: "Vietnam",
    factory: "Factory B",
    warehouse: "F2",
    type: "Shelf",
    shelf: 5,
    capacity: 120,
    currentOccupancy: 110,
    lastUpdated: "10/17/2025",
    description: "Khu vực vải kaki màu",
    qrCode: "LOC-F2-05",
    isQrPrinted: true,
    purpose: "fabric",
    enabled: true,
  },
  {
    id: "F2-03",
    country: "Vietnam",
    factory: "Factory B",
    warehouse: "F2",
    type: "Shelf",
    shelf: 3,
    capacity: 100,
    currentOccupancy: 75,
    lastUpdated: "10/18/2025",
    description: "Khu vực vải voan",
    qrCode: "LOC-F2-03",
    isQrPrinted: false,
    purpose: "fabric",
    enabled: true,
  },
  // --- Cambodia, Factory C ---
  {
    id: "F3-10",
    country: "Cambodia",
    factory: "Factory C",
    warehouse: "F3",
    type: "Shelf",
    shelf: 10,
    capacity: 150,
    currentOccupancy: 150,
    lastUpdated: "10/16/2025",
    description: "Khu vực vải denim (jean)",
    qrCode: "LOC-F3-10",
    isQrPrinted: true,
    purpose: "fabric",
    enabled: false,
  },
  {
    id: "A1-R1",
    country: "Cambodia",
    factory: "Factory C",
    warehouse: "A1",
    type: "Shelf",
    shelf: 1, // Row/Rack 1
    capacity: 1000,
    currentOccupancy: 700,
    lastUpdated: "10/20/2025",
    description: "Zippers and Buttons Rack",
    qrCode: "LOC-A1-R1",
    isQrPrinted: true,
    purpose: "accessories",
    enabled: true,
  },
  // --- Thailand, Factory D ---
  {
    id: "P1-S1",
    country: "Thailand",
    factory: "Factory D",
    warehouse: "P1",
    type: "Shelf",
    shelf: 1,
    capacity: 1000,
    currentOccupancy: 800,
    lastUpdated: "10/21/2025",
    description: "Cardboard Boxes Section",
    qrCode: "LOC-P1-S1",
    isQrPrinted: false,
    purpose: "packaging",
    enabled: true,
  },
  // --- Machines ---
  {
    id: "F1-M-Relaxation-Machine-01",
    country: "Vietnam",
    factory: "Factory A",
    warehouse: "F1",
    type: "Machine",
    shelf: "Relaxation Machine 01" as any,
    capacity: 0,
    currentOccupancy: 0,
    lastUpdated: "10/23/2025",
    description: "Fabric relaxation machine",
    qrCode: "LOC-F1-M-Relaxation-Machine-01",
    isQrPrinted: true,
    purpose: "fabric",
    enabled: true,
  },
];




// --- SKELETON COMPONENT ---
const DetailSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm h-full animate-pulse">
    <div className="h-7 w-48 bg-gray-300 rounded-md mb-4"></div>
    <div className="space-y-3">
      <div className="h-10 w-full bg-gray-200 rounded-md"></div>
      <div className="h-10 w-full bg-gray-200 rounded-md"></div>
    </div>
  </div>
);

// --- HEADER COMPONENT ---
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

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Warehouse Location Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage Shelves and Machines.
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <select
          onChange={handleFilterChange}
          value={`${currentFilter.country}:${currentFilter.factory}`}
          className="block w-56 pl-3 pr-10 py-2 border-gray-300 border rounded-md"
        >
          <option value="all:all">All Countries & Factories</option>
          {Object.entries(filterOptions).map(([country, factories]) => (
            <optgroup label={country} key={country}>
              <option value={`${country}:all`}>All Factories in {country}</option>
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
              Print ({selectedCount})
            </Button>
            <Button variant="destructive" onClick={onDeleteSelected}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedCount})
            </Button>
          </>
        )}
        <Button onClick={onAddLocation}>
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>
    </div>
  );
};

// --- FORM MODAL ---
const COUNTRIES: LocationItem["country"][] = ["Vietnam", "Cambodia", "Thailand"];
const FACTORIES_BY_COUNTRY: Record<LocationItem["country"], string[]> = {
  Vietnam: ["Factory A", "Factory B"],
  Cambodia: ["Factory C"],
  Thailand: ["Factory D"],
};

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (locationData: LocationItem) => void;
  initialData?: LocationItem | null;
  defaultPurpose: "fabric" | "accessories" | "packaging";
}

const LocationFormModal: React.FC<LocationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultPurpose,
}) => {
  const [country, setCountry] = useState<LocationItem["country"]>("Vietnam");
  const [factory, setFactory] = useState(FACTORIES_BY_COUNTRY["Vietnam"][0]);
  const [warehouse, setWarehouse] = useState("F1");
  const [type, setType] = useState<"Shelf" | "Machine">("Shelf");
  const [shelf, setShelf] = useState<number | string | "">("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [currentOccupancy, setCurrentOccupancy] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState(defaultPurpose);
  const [enabled, setEnabled] = useState(false);

  const isEditing = !!initialData;
  const hasQrCode = isEditing && initialData?.qrCode;

  // Reset or Load Data
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCountry(initialData.country);
        setFactory(initialData.factory);
        setWarehouse(initialData.warehouse);
        setType(initialData.type);
        setShelf(initialData.shelf);
        setCapacity(initialData.capacity);
        setCurrentOccupancy(initialData.currentOccupancy);
        setDescription(initialData.description);
        setPurpose(initialData.purpose);
        setEnabled(initialData.enabled);
      } else {
        setCountry("Vietnam");
        setFactory(FACTORIES_BY_COUNTRY["Vietnam"][0]);
        setWarehouse("F1");
        setType("Shelf");
        setShelf("");
        setCapacity("");
        setCurrentOccupancy(0);
        setDescription("");
        setPurpose(defaultPurpose);
        setEnabled(false);
      }
    }
  }, [isOpen, initialData, defaultPurpose]);

  useEffect(() => {
     if (purpose !== "fabric") setType("Shelf");
  }, [purpose]);

  useEffect(() => {
    if (!isEditing && isOpen) {
        const factories = FACTORIES_BY_COUNTRY[country];
        if (!factories.includes(factory)) setFactory(factories[0]);
    }
  }, [country, isEditing, isOpen, factory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if ((type === "Shelf" && (shelf === "" || capacity === "")) ||
        (type === "Machine" && shelf === "")) {
      alert("Please fill in all required fields.");
      return;
    }

    let locationId = "";
    if (isEditing) {
      locationId = initialData!.id;
    } else {
      if (type === "Shelf") {
        // ID Format: Warehouse-ShelfNumber (e.g., F1-01)
        locationId = `${warehouse}-${String(shelf).padStart(2, "0")}`;
      } else {
        locationId = `${warehouse}-M-${String(shelf).replace(/\s/g, "-")}`;
      }
    }

    onSave({
      id: locationId,
      country,
      factory,
      warehouse,
      type,
      shelf: type === "Shelf" ? Number(shelf) : (shelf as any),
      capacity: type === "Shelf" ? Number(capacity) : 0,
      currentOccupancy,
      description,
      lastUpdated: new Date().toLocaleDateString("en-US"),
      qrCode: isEditing ? initialData!.qrCode : "",
      isQrPrinted: isEditing ? initialData!.isQrPrinted : false,
      purpose,
      enabled,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">{isEditing ? "Edit Location" : "Add Location"}</h2>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Purpose</label>
              <select disabled={isEditing} value={purpose} onChange={(e) => setPurpose(e.target.value as any)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="fabric">Fabric</option>
                <option value="accessories">Accessories</option>
                <option value="packaging">Packaging</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <select disabled={isEditing} value={country} onChange={(e) => setCountry(e.target.value as any)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Factory</label>
              <select disabled={isEditing} value={factory} onChange={(e) => setFactory(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                {FACTORIES_BY_COUNTRY[country].map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Warehouse</label>
              <input disabled={isEditing} type="text" value={warehouse} onChange={(e) => setWarehouse(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select disabled={isEditing || purpose !== "fabric"} value={type} onChange={(e) => setType(e.target.value as any)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="Shelf">Shelf</option>
                {purpose === "fabric" && <option value="Machine">Machine</option>}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">{type === "Shelf" ? "Shelf Number" : "Machine Name"} *</label>
              <input disabled={isEditing} required type={type === "Shelf" ? "number" : "text"} value={shelf} onChange={(e) => type === "Shelf" ? setShelf(Number(e.target.value)) : setShelf(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100" />
            </div>

            {/* CAPACITY FIELD - Disabled when Editing */}
            {type === "Shelf" && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                    Capacity (Rolls/Items) *
                </label>
                <input 
                    type="number" 
                    min="0" 
                    value={capacity} 
                    onChange={(e) => setCapacity(Number(e.target.value))} 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-500" 
                    required 
                    // LOGIC THAY ĐỔI: Không cho phép update capacity khi đang edit
                    disabled={isEditing}
                />
              </div>
            )}

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
            </div>

            <div className="col-span-2 flex items-center">
              <input type="checkbox" id="enabled" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} disabled={!hasQrCode} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <label htmlFor="enabled" className={`ml-2 block text-sm ${!hasQrCode ? 'text-gray-400' : 'text-gray-900'}`}>Enable location {!hasQrCode && "(Requires QR Code)"}</label>
            </div>
          </div>

          <div className="flex justify-end items-center p-4 border-t space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- TABLE COMPONENT ---
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
  onViewItems,
  selectedIds,
  onSelectionChange,
}) => {
  const [expandedWarehouses, setExpandedWarehouses] = useState<Set<string>>(new Set());

  // Grouping logic: Warehouse -> List of Locations (Shelves/Machines)
  const groupedData = useMemo(() => {
    const warehouses: {
      [key: string]: {
        items: LocationItem[];
        totals: { capacity: number; occupancy: number };
      };
    } = {};

    locations.forEach((location) => {
      if (!warehouses[location.warehouse]) {
        warehouses[location.warehouse] = {
            items: [],
            totals: { capacity: 0, occupancy: 0 },
        };
      }
      warehouses[location.warehouse].items.push(location);
      warehouses[location.warehouse].totals.capacity += location.capacity;
      warehouses[location.warehouse].totals.occupancy += location.currentOccupancy;
    });
    return warehouses;
  }, [locations]);

  // Default expand all
  useEffect(() => {
    setExpandedWarehouses(new Set(Object.keys(groupedData)));
  }, [groupedData]);

  const toggleWarehouse = (wh: string) => {
    const newSet = new Set(expandedWarehouses);
    if (newSet.has(wh)) newSet.delete(wh);
    else newSet.add(wh);
    setExpandedWarehouses(newSet);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) onSelectionChange(new Set(locations.map(l => l.id)));
    else onSelectionChange(new Set());
  };

  const handleSelectGroup = (ids: string[], isSelected: boolean) => {
    const newSet = new Set(selectedIds);
    ids.forEach(id => isSelected ? newSet.add(id) : newSet.delete(id));
    onSelectionChange(newSet);
  };

  const renderOccupancy = (occupancy: number, capacity: number) => {
    if (capacity === 0) return <span className="text-gray-400 text-sm">N/A</span>;
    const percentage = Math.min((occupancy / capacity) * 100, 100);
    const color = percentage > 90 ? "bg-red-500" : percentage > 75 ? "bg-yellow-500" : "bg-blue-500";
    return (
      <div className="flex items-center w-32">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
          <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
        <span className="text-xs text-gray-600">{occupancy}/{capacity}</span>
      </div>
    );
  };

  const isAllSelected = locations.length > 0 && selectedIds.size === locations.length;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/3">
                <div className="flex items-center">
                    <input type="checkbox" className="mr-3 h-4 w-4 rounded border-gray-300" checked={isAllSelected} onChange={handleSelectAll} />
                    Location
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupancy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">QR Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(groupedData).map(([wh, data]) => {
                const whIds = data.items.map(i => i.id);
                const whSelectedCount = whIds.filter(id => selectedIds.has(id)).length;
                const isWhAllSelected = whSelectedCount === whIds.length && whIds.length > 0;
                const isWhIndeterminate = whSelectedCount > 0 && !isWhAllSelected;

                return (
                    <React.Fragment key={wh}>
                        {/* Warehouse Row */}
                        <tr className="bg-gray-100 font-bold">
                            <td className="px-6 py-3 text-sm text-gray-800 flex items-center">
                                <input 
                                    type="checkbox" 
                                    className="mr-3 h-4 w-4 rounded border-gray-300"
                                    checked={isWhAllSelected}
                                    ref={el => {if(el) el.indeterminate = isWhIndeterminate}}
                                    onChange={(e) => handleSelectGroup(whIds, e.target.checked)}
                                />
                                <button onClick={() => toggleWarehouse(wh)} className="flex items-center focus:outline-none">
                                    {expandedWarehouses.has(wh) ? <ChevronDown className="h-4 w-4 mr-2"/> : <ChevronRight className="h-4 w-4 mr-2"/>}
                                    Warehouse {wh}
                                </button>
                            </td>
                            <td className="px-6 py-3">{renderOccupancy(data.totals.occupancy, data.totals.capacity)}</td>
                            <td colSpan={3}></td>
                        </tr>
                        {/* Items Rows */}
                        {expandedWarehouses.has(wh) && data.items.map(loc => (
                            <tr key={loc.id} className="hover:bg-blue-50 border-b last:border-0">
                                <td className="px-6 py-3 pl-12 text-sm text-gray-700 font-medium">
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            className="mr-3 h-4 w-4 rounded border-gray-300"
                                            checked={selectedIds.has(loc.id)}
                                            onChange={(e) => {
                                                const newSet = new Set(selectedIds);
                                                if(e.target.checked) newSet.add(loc.id); else newSet.delete(loc.id);
                                                onSelectionChange(newSet);
                                            }}
                                        />
                                        <div className="flex flex-col cursor-pointer hover:text-blue-600" onClick={() => onViewItems(loc)}>
                                            <span>{loc.id}</span>
                                            <span className="text-xs text-gray-400 font-normal">{loc.type === "Shelf" ? `Shelf ${loc.shelf}` : loc.shelf}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-3">{renderOccupancy(loc.currentOccupancy, loc.capacity)}</td>
                                <td className="px-6 py-3">
                                    {loc.isQrPrinted ? 
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Yes</span> : 
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">No</span>
                                    }
                                </td>
                                <td className="px-6 py-3">
                                    {loc.enabled ? 
                                        <span className="text-green-600 text-sm flex items-center">● Enabled</span> : 
                                        <span className="text-red-500 text-sm flex items-center">● Disabled</span>
                                    }
                                </td>
                                <td className="px-6 py-3 text-right space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => alert(loc.qrCode)}><Printer className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(loc)}><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => onDelete(loc.id)}><Trash2 className="h-4 w-4" /></Button>
                                </td>
                            </tr>
                        ))}
                    </React.Fragment>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

const LocationManagementPage = () => {
  const [locations, setLocations] = useState<LocationItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"fabric" | "accessories" | "packaging">("fabric");
  const [fabricSubTab, setFabricSubTab] = useState<"Shelf" | "Machine">("Shelf");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState({ country: "all", factory: "all" });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<LocationItem | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setLocations(locationListData);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => setSelectedIds(new Set()), [activeTab, fabricSubTab, filter]);

  const handleSave = (data: LocationItem) => {
    setLocations(prev => {
      if (!prev) return [data];
      const exists = prev.some(l => l.id === data.id);
      if (exists) return prev.map(l => l.id === data.id ? data : l);
      return [...prev, data];
    });
    setIsFormOpen(false);
    setEditingLoc(null);
  };

  const handleDelete = (id: string) => {
    const loc = locations?.find(l => l.id === id);
    if (loc && loc.currentOccupancy > 0) {
        alert("Cannot delete non-empty location.");
        return;
    }
    if (confirm("Delete this location?")) {
      setLocations(prev => prev ? prev.filter(l => l.id !== id) : null);
      const newSet = new Set(selectedIds); newSet.delete(id); setSelectedIds(newSet);
    }
  };

  const handleBulkDelete = () => {
     // Check logic...
     if(confirm(`Delete ${selectedIds.size} locations?`)) {
        setLocations(prev => prev ? prev.filter(l => !selectedIds.has(l.id)) : null);
        setSelectedIds(new Set());
     }
  };

  const filteredLocations = useMemo(() => {
    if (!locations) return [];
    return locations.filter(loc => {
      if (loc.purpose !== activeTab) return false;
      if (activeTab === "fabric" && loc.type !== fabricSubTab) return false;
      if (filter.country !== "all" && loc.country !== filter.country) return false;
      if (filter.factory !== "all" && loc.factory !== filter.factory) return false;
      return true;
    });
  }, [locations, activeTab, fabricSubTab, filter]);

  if (isLoading) return <div className="p-6"><DetailSkeleton /></div>;

  return (
    <div className="p-6 bg-gray-50 h-screen flex flex-col">
      <PageHeader 
        allLocations={locations || []}
        currentFilter={filter}
        onFilterChange={setFilter}
        onAddLocation={() => { setEditingLoc(null); setIsFormOpen(true); }}
        onDeleteSelected={handleBulkDelete}
        onPrintSelected={() => alert("Printing...")}
        selectedCount={selectedIds.size}
      />

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex space-x-4 border-b">
          {(["fabric", "accessories", "packaging"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 font-medium border-b-2 capitalize ${activeTab === tab ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"}`}>
              {tab} Warehouse
            </button>
          ))}
        </div>
        {activeTab === "fabric" && (
           <div className="flex space-x-4 mt-3">
             <button onClick={() => setFabricSubTab("Shelf")} className={`text-sm px-3 py-1 rounded-full ${fabricSubTab === "Shelf" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>Shelves</button>
             <button onClick={() => setFabricSubTab("Machine")} className={`text-sm px-3 py-1 rounded-full ${fabricSubTab === "Machine" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>Machines</button>
           </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <LocationTable 
            locations={filteredLocations} 
            onDelete={handleDelete}
            onEdit={(loc) => { setEditingLoc(loc); setIsFormOpen(true); }}
            onViewItems={(loc) => console.log(loc)}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
        />
      </div>

      <LocationFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        initialData={editingLoc}
        defaultPurpose={activeTab}
      />
    </div>
  );
};

export default LocationManagementPage;