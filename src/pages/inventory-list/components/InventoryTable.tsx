// Path: src/pages/inventory-list/components/InventoryTable.tsx

import React, { useState, useRef, useEffect } from "react";
import type { FabricRoll } from "../types";
import {
  ArrowUpDown,
  MoreHorizontal,
  Printer,
  Move,
  History,
  Scissors,
  RefreshCw,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface InventoryTableProps {
  items: FabricRoll[];
  visibleColumns: Set<string>;
  selectedRows: Set<string>;
  onSelectionChange: (newSelection: Set<string>) => void;
  onPrintQr: (item: FabricRoll) => void;
  onTransferLocation: (item: FabricRoll) => void;
  onViewHistory: (item: FabricRoll) => void;
  onBreakdown: (item: FabricRoll) => void;
  onUpdateRelax: (item: FabricRoll) => void;
}

const columnConfig: {
  id: keyof FabricRoll;
  header: string;
  cell?: (item: FabricRoll) => React.ReactNode;
}[] = [
  // Key Info
  {
    id: "qrCode",
    header: "QR Code",
    cell: (item) => (
      <span className="font-medium text-blue-600">{item.qrCode}</span>
    ),
  },
  { id: "itemCode", header: "Item Code" },
  { id: "description", header: "Description" },
  { id: "location", header: "Location" },

  // Quantity
  {
    id: "yards",
    header: "Yards",
    cell: (item) => <span>{item.yards.toLocaleString()}</span>,
  },
  {
    id: "balanceYards",
    header: "Balance Yards",
    cell: (item) => <span>{item.balanceYards.toLocaleString()}</span>,
  },
  {
    id: "netWeightKgs",
    header: "Net Weight (Kgs)",
    cell: (item) => <span>{item.netWeightKgs.toLocaleString()}</span>,
  },
  {
    id: "grossWeightKgs",
    header: "Gross Weight (Kgs)",
    cell: (item) => <span>{item.grossWeightKgs.toLocaleString()}</span>,
  },
  { id: "width", header: "Width" },

  // Source Info
  { id: "poNumber", header: "PO Number" },
  { id: "supplier", header: "Supplier" },
  { id: "factory", header: "Factory" },
  { id: "invoiceNo", header: "Invoice No" },

  // Details
  { id: "color", header: "Color" },
  { id: "colorCode", header: "Color Code" },
  { id: "rollNo", header: "Roll No" },
  { id: "lotNo", header: "Lot No" },

  // QC Info
  {
    id: "qcStatus",
    header: "QC Status",
    cell: (item) => <StatusBadge status={item.qcStatus} />,
  },
  {
    id: "qcDate",
    header: "QC Date",
    cell: (item) =>
      item.qcDate ? new Date(item.qcDate).toLocaleDateString() : "-",
  },
  { id: "qcBy", header: "QC By" },
  { id: "comment", header: "Comment" },

  // Date & Status
  {
    id: "dateInHouse",
    header: "Date In House",
    cell: (item) => new Date(item.dateInHouse).toLocaleDateString(),
  },
  {
    id: "printed",
    header: "Printed",
    cell: (item) => (
      <span className={item.printed ? "text-green-600" : "text-gray-500"}>
        {item.printed ? "Yes" : "No"}
      </span>
    ),
  },
  {
    id: "parentQrCode",
    header: "Parent QR",
    cell: (item) => item.parentQrCode || "-",
  },

  // Relax Info
  { id: "hourStandard", header: "Hour Standard" },
  { id: "hourRelax", header: "Hour Relax" },
  {
    id: "relaxDate",
    header: "Relax Date",
    cell: (item) =>
      item.relaxDate ? new Date(item.relaxDate).toLocaleDateString() : "-",
  },
  { id: "relaxTime", header: "Relax Time" },
  { id: "relaxBy", header: "Relax By" },
];

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  visibleColumns,
  selectedRows,
  onSelectionChange,
  onPrintQr,
  onTransferLocation,
  onViewHistory,
  onBreakdown,
  onUpdateRelax,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const displayedColumns = columnConfig.filter((c) => visibleColumns.has(c.id));

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

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                className={`hover:bg-gray-50 ${selectedRows.has(item.id) ? "bg-blue-50" : ""}`}>
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
                      : (item[col.id as keyof FabricRoll] as string)}
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
                      className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-10 border border-gray-200 origin-top-right"
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
                            onTransferLocation(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Move className="w-4 h-4 mr-3" /> Transfer Location
                        </button>
                        <button
                          onClick={() => {
                            onViewHistory(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <History className="w-4 h-4 mr-3" /> View Location
                          History
                        </button>
                        <button
                          onClick={() => {
                            onBreakdown(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Scissors className="w-4 h-4 mr-3" /> Breakdown Roll
                        </button>
                        <button
                          onClick={() => {
                            onUpdateRelax(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <RefreshCw className="w-4 h-4 mr-3" /> Update Relax
                          Hour
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
