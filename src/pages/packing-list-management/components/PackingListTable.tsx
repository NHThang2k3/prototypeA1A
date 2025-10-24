// src/pages/packing-list-management/components/PackingListTable.tsx

import React, { useState, useMemo } from "react";
import type { FabricRollItem } from "../types";
import StatusBadge from "./StatusBadge";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import SimpleDropdownMenu, { DropdownCheckboxItem } from "./SimpleDropdownMenu";
import { QrCode, Undo2, Columns } from "lucide-react";

const ALL_COLUMNS = [
  { id: "poNumber", label: "PO Number" },
  { id: "itemCode", label: "Item Code" },
  { id: "factory", label: "Factory" },
  { id: "supplier", label: "Supplier" },
  { id: "invoiceNo", label: "Invoice No" },
  { id: "colorCode", label: "Color Code" },
  { id: "color", label: "Color" },
  { id: "rollNo", label: "Roll No" },
  { id: "lotNo", label: "Lot No" },
  { id: "yards", label: "Yards" },
  { id: "netWeightKgs", label: "Net Weight (Kgs)" },
  { id: "grossWeightKgs", label: "Gross Weight (Kgs)" },
  { id: "width", label: "Width" },
  { id: "location", label: "Location" },
  { id: "qrCode", label: "QR Code" },
  { id: "dateInHouse", label: "Date In House" },
  { id: "description", label: "Description" },
  { id: "qcCheck", label: "QC Check" },
  { id: "qcDate", label: "QC Date" },
  { id: "qcBy", label: "QC By" },
  { id: "comment", label: "Comment" },
  { id: "printed", label: "Printed" },
  { id: "action", label: "Action" },
];

interface PackingListTableProps {
  items: FabricRollItem[];
  onPrint: (itemIds: Set<string>) => void;
  onOpenSplitModal: (item: FabricRollItem) => void;
  onQcCheckChange: (itemId: string, checked: boolean) => void;
}

const PackingListTable: React.FC<PackingListTableProps> = ({
  items,
  onPrint,
  // onOpenSplitModal,
  onQcCheckChange,
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      // Key Info - Visible by default
      poNumber: true,
      itemCode: true,
      color: true,
      rollNo: true,
      lotNo: true,
      yards: true,
      netWeightKgs: true,
      width: true,
      qcCheck: true,
      printed: true,
      action: true,

      // Secondary Info - Hidden by default
      factory: false,
      supplier: false,
      invoiceNo: false,
      colorCode: false,
      description: false,
      grossWeightKgs: false,
      location: false,
      qrCode: false,
      dateInHouse: false,
      qcDate: false,
      qcBy: false,
      comment: false,
    }
  );

  // ... (selection logic remains the same)
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableItems = items
        .filter((item) => item.printStatus === "NOT_PRINTED")
        .map((item) => item.id);
      setSelectedItems(new Set(selectableItems));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelectedItems = new Set(selectedItems);
    if (checked) {
      newSelectedItems.add(itemId);
    } else {
      newSelectedItems.delete(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const allSelectableItems = useMemo(() => {
    return items.filter((item) => item.printStatus === "NOT_PRINTED");
  }, [items]);

  const isAllSelected = useMemo(() => {
    return (
      allSelectableItems.length > 0 &&
      selectedItems.size === allSelectableItems.length
    );
  }, [allSelectableItems, selectedItems]);

  const handlePrintSelected = () => {
    if (selectedItems.size === 0) {
      alert("Please select at least one item to print.");
      return;
    }
    onPrint(selectedItems);
    setSelectedItems(new Set());
  };

  const handlePrintSingleItem = (item: FabricRollItem) => {
    onPrint(new Set([item.id]));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-800">Item List</h3>
        <div className="flex items-center gap-2">
          {/* Column Visibility Dropdown using our custom component */}
          <SimpleDropdownMenu
            trigger={
              <Button variant="outline" size="sm">
                <Columns className="w-4 h-4 mr-2" />
                Columns
              </Button>
            }
          >
            <div className="px-4 py-2 text-xs font-semibold text-gray-500">
              TOGGLE COLUMNS
            </div>
            {ALL_COLUMNS.map((col) => (
              <DropdownCheckboxItem
                key={col.id}
                checked={visibleColumns[col.id]}
                onCheckedChange={(value) =>
                  setVisibleColumns((prev) => ({ ...prev, [col.id]: value }))
                }
              >
                {col.label}
              </DropdownCheckboxItem>
            ))}
          </SimpleDropdownMenu>

          <Button
            size="sm"
            onClick={handlePrintSelected}
            disabled={selectedItems.size === 0}
          >
            <QrCode className="w-4 h-4 mr-2" />
            Print QR for Selected ({selectedItems.size})
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="p-4">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all printable items"
                />
              </th>
              {ALL_COLUMNS.map(
                (col) =>
                  visibleColumns[col.id] && (
                    <th
                      key={col.id}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => {
              const isSelectable = item.printStatus === "NOT_PRINTED";
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={(checked) =>
                        handleSelectItem(item.id, !!checked)
                      }
                      disabled={!isSelectable}
                      aria-label={`Select item ${item.itemCode}`}
                    />
                  </td>
                  {visibleColumns.poNumber && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.poNumber}
                    </td>
                  )}
                  {visibleColumns.itemCode && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.itemCode}
                    </td>
                  )}
                  {visibleColumns.factory && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.factory}
                    </td>
                  )}
                  {visibleColumns.supplier && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.supplier}
                    </td>
                  )}
                  {visibleColumns.invoiceNo && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.invoiceNo}
                    </td>
                  )}
                  {visibleColumns.colorCode && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.colorCode}
                    </td>
                  )}
                  {visibleColumns.color && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.color}
                    </td>
                  )}
                  {visibleColumns.rollNo && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.rollNo}
                    </td>
                  )}
                  {visibleColumns.lotNo && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.lotNo}
                    </td>
                  )}
                  {visibleColumns.yards && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.yards}
                    </td>
                  )}
                  {visibleColumns.netWeightKgs && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.netWeightKgs}
                    </td>
                  )}
                  {visibleColumns.grossWeightKgs && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.grossWeightKgs}
                    </td>
                  )}
                  {visibleColumns.width && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.width}
                    </td>
                  )}
                  {visibleColumns.location && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.location}
                    </td>
                  )}
                  {visibleColumns.qrCode && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono ">
                      {item.qrCode}
                    </td>
                  )}
                  {visibleColumns.dateInHouse && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.dateInHouse}
                    </td>
                  )}
                  {visibleColumns.description && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.description}
                    </td>
                  )}
                  {visibleColumns.qcCheck && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <Checkbox
                        checked={item.qcCheck}
                        onCheckedChange={(checked) =>
                          onQcCheckChange(item.id, !!checked)
                        }
                        aria-label={`Mark ${item.itemCode} for QC`}
                      />
                    </td>
                  )}
                  {visibleColumns.qcDate && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.qcDate}
                    </td>
                  )}
                  {visibleColumns.qcBy && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.qcBy}
                    </td>
                  )}
                  {visibleColumns.comment && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.comment}
                    </td>
                  )}
                  {visibleColumns.printed && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={item.printStatus} />
                    </td>
                  )}
                  {visibleColumns.action && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenSplitModal(item)}
                        >
                          <Split className="w-4 h-4 mr-2" />
                          Split
                        </Button> */}
                        {item.printStatus === "PRINTED" ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handlePrintSingleItem(item)}
                          >
                            <Undo2 className="w-4 h-4 mr-2" />
                            Reprint
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrintSingleItem(item)}
                          >
                            <QrCode className="w-4 h-4 mr-2" />
                            Print
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackingListTable;
