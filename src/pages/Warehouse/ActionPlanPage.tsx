import { useState, useMemo } from "react";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  UserPlus,
  Filter,
  Eye,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

// Shadcn UI Imports (Giả định bạn đã config alias @)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ScrollArea } from "@/components/ui/scroll-area";

// Custom Table Import (Component bảng của bạn)
import { CustomTable } from "@/components/ui/custom-table";

// --- TYPES ---
interface ActionPlan {
  id: string;
  title: string;
  remediationProcess: string;
  assignees: string[];
}

// --- MOCK DATA ---
const AVAILABLE_ASSIGNEES = [
  "John Doe",
  "Jane Smith",
  "Mike Ross",
  "Maintenance Team",
  "QC Team",
  "Warehouse Manager",
  "Production Lead",
];

const initialData: ActionPlan[] = [
  {
    id: "AP-001",
    title: "High defect rate on STYLE-A01",
    remediationProcess:
      "Adjust heat press temp to 150C and recalibrate sensors. (Full Detail) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    assignees: ["John Doe", "Mike Ross"],
  },
  {
    id: "AP-002",
    title: "Embroidery machine #5 downtime",
    remediationProcess:
      "Replace broken needle sensor and update firmware via USB port B.",
    assignees: ["Maintenance Team"],
  },
  {
    id: "AP-003",
    title: "Pad-Print ink smudging issue",
    remediationProcess:
      "Change ink viscosity mixture ratio to 5:1 and clean the pad surface with solvent #42.",
    assignees: ["Jane Smith", "QC Team"],
  },
];

// --- PAGE COMPONENT ---
const ActionPlanPage = () => {
  const [data, setData] = useState<ActionPlan[]>(initialData);

  // --- FILTERS STATE ---
  const [tempSearch, setTempSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);

  // --- DIALOG & ALERT STATE ---
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Create/Edit
  const [currentAction, setCurrentAction] = useState<ActionPlan | null>(null);
  const [formData, setFormData] = useState<Partial<ActionPlan>>({});

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false); // Delete
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [isViewDetailOpen, setIsViewDetailOpen] = useState(false); // View Detail
  const [itemToView, setItemToView] = useState<ActionPlan | null>(null);

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(lowerQuery) ||
        item.remediationProcess.toLowerCase().includes(lowerQuery);

      const matchesAssignee = filterAssignee
        ? item.assignees.includes(filterAssignee)
        : true;

      return matchesSearch && matchesAssignee;
    });
  }, [data, searchQuery, filterAssignee]);

  // --- HANDLERS ---
  const handleSearch = () => {
    setSearchQuery(tempSearch);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReset = () => {
    setTempSearch("");
    setSearchQuery("");
    setFilterAssignee(null);
  };

  // Open Handlers
  const openCreateDialog = () => {
    setCurrentAction(null);
    setFormData({
      title: "",
      remediationProcess: "",
      assignees: [],
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (action: ActionPlan) => {
    setCurrentAction(action);
    setFormData({ ...action });
    setIsDialogOpen(true);
  };

  const openViewDetail = (action: ActionPlan) => {
    setItemToView(action);
    setIsViewDetailOpen(true);
  };

  // Save / Delete Handlers
  const handleSave = () => {
    if (currentAction) {
      // Update
      setData((prev) =>
        prev.map((item) =>
          item.id === currentAction.id
            ? ({ ...item, ...formData } as ActionPlan)
            : item
        )
      );
    } else {
      // Create
      const newItem: ActionPlan = {
        id: `AP-${Math.floor(Math.random() * 10000)}`,
        title: formData.title || "",
        remediationProcess: formData.remediationProcess || "",
        assignees: formData.assignees || [],
      };
      setData((prev) => [newItem, ...prev]);
    }
    setIsDialogOpen(false);
  };

  const toggleAssignee = (name: string) => {
    const currentAssignees = formData.assignees || [];
    if (currentAssignees.includes(name)) {
      setFormData({
        ...formData,
        assignees: currentAssignees.filter((item) => item !== name),
      });
    } else {
      setFormData({
        ...formData,
        assignees: [...currentAssignees, name],
      });
    }
  };

  const openDeleteAlert = (id: string) => {
    setItemToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setData((prev) => prev.filter((item) => item.id !== itemToDelete));
    }
    setIsDeleteAlertOpen(false);
    setItemToDelete(null);
  };

  // --- TABLE COLUMNS ---
  const columns = useMemo<ColumnDef<ActionPlan>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="flex flex-col max-w-[200px]">
            {/* CLICK TITLE TO VIEW DETAIL */}
            <span
              onClick={() => openViewDetail(row.original)}
              className="font-semibold text-base truncate cursor-pointer hover:underline hover:text-blue-600 transition-colors"
              title="Click to view details"
            >
              {row.original.title}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "remediationProcess",
        header: "Remediation Process",
        cell: ({ row }) => (
          // LINE CLAMP 2 LINES
          <div
            className="max-w-[350px]"
            title={row.original.remediationProcess}
          >
            <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-2">
              {row.original.remediationProcess}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "assignees",
        header: "Assignees",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {row.original.assignees.length > 0 ? (
              row.original.assignees.slice(0, 2).map((person, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {person}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">
                Unassigned
              </span>
            )}
            {row.original.assignees.length > 2 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{row.original.assignees.length - 2}
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const action = row.original;
          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>

                  {/* VIEW DETAIL ACTION */}
                  <DropdownMenuItem onClick={() => openViewDetail(action)}>
                    <Eye className="mr-2 h-4 w-4" /> View Details
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => openEditDialog(action)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDeleteAlert(action.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [] // Dependencies
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Action Plan Management
        </h1>
        <Button onClick={openCreateDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Action Plan
        </Button>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex w-full md:w-1/2 items-center space-x-2">
              <Input
                placeholder="Search by title or process..."
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={handleSearch} type="button">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>

            {/* Assignee Filter */}
            <div className="flex w-full md:w-auto items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-[200px] justify-between"
                  >
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="truncate">
                        {filterAssignee ? filterAssignee : "All Assignees"}
                      </span>
                    </div>
                    {filterAssignee && (
                      <Badge
                        variant="secondary"
                        className="ml-2 h-5 px-1 text-[10px]"
                      >
                        1
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]" align="start">
                  <DropdownMenuLabel>Filter by Assignee</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterAssignee(null)}>
                    All Assignees
                  </DropdownMenuItem>
                  {AVAILABLE_ASSIGNEES.map((person) => (
                    <DropdownMenuCheckboxItem
                      key={person}
                      checked={filterAssignee === person}
                      onCheckedChange={() =>
                        setFilterAssignee(
                          filterAssignee === person ? null : person
                        )
                      }
                    >
                      {person}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reset Button */}
              {(filterAssignee || searchQuery || tempSearch) && (
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="ml-2 px-3"
                >
                  <X className="mr-2 h-4 w-4" /> Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <div className="space-y-4">
        <CustomTable
          columns={columns}
          data={filteredData}
          showCheckbox={false}
        />
      </div>

      {/* --- VIEW DETAIL DIALOG (NEW) --- */}
      <Dialog open={isViewDetailOpen} onOpenChange={setIsViewDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Action Plan Details</DialogTitle>
            <DialogDescription>ID: {itemToView?.id}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6 py-2">
              {/* Title Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Title / Problem
                </h3>
                <div className="text-lg font-semibold border rounded-md p-3 bg-muted/20">
                  {itemToView?.title}
                </div>
              </div>

              {/* Remediation Process Section - FULL TEXT DISPLAY */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Remediation Process
                </h3>
                <div className="text-sm border rounded-md p-3 bg-muted/20 whitespace-pre-wrap leading-relaxed">
                  {itemToView?.remediationProcess || "No process defined."}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Assignees Section */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Assignees
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {itemToView?.assignees &&
                    itemToView.assignees.length > 0 ? (
                      itemToView.assignees.map((person, idx) => (
                        <Badge key={idx} variant="secondary">
                          {person}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm italic text-muted-foreground">
                        None
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button onClick={() => setIsViewDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentAction ? "Edit Action Plan" : "Create Action Plan"}
            </DialogTitle>
            <DialogDescription>
              Define the problem and assign remediation steps.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title / Problem</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="E.g., High defect rate on Line 4"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="process">Remediation Process</Label>
                <Textarea
                  id="process"
                  className="min-h-[120px]"
                  placeholder="Describe the technical steps to fix the issue..."
                  value={formData.remediationProcess || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      remediationProcess: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Assignees</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Select Assignees
                      </span>
                      {formData.assignees && formData.assignees.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-2 rounded-sm px-1 font-normal"
                        >
                          {formData.assignees.length} selected
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                    {AVAILABLE_ASSIGNEES.map((person) => (
                      <DropdownMenuCheckboxItem
                        key={person}
                        checked={formData.assignees?.includes(person)}
                        onCheckedChange={() => toggleAssignee(person)}
                      >
                        {person}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.assignees?.map((person) => (
                    <Badge
                      key={person}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {person}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => toggleAssignee(person)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActionPlanPage;
