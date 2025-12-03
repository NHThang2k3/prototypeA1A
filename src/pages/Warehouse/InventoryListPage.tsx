// src/pages/Warehouse/InventoryListPage.tsx

// =================================================================================
// TYPE DEFINITIONS & DUMMY DATA
// =================================================================================
export type QCStatus = "Passed" | "Failed" | "Pending";

export interface FabricRoll {
  id: string;
  poNumber: string;
  itemCode: string;
  factory: string;
  supplier: string;
  supplierCode: string;
  invoiceNo: string;
  colorCode: string;
  color: string;
  rollNo: string;
  lotNo: string;
  yards: number;
  netWeightKgs: number;
  grossWeightKgs: number;
  width: string;
  location: string;
  qrCode: string;
  dateInHouse: string;
  description: string;
  qcStatus: QCStatus;
  qcDate: string;
  qcBy: string;
  comment: string;
  printed: boolean;
  balanceYards: number;
  hourStandard: number;
  hourRelax: number;
  relaxDate: string;
  relaxTime: string;
  relaxBy: string;
  needRelax: "Yes" | "No";
  parentQrCode: string | null;
  locationHistory: LocationHistoryEntry[];
}

export interface LocationHistoryEntry {
  dateTime: string;
  from: string;
  to: string;
  changedBy: string;
}

const DUMMY_FABRIC_DATA: FabricRoll[] = [
  {
    id: "QR-76433",
    poNumber: "POPU0018235",
    itemCode: "CK-126-04-00277",
    factory: "Factory C",
    supplier: "Supplier Z",
    supplierCode: "SUP-Z",
    invoiceNo: "INV-005",
    colorCode: "CC-002",
    color: "Puma Black",
    rollNo: "1",
    lotNo: "225628091",
    yards: 45,
    netWeightKgs: 17.4,
    grossWeightKgs: 17.8,
    width: '68"',
    location: "F2-03-05",
    qrCode: "QR-76433",
    dateInHouse: "2023-02-18",
    description: "Polyester Blend",
    qcStatus: "Failed",
    qcDate: "2023-04-29",
    qcBy: "John Doe",
    comment: "Minor defect on edge",
    printed: true,
    balanceYards: 37,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-01-17",
    relaxTime: "09:00",
    relaxBy: "Alice",
    needRelax: "Yes",
    parentQrCode: null,
    locationHistory: [
      {
        dateTime: "2023-01-15T10:00:00Z",
        from: "Receiving",
        to: "F2-03-05",
        changedBy: "System",
      },
    ],
  },
  {
    id: "QR-93641",
    poNumber: "PSPU0002986",
    itemCode: "WO-413-04-00361",
    factory: "Factory B",
    supplier: "Supplier X",
    supplierCode: "SUP-X",
    invoiceNo: "INV-006",
    colorCode: "CC-004",
    color: "PUMA BLACK",
    rollNo: "1",
    lotNo: "225628091",
    yards: 22,
    netWeightKgs: 4.5,
    grossWeightKgs: 4.8,
    width: '57"',
    location: "F2-03-06",
    qrCode: "QR-93641",
    dateInHouse: "2023-03-16",
    description: "Silk Blend",
    qcStatus: "Passed",
    qcDate: "2023-08-05",
    qcBy: "Jane Smith",
    comment: "No issues found",
    printed: false,
    balanceYards: 13,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-05-10",
    relaxTime: "15:45",
    relaxBy: "Bob",
    needRelax: "No",
    parentQrCode: null,
    locationHistory: [],
  },
  {
    id: "QR-89437",
    poNumber: "PSPU0002986",
    itemCode: "WO-413-04-00361",
    factory: "Factory B",
    supplier: "Supplier X",
    supplierCode: "SUP-X",
    invoiceNo: "INV-007",
    colorCode: "CC-003",
    color: "PUMA WHITE",
    rollNo: "2",
    lotNo: "225628091",
    yards: 119,
    netWeightKgs: 24.6,
    grossWeightKgs: 24.7,
    width: '57"',
    location: "F2-03-07",
    qrCode: "QR-89437",
    dateInHouse: "2023-11-22",
    description: "Polyester Blend",
    qcStatus: "Failed",
    qcDate: "2023-03-18",
    qcBy: "Peter Jones",
    comment: "Approved for production",
    printed: true,
    balanceYards: 26,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-05-25",
    relaxTime: "15:45",
    relaxBy: "Bob",
    needRelax: "Yes",
    parentQrCode: null,
    locationHistory: [],
  },
  {
    id: "QR-22682",
    poNumber: "SPPU0004476",
    itemCode: "CK-105-05-00062",
    factory: "Factory C",
    supplier: "Supplier Y",
    supplierCode: "SUP-Y",
    invoiceNo: "INV-008",
    colorCode: "CC-003",
    color: "PUMA WHITE",
    rollNo: "1",
    lotNo: "225628091",
    yards: 4,
    netWeightKgs: 1,
    grossWeightKgs: 1.4,
    width: '61"',
    location: "F2-03-08",
    qrCode: "QR-22682",
    dateInHouse: "2023-12-08",
    description: "Cotton Fabric",
    qcStatus: "Failed",
    qcDate: "2023-02-27",
    qcBy: "John Doe",
    comment: "No issues found",
    printed: false,
    balanceYards: 32,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-03-06",
    relaxTime: "10:30",
    relaxBy: "Charlie",
    needRelax: "No",
    parentQrCode: null,
    locationHistory: [],
  },
  {
    id: "QR-16812",
    poNumber: "SSPU0002939",
    itemCode: "CK-105-04-00325",
    factory: "Factory C",
    supplier: "Supplier Y",
    supplierCode: "SUP-Y",
    invoiceNo: "INV-009",
    colorCode: "CC-002",
    color: "PUMA WHITE",
    rollNo: "1",
    lotNo: "225628091",
    yards: 90,
    netWeightKgs: 24,
    grossWeightKgs: 24.4,
    width: '63"',
    location: "F2-03-09",
    qrCode: "QR-16812",
    dateInHouse: "2023-05-05",
    description: "Denim Material",
    qcStatus: "Pending",
    qcDate: "2023-03-12",
    qcBy: "Peter Jones",
    comment: "Rework required",
    printed: true,
    balanceYards: 26,
    hourStandard: 48,
    hourRelax: 48,
    relaxDate: "2023-02-24",
    relaxTime: "15:45",
    relaxBy: "Alice",
    needRelax: "Yes",
    parentQrCode: null,
    locationHistory: [],
  },
];

// =================================================================================
// IMPORTS
// =================================================================================

import React, { useState, useEffect, useMemo, type FC } from "react";
import {
  ChevronDown,
  FileDown,
  History,
  MoreVertical,
  Move,
  Printer,
  Search,
  SlidersHorizontal,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { cn } from "@/lib/utils";
import { CustomTable } from "@/components/ui/custom-table";

// =================================================================================
// SUB-COMPONENTS
// =================================================================================

export const FilterSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-7 w-full" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </CardContent>
  </Card>
);

export const TableSkeleton = () => (
  <div className="space-y-4 mt-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-10 w-40" />
    </div>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {[...Array(10)].map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-6 w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(10)].map((_, i) => (
            <TableRow key={i}>
              {[...Array(10)].map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

interface StatusBadgeProps {
  status: QCStatus;
}
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variant = useMemo(() => {
    switch (status) {
      case "Passed":
        return "default";
      case "Failed":
        return "destructive";
      case "Pending":
        return "secondary";
      default:
        return "outline";
    }
  }, [status]);
  const className = useMemo(() => {
    switch (status) {
      case "Passed":
        return "bg-green-500 hover:bg-green-600";
      case "Pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "";
    }
  }, [status]);
  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
};

interface InventoryHeaderProps {
  selectedRowCount: number;
  onExportAll: () => void;
  onExportSelected: () => void;
  onPrintMultiple: () => void;
  onTransfer: () => void;
  onViewHistory: () => void;
  onDelete: () => void;
}
export const InventoryHeader = ({
  selectedRowCount,
  onExportAll,
  onExportSelected,
  onPrintMultiple,
  onTransfer,
  onViewHistory,
  onDelete,
}: InventoryHeaderProps) => {
  const hasSelection = selectedRowCount > 0;
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        {hasSelection && (
          <p className="text-sm text-muted-foreground mt-1">
            {selectedRowCount} item(s) selected.
          </p>
        )}
      </div>
      <div className="flex space-x-2 mt-4 md:mt-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={!hasSelection}>
              Actions <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onSelect={onExportSelected}>
              <FileDown className="w-4 h-4 mr-2" />
              Export Selected
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onPrintMultiple}>
              <Printer className="w-4 h-4 mr-2" />
              Print QR Code
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onTransfer}>
              <Move className="w-4 h-4 mr-2" />
              Transfer Location
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onViewHistory}>
              <History className="w-4 h-4 mr-2" />
              View Location History
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={onDelete}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onExportAll}>
          <FileDown className="w-5 h-5 mr-2" /> Export All to Excel
        </Button>
      </div>
    </div>
  );
};

export const InventoryFilters = () => {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="w-full"
    >
      <AccordionItem value="item-1">
        <Card>
          <CardHeader className="p-4">
            <AccordionTrigger className="text-lg font-semibold w-full flex justify-between p-2 hover:no-underline">
              <span className="flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-3 text-gray-500" />
                Search Filters
              </span>
            </AccordionTrigger>
          </CardHeader>
          <AccordionContent>
            <CardContent className="pt-0">
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="poNumber">PO NO</Label>
                    <Input id="poNumber" placeholder="e.g., POPU0018251" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierCode">Supplier Code</Label>
                    <Input id="supplierCode" placeholder="e.g., SUP-Y" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNo">Invoice No</Label>
                    <Input id="invoiceNo" placeholder="e.g., INV-001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollNo">Fabric</Label>
                    <Input id="rollNo" placeholder="e.g., 1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" placeholder="e.g., Puma Black" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qcStatus">QC Status</Label>
                    <Select>
                      <SelectTrigger id="qcStatus">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {(["Passed", "Failed", "Pending"] as QCStatus[]).map(
                          (status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relaxDateFrom">Relax Date From</Label>
                    <Input id="relaxDateFrom" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relaxDateTo">Relax Date To</Label>
                    <Input id="relaxDateTo" type="date" />
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t flex items-center justify-end space-x-3">
                  <Button type="button" variant="outline">
                    Clear
                  </Button>
                  <Button type="submit" onClick={(e) => e.preventDefault()}>
                    <Search className="w-5 h-5 mr-2 -ml-1" /> Search
                  </Button>
                </div>
              </form>
            </CardContent>
          </AccordionContent>
        </Card>
      </AccordionItem>
    </Accordion>
  );
};

const RelaxProgressBar: React.FC<{ roll: FabricRoll }> = ({ roll }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!roll.relaxDate || !roll.relaxTime) {
      setProgress(0);
      return;
    }
    const calculateProgress = () => {
      const startTime = new Date(`${roll.relaxDate}T${roll.relaxTime}`);
      const now = new Date();
      const elapsedHours =
        (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      const calculatedProgress = Math.min(
        100,
        (elapsedHours / roll.hourStandard) * 100
      );
      setProgress(calculatedProgress);
    };
    calculateProgress();
    const interval = setInterval(calculateProgress, 60000); // update every minute
    return () => clearInterval(interval);
  }, [roll.relaxDate, roll.relaxTime, roll.hourStandard]);

  return (
    <Progress
      value={progress}
      className={cn(progress >= 100 && "bg-green-500")}
    />
  );
};

// =================================================================================
// MODALS
// =================================================================================

// ADDED: Fabric Roll Detail Modal
const FabricRollDetailModal: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roll: FabricRoll | null;
}> = ({ open, onOpenChange, roll }) => {
  if (!roll) return null;

  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b last:border-0 border-gray-100">
      <span className="font-medium text-muted-foreground col-span-1">
        {label}
      </span>
      <span className="col-span-2 text-foreground font-medium">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fabric Roll Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {/* General Info */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-primary flex items-center">
              General Information
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border">
              <DetailRow label="QR Code" value={roll.qrCode} />
              <DetailRow label="PO Number" value={roll.poNumber} />
              <DetailRow label="Item Code" value={roll.itemCode} />
              <DetailRow label="Description" value={roll.description} />
              <DetailRow label="Factory" value={roll.factory} />
              <DetailRow
                label="Supplier"
                value={`${roll.supplier} (${roll.supplierCode})`}
              />
              <DetailRow label="Invoice No" value={roll.invoiceNo} />
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-primary">
              Specifications
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border">
              <DetailRow
                label="Color"
                value={`${roll.color} (${roll.colorCode})`}
              />
              <DetailRow label="Roll No" value={roll.rollNo} />
              <DetailRow label="Lot No" value={roll.lotNo} />
              <DetailRow label="Width" value={roll.width} />
              <DetailRow label="Location" value={roll.location} />
            </div>
          </div>

          {/* Metrics */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-primary">
              Measurements
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border">
              <DetailRow label="Yards (Shipped)" value={roll.yards} />
              <DetailRow label="Balance Yards" value={roll.balanceYards} />
              <DetailRow label="Net Weight (Kg)" value={roll.netWeightKgs} />
              <DetailRow
                label="Gross Weight (Kg)"
                value={roll.grossWeightKgs}
              />
            </div>
          </div>

          {/* QC Status */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-primary">
              Quality Control
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border">
              <DetailRow
                label="Status"
                value={<StatusBadge status={roll.qcStatus} />}
              />
              <DetailRow label="QC Date" value={roll.qcDate} />
              <DetailRow label="QC By" value={roll.qcBy} />
              <DetailRow label="Remark" value={roll.comment} />
            </div>
          </div>

          {/* Relax Status */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-primary">
              Relaxation
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border">
              <DetailRow label="Need Relax" value={roll.needRelax} />
              <DetailRow label="Relax Date" value={roll.relaxDate} />
              <DetailRow label="Relax Time" value={roll.relaxTime} />
              <DetailRow label="Standard Hours" value={roll.hourStandard} />
              <div className="py-2 border-t mt-2">
                <span className="font-medium text-muted-foreground block mb-2">
                  Current Status
                </span>
                <RelaxProgressBar roll={roll} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MultiTransferLocationModal: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rolls: FabricRoll[];
  onSubmit: (newLocation: string) => void;
}> = ({ open, onOpenChange, rolls, onSubmit }) => {
  const [newLocation, setNewLocation] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer {rolls.length} Item(s)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The following items will be moved:
          </p>
          <div className="max-h-40 overflow-y-auto rounded-md border p-2 bg-muted">
            <ul className="list-disc list-inside text-sm">
              {rolls.map((roll) => (
                <li key={roll.id}>
                  {roll.qrCode} (Current: {roll.location})
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-location">New Location</Label>
            <Input
              id="new-location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="e.g., F2-10-05"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onSubmit(newLocation)} disabled={!newLocation}>
            Confirm Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const MultiLocationHistoryModal: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rolls: FabricRoll[];
}> = ({ open, onOpenChange, rolls }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Location History for {rolls.length} Item(s)</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {rolls.map((roll) => (
            <div key={roll.id}>
              <h4 className="font-semibold text-lg mb-2 border-b pb-1">
                {roll.qrCode}
              </h4>
              {roll.locationHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Time</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...roll.locationHistory].reverse().map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(entry.dateTime).toLocaleString()}
                        </TableCell>
                        <TableCell>{entry.from}</TableCell>
                        <TableCell>{entry.to}</TableCell>
                        <TableCell>{entry.changedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No location history.
                </p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// =================================================================================
// MAIN PAGE COMPONENT
// =================================================================================

const InventoryListPage = () => {
  const [fabricRolls, setFabricRolls] = useState<FabricRoll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for selected data objects
  const [selectedRolls, setSelectedRolls] = useState<FabricRoll[]>([]);

  // UPDATED: Added "details" to ModalType
  type ModalType = "transfer" | "history" | "details";
  const [modalState, setModalState] = useState<{
    type: ModalType | null;
    data: FabricRoll[];
  }>({ type: null, data: [] });

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    items: FabricRoll[];
  }>({ open: false, items: [] });

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setFabricRolls(DUMMY_FABRIC_DATA);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // --- Single Item Action Handlers ---
  const handlePrintSingle = (item: FabricRoll) =>
    alert(`Printing QR Code for: ${item.id}`);
  const handleTransferSingle = (item: FabricRoll) =>
    setModalState({ type: "transfer", data: [item] });
  const handleViewHistorySingle = (item: FabricRoll) =>
    setModalState({ type: "history", data: [item] });
  // ADDED: Handler for View Details
  const handleViewDetailsSingle = (item: FabricRoll) =>
    setModalState({ type: "details", data: [item] });
  const handleDeleteSingle = (item: FabricRoll) =>
    setDeleteConfirmation({ open: true, items: [item] });

  // Columns definition
  const columns = useMemo<ColumnDef<FabricRoll>[]>(
    () => [
      {
        accessorKey: "poNumber",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            PO NO
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      { accessorKey: "supplierCode", header: "Supplier Code" },
      { accessorKey: "invoiceNo", header: "Invoice No" },
      { accessorKey: "rollNo", header: "Fabric" },
      { accessorKey: "color", header: "Color" },
      { accessorKey: "lotNo", header: "Batch No" },
      { accessorKey: "yards", header: "Shipped length" },
      { accessorKey: "balanceYards", header: "Actual length" },
      {
        accessorKey: "qcStatus",
        header: "QC Status",
        cell: ({ row }) => <StatusBadge status={row.original.qcStatus} />,
      },
      {
        accessorKey: "comment",
        header: "Remark",
        cell: ({ row }) => (
          <div className="max-w-[80px] truncate" title={row.original.comment}>
            {row.original.comment || ""}
          </div>
        ),
      },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "factory", header: "Factory" },
      { accessorKey: "hourStandard", header: "Relax hour" },
      { accessorKey: "needRelax", header: "Need Relax" },
      {
        id: "relaxProgress",
        header: "Relax Status",
        cell: ({ row }) => <RelaxProgressBar roll={row.original} />,
      },
      {
        accessorKey: "relaxDate",
        header: "Date Relax",
        cell: ({ row }) =>
          row.original.relaxDate
            ? new Date(row.original.relaxDate).toLocaleDateString()
            : "-",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                {/* ADDED: View Details Action */}
                <DropdownMenuItem onClick={() => handleViewDetailsSingle(item)}>
                  View Details
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handlePrintSingle(item)}>
                  Reprint QR Code
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewHistorySingle(item)}>
                  View History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTransferSingle(item)}>
                  Transfer Location
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteSingle(item)}
                  className="text-red-500"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  // --- Bulk Action Handlers ---
  const handleExportSelected = () =>
    alert(`Exporting ${selectedRolls.length} selected item(s) to Excel.`);
  const handlePrintMultiple = () =>
    alert(
      `Printing QR Codes for: ${selectedRolls.map((r) => r.id).join(", ")}`
    );
  const handleTransfer = () => {
    if (selectedRolls.length > 0)
      setModalState({ type: "transfer", data: selectedRolls });
  };
  const handleViewHistory = () => {
    if (selectedRolls.length > 0)
      setModalState({ type: "history", data: selectedRolls });
  };
  const handleDeleteMultiple = () => {
    if (selectedRolls.length > 0)
      setDeleteConfirmation({ open: true, items: selectedRolls });
  };
  const handleExportAll = () =>
    alert(`Exporting all ${fabricRolls.length} items to Excel.`);

  // --- Logic Handlers ---
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
            changedBy: "Admin User",
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
    setSelectedRolls([]);
    alert(`${rollsToUpdate.length} item(s) have been moved to ${newLocation}.`);
  };

  const confirmDelete = () => {
    const idsToDelete = new Set(
      deleteConfirmation.items.map((item) => item.id)
    );
    setFabricRolls((prevRolls) =>
      prevRolls.filter((roll) => !idsToDelete.has(roll.id))
    );
    alert(`${idsToDelete.size} item(s) have been deleted.`);
    setSelectedRolls([]);
    setDeleteConfirmation({ open: false, items: [] });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <section>
        {isLoading ? (
          <>
            <FilterSkeleton />
            <TableSkeleton />
          </>
        ) : (
          <>
            <InventoryHeader
              selectedRowCount={selectedRolls.length}
              onExportAll={handleExportAll}
              onExportSelected={handleExportSelected}
              onPrintMultiple={handlePrintMultiple}
              onTransfer={handleTransfer}
              onViewHistory={handleViewHistory}
              onDelete={handleDeleteMultiple}
            />
            <InventoryFilters />

            <div className="mt-6">
              {fabricRolls.length > 0 ? (
                <CustomTable
                  columns={columns}
                  data={fabricRolls}
                  onSelectionChange={setSelectedRolls}
                />
              ) : (
                <Card className="text-center p-12">
                  <CardHeader>
                    <CardTitle>No items found</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      No items match the current filters.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </section>

      {/* --- Modals & Dialogs --- */}

      {/* ADDED: Detail Modal Render */}
      <FabricRollDetailModal
        open={modalState.type === "details"}
        onOpenChange={(open) =>
          !open && setModalState({ type: null, data: [] })
        }
        roll={modalState.data[0] || null}
      />

      <MultiTransferLocationModal
        open={modalState.type === "transfer"}
        onOpenChange={(open) =>
          !open && setModalState({ type: null, data: [] })
        }
        rolls={modalState.data}
        onSubmit={(newLocation) =>
          handleExecuteTransfer(modalState.data, newLocation)
        }
      />
      <MultiLocationHistoryModal
        open={modalState.type === "history"}
        onOpenChange={(open) =>
          !open && setModalState({ type: null, data: [] })
        }
        rolls={modalState.data}
      />
      <AlertDialog
        open={deleteConfirmation.open}
        onOpenChange={(open) =>
          setDeleteConfirmation((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {deleteConfirmation.items.length} item(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InventoryListPage;
