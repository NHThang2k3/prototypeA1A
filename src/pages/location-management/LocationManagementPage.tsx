// Path: src/pages/location-management/LocationManagementPage.tsx

import { useState, useEffect, useCallback } from "react";
import LocationTree from "./components/LocationTree";
import LocationDetail from "./components/LocationDetail";
import PageHeader from "./components/PageHeader";
import LocationFormModal from "./components/LocationFormModal";
import TreeSkeleton from "./components/skeletons/TreeSkeleton";
import DetailSkeleton from "./components/skeletons/DetailSkeleton";
import type { LocationNode } from "./types";
import { warehouseData } from "./data";

// --- Thêm các hàm helper để xử lý cây dữ liệu một cách bất biến (immutable) ---

// Tìm và cập nhật một node trong cây
const updateNodeInTree = (
  node: LocationNode,
  updatedNode: Partial<LocationNode>
): LocationNode => {
  if (node.id === updatedNode.id) {
    return {
      ...node,
      ...updatedNode,
      items: node.items,
      children: node.children,
    };
  }
  return {
    ...node,
    children: node.children.map((child) =>
      updateNodeInTree(child, updatedNode)
    ),
  };
};

// Tìm và thêm một node con mới vào cây
const addNodeToTree = (
  node: LocationNode,
  parentId: string,
  newNode: LocationNode
): LocationNode => {
  if (node.id === parentId) {
    return { ...node, children: [...node.children, newNode] };
  }
  return {
    ...node,
    children: node.children.map((child) =>
      addNodeToTree(child, parentId, newNode)
    ),
  };
};

const findNodeById = (node: LocationNode, id: string): LocationNode | null => {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
};

const LocationManagementPage = () => {
  const [locations, setLocations] = useState<LocationNode | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State quản lý modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<LocationNode | null>(
    null
  );
  const [modalParentId, setModalParentId] = useState<string | null>(null);

  const selectedLocation =
    selectedNodeId && locations
      ? findNodeById(locations, selectedNodeId)
      : null;

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setLocations(warehouseData);
      setSelectedNodeId(warehouseData.id);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleOpenAddModal = (parentId: string | null = null) => {
    setModalInitialData(null);
    setModalParentId(parentId);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (location: LocationNode) => {
    setModalInitialData(location);
    setModalParentId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalInitialData(null);
    setModalParentId(null);
  };

  const handleSaveLocation = (
    data: Partial<LocationNode> & { parentId?: string | null }
  ) => {
    if (!locations) return;

    if (data.parentId) {
      // Thêm mới
      const newNode: LocationNode = {
        id: data.id!,
        name: data.name!,
        type: data.type!,
        status: data.status!,
        capacity: data.capacity,
        items: [],
        children: [],
      };
      const updatedTree = addNodeToTree(locations, data.parentId, newNode);
      setLocations(updatedTree);
    } else {
      // Cập nhật
      const updatedTree = updateNodeInTree(locations, data);
      setLocations(updatedTree);
    }

    handleCloseModal();
  };

  if (isLoading || !locations) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 h-24 animate-pulse"></div>
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          style={{ height: "calc(100vh - 160px)" }}
        >
          <div className="lg:col-span-1">
            <TreeSkeleton />
          </div>
          <div className="lg:col-span-2">
            <DetailSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <PageHeader onAddRootLocation={() => handleOpenAddModal(locations.id)} />

      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        style={{ height: "calc(100vh - 160px)" }}
      >
        <div className="lg:col-span-1">
          <LocationTree
            data={locations}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
          />
        </div>

        <div className="lg:col-span-2">
          <LocationDetail
            location={selectedLocation}
            onEdit={handleOpenEditModal}
            onAddChild={() =>
              selectedNodeId && handleOpenAddModal(selectedNodeId)
            }
          />
        </div>
      </div>

      <LocationFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveLocation}
        initialData={modalInitialData}
        parentId={modalParentId}
      />
    </div>
  );
};

export default LocationManagementPage;
