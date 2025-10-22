// Path: src/pages/inventory-list/InventoryListPage.tsx

import { useState, useEffect, useMemo, type FC } from "react";
import { InventoryHeader } from "./components/InventoryHeader";
import { InventoryFilters } from "./components/InventoryFilters";
import { InventoryTable } from "./components/InventoryTable";
import Pagination from "./components/Pagination";
import type { FabricRoll, LocationHistoryEntry } from "./types";
import { FilterSkeleton } from "./components/skeletons/FilterSkeleton";
import { TableSkeleton } from "./components/skeletons/TableSkeleton";
import { DUMMY_FABRIC_DATA } from "./data";

// (allColumns and defaultVisibleColumns remain the same)
const allColumns = [
  { id: "poNumber", name: "Order No" },
  { id: "supplierCode", name: "Supplier Code" },
  { id: "invoiceNo", name: "Invoice No" },
  { id: "rollNo", name: "Roll No" },
  { id: "color", name: "Color" },
  { id: "lotNo", name: "Batch No" },
  { id: "yards", name: "Shipped length" },
  { id: "balanceYards", name: "Actual length" },
  { id: "grossWeightKgs", name: "Gross Weight" },
  { id: "netWeightKgs", name: "Net Weight" },
  { id: "qcStatus", name: "QC Status" },
  { id: "location", name: "Location" },
  { id: "factory", name: "Factory" },
  { id: "hourStandard", name: "Relax hour" },
  { id: "relaxProgress", name: "Relax Progress" },
  { id: "relaxDate", name: "Date Relaxed" },
];

const defaultVisibleColumns = new Set([
  "poNumber",
  "supplierCode",
  "invoiceNo",
  "rollNo",
  "color",
  "lotNo",
  "balanceYards",
  "qcStatus",
  "location",
  "relaxProgress",
]);

// --- Modal Components ---

const Modal: FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}> = ({ title, children, onClose, maxWidth = "max-w-md" }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
    <div className={`bg-white p-6 rounded-lg shadow-xl w-full ${maxWidth}`}>
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

// --- Main Page Component ---

const InventoryListPage = () => {
  const [fabricRolls, setFabricRolls] = useState<FabricRoll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    defaultVisibleColumns
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  type ModalType = "transfer" | "history";
  const [modalState, setModalState] = useState<{
    type: ModalType | null;
    data: FabricRoll[];
  }>({ type: null, data: [] });

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setFabricRolls(DUMMY_FABRIC_DATA);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectedRows(new Set());
  }, [currentPage, rowsPerPage]);

  const paginatedRolls = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return fabricRolls.slice(startIndex, endIndex);
  }, [fabricRolls, currentPage, rowsPerPage]);

  const getSelectedItems = (): FabricRoll[] => {
    return fabricRolls.filter((roll) => selectedRows.has(roll.id));
  };

  const handleExportSelected = () => {
    const selectedItems = getSelectedItems();
    alert(`Exporting ${selectedItems.length} selected item(s) to Excel.`);
  };

  const handlePrintMultiple = () => {
    const selectedIds = Array.from(selectedRows).join(", ");
    alert(`Printing QR Codes for: ${selectedIds}`);
    setSelectedRows(new Set());
  };

  const handleTransfer = () => {
    const items = getSelectedItems();
    if (items.length > 0) {
      setModalState({ type: "transfer", data: items });
    }
  };

  const handleViewHistory = () => {
    const items = getSelectedItems();
    if (items.length > 0) {
      setModalState({ type: "history", data: items });
    }
  };

  const handleExecuteTransfer = (
    rollsToUpdate: FabricRoll[],
    newLocation: string
  ) => {
    const idsToUpdate = new Set(rollsToUpdate.map((r) => r.id));

    setFabricRolls((prevRolls) =>
      prevRolls.map((roll) => {
        if (idsToUpdate.has(roll.id)) {
          const newHistoryEntry: LocationHistoryEntry = {
            dateTime: new Date().toISOString(),
            from: roll.location,
            to: newLocation,
            changedBy: "Admin User", // Mock user
          };
          return {
            ...roll,
            location: newLocation,
            locationHistory: [...roll.locationHistory, newHistoryEntry],
          };
        }
        return roll;
      })
    );

    setModalState({ type: null, data: [] });
    setSelectedRows(new Set());
    alert(`${rollsToUpdate.length} item(s) have been moved to ${newLocation}.`);
  };

  const handleDeleteMultiple = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedRows.size} selected item(s)?`
      )
    ) {
      setFabricRolls((prevRolls) =>
        prevRolls.filter((roll) => !selectedRows.has(roll.id))
      );
      alert(`${selectedRows.size} item(s) have been deleted.`);
      setSelectedRows(new Set());
    }
  };

  const handleExportAll = () => {
    alert(`Exporting all ${fabricRolls.length} items to Excel.`);
  };

  // --- Single Item Action Handlers ---
  const handlePrintSingle = (item: FabricRoll) => {
    alert(`Printing QR Code for: ${item.id}`);
  };

  const handleTransferSingle = (item: FabricRoll) => {
    setModalState({ type: "transfer", data: [item] });
  };

  const handleViewHistorySingle = (item: FabricRoll) => {
    setModalState({ type: "history", data: [item] });
  };

  const handleDeleteSingle = (item: FabricRoll) => {
    if (window.confirm(`Are you sure you want to delete item ${item.id}?`)) {
      setFabricRolls((prevRolls) =>
        prevRolls.filter((roll) => roll.id !== item.id)
      );
      alert(`Item ${item.id} has been deleted.`);
      // Also remove from selection if it was selected
      setSelectedRows((prev) => {
        const newSelection = new Set(prev);
        newSelection.delete(item.id);
        return newSelection;
      });
    }
  };

  const renderModal = () => {
    if (!modalState.type || modalState.data.length === 0) return null;

    switch (modalState.type) {
      case "transfer":
        return (
          <MultiTransferLocationModal
            rolls={modalState.data}
            onCancel={() => setModalState({ type: null, data: [] })}
            onSubmit={(newLocation) => {
              handleExecuteTransfer(modalState.data, newLocation);
            }}
          />
        );
      case "history":
        return (
          <MultiLocationHistoryModal
            rolls={modalState.data}
            onClose={() => setModalState({ type: null, data: [] })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {renderModal()}

      <section>
        {isLoading ? (
          <>
            <FilterSkeleton />
            <TableSkeleton />
          </>
        ) : (
          <>
            <InventoryHeader
              selectedRowCount={selectedRows.size}
              onExportAll={handleExportAll}
              onExportSelected={handleExportSelected}
              onPrintMultiple={handlePrintMultiple}
              onTransfer={handleTransfer}
              onViewHistory={handleViewHistory}
              onDelete={handleDeleteMultiple}
            />
            <InventoryFilters />
            {fabricRolls.length > 0 ? (
              <>
                <InventoryTable
                  items={paginatedRolls}
                  allColumns={allColumns}
                  visibleColumns={visibleColumns}
                  onColumnVisibilityChange={setVisibleColumns}
                  selectedRows={selectedRows}
                  onSelectionChange={setSelectedRows}
                  onPrintSingle={handlePrintSingle}
                  onViewHistorySingle={handleViewHistorySingle}
                  onTransferSingle={handleTransferSingle}
                  onDeleteSingle={handleDeleteSingle}
                />
                <Pagination
                  currentPage={currentPage}
                  totalItems={fabricRolls.length}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setCurrentPage}
                  onRowsPerPageChange={setRowsPerPage}
                />
              </>
            ) : (
              <div className="bg-white text-center p-12 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-gray-900">
                  No items found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  No items match the current filters.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default InventoryListPage;
