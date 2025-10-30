// path: src/pages/packing-list-management/PackingListManagementPage.tsx

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
  X,
  CheckCircle,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- START OF TYPES (from types.ts) ---

export type PrintStatus = "NOT_PRINTED" | "PRINTED";
export type QCStatus = "Passed" | "Failed" | "Pending";

export interface FabricRollItem {
  id: string;
  poNumber: string;
  itemCode: string;
  factory: string;
  supplier: string;
  invoiceNo: string;
  colorCode: string;
  color: string;
  description: string;
  rollNo: number;
  lotNo: string;
  yards: number;
  netWeightKgs: number;
  grossWeightKgs: number;
  width: string;
  location: string;
  qrCode: string;
  dateInHouse: string;
  qcCheck: boolean;
  qcDate: string;
  qcBy: string;
  comment: string;
  printStatus: PrintStatus;
}

// Type for items in the import modal
export interface PackingListItem {
  id: string;
  // Add other properties as needed from the import process
  // [key: string]: any;
}

// --- END OF TYPES ---

// --- START OF MOCK DATA (from data.ts) ---

const mockFabricRolls: FabricRollItem[] = [
  {
    id: uuidv4(),
    poNumber: "POPU0018235",
    itemCode: "CK-126-04-00277",
    factory: "Factory C",
    supplier: "Supplier Z",
    invoiceNo: "INV-005",
    colorCode: "CC-002",
    color: "Puma Black",
    description: "Polyester Blend",
    rollNo: 1,
    lotNo: "225628091",
    yards: 45,
    netWeightKgs: 17.4,
    grossWeightKgs: 17.8,
    width: '68"',
    location: "F2-03-05",
    qrCode: "QR-76433",
    dateInHouse: "2/18/2023",
    qcCheck: false,
    qcDate: "4/29/2023",
    qcBy: "John Doe",
    comment: "Minor defect on edge",
    printStatus: "PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "PSPU0002986",
    itemCode: "WO-413-04-00361",
    factory: "Factory B",
    supplier: "Supplier X",
    invoiceNo: "INV-006",
    colorCode: "CC-004",
    color: "PUMA BLACK",
    description: "Silk Blend",
    rollNo: 1,
    lotNo: "225628091",
    yards: 22,
    netWeightKgs: 4.5,
    grossWeightKgs: 4.8,
    width: '57"',
    location: "F2-03-06",
    qrCode: "QR-93641",
    dateInHouse: "3/16/2023",
    qcCheck: true,
    qcDate: "8/5/2023",
    qcBy: "Jane Smith",
    comment: "No issues found",
    printStatus: "NOT_PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "PSPU0002986",
    itemCode: "WO-413-04-00361",
    factory: "Factory B",
    supplier: "Supplier X",
    invoiceNo: "INV-007",
    colorCode: "CC-003",
    color: "PUMA WHITE",
    description: "Polyester Blend",
    rollNo: 2,
    lotNo: "225628091",
    yards: 119,
    netWeightKgs: 24.6,
    grossWeightKgs: 24.7,
    width: '57"',
    location: "F2-03-07",
    qrCode: "QR-89437",
    dateInHouse: "11/22/2023",
    qcCheck: false,
    qcDate: "3/18/2023",
    qcBy: "Peter Jones",
    comment: "Approved for production",
    printStatus: "PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "SPPU0004476",
    itemCode: "CK-105-05-00062",
    factory: "Factory C",
    supplier: "Supplier Y",
    invoiceNo: "INV-008",
    colorCode: "CC-003",
    color: "PUMA WHITE",
    description: "Cotton Fabric",
    rollNo: 1,
    lotNo: "225628091",
    yards: 4,
    netWeightKgs: 1,
    grossWeightKgs: 1.4,
    width: '61"',
    location: "F2-03-08",
    qrCode: "QR-22682",
    dateInHouse: "12/8/2023",
    qcCheck: false,
    qcDate: "2/27/2023",
    qcBy: "John Doe",
    comment: "No issues found",
    printStatus: "NOT_PRINTED",
  },
  {
    id: uuidv4(),
    poNumber: "SSPU0002939",
    itemCode: "CK-105-04-00325",
    factory: "Factory C",
    supplier: "Supplier Y",
    invoiceNo: "INV-009",
    colorCode: "CC-002",
    color: "PUMA WHITE",
    description: "Denim Material",
    rollNo: 1,
    lotNo: "225628091",
    yards: 90,
    netWeightKgs: 24,
    grossWeightKgs: 24.4,
    width: '63"',
    location: "F2-03-09",
    qrCode: "QR-16812",
    dateInHouse: "5/5/2023",
    qcCheck: false,
    qcDate: "3/12/2023",
    qcBy: "Peter Jones",
    comment: "Rework required",
    printStatus: "PRINTED",
  },
];

// --- END OF MOCK DATA ---

// --- START OF UI COMPONENT PLACEHOLDERS ---

// A simple placeholder for the Button component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  children: ReactNode;
}
const Button: FC<ButtonProps> = ({ children, ...props }) => {
  // Basic styling to make it look like a button
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

  // Set default variant if not provided
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

// A simple placeholder for the Input component
const Input: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      {...props}
      className={`w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${props.className}`}
    />
  );
};

// A simple placeholder for the Checkbox component
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

// --- END OF UI COMPONENT PLACEHOLDERS ---

// --- START OF COMPONENT: StatusBadge.tsx ---

interface StatusBadgeProps {
  status: PrintStatus;
}
const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    NOT_PRINTED: {
      label: "Not Printed",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      icon: <Printer className="w-4 h-4" />,
    },
    PRINTED: {
      label: "Printed",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      icon: <CheckCircle className="w-4 h-4" />,
    },
  };

  const config = statusConfig[status];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};
// --- END OF COMPONENT: StatusBadge.tsx ---

// --- START OF COMPONENT: SimpleDropdownMenu.tsx ---

interface SimpleDropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

const SimpleDropdownMenu: FC<SimpleDropdownMenuProps> = ({
  trigger,
  children,
  align = "right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
}
const DropdownCheckboxItem: FC<
  DropdownItemProps & {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }
> = ({ checked, onCheckedChange, children }) => {
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
// --- END OF COMPONENT: SimpleDropdownMenu.tsx ---

// --- START OF COMPONENT: PageHeader.tsx ---

interface PageHeaderProps {
  onImportClick: () => void;
}
const PageHeader: FC<PageHeaderProps> = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Packing List Management
      </h1>
      <Button className="inline-flex items-center justify-center">
        <Plus className="-ml-1 mr-2 h-5 w-5" />
        Import Packing List
      </Button>
    </div>
  );
};
// --- END OF COMPONENT: PageHeader.tsx ---

// --- START OF COMPONENT: PackingListFilters.tsx ---

const PackingListFilters: FC = () => {
  return (
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
};
// --- END OF COMPONENT: PackingListFilters.tsx ---

// --- START OF COMPONENT: PackingListTable.tsx ---
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
  onQcCheckChange: (itemId: string, checked: boolean) => void;
}
const PackingListTable: FC<PackingListTableProps> = ({ items, onPrint }) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
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
    if (checked) newSelectedItems.add(itemId);
    else newSelectedItems.delete(itemId);
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
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={(checked) =>
                      handleSelectItem(item.id, !!checked)
                    }
                    disabled={item.printStatus !== "NOT_PRINTED"}
                    aria-label={`Select item ${item.itemCode}`}
                  />
                </td>
                {/* Dynamically render cells based on visibleColumns state */}
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
                {/* === START OF CHANGE === */}
                {visibleColumns.qcCheck && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {item.qcCheck ? "Yes" : "No"}
                  </td>
                )}
                {/* === END OF CHANGE === */}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">
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
                      {item.printStatus === "PRINTED" ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handlePrintSingleItem(item)}
                        >
                          <Undo2 className="w-4 h-4 mr-2" /> Reprint
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrintSingleItem(item)}
                        >
                          <QrCode className="w-4 h-4 mr-2" /> Print
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
// --- END OF COMPONENT: PackingListTable.tsx ---

// --- START OF COMPONENT: Pagination.tsx ---

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (size: number) => void;
}
const Pagination: FC<PaginationProps> = ({
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
          id="rowsPerPage"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="p-1 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 flex justify-end items-center">
        <p className="text-sm text-gray-700 mr-4">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </p>
        <div className="flex items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalItems === 0}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
// --- END OF COMPONENT: Pagination.tsx ---

// --- START OF COMPONENT: TableSkeleton.tsx ---

const TableSkeleton: FC = () => {
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-4 py-4 w-12">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="h-8 bg-gray-200 rounded w-28 mx-auto"></div>
      </td>
    </tr>
  );
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="p-4">
                <div className="h-5 w-5 bg-gray-300 rounded"></div>
              </th>
              {[
                "Mã Vật tư",
                "Mô tả",
                "Màu sắc",
                "Số Lot",
                "Số lượng",
                "Trạng thái",
                "Hành động",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
// --- END OF COMPONENT: TableSkeleton.tsx ---

// --- START OF COMPONENT: SplitRollModal.tsx ---

// --- END OF COMPONENT: SplitRollModal.tsx ---

// --- START OF COMPONENT: ImportPackingListModal.tsx ---

// Placeholder for missing components
const ImportPackingListFormPage: FC<{
  items: PackingListItem[];
  onItemsChange: (items: PackingListItem[]) => void;
}> = ({ onItemsChange }) => (
  <div className="text-center p-10 border-2 border-dashed rounded-lg">
    <p className="text-gray-500">Import Packing List Form UI would be here.</p>
    <p className="text-sm text-gray-400">This is a placeholder component.</p>
    <Button
      variant="outline"
      size="sm"
      className="mt-4"
      onClick={() => onItemsChange([{ id: "sample-1" }, { id: "sample-2" }])}
    >
      Simulate File Upload
    </Button>
  </div>
);
const ActionToolbar: FC<{ onSubmit: () => void; isSubmitting: boolean }> = ({
  onSubmit,
  isSubmitting,
}) => (
  <div className="p-4 bg-gray-100 border-t flex justify-end">
    <Button onClick={onSubmit} disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : "Submit Inbound Shipment"}
    </Button>
  </div>
);

interface ImportPackingListModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const ImportPackingListModal: FC<ImportPackingListModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [items, setItems] = useState<PackingListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (items.length === 0) {
      alert("Please upload and process a file before submitting.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newShipmentId = `PNK-${Date.now()}`;
      alert(`Successfully created inbound shipment ${newShipmentId}!`);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col h-full max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Import Packing List
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          <ImportPackingListFormPage items={items} onItemsChange={setItems} />
        </div>
        <div className="flex-shrink-0">
          <ActionToolbar onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
};
// --- END OF COMPONENT: ImportPackingListModal.tsx ---

// --- MAIN PAGE COMPONENT: PackingListManagementPage ---

const PackingListManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FabricRollItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(mockFabricRolls);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenImportModal = () => setIsImportModalOpen(true);
  const handleCloseImportModal = () => setIsImportModalOpen(false);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return items.slice(startIndex, startIndex + rowsPerPage);
  }, [items, currentPage, rowsPerPage]);

  const handleQcCheckChange = (itemId: string, checked: boolean) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, qcCheck: checked } : item
      )
    );
  };

  const handlePrintItems = (itemIds: Set<string>) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        itemIds.has(item.id) ? { ...item, printStatus: "PRINTED" } : item
      )
    );
    const printedItemCodes = items
      .filter((item) => itemIds.has(item.id))
      .map((item) => `${item.itemCode} (Roll: ${item.rollNo})`)
      .join(", ");
    alert(
      `Print command sent for items: ${printedItemCodes}\n(This would trigger a printing API).`
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

      <ImportPackingListModal
        isOpen={isImportModalOpen}
        onClose={handleCloseImportModal}
      />
    </div>
  );
};

export default PackingListManagementPage;
