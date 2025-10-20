// Path: src/pages/location-management/LocationManagementPage.tsx

import { useState, useEffect } from "react";
import PageHeader from "./components/PageHeader";
import LocationFormModal from "./components/LocationFormModal";
import LocationTable from "./components/LocationTable";
import LocationItemsModal from "./components/LocationItemsModal"; // Import new modal
import type { LocationItem, FabricRoll } from "./types";
import { locationListData, getRollsByLocationId } from "./data";
import DetailSkeleton from "./components/skeletons/DetailSkeleton";

const LocationManagementPage = () => {
  const [locations, setLocations] = useState<LocationItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // --- Handlers for Location Items Modal ---
  const handleViewLocationItems = async (location: LocationItem) => {
    const items = await getRollsByLocationId(location.id);
    setSelectedLocationForItems({ location, items });
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

      <div style={{ height: "calc(100vh - 160px)" }}>
        <LocationTable
          locations={locations}
          onEdit={handleOpenEditModal}
          onViewItems={handleViewLocationItems}
        />
      </div>

      <LocationFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSave={handleSaveLocation}
        initialData={modalInitialData}
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
