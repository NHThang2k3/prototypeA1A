// path: src/pages/packing-list-management/PackingListManagementPageAccessory.tsx

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type FC,
  type HTMLProps,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Plus,
  Search,
  QrCode,
  Undo2,
  Columns,
  CheckCircle,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- TYPES ---

export type PrintStatus = "NOT_PRINTED" | "PRINTED";

export interface AccessoryItem {
  id: string;
  poNumber: string;
  itemCode: string;
  supplier: string;
  invoiceNo: string;
  color: string;
  description: string;
  boxNo: number;
  lotNo: string;
  quantity: number;
  unit: string;
  netWeightKgs: number;
  grossWeightKgs: number;
  size: string;
  location: string;
  qrCode: string;
  dateInHouse: string;
  qcCheck: boolean;
  printStatus: PrintStatus;
}

export interface PackingListItem {
  id: string;
}

// --- MOCK DATA ---

const mockAccessoryItems: AccessoryItem[] = [
  {
    id: uuidv4(),
    poNumber: "POACC001",
    itemCode: "ACC-ZIP-SLV-05",
    supplier: "Zipper Co.",
    invoiceNo: "INV-ACC-101",
    color: "Silver",
    description: "Metal Zipper #5",
    boxNo: 1,
    lotNo: "LOT-ZIP-2023",
    quantity: 500,
    unit: "PCS",
    netWeightKgs: 5.2,
    grossWeightKgs: 5.5,
    size: '5"',
    location: "C-01-A",
    qrCode: "QR-ACC-001",
    dateInHouse: "10/15/2023",
    qcCheck: true,
    printStatus: "PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "POACC002",
    itemCode: "ACC-BTN-BLK-15",
    supplier: "Button World",
    invoiceNo: "INV-ACC-102",
    color: "Black",
    description: "Plastic Buttons 15mm",
    boxNo: 1,
    lotNo: "LOT-BTN-2023",
    quantity: 1000,
    unit: "PCS",
    netWeightKgs: 2.1,
    grossWeightKgs: 2.3,
    size: "15mm",
    location: "C-01-B",
    qrCode: "QR-ACC-002",
    dateInHouse: "10/16/2023",
    qcCheck: false,
    printStatus: "NOT_PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "POACC002",
    itemCode: "ACC-BTN-BLK-15",
    supplier: "Button World",
    invoiceNo: "INV-ACC-102",
    color: "Black",
    description: "Plastic Buttons 15mm",
    boxNo: 2,
    lotNo: "LOT-BTN-2023",
    quantity: 1000,
    unit: "PCS",
    netWeightKgs: 2.1,
    grossWeightKgs: 2.3,
    size: "15mm",
    location: "C-01-B",
    qrCode: "QR-ACC-003",
    dateInHouse: "10/16/2023",
    qcCheck: false,
    printStatus: "NOT_PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "POACC003",
    itemCode: "ACC-LBL-MAIN-M",
    supplier: "Label Pro",
    invoiceNo: "INV-ACC-103",
    color: "White",
    description: "Main Label - Size M",
    boxNo: 1,
    lotNo: "LOT-LBL-2023",
    quantity: 2500,
    unit: "PCS",
    netWeightKgs: 1.5,
    grossWeightKgs: 1.7,
    size: "M",
    location: "C-01-C",
    qrCode: "QR-ACC-004",
    dateInHouse: "10/18/2023",
    qcCheck: true,
    printStatus: "PRINTED",
  },
];

// --- UI COMPONENT PLACEHOLDERS ---

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  children: ReactNode;
}
const Button: FC<ButtonProps> = ({ children, ...props }) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyle = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    ghost: "hover:bg-gray-100",
  };
  const sizeStyle = {
    sm: "px-3 py-1.5",
    md: "px-4 py-2",
    lg: "px-6 py-3",
    icon: "h-9 w-9",
  };
  const currentVariant = props.variant || "primary";
  const currentSize = props.size || "md";
  const className = `${baseStyle} ${variantStyle[currentVariant]} ${
    sizeStyle[currentSize]
  } ${props.className || ""}`;
  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
};

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      {...props}
      className={`w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${props.className}`}
    />
  );
};

interface CheckboxProps
  extends Omit<HTMLProps<HTMLInputElement>, "onCheckedChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}
const Checkbox: FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  ...props
}) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
      className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${props.className}`}
    />
  );
};

// --- SUB-COMPONENTS ---

const StatusBadge: FC<{ status: PrintStatus }> = ({ status }) => {
  const config =
    status === "PRINTED"
      ? {
          label: "Printed",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: <CheckCircle className="w-4 h-4" />,
        }
      : {
          label: "Not Printed",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          icon: <Printer className="w-4 h-4" />,
        };
  return (
    <span
      className={`inline-flex items-center gap-x-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

const SimpleDropdownMenu: FC<{
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}> = ({ trigger, children, align = "right" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const alignmentClass = align === "right" ? "right-0" : "left-0";
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute ${alignmentClass} z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

const DropdownCheckboxItem: FC<{
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: ReactNode;
}> = ({ checked, onCheckedChange, children }) => {
  const id = React.useId();
  return (
    <label
      htmlFor={id}
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3"
      />
      {children}
    </label>
  );
};

const PageHeader: FC = () => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-gray-900">Accessory Management</h1>
    <Button className="inline-flex items-center justify-center">
      <Plus className="-ml-1 mr-2 h-5 w-5" /> Import Accessory List
    </Button>
  </div>
);

const PackingListFilters: FC = () => (
  <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-2">
        <label
          htmlFor="item-search"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Search Item
        </label>
        <div className="relative">
          <Input
            id="item-search"
            placeholder="Enter PO, Item Code, Color, Lot..."
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div>
        <label
          htmlFor="print-status-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Print Status
        </label>
        <select
          id="print-status-filter"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="NOT_PRINTED">Not Printed</option>
          <option value="PRINTED">Printed</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="qc-check-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          QC Check
        </label>
        <select
          id="qc-check-filter"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All</option>
          <option value="checked">Yes</option>
          <option value="not-checked">No</option>
        </select>
      </div>
    </div>
    <div className="mt-4 flex justify-end">
      <Button variant="primary">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  </div>
);

const ALL_COLUMNS = [
  { id: "poNumber", label: "PO Number" },
  { id: "itemCode", label: "Item Code" },
  { id: "supplier", label: "Supplier" },
  { id: "description", label: "Description" },
  { id: "color", label: "Color" },
  { id: "boxNo", label: "Box No" },
  { id: "lotNo", label: "Lot No" },
  { id: "quantity", label: "Quantity" },
  { id: "unit", label: "Unit" },
  { id: "netWeightKgs", label: "Net Weight (Kgs)" },
  { id: "size", label: "Size" },
  { id: "location", label: "Location" },
  { id: "qcCheck", label: "QC Check" },
  { id: "printStatus", label: "Print Status" },
  { id: "action", label: "Action" },
];

const PackingListTable: FC<{
  items: AccessoryItem[];
  onPrint: (itemIds: Set<string>) => void;
}> = ({ items, onPrint }) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      poNumber: true,
      itemCode: true,
      description: true,
      color: true,
      boxNo: true,
      lotNo: true,
      quantity: true,
      unit: true,
      qcCheck: true,
      printStatus: true,
      action: true,
      supplier: false,
      netWeightKgs: false,
      size: false,
      location: false,
    }
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectable = items
        .filter((item) => item.printStatus === "NOT_PRINTED")
        .map((item) => item.id);
      setSelectedItems(new Set(selectable));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) newSelected.add(itemId);
    else newSelected.delete(itemId);
    setSelectedItems(newSelected);
  };

  const allSelectable = useMemo(
    () => items.filter((item) => item.printStatus === "NOT_PRINTED"),
    [items]
  );
  const isAllSelected = useMemo(
    () =>
      allSelectable.length > 0 && selectedItems.size === allSelectable.length,
    [allSelectable, selectedItems]
  );

  const handlePrintSelected = () => {
    if (selectedItems.size === 0) return;
    onPrint(selectedItems);
    setSelectedItems(new Set());
  };

  const handlePrintSingle = (item: AccessoryItem) =>
    onPrint(new Set([item.id]));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-800">Accessory List</h3>
        <div className="flex items-center gap-2">
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
                onCheckedChange={(v) =>
                  setVisibleColumns((p) => ({ ...p, [col.id]: v }))
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
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={(c) => handleSelectItem(item.id, !!c)}
                    disabled={item.printStatus !== "NOT_PRINTED"}
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
                {visibleColumns.supplier && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.supplier}
                  </td>
                )}
                {visibleColumns.description && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.description}
                  </td>
                )}
                {visibleColumns.color && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.color}
                  </td>
                )}
                {visibleColumns.boxNo && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.boxNo}
                  </td>
                )}
                {visibleColumns.lotNo && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.lotNo}
                  </td>
                )}
                {visibleColumns.quantity && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.quantity}
                  </td>
                )}
                {visibleColumns.unit && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.unit}
                  </td>
                )}
                {visibleColumns.netWeightKgs && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.netWeightKgs}
                  </td>
                )}
                {visibleColumns.size && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.size}
                  </td>
                )}
                {visibleColumns.location && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.location}
                  </td>
                )}
                {visibleColumns.qcCheck && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {item.qcCheck ? "Yes" : "No"}
                  </td>
                )}
                {visibleColumns.printStatus && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={item.printStatus} />
                  </td>
                )}
                {visibleColumns.action && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex items-center justify-center gap-2">
                      {item.printStatus === "PRINTED" ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handlePrintSingle(item)}
                        >
                          <Undo2 className="w-4 h-4 mr-2" />
                          Reprint
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrintSingle(item)}
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Print
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Pagination: FC<{
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (s: number) => void;
}> = ({
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);
  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
      <div className="flex-1 flex items-center">
        <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="p-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
      <div className="flex-1 flex justify-end items-center">
        <p className="text-sm text-gray-700 mr-4">
          Showing {startItem} to {endItem} of {totalItems} results
        </p>
        <div>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const PackingListManagementPageAccessory = () => {
  const [items, setItems] = useState<AccessoryItem[]>(mockAccessoryItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return items.slice(startIndex, startIndex + rowsPerPage);
  }, [items, currentPage, rowsPerPage]);

  const handlePrintItems = (itemIds: Set<string>) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        itemIds.has(item.id) ? { ...item, printStatus: "PRINTED" } : item
      )
    );
    alert(`Print command sent for ${itemIds.size} accessory items.`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-full">
      <PageHeader />
      <PackingListFilters />
      <PackingListTable items={paginatedItems} onPrint={handlePrintItems} />
      <Pagination
        currentPage={currentPage}
        totalItems={items.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(size) => {
          setRowsPerPage(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default PackingListManagementPageAccessory;
