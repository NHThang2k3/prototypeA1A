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
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

// Shadcn UI Imports
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

// Custom Table Import
import { CustomTable } from "@/components/ui/custom-table";

// --- TYPES ---
interface ActionPlan {
  id: string;
  title: string;
  remediationProcess: string;
  assignees: string[];
  dueDate: string;
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
      "Adjust heat press temp to 150C and recalibrate sensors.",
    assignees: ["John Doe", "Mike Ross"],
    dueDate: "2023-11-05",
  },
  {
    id: "AP-002",
    title: "Embroidery machine #5 downtime",
    remediationProcess: "Replace broken needle sensor and update firmware.",
    assignees: ["Maintenance Team"],
    dueDate: "2023-10-30",
  },
  {
    id: "AP-003",
    title: "Pad-Print ink smudging issue",
    remediationProcess: "Change ink viscosity mixture ratio to 5:1.",
    assignees: ["Jane Smith", "QC Team"],
    dueDate: "2023-11-10",
  },
];

// --- PAGE COMPONENT ---
const ActionPlanPage = () => {
  const [data, setData] = useState<ActionPlan[]>(initialData);

  // --- FILTERS STATE ---
  // tempSearch: Giá trị hiển thị trong ô input
  const [tempSearch, setTempSearch] = useState("");
  // searchQuery: Giá trị thực sự dùng để filter (khi bấm nút Search)
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);

  // --- DIALOG & ALERT STATE ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionPlan | null>(null);
  const [formData, setFormData] = useState<Partial<ActionPlan>>({});
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Filter by Search Text (Dùng searchQuery thay vì tempSearch)
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(lowerQuery) ||
        item.remediationProcess.toLowerCase().includes(lowerQuery);

      // 2. Filter by Assignee
      const matchesAssignee = filterAssignee
        ? item.assignees.includes(filterAssignee)
        : true;

      return matchesSearch && matchesAssignee;
    });
  }, [data, searchQuery, filterAssignee]);

  // --- HANDLERS ---

  // Xử lý khi bấm nút Search
  const handleSearch = () => {
    setSearchQuery(tempSearch);
  };

  // Xử lý khi bấm phím Enter trong ô input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Reset toàn bộ filter
  const handleReset = () => {
    setTempSearch("");
    setSearchQuery("");
    setFilterAssignee(null);
  };

  const openCreateDialog = () => {
    setCurrentAction(null);
    setFormData({
      title: "",
      remediationProcess: "",
      assignees: [],
      dueDate: new Date().toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (action: ActionPlan) => {
    setCurrentAction(action);
    setFormData({ ...action });
    setIsDialogOpen(true);
  };

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
        dueDate: formData.dueDate || "",
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
          <div className="flex flex-col">
            <span className="font-semibold text-base">
              {row.original.title}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "remediationProcess",
        header: "Remediation Process",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {row.original.remediationProcess}
          </div>
        ),
      },
      {
        accessorKey: "assignees",
        header: "Assignees",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.assignees.length > 0 ? (
              row.original.assignees.map((person, idx) => (
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
    []
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
            {/* Search Input & Button Group */}
            <div className="flex w-full md:w-1/2 items-center space-x-2">
              <Input
                placeholder="Search by title or process..."
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onKeyDown={handleKeyDown} // Hỗ trợ phím Enter
              />
              <Button onClick={handleSearch} type="button">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>

            {/* Assignee Filter Dropdown */}
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

              {/* Reset Button (Hiện khi có bất kỳ filter nào đang active) */}
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
              {/* Title */}
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

              {/* Process */}
              <div className="grid gap-2">
                <Label htmlFor="process">Remediation Process</Label>
                <Textarea
                  id="process"
                  className="min-h-[100px]"
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

              {/* Assignees */}
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
