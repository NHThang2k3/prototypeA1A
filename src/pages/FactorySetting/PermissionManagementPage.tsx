import React, { useState, useMemo } from "react";
import {
  Shield,
  Plus,
  Settings,
  Trash2,
  X,
  Check,
  ChevronsUpDown,
} from "lucide-react";

// --- UI Components (Shadcn UI style simulation) ---
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomTable } from "@/components/ui/custom-table"; // Giả định có sẵn
import { cn } from "@/lib/utils"; // Giả định utility class của shadcn

// --- Constants & Data Definitions ---

// 1. Dữ liệu Phòng ban (Departments)
const DEPARTMENTS_LIST = [
  { value: "warehouse", label: "Warehouse" },
  { value: "cutting", label: "Cutting Department" },
  { value: "sewing", label: "Sewing Line" },
  { value: "finishing", label: "Finishing & Packing" },
  { value: "hr", label: "Human Resources" },
  { value: "it", label: "IT Support" },
];

// 2. Dữ liệu Quyền hạn (Permissions Structure)
interface PermissionAction {
  id: string;
  label: string;
}
interface PermissionJob {
  id: string;
  label: string;
  actions: PermissionAction[];
}
interface PermissionGroup {
  id: string;
  label: string;
  jobs: PermissionJob[];
}

const PERMISSION_STRUCTURE: PermissionGroup[] = [
  {
    id: "packing_mgmt",
    label: "Packing List Management",
    jobs: [
      {
        id: "packing_job",
        label: "Packing List Job",
        actions: [
          { id: "create", label: "Create" },
          { id: "view", label: "View" },
          { id: "print", label: "Print QR" },
          { id: "delete", label: "Delete" },
        ],
      },
    ],
  },
  {
    id: "inventory_mgmt",
    label: "Inventory Management",
    jobs: [
      {
        id: "stock_check",
        label: "Stock Checking",
        actions: [
          { id: "view", label: "View Stock" },
          { id: "adjust", label: "Adjust Qty" },
        ],
      },
    ],
  },
  {
    id: "cutting_mgmt",
    label: "Cutting Room Management",
    jobs: [
      {
        id: "marker_planning",
        label: "Marker Planning",
        actions: [
            { id: "create", label: "Create Marker" }, 
            { id: "view", label: "View Marker" }
        ],
      },
    ],
  },
];

// 3. Cấu hình Mặc định theo Role Type
const ROLE_TYPES = ["Manager", "Sub-Manager", "Officer", "Worker"];

const DEFAULT_ROLES_CONFIG: Record<string, { groups: string[]; permissions: string[] }> = {
  Manager: {
    groups: ["packing_mgmt", "inventory_mgmt", "cutting_mgmt"],
    // Manager có full quyền (ví dụ minh họa)
    permissions: [
      "packing_mgmt:packing_job:create", "packing_mgmt:packing_job:view", "packing_mgmt:packing_job:print", "packing_mgmt:packing_job:delete",
      "inventory_mgmt:stock_check:view", "inventory_mgmt:stock_check:adjust",
      "cutting_mgmt:marker_planning:create", "cutting_mgmt:marker_planning:view"
    ],
  },
  "Sub-Manager": {
    groups: ["packing_mgmt", "inventory_mgmt"],
    permissions: [
      "packing_mgmt:packing_job:create", "packing_mgmt:packing_job:view", "packing_mgmt:packing_job:print",
      "inventory_mgmt:stock_check:view", "inventory_mgmt:stock_check:adjust"
    ],
  },
  Officer: {
    groups: ["packing_mgmt"],
    permissions: [
      "packing_mgmt:packing_job:create", "packing_mgmt:packing_job:view"
    ],
  },
  Worker: {
    groups: ["packing_mgmt"],
    permissions: [
      "packing_mgmt:packing_job:view" // Chỉ xem
    ],
  },
};

// --- Helper Functions ---
const getPermId = (groupId: string, jobId: string, actionId?: string) => {
  if (actionId) return `${groupId}:${jobId}:${actionId}`;
  return `${groupId}:${jobId}`;
};

// --- Component: MultiSelect with Search (Dùng chung cho Dept & Permission Add) ---
interface MultiSelectProps {
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select...",
  className,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (currentValue: string) => {
    if (selectedValues.includes(currentValue)) {
      onChange(selectedValues.filter((v) => v !== currentValue));
    } else {
      onChange([...selectedValues, currentValue]);
    }
  };

  const handleRemove = (e: React.MouseEvent, valueToRemove: string) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== valueToRemove));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto min-h-[40px] px-3 py-2 border-2 border-slate-300 hover:bg-white", className)}
        >
          <div className="flex flex-wrap gap-1 items-center text-left">
            {selectedValues.length === 0 && (
              <span className="text-slate-500 font-normal">{placeholder}</span>
            )}
            {selectedValues.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <Badge key={val} variant="secondary" className="bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200">
                  {opt?.label || val}
                  <div
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    onMouseDown={(e) => handleRemove(e, val)}
                  >
                    <X className="h-3 w-3 text-slate-500 hover:text-red-500" />
                  </div>
                </Badge>
              );
            })}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label} // Search by label
                  onSelect={() => handleSelect(option.value)}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedValues.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className={cn("h-4 w-4 text-white")} />
                  </div>
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// --- Sub-Component: Role Form Content ---

interface Role {
  id: string;
  name: string;
  departments: string[]; // Changed from single string to array
  type: string;
  description: string;
  permissions: string[];
  activeGroups: string[];
}

interface RoleFormProps {
  formData: Role;
  setFormData: React.Dispatch<React.SetStateAction<Role>>;
  isEditMode: boolean;
}

const RoleFormContent: React.FC<RoleFormProps> = ({ formData, setFormData }) => {
  
  // 1. Handle Type Change -> Load Default Permissions
  const handleTypeChange = (type: string) => {
    // Nếu đang Edit mà user đổi Type, cảnh báo hoặc tự động reset (ở đây làm auto reset theo default)
    const defaults = DEFAULT_ROLES_CONFIG[type];
    
    setFormData((prev) => ({
      ...prev,
      type: type,
      // Hợp nhất các group mặc định với các group hiện có (hoặc replace hoàn toàn tùy business logic)
      // Ở đây: Replace hoàn toàn permission theo type mới để đảm bảo tính nhất quán
      activeGroups: defaults ? defaults.groups : [],
      permissions: defaults ? defaults.permissions : [],
    }));
  };

  // 2. Handle Department Change (Multi-select)
  const handleDepartmentsChange = (newDepts: string[]) => {
    setFormData((prev) => ({ ...prev, departments: newDepts }));
  };

  // 3. Handle Add More Permission Groups (Multi-select)
  const handleAddPermissionGroups = (selectedGroupIds: string[]) => {
      // Chỉ add những cái chưa có trong activeGroups
      setFormData(prev => {
          const uniqueGroups = Array.from(new Set([...prev.activeGroups, ...selectedGroupIds]));
          return { ...prev, activeGroups: uniqueGroups };
      });
  };

  // 4. Remove a specific permission group
  const handleRemoveGroup = (groupId: string) => {
    setFormData((prev) => ({
      ...prev,
      activeGroups: prev.activeGroups.filter((g) => g !== groupId),
      permissions: prev.permissions.filter((p) => !p.startsWith(`${groupId}:`)),
    }));
  };

  // 5. Toggle specific Checkbox
  const togglePermission = (id: string, childrenIds: string[] = []) => {
    setFormData((prev) => {
      const isChecked = prev.permissions.includes(id);
      let newPerms = [...prev.permissions];

      if (isChecked) {
        newPerms = newPerms.filter((p) => p !== id && !childrenIds.includes(p));
      } else {
        newPerms.push(id);
        if (childrenIds.length > 0) {
          childrenIds.forEach((child) => {
            if (!newPerms.includes(child)) newPerms.push(child);
          });
        }
      }
      return { ...prev, permissions: newPerms };
    });
  };

  // Options for permission dropdown (exclude already active ones)
  const availablePermissionOptions = useMemo(() => {
     return PERMISSION_STRUCTURE.map(p => ({
         value: p.id,
         label: p.label
     }));
  }, []);

  return (
    <div className="space-y-6 py-2">
      {/* --- Top Section: Fields --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Col 1 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-bold">Role Name <span className="text-red-500">*</span></Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-2 border-slate-300 focus-visible:ring-0 focus-visible:border-slate-800"
              placeholder="e.g. Warehouse Manager"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Type <span className="text-red-500">*</span></Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="border-2 border-slate-300">
                <SelectValue placeholder="Select type to load defaults" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 italic">
              * Selecting a type will reset permissions to default values.
            </p>
          </div>
        </div>

        {/* Col 2 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-bold">Department Access <span className="text-red-500">*</span></Label>
            {/* MultiSelect Component with Search */}
            <MultiSelect 
                options={DEPARTMENTS_LIST}
                selectedValues={formData.departments}
                onChange={handleDepartmentsChange}
                placeholder="Select departments..."
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-[88px] border-2 border-slate-300 resize-none focus-visible:ring-0 focus-visible:border-slate-800"
              placeholder="Describe the role responsibilities..."
            />
          </div>
        </div>
      </div>

      {/* --- Bottom Section: Permissions --- */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="font-bold text-base">Permission</Label>
          <div className="h-0.5 flex-1 bg-slate-800 mt-1"></div>
        </div>

        <div className="border-2 border-slate-800 rounded-md p-4 min-h-[400px] flex flex-col gap-4 bg-white shadow-sm">
          
          {/* Add Permission Dropdown (Multi-select) */}
          <div className="w-full md:w-2/3 lg:w-1/2">
             <div className="mb-1 text-sm font-semibold text-slate-700">Add more permission</div>
             <MultiSelect 
                options={availablePermissionOptions}
                selectedValues={[]} // Always empty to act as an "Adder"
                onChange={(values) => handleAddPermissionGroups(values)}
                placeholder="Search & select modules to add..."
                className="bg-blue-50 border-blue-200 text-blue-900"
             />
          </div>

          <div className="flex-1 space-y-4 pl-1 mt-2">
            {formData.activeGroups.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 border-2 border-dashed rounded-lg bg-slate-50">
                  <Shield className="h-10 w-10 mb-2 opacity-20"/>
                  <p>No permissions configured.</p>
                  <p className="text-sm">Select a <b>Type</b> or add permissions manually.</p>
              </div>
            )}

            {formData.activeGroups.map((groupId) => {
              const group = PERMISSION_STRUCTURE.find((g) => g.id === groupId);
              if (!group) return null;

              return (
                <div key={group.id} className="animate-in fade-in slide-in-from-top-2 border rounded-lg p-3 bg-slate-50/50">
                  {/* Group Level Header */}
                  <div className="flex items-center justify-between mb-3 border-b pb-2 border-slate-200">
                    <div className="flex items-center gap-2">
                       <Badge variant="outline" className="bg-white text-slate-700 font-bold border-slate-300">
                          {group.label}
                       </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGroup(group.id)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50"
                      title="Remove this module"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Jobs Level */}
                  <div className="pl-2 space-y-4">
                    {group.jobs.map((job) => {
                      const jobFullId = getPermId(group.id, job.id);
                      const actionFullIds = job.actions.map((a) =>
                        getPermId(group.id, job.id, a.id)
                      );
                      const isJobChecked = formData.permissions.includes(jobFullId);

                      return (
                        <div key={job.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={jobFullId}
                              checked={isJobChecked}
                              onCheckedChange={() => togglePermission(jobFullId, actionFullIds)}
                              className="border-slate-400 data-[state=checked]:bg-slate-800 data-[state=checked]:border-slate-800"
                            />
                            <Label
                              htmlFor={jobFullId}
                              className="font-bold text-sm cursor-pointer select-none"
                            >
                              {job.label}
                            </Label>
                          </div>

                          {/* Actions Level */}
                          <div className="ml-6 grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4">
                            {job.actions.map((action) => {
                              const actionFullId = getPermId(group.id, job.id, action.id);
                              return (
                                <div key={action.id} className="flex items-center gap-2">
                                  <Checkbox
                                    id={actionFullId}
                                    checked={formData.permissions.includes(actionFullId)}
                                    onCheckedChange={() => togglePermission(actionFullId)}
                                    className="border-slate-300"
                                  />
                                  <Label
                                    htmlFor={actionFullId}
                                    className="font-normal text-slate-600 text-sm cursor-pointer select-none"
                                  >
                                    {action.label}
                                  </Label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

const PermissionManagementPage: React.FC = () => {
  // Mock Data
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "r1",
      name: "Warehouse Manager",
      departments: ["warehouse"],
      type: "Manager",
      description: "Manage all inbound/outbound",
      permissions: ["packing_mgmt:packing_job:view"],
      activeGroups: ["packing_mgmt"],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const initialFormState: Role = {
    id: "",
    name: "",
    departments: [],
    type: "",
    description: "",
    permissions: [],
    activeGroups: [],
  };

  const [formData, setFormData] = useState<Role>(initialFormState);

  const openCreateModal = () => {
    setEditingRoleId(null);
    setFormData({ ...initialFormState, id: `new_${Date.now()}` });
    setIsModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    setEditingRoleId(role.id);
    setFormData({ ...role });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.type || formData.departments.length === 0) {
      alert("Please fill in Role Name, Type and select at least one Department.");
      return;
    }

    if (editingRoleId) {
      setRoles((prev) => prev.map((r) => (r.id === editingRoleId ? formData : r)));
    } else {
      setRoles((prev) => [...prev, { ...formData, id: `r_${Date.now()}` }]);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { header: "Role Name", accessorKey: "name", cell: ({ row }: any) => <span className="font-bold">{row.original.name}</span> },
    { 
        header: "Department", 
        accessorKey: "departments",
        cell: ({ row }: any) => (
            <div className="flex flex-wrap gap-1">
                {row.original.departments.map((d: string) => (
                     <Badge key={d} variant="outline" className="text-[10px] bg-slate-50">
                         {DEPARTMENTS_LIST.find(dept => dept.value === d)?.label || d}
                     </Badge>
                ))}
            </div>
        )
    },
    { header: "Type", accessorKey: "type" },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => openEditModal(row.original)}>
            <Settings className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Permission Management</h1>
          <p className="text-slate-500">Define roles, departments and granular access control.</p>
        </div>
        <Button onClick={openCreateModal} className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Create new role
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          <CustomTable columns={columns} data={roles} />
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[800px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <div className="border-b px-6 py-4 bg-white">
            <DialogTitle className="text-xl font-bold">
              {editingRoleId ? "Update role" : "Create new role"}
            </DialogTitle>
          </div>

          <ScrollArea className="flex-1 px-6 bg-white">
            <RoleFormContent formData={formData} setFormData={setFormData} isEditMode={!!editingRoleId} />
          </ScrollArea>

          <DialogFooter className="p-6 border-t bg-slate-50/50 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-2 border-slate-800 text-slate-800 font-bold hover:bg-slate-100 min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white font-bold min-w-[100px] ml-2"
            >
              {editingRoleId ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionManagementPage;