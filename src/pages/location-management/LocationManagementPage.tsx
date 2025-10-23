// Path: src/pages/location-management/LocationManagementPage.tsx

import { useState, useEffect, useMemo } from "react";
import PageHeader from "./components/PageHeader";
import LocationFormModal from "./components/LocationFormModal";
import LocationTable from "./components/LocationTable";
import LocationItemsModal from "./components/LocationItemsModal";
import type { LocationItem, FabricRoll } from "./types";
import { locationListData } from "./data";
import DetailSkeleton from "./components/skeletons/DetailSkeleton";
// import { Button } from "../../components/ui/button";

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

  // State to manage edit/add location modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<LocationItem | null>(
    null
  );

  // State to manage view fabric rolls modal
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

  // --- Handler for Deleting a Location ---
  const handleDeleteLocation = (locationId: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete location ${locationId}? This action cannot be undone.`
      )
    ) {
      setLocations((prev) => {
        if (!prev) return null;
        // In a real app, you would also check if the location is empty before deleting.
        return prev.filter((loc) => loc.id !== locationId);
      });
      console.log(`ACTION: Deleting location ${locationId}`);
    }
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
    // This is a simulation. In a real application, you would call an API here.
    console.log(
      `ACTION: Moving roll ${rollId} from ${oldLocationId} to ${newLocationId}`
    );
    alert(
      `Roll ${rollId} will be moved to ${newLocationId}.\n(This is a simulation. Data will not be permanently changed.)`
    );
    // Close modal after execution
    handleCloseItemsModal();
  };

  const filteredLocations = useMemo(() => {
    if (!locations) return [];
    return locations.filter((loc) => loc.purpose === activeTab);
  }, [locations, activeTab]);

  if (isLoading || !locations) {
    // ... skeleton loading state remains unchanged
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
      <PageHeader onAddLocation={handleOpenAddModal} />

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
