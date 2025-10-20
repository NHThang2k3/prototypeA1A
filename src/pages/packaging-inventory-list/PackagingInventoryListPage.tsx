// Path: src/pages/packaging-inventory-list/PackagingInventoryListPage.tsx

import { useState, useEffect, useMemo, type FC } from "react";
import { PackagingInventoryHeader } from "./components/PackagingInventoryHeader";
import { PackagingInventoryFilters } from "./components/PackagingInventoryFilters";
import { PackagingInventoryTable } from "./components/PackagingInventoryTable";
import Pagination from "./components/Pagination";
import type { PackagingItem, PackagingStatus } from "./types";
import { FilterSkeleton } from "./components/skeletons/FilterSkeleton";
import { TableSkeleton } from "./components/skeletons/TableSkeleton";
import { DUMMY_PACKAGING_DATA } from "./data";

// List of all available columns for the user to toggle
const allColumns = [
  { id: "qrCode", name: "QR Code" },
  { id: "itemNumber", name: "Item Number" },
  { id: "materialName", name: "Material Name" },
  { id: "description", name: "Description" },
  { id: "color", name: "Color" },
  { id: "size", name: "Size" },
  { id: "quantity", name: "Quantity" },
  { id: "unit", name: "Unit" },
  { id: "location", name: "Location" },
  { id: "status", name: "Status" },
  { id: "supplier", name: "Supplier" },
  { id: "poNumber", name: "PO Number" },
  { id: "itemCategory", name: "Item Category" },
  { id: "requiredQuantity", name: "Required Quantity" },
  { id: "batchNumber", name: "Batch Number" },
  { id: "dateReceived", name: "Date Received" },
  { id: "reorderPoint", name: "Reorder Point" },
  { id: "lastModifiedDate", name: "Last Modified Date" },
  { id: "lastModifiedBy", name: "Last Modified By" },
];

// Default columns to show on initial load
const defaultVisibleColumns = new Set([
  "qrCode",
  "itemNumber",
  "materialName",
  "color",
  "quantity",
  "unit",
  "location",
  "status",
  "supplier",
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

const IssueModal: FC<{
  item: PackagingItem;
  onSubmit: (quantity: number) => void;
  onCancel: () => void;
}> = ({ item, onSubmit, onCancel }) => {
  const [quantity, setQuantity] = useState<number | string>("");
  return (
    <Modal title={`Issue Packaging: ${item.itemNumber}`} onClose={onCancel}>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">{item.materialName}</span> - {item.color}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Current quantity: <span className="font-bold">{item.quantity}</span>{" "}
        {item.unit}
      </p>
      <div>
        <label
          htmlFor="quantity-issue"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quantity to issue
        </label>
        <input
          type="number"
          id="quantity-issue"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={`e.g., 100`}
          min="1"
          max={item.quantity}
        />
      </div>
      <button
        onClick={() => onSubmit(Number(quantity))}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        disabled={
          !quantity || Number(quantity) <= 0 || Number(quantity) > item.quantity
        }
      >
        Confirm Issue
      </button>
    </Modal>
  );
};

// --- Main Page Component ---

const PackagingInventoryListPage = () => {
  const [packagingItems, setPackagingItems] = useState<PackagingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    defaultVisibleColumns
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  type ModalType = "transfer" | "issue";
  const [modalState, setModalState] = useState<{
    type: ModalType | null;
    data: PackagingItem | null;
  }>({ type: null, data: null });

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setPackagingItems(DUMMY_PACKAGING_DATA);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectedRows(new Set());
  }, [currentPage, rowsPerPage]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return packagingItems.slice(startIndex, endIndex);
  }, [packagingItems, currentPage, rowsPerPage]);

  const handlePrintQr = (item: PackagingItem) => {
    alert(`Printing QR Code for: ${item.qrCode}`);
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

  const handleExecuteIssue = (
    itemToUpdate: PackagingItem,
    quantityToIssue: number
  ) => {
    if (
      !quantityToIssue ||
      quantityToIssue <= 0 ||
      quantityToIssue > itemToUpdate.quantity
    ) {
      alert("Invalid quantity to issue.");
      return;
    }

    setPackagingItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemToUpdate.id) {
          const newQuantity = item.quantity - quantityToIssue;
          let newStatus: PackagingStatus = "In Stock";
          if (newQuantity <= 0) {
            newStatus = "Out of Stock";
          } else if (newQuantity <= item.reorderPoint) {
            newStatus = "Low Stock";
          }
          return {
            ...item,
            quantity: newQuantity,
            status: newStatus,
            lastModifiedDate: new Date().toISOString().split("T")[0],
            lastModifiedBy: "Admin User", // Mock user
          };
        }
        return item;
      })
    );
    setModalState({ type: null, data: null });
    alert(
      `Issued ${quantityToIssue} ${itemToUpdate.unit} of ${itemToUpdate.itemNumber}.`
    );
  };

  const handleTransferLocation = (
    itemToUpdate: PackagingItem,
    newLocation: string
  ) => {
    if (!newLocation.trim()) {
      alert("New location cannot be empty.");
      return;
    }

    setPackagingItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemToUpdate.id
          ? {
              ...item,
              location: newLocation,
              lastModifiedDate: new Date().toISOString().split("T")[0],
              lastModifiedBy: "Admin User", // Mock user
            }
          : item
      )
    );
    setModalState({ type: null, data: null });
    alert(
      `Transferred ${itemToUpdate.itemNumber} to new location: ${newLocation}`
    );
  };

  const renderModal = () => {
    if (!modalState.data) return null;

    switch (modalState.type) {
      case "transfer":
        return (
          <Modal
            title={`Transfer Location for ${modalState.data.itemNumber}`}
            onClose={() => setModalState({ type: null, data: null })}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newLocation = (
                  e.currentTarget.elements.namedItem(
                    "new-location"
                  ) as HTMLInputElement
                ).value;
                handleTransferLocation(modalState.data!, newLocation);
              }}
            >
              <p className="mb-4">
                Current location:{" "}
                <span className="font-semibold">
                  {modalState.data.location}
                </span>
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
                name="new-location"
                className="block w-full py-2 px-3 border border-gray-300 rounded-md"
                placeholder="e.g., Kệ Z-99-99"
                required
              />
              <button
                type="submit"
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Confirm Transfer
              </button>
            </form>
          </Modal>
        );
      case "issue":
        return (
          <IssueModal
            item={modalState.data}
            onSubmit={(quantity) =>
              handleExecuteIssue(modalState.data!, quantity)
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
            <PackagingInventoryHeader
              allColumns={allColumns}
              visibleColumns={visibleColumns}
              onColumnVisibilityChange={setVisibleColumns}
              selectedRowCount={selectedRows.size}
              onPrintMultiple={handlePrintMultipleQr}
              onExportExcel={handleExportExcel}
            />
            <PackagingInventoryFilters />
            {packagingItems.length > 0 ? (
              <>
                <PackagingInventoryTable
                  items={paginatedItems}
                  visibleColumns={visibleColumns}
                  selectedRows={selectedRows}
                  onSelectionChange={setSelectedRows}
                  onPrintQr={handlePrintQr}
                  onTransferLocation={(item) =>
                    setModalState({ type: "transfer", data: item })
                  }
                  onIssue={(item) =>
                    setModalState({ type: "issue", data: item })
                  }
                />
                <Pagination
                  currentPage={currentPage}
                  totalItems={packagingItems.length}
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

export default PackagingInventoryListPage;
