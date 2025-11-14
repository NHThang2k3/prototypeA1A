import React, { useState, useMemo, useCallback } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
  HeaderContext,
  CellContext,
  Column,
  RowSelectionState,
} from "@tanstack/react-table";
import { SlidersHorizontal, Pencil, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

//================================================================================
// CUSTOM TABLE COMPONENT (MODIFIED TO ACCEPT CONTROLLED SELECTION)
//================================================================================

interface CustomTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showCheckbox?: boolean;
  showColumnVisibility?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}

export function CustomTable<TData, TValue>({
  columns,
  data,
  showCheckbox = true,
  showColumnVisibility = true,
  onSelectionChange,
  rowSelection: controlledRowSelection,
  setRowSelection: setControlledRowSelection,
}: CustomTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Internal state for uncontrolled selection
  const [internalRowSelection, setInternalRowSelection] =
    React.useState<RowSelectionState>({});

  // Determine if the component is in controlled mode for row selection
  const isControlled =
    controlledRowSelection !== undefined &&
    setControlledRowSelection !== undefined;
  const rowSelection = isControlled
    ? controlledRowSelection
    : internalRowSelection;
  const onRowSelectionChange = isControlled
    ? setControlledRowSelection
    : setInternalRowSelection;

  const tableColumns = React.useMemo(() => {
    const processedColumns = columns.map((column) => {
      if (column.id === "actions" && showColumnVisibility) {
        return {
          ...column,
          enableSorting: false,
          enableHiding: false,
          header: ({ table }: HeaderContext<TData, TValue>) => (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((col) => col.getCanHide())
                    .map((col: Column<TData, unknown>) => (
                      <DropdownMenuCheckboxItem
                        key={col.id}
                        className="capitalize"
                        checked={col.getIsVisible()}
                        onCheckedChange={(value) =>
                          col.toggleVisibility(!!value)
                        }
                      >
                        {typeof col.columnDef.header === "string"
                          ? col.columnDef.header
                          : col.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        };
      }
      return column;
    });

    if (showCheckbox) {
      processedColumns.unshift({
        id: "select",
        header: ({ table }: HeaderContext<TData, TValue>) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }: CellContext<TData, TValue>) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }
    return processedColumns as ColumnDef<TData, TValue>[];
  }, [columns, showCheckbox, showColumnVisibility]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: onRowSelectionChange,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRowsData = table
        .getFilteredSelectedRowModel()
        .rows.map((row: Row<TData>) => row.original);
      onSelectionChange(selectedRowsData);
    }
  }, [rowSelection, onSelectionChange, table]);

  return (
    <div className="w-full space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 p-4">
        {showCheckbox && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        )}
        <div className="flex items-center space-x-2 ml-auto">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  First
                </Button>
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.previousPage();
                  }}
                  className={
                    !table.getCanPreviousPage()
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.nextPage();
                  }}
                  className={
                    !table.getCanNextPage()
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  Last
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

//================================================================================
// MAIN PAGE COMPONENT
//================================================================================

interface RelaxTimeStandard {
  id: number;
  fabricType: string;
  relaxTime: number;
}

type RelaxTimeStandardPageProps = Record<string, never>;

const initialStandards: RelaxTimeStandard[] = [
  { id: 1, fabricType: "Cotton Jersey", relaxTime: 24 },
  { id: 2, fabricType: "Polyester Spandex", relaxTime: 12 },
  { id: 3, fabricType: "Rayon Challis", relaxTime: 48 },
  { id: 4, fabricType: "Linen", relaxTime: 24 },
  { id: 5, fabricType: "Wool Gabardine", relaxTime: 72 },
  { id: 6, fabricType: "Silk Charmeuse", relaxTime: 6 },
  { id: 7, fabricType: "Denim (Rigid)", relaxTime: 4 },
  { id: 8, fabricType: "Fleece", relaxTime: 8 },
];

const RelaxTimeStandardPage: React.FC<RelaxTimeStandardPageProps> = () => {
  const [standards, setStandards] =
    useState<RelaxTimeStandard[]>(initialStandards);
  const [filter, setFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStandard, setCurrentStandard] =
    useState<Partial<RelaxTimeStandard> | null>(null);

  // State to manage selected rows
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedStandards, setSelectedStandards] = useState<
    RelaxTimeStandard[]
  >([]);

  const handleAddNew = () => {
    setCurrentStandard({});
    setIsDialogOpen(true);
  };

  const handleEdit = useCallback((standard: RelaxTimeStandard) => {
    setCurrentStandard(standard);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback((id: number) => {
    setStandards((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleDeleteSelected = () => {
    const selectedIds = new Set(selectedStandards.map((s) => s.id));
    setStandards((prev) =>
      prev.filter((standard) => !selectedIds.has(standard.id))
    );
    setRowSelection({}); // Clear selection after deletion
  };

  const handleSave = () => {
    if (
      !currentStandard ||
      !currentStandard.fabricType ||
      currentStandard.relaxTime === undefined
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (currentStandard.id) {
      setStandards((prev) =>
        prev.map((s) =>
          s.id === currentStandard.id
            ? (currentStandard as RelaxTimeStandard)
            : s
        )
      );
    } else {
      const newStandard: RelaxTimeStandard = {
        ...currentStandard,
        id: Date.now(),
      } as RelaxTimeStandard;
      setStandards((prev) => [...prev, newStandard]);
    }
    setIsDialogOpen(false);
    setCurrentStandard(null);
  };

  const filteredData = useMemo(() => {
    if (!filter) return standards;
    return standards.filter((standard) =>
      standard.fabricType.toLowerCase().includes(filter.toLowerCase())
    );
  }, [standards, filter]);

  const columns = useMemo<ColumnDef<RelaxTimeStandard>[]>(
    () => [
      { accessorKey: "fabricType", header: "Fabric Type" },
      { accessorKey: "relaxTime", header: "Relax Time (hours)" },
      {
        id: "actions",
        cell: ({ row }) => {
          const standard = row.original;
          return (
            <div className="flex justify-end items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(standard)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the standard for "{standard.fabricType}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(standard.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
      },
    ],
    [handleDelete, handleEdit]
  );

  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCurrentStandard((prev) => ({
        ...prev,
        [name]:
          name === "relaxTime" ? (value === "" ? "" : Number(value)) : value,
      }));
    },
    []
  );

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Relax Time Standard Management
        </h1>
        <p className="text-muted-foreground">
          Manage standard relax times for different fabric types.
        </p>
      </header>
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Input
          placeholder="Filter by Fabric Type..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        <div className="flex items-center gap-2">
          {selectedStandards.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedStandards.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the selected {selectedStandards.length} standard(s).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteSelected}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Standard
          </Button>
        </div>
      </div>
      <div className="border rounded-lg">
        <CustomTable
          columns={columns}
          data={filteredData}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectionChange={setSelectedStandards}
        />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentStandard?.id ? "Edit Standard" : "Add New Standard"}
            </DialogTitle>
            <DialogDescription>
              {currentStandard?.id
                ? "Make changes to the existing standard."
                : "Add a new fabric relax time standard to the system."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fabricType" className="text-right">
                Fabric Type
              </Label>
              <Input
                id="fabricType"
                name="fabricType"
                value={currentStandard?.fabricType || ""}
                onChange={handleFormChange}
                className="col-span-3"
                disabled={!!currentStandard?.id}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relaxTime" className="text-right">
                Relax Time
              </Label>
              <Input
                id="relaxTime"
                name="relaxTime"
                type="number"
                value={currentStandard?.relaxTime ?? ""}
                onChange={handleFormChange}
                className="col-span-3"
                placeholder="in hours"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RelaxTimeStandardPage;
