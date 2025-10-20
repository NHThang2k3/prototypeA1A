// Path: src/pages/inventory-list/InventoryListPage.tsx

import { useState, useEffect, useMemo, type FC } from "react";
import { InventoryHeader } from "./components/InventoryHeader";
import { InventoryFilters } from "./components/InventoryFilters";
import { InventoryTable } from "./components/InventoryTable";
import Pagination from "./components/Pagination";
import type { FabricRoll } from "./types";
import { FilterSkeleton } from "./components/skeletons/FilterSkeleton";
import { TableSkeleton } from "./components/skeletons/TableSkeleton";
import { DUMMY_FABRIC_DATA } from "./data"; // Import data from the new file

// List of all available columns for the user to toggle
const allColumns = [
  // Key Info
  { id: "qrCode", name: "QR Code" },
  { id: "itemCode", name: "Item Code" },
  { id: "description", name: "Description" },
  { id: "location", name: "Location" },

  // Quantity
  { id: "yards", name: "Yards" },
  { id: "balanceYards", name: "Balance Yards" },
  { id: "netWeightKgs", name: "Net Weight (Kgs)" },
  { id: "grossWeightKgs", name: "Gross Weight (Kgs)" },
  { id: "width", name: "Width" },

  // Source Info
  { id: "poNumber", name: "PO Number" },
  { id: "supplier", name: "Supplier" },
  { id: "factory", name: "Factory" },
  { id: "invoiceNo", name: "Invoice No" },

  // Details
  { id: "color", name: "Color" },
  { id: "colorCode", name: "Color Code" },
  { id: "rollNo", name: "Roll No" },
  { id: "lotNo", name: "Lot No" },

  // QC Info
  { id: "qcStatus", name: "QC Status" },
  { id: "qcDate", name: "QC Date" },
  { id: "qcBy", name: "QC By" },
  { id: "comment", name: "Comment" },

  // Date & Status
  { id: "dateInHouse", name: "Date In House" },
  { id: "printed", name: "Printed" },
  { id: "parentQrCode", name: "Parent QR" },

  // Relax Info
  { id: "hourStandard", name: "Hour Standard" },
  { id: "hourRelax", name: "Hour Relax" },
  { id: "relaxDate", name: "Relax Date" },
  { id: "relaxTime", name: "Relax Time" },
  { id: "relaxBy", name: "Relax By" },
];

// Default columns to show on initial load
const defaultVisibleColumns = new Set([
  "qrCode",
  "itemCode",
  "description",
  "color",
  "supplier",
  "yards",
  "balanceYards",
  "location",
  "qcStatus",
  "dateInHouse",
]);

// --- Modal Components ---

const Modal: FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
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

const BreakdownModal: FC<{
  roll: FabricRoll;
  onSubmit: (yards: number) => void;
  onCancel: () => void;
}> = ({ roll, onSubmit, onCancel }) => {
  const [yards, setYards] = useState<number | string>("");
  return (
    <Modal title={`Breakdown Fabric Roll: ${roll.qrCode}`} onClose={onCancel}>
      <p className="text-sm text-gray-600 mb-4">
        Current balance: <span className="font-bold">{roll.balanceYards}</span>{" "}
        yards
      </p>
      <div>
        <label
          htmlFor="yards-split"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Yards to breakdown
        </label>
        <input
          type="number"
          id="yards-split"
          value={yards}
          onChange={(e) => setYards(e.target.value)}
          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., 10"
          min="1"
          max={roll.balanceYards - 1}
        />
      </div>
      <button
        onClick={() => onSubmit(Number(yards))}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        disabled={
          !yards || Number(yards) <= 0 || Number(yards) >= roll.balanceYards
        }
      >
        Breakdown
      </button>
    </Modal>
  );
};

const UpdateRelaxModal: FC<{
  roll: FabricRoll;
  onSubmit: (hours: number) => void;
  onCancel: () => void;
}> = ({ roll, onSubmit, onCancel }) => {
  const [hours, setHours] = useState(roll.hourStandard);
  return (
    <Modal title={`Update Relax Hour: ${roll.qrCode}`} onClose={onCancel}>
      <p className="text-sm text-gray-600 mb-4">
        Current Hour Standard:{" "}
        <span className="font-bold">{roll.hourStandard}</span>
      </p>
      <div>
        <label
          htmlFor="hour-relax"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          New Hour Standard
        </label>
        <input
          type="number"
          id="hour-relax"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          min="1"
        />
      </div>
      <button
        onClick={() => onSubmit(hours)}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        disabled={!hours || hours <= 0}
      >
        Update
      </button>
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

  type ModalType = "transfer" | "history" | "breakdown" | "relax";
  const [modalState, setModalState] = useState<{
    type: ModalType | null;
    data: FabricRoll | null;
  }>({ type: null, data: null });

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setFabricRolls(DUMMY_FABRIC_DATA);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Clear selection when page or rows per page changes
  useEffect(() => {
    setSelectedRows(new Set());
  }, [currentPage, rowsPerPage]);

  const paginatedRolls = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return fabricRolls.slice(startIndex, endIndex);
  }, [fabricRolls, currentPage, rowsPerPage]);

  const handlePrintQr = (item: FabricRoll) => {
    alert(`Printing QR Code: ${item.qrCode}`);
  };

  const handlePrintMultipleQr = () => {
    if (selectedRows.size === 0) {
      alert("No rows selected to print.");
      return;
    }
    const selectedIds = Array.from(selectedRows).join(", ");
    alert(`Printing QR Codes for: ${selectedIds}`);
    setSelectedRows(new Set()); // Clear selection after action
  };

  const handleExportExcel = () => {
    if (selectedRows.size === 0) {
      alert("No rows selected to export.");
      return;
    }
    const selectedIds = Array.from(selectedRows).join(", ");
    alert(`Exporting data for: ${selectedIds}`);
    setSelectedRows(new Set()); // Clear selection after action
  };

  const handleExecuteBreakdown = (
    originalRoll: FabricRoll,
    yardsToSplit: number
  ) => {
    if (
      !yardsToSplit ||
      yardsToSplit <= 0 ||
      yardsToSplit >= originalRoll.balanceYards
    ) {
      alert("Invalid yards to breakdown.");
      return;
    }

    const newQr = `QR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRoll: FabricRoll = {
      ...originalRoll,
      id: newQr,
      qrCode: newQr,
      parentQrCode: originalRoll.qrCode,
      yards: yardsToSplit,
      balanceYards: yardsToSplit,
      printed: false, // New roll has not been printed
      rollNo: `${originalRoll.rollNo}-B`, // Mark as a child roll
    };

    setFabricRolls((prevRolls) => {
      const updatedRolls = prevRolls.map((roll) =>
        roll.id === originalRoll.id
          ? { ...roll, balanceYards: roll.balanceYards - yardsToSplit }
          : roll
      );
      return [newRoll, ...updatedRolls];
    });

    setModalState({ type: null, data: null });
    alert(
      `Created new roll ${newRoll.qrCode} with ${yardsToSplit} yards.\nRemaining balance of original roll is ${originalRoll.balanceYards - yardsToSplit} yards.`
    );
  };

  const handleExecuteUpdateRelax = (
    rollToUpdate: FabricRoll,
    newHourStandard: number
  ) => {
    if (!newHourStandard || newHourStandard <= 0) {
      alert("Invalid Hour Standard.");
      return;
    }

    setFabricRolls((prevRolls) =>
      prevRolls.map((roll) =>
        roll.id === rollToUpdate.id
          ? {
              ...roll,
              hourStandard: newHourStandard,
              hourRelax: newHourStandard,
              relaxDate: new Date().toISOString().split("T")[0],
              relaxTime: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              relaxBy: "Admin User", // Mock data for logged in user
            }
          : roll
      )
    );
    setModalState({ type: null, data: null });
    alert(`Updated Relax Hour for roll ${rollToUpdate.qrCode}.`);
  };

  const renderModal = () => {
    if (!modalState.data) return null;

    switch (modalState.type) {
      case "transfer":
        return (
          <Modal
            title={`Transfer warehouse location for ${modalState.data.qrCode}`}
            onClose={() => setModalState({ type: null, data: null })}
          >
            <p className="mb-4">
              Current location:{" "}
              <span className="font-semibold">{modalState.data.location}</span>
            </p>
            <label
              htmlFor="new-location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New location
            </label>
            <input
              type="text"
              id="new-location"
              className="block w-full py-2 px-3 border border-gray-300 rounded-md"
              placeholder="e.g., F2-10-05"
            />
            <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Confirm
            </button>
          </Modal>
        );
      case "history":
        return (
          <Modal
            title={`Location transfer history for ${modalState.data.qrCode}`}
            onClose={() => setModalState({ type: null, data: null })}
          >
            <p>No history yet (mock data).</p>
          </Modal>
        );
      case "breakdown":
        return (
          <BreakdownModal
            roll={modalState.data}
            onSubmit={(yards) =>
              handleExecuteBreakdown(modalState.data!, yards)
            }
            onCancel={() => setModalState({ type: null, data: null })}
          />
        );
      case "relax":
        return (
          <UpdateRelaxModal
            roll={modalState.data}
            onSubmit={(hours) =>
              handleExecuteUpdateRelax(modalState.data!, hours)
            }
            onCancel={() => setModalState({ type: null, data: null })}
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
              allColumns={allColumns}
              visibleColumns={visibleColumns}
              onColumnVisibilityChange={setVisibleColumns}
              selectedRowCount={selectedRows.size}
              onPrintMultiple={handlePrintMultipleQr}
              onExportExcel={handleExportExcel}
            />
            <InventoryFilters />
            {fabricRolls.length > 0 ? (
              <>
                <InventoryTable
                  items={paginatedRolls}
                  visibleColumns={visibleColumns}
                  selectedRows={selectedRows}
                  onSelectionChange={setSelectedRows}
                  onPrintQr={handlePrintQr}
                  onTransferLocation={(item) =>
                    setModalState({ type: "transfer", data: item })
                  }
                  onViewHistory={(item) =>
                    setModalState({ type: "history", data: item })
                  }
                  onBreakdown={(item) =>
                    setModalState({ type: "breakdown", data: item })
                  }
                  onUpdateRelax={(item) =>
                    setModalState({ type: "relax", data: item })
                  }
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
