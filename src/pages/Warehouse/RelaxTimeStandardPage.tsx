import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomTable } from "@/components/ui/custom-table";
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
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

// Define the type for a single standard
interface RelaxTimeStandard {
  id: number;
  fabricType: string;
  relaxTime: number;
}

// Props for the component (if any were needed)
// Explicitly use an empty object type to avoid an empty interface which can allow non-object values.
type RelaxTimeStandardPageProps = Record<string, never>;

// Dummy data for initial render
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

  const handleAddNew = () => {
    setCurrentStandard({});
    setIsDialogOpen(true);
  };

  const handleEdit = useCallback(
    (standard: RelaxTimeStandard) => {
      setCurrentStandard(standard);
      setIsDialogOpen(true);
    },
    [setCurrentStandard, setIsDialogOpen]
  );

  const handleDelete = useCallback(
    (id: number) => {
      setStandards((prev) => prev.filter((s) => s.id !== id));
    },
    [setStandards]
  );

  const handleSave = () => {
    if (
      !currentStandard ||
      !currentStandard.fabricType ||
      currentStandard.relaxTime === undefined
    ) {
      // Basic validation
      alert("Please fill in all fields.");
      return;
    }

    if (currentStandard.id) {
      // Edit mode
      setStandards((prev) =>
        prev.map((s) =>
          s.id === currentStandard.id
            ? (currentStandard as RelaxTimeStandard)
            : s
        )
      );
    } else {
      // Add mode
      const newStandard: RelaxTimeStandard = {
        ...currentStandard,
        id: Date.now(), // Simple unique ID generation
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
      {
        accessorKey: "fabricType",
        header: "Fabric Type",
      },
      {
        accessorKey: "relaxTime",
        header: "Relax Time (hours)",
        cell: ({ row }) => <div className="">{row.original.relaxTime}</div>,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
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
        <div className="w-full sm:max-w-xs">
          <Label htmlFor="fabric-type-filter" className="sr-only">
            Filter by Fabric Type
          </Label>
          <Input
            id="fabric-type-filter"
            placeholder="Filter by Fabric Type..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Standard
        </Button>
      </div>

      <div className="border rounded-lg">
        <CustomTable columns={columns} data={filteredData} />
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
                // THAY ĐỔI Ở ĐÂY
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
                value={currentStandard?.relaxTime || ""}
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
