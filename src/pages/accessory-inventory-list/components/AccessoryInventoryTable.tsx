// Path: src/pages/accessory-inventory-list/components/AccessoryInventoryTable.tsx

import React, { useState, useRef, useEffect } from "react";
import type { AccessoryItem } from "../types";
import {
  ArrowUpDown,
  MoreHorizontal,
  Move,
  PackageMinus,
  Printer,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface AccessoryInventoryTableProps {
  items: AccessoryItem[];
  visibleColumns: Set<string>;
  selectedRows: Set<string>;
  onSelectionChange: (newSelection: Set<string>) => void;
  onPrintQr: (item: AccessoryItem) => void;
  onTransferLocation: (item: AccessoryItem) => void;
  onIssue: (item: AccessoryItem) => void;
}

const columnConfig: {
  id: keyof AccessoryItem;
  header: string;
  cell?: (item: AccessoryItem) => React.ReactNode;
}[] = [
  {
    id: "qrCode",
    header: "QR Code",
    cell: (item) => (
      <span className="font-medium text-blue-600">{item.qrCode}</span>
    ),
  },
  {
    id: "itemNumber",
    header: "Item Number",
    cell: (item) => (
      <span className="font-medium text-gray-800">{item.itemNumber}</span>
    ),
  },
  { id: "itemCategory", header: "Item Category" },
  { id: "materialName", header: "Material Name" },
  { id: "color", header: "Color" },
  { id: "size", header: "Size" },
  {
    id: "quantity",
    header: "Quantity",
    cell: (item) => <span>{item.quantity.toLocaleString()}</span>,
  },
  { id: "unit", header: "Unit" },
  { id: "location", header: "Location" },
  {
    id: "requiredQuantity",
    header: "Required Qty",
    cell: (item) => <span>{item.requiredQuantity.toLocaleString()}</span>,
  },
  {
    id: "status",
    header: "Status",
    cell: (item) => <StatusBadge status={item.status} />,
  },
  { id: "batchNumber", header: "Batch Number" },
  {
    id: "dateReceived",
    header: "Date Received",
    cell: (item) => new Date(item.dateReceived).toLocaleDateString(),
  },
  { id: "supplier", header: "Supplier" },
  { id: "poNumber", header: "PO Number" },
  {
    id: "reorderPoint",
    header: "Reorder Point",
    cell: (item) => <span>{item.reorderPoint.toLocaleString()}</span>,
  },
  {
    id: "lastModifiedDate",
    header: "Last Modified",
    cell: (item) => new Date(item.lastModifiedDate).toLocaleDateString(),
  },
  { id: "lastModifiedBy", header: "Modified By" },
  { id: "description", header: "Description" },
];

export const AccessoryInventoryTable: React.FC<
  AccessoryInventoryTableProps
> = ({
  items,
  visibleColumns,
  selectedRows,
  onSelectionChange,
  onPrintQr,
  onTransferLocation,
  onIssue,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !menuRef.current?.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      const numSelected = selectedRows.size;
      const numItems = items.length;
      selectAllCheckboxRef.current.checked = numSelected === numItems && numItems > 0;
      selectAllCheckboxRef.current.indeterminate =
        numSelected > 0 && numSelected < numItems;
    }
  }, [selectedRows, items]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allItemIds = new Set(items.map((item) => item.id));
      onSelectionChange(allItemIds);
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectOne = (itemId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    onSelectionChange(newSelection);
  };

  const TableHeader = ({ children }: { children: React.ReactNode }) => (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <span className="flex items-center cursor-pointer hover:text-gray-800">
        {children}
        <ArrowUpDown className="w-4 h-4 ml-1.5" />
      </span>
    </th>
  );

  const displayedColumns = columnConfig.filter((c) => visibleColumns.has(c.id));

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  ref={selectAllCheckboxRef}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              {displayedColumns.map((col) => (
                <TableHeader key={col.id}>{col.header}</TableHeader>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-gray-50 ${
                  selectedRows.has(item.id) ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(item.id)}
                    onChange={() => handleSelectOne(item.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                {displayedColumns.map((col) => (
                  <td
                    key={col.id}
                    className="px-4 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {col.cell
                      ? col.cell(item)
                      : (item[col.id as keyof AccessoryItem] as string)}
                  </td>
                ))}
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === item.id ? null : item.id)
                    }
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {openMenuId === item.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200 origin-top-right"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onPrintQr(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Printer className="w-4 h-4 mr-3" /> Print QR Code
                        </button>
                        <button
                          onClick={() => {
                            onIssue(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <PackageMinus className="w-4 h-4 mr-3" /> Issue for
                          Production
                        </button>
                        <button
                          onClick={() => {
                            onTransferLocation(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Move className="w-4 h-4 mr-3" /> Transfer Location
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
