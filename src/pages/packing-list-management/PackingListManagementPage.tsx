// src/pages/packing-list-management/PackingListManagementPage.tsx

import { useState, useEffect, useMemo } from "react";
import PageHeader from "./components/PageHeader";
import ImportPackingListModal from "./components/ImportPackingListModal";
import PackingListFilters from "./components/PackingListFilters";
import PackingListTable from "./components/PackingListTable";
import Pagination from "./components/Pagination";
import TableSkeleton from "./components/skeletons/TableSkeleton";
import SplitRollModal from "./components/SplitRollModal"; // Import the new modal
import { mockFabricRolls } from "./data";
import type { FabricRollItem } from "./types";
import { v4 as uuidv4 } from "uuid";

const PackingListManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FabricRollItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for the split modal
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [currentItemToSplit, setCurrentItemToSplit] =
    useState<FabricRollItem | null>(null);

  // State for the import modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
  };

  useEffect(() => {
    // Simulate fetching data from an API
    const timer = setTimeout(() => {
      setItems(mockFabricRolls);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, rowsPerPage]);

  // --- Handlers for Split Modal ---
  const handleOpenSplitModal = (item: FabricRollItem) => {
    setCurrentItemToSplit(item);
    setIsSplitModalOpen(true);
  };

  const handleCloseSplitModal = () => {
    setIsSplitModalOpen(false);
    setCurrentItemToSplit(null);
  };

  const handleSaveSplit = (parentId: string, splitYards: number) => {
    setItems((prevItems) => {
      const parentRoll = prevItems.find((item) => item.id === parentId);
      if (!parentRoll || splitYards <= 0 || splitYards >= parentRoll.yards) {
        // Basic validation
        return prevItems;
      }

      const newItems = [...prevItems];
      const parentIndex = newItems.findIndex((item) => item.id === parentId);

      // 1. Calculate proportional weights
      const yardageRatio = splitYards / parentRoll.yards;
      const newRollNetWeight = parentRoll.netWeightKgs * yardageRatio;
      const newRollGrossWeight = parentRoll.grossWeightKgs * yardageRatio;

      // 2. Create the new split roll
      const newRoll: FabricRollItem = {
        ...parentRoll,
        id: uuidv4(), // New unique ID
        yards: splitYards,
        netWeightKgs: parseFloat(newRollNetWeight.toFixed(2)),
        grossWeightKgs: parseFloat(newRollGrossWeight.toFixed(2)),
        qrCode: `QR_${parentRoll.itemCode}_SPLIT_${Date.now()}`, // New QR code
        printStatus: "NOT_PRINTED", // New roll is not printed
        // Reset QC status for the new roll as it needs re-evaluation
        qcCheck: false, // Default new split rolls to not be checked for QC
        qcDate: "", // Clear previous QC date
        qcBy: "", // Clear previous QC person
        comment: `Split from original roll ID ${parentRoll.id}.`, // Add a comment
      };

      // 3. Update the original parent roll
      const updatedParentRoll: FabricRollItem = {
        ...parentRoll,
        yards: parentRoll.yards - splitYards,
        netWeightKgs: parseFloat(
          (parentRoll.netWeightKgs - newRollNetWeight).toFixed(2)
        ),
        grossWeightKgs: parseFloat(
          (parentRoll.grossWeightKgs - newRollGrossWeight).toFixed(2)
        ),
        comment: parentRoll.comment
          ? `${parentRoll.comment} | A split of ${splitYards} yards was created.`
          : `A split of ${splitYards} yards was created.`,
      };

      // 4. Update the state array
      newItems[parentIndex] = updatedParentRoll;
      newItems.splice(parentIndex + 1, 0, newRoll); // Add new roll right after parent

      return newItems;
    });
    handleCloseSplitModal();
  };

  const handleQcCheckChange = (itemId: string, checked: boolean) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, qcCheck: checked } : item
      )
    );
  };

  // --- Handler for Printing ---
  const handlePrintItems = (itemIds: Set<string>) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (itemIds.has(item.id)) {
          return { ...item, printStatus: "PRINTED" };
        }
        return item;
      })
    );

    const printedItemCodes = items
      .filter((item) => itemIds.has(item.id))
      .map((item) => `${item.itemCode} (Roll: ${item.rollNo})`)
      .join(", ");

    alert(
      `Print command sent for items: ${printedItemCodes}\n(In a real application, this would trigger the printing API).`
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-full">
      <PageHeader onImportClick={handleOpenImportModal} />

      <PackingListFilters />

      {loading ? (
        <TableSkeleton />
      ) : items.length > 0 ? (
        <>
          <PackingListTable
            items={paginatedItems}
            onPrint={handlePrintItems}
            onOpenSplitModal={handleOpenSplitModal}
            onQcCheckChange={handleQcCheckChange}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={items.length}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        </>
      ) : (
        <p>No items found.</p>
      )}

      {/* Render the Split Roll Modal */}
      <SplitRollModal
        isOpen={isSplitModalOpen}
        onClose={handleCloseSplitModal}
        onSave={handleSaveSplit}
        item={currentItemToSplit}
      />

      {/* Render the Import Packing List Modal */}
      <ImportPackingListModal
        isOpen={isImportModalOpen}
        onClose={handleCloseImportModal}
      />
    </div>
  );
};

export default PackingListManagementPage;
