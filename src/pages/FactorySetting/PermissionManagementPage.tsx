import React, { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Settings,
  X,
  Trash2,
  Key,
  Save,
  Search,
} from "lucide-react";

// Giả định các components này đã tồn tại trong project
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CustomTable } from "@/components/ui/custom-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// --- Types & Interfaces ---

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

// --- Dummy Data ---

const INITIAL_PERMISSIONS: Permission[] = [
  { id: "p1", name: "user:read", description: "View user details" },
  { id: "p2", name: "user:write", description: "Create or edit users" },
  { id: "p3", name: "user:delete", description: "Delete users" },
  { id: "p4", name: "role:read", description: "View roles" },
  { id: "p5", name: "role:write", description: "Manage roles" },
  { id: "p6", name: "system:config", description: "Access system settings" },
  { id: "p7", name: "report:view", description: "View analytics reports" },
  { id: "p8", name: "report:export", description: "Export data to CSV" },
];

const INITIAL_ROLES: Role[] = [
  {
    id: "r1",
    name: "Admin",
    description: "Full system access and configuration",
    permissions: [...INITIAL_PERMISSIONS],
  },
  {
    id: "r2",
    name: "Editor",
    description: "Can manage content and basic user settings",
    permissions: [
      INITIAL_PERMISSIONS[0],
      INITIAL_PERMISSIONS[1],
      INITIAL_PERMISSIONS[3],
    ],
  },
];

// --- Main Component ---

const PermissionManagementPage: React.FC = () => {
  // --- Global State ---
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);

  // --- Modal Visibility States ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  // --- Create Role States ---
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [selectedPermsForCreate, setSelectedPermsForCreate] = useState<
    string[]
  >([]);
  // [NEW] Search state cho Create Modal
  const [createSearchTerm, setCreateSearchTerm] = useState("");

  // --- Edit Role (Permission Manager) States ---
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<Role | null>(
    null
  );
  const [tempPermissions, setTempPermissions] = useState<Permission[]>([]);
  // [NEW] Search state cho Edit Modal (phần Available permissions)
  const [editSearchTerm, setEditSearchTerm] = useState("");

  // ==========================================
  // HANDLERS: CREATE ROLE
  // ==========================================

  useEffect(() => {
    if (isCreateModalOpen) {
      setNewRoleName("");
      setNewRoleDesc("");
      setSelectedPermsForCreate([]);
      setCreateSearchTerm(""); // Reset search khi mở modal
    }
  }, [isCreateModalOpen]);

  const toggleCreatePermission = (permId: string) => {
    setSelectedPermsForCreate((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;

    const initialRolePermissions = INITIAL_PERMISSIONS.filter((p) =>
      selectedPermsForCreate.includes(p.id)
    );

    const newRole: Role = {
      id: `r${Date.now()}`,
      name: newRoleName,
      description: newRoleDesc || "No description provided",
      permissions: initialRolePermissions,
    };

    setRoles([...roles, newRole]);
    setIsCreateModalOpen(false);
  };

  // [NEW] Filter permissions trong Create Modal
  const filteredCreatePermissions = INITIAL_PERMISSIONS.filter(
    (perm) =>
      perm.name.toLowerCase().includes(createSearchTerm.toLowerCase()) ||
      perm.description.toLowerCase().includes(createSearchTerm.toLowerCase())
  );

  // ==========================================
  // HANDLERS: EDIT ROLE (Permissions)
  // ==========================================

  const openPermissionManager = (role: Role) => {
    setSelectedRoleForEdit(role);
    setTempPermissions([...role.permissions]);
    setEditSearchTerm(""); // Reset search
    setIsPermissionModalOpen(true);
  };

  // Xóa quyền khỏi danh sách tạm
  const handleRemoveTempPermission = (permId: string) => {
    setTempPermissions((prev) => prev.filter((p) => p.id !== permId));
  };

  // [NEW] Thêm quyền vào danh sách tạm
  const handleAddTempPermission = (perm: Permission) => {
    // Kiểm tra xem đã có chưa (đề phòng double click)
    if (!tempPermissions.find((p) => p.id === perm.id)) {
      setTempPermissions((prev) => [...prev, perm]);
    }
  };

  // LƯU CHÍNH THỨC
  const handleSaveChanges = () => {
    if (!selectedRoleForEdit) return;

    const updatedRole = {
      ...selectedRoleForEdit,
      permissions: tempPermissions,
    };

    setRoles((prevRoles) =>
      prevRoles.map((r) => (r.id === selectedRoleForEdit.id ? updatedRole : r))
    );

    setIsPermissionModalOpen(false);
  };

  // [NEW] Tính toán danh sách các quyền CHƯA ĐƯỢC GÁN (Available) để hiển thị
  const availablePermissions = INITIAL_PERMISSIONS.filter(
    (initialPerm) =>
      !tempPermissions.some((tempPerm) => tempPerm.id === initialPerm.id)
  );

  // [NEW] Filter danh sách Available theo search term
  const filteredAvailablePermissions = availablePermissions.filter(
    (perm) =>
      perm.name.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
      perm.description.toLowerCase().includes(editSearchTerm.toLowerCase())
  );

  // ==========================================
  // HANDLERS: DELETE ROLE
  // ==========================================
  const handleDeleteRole = (roleId: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter((r) => r.id !== roleId));
    }
  };

  // --- Table Columns ---
  const tableColumns = [
    {
      header: "Role Name",
      accessorKey: "name",
      cell: ({ row }: { row: { original: Role } }) => (
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-slate-900">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }: { row: { original: Role } }) => (
        <span className="text-slate-500 text-sm truncate max-w-[300px] block">
          {row.original.description}
        </span>
      ),
    },
    {
      header: "Permissions",
      accessorKey: "permissions",
      cell: ({ row }: { row: { original: Role } }) => {
        const count = row.original.permissions.length;
        return (
          <Badge variant={count > 0 ? "secondary" : "outline"}>
            {count} access rights
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }: { row: { original: Role } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openPermissionManager(row.original)}
          >
            <Settings className="h-4 w-4 mr-1" /> Manage
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDeleteRole(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Role Directory
          </h1>
          <p className="text-slate-500 mt-1">
            Define roles and assign permissions to control system access.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Role
        </Button>
      </div>

      {/* Main Table */}
      <Card>
        <CardContent className="p-0">
          <CustomTable columns={tableColumns} data={roles} />
        </CardContent>
      </Card>

      {/* =========================================================
          MODAL: CREATE NEW ROLE (Updated: With Search)
         ========================================================= */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Create a role and assign initial permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Input Name & Desc */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Role Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Content Manager"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Role description..."
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
              />
            </div>

            <Separator className="my-1" />

            {/* Permission Selection List WITH SEARCH */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Assign Permissions</Label>
                <span className="text-xs text-muted-foreground">
                  {selectedPermsForCreate.length} selected
                </span>
              </div>

              {/* [NEW] Search Bar for Create Modal */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  className="pl-9"
                  value={createSearchTerm}
                  onChange={(e) => setCreateSearchTerm(e.target.value)}
                />
              </div>

              <ScrollArea className="h-[200px] border rounded-md p-3">
                <div className="space-y-3">
                  {filteredCreatePermissions.length > 0 ? (
                    filteredCreatePermissions.map((perm) => (
                      <div key={perm.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={`create-perm-${perm.id}`}
                          checked={selectedPermsForCreate.includes(perm.id)}
                          onCheckedChange={() =>
                            toggleCreatePermission(perm.id)
                          }
                        />
                        <div className="grid gap-1 leading-none">
                          <label
                            htmlFor={`create-perm-${perm.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {perm.name}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {perm.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-center text-muted-foreground py-4">
                      No permissions found matching "{createSearchTerm}"
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateRole} disabled={!newRoleName.trim()}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================
          MODAL: MANAGE PERMISSIONS (Updated: Add + Remove)
         ========================================================= */}
      <Dialog
        open={isPermissionModalOpen}
        onOpenChange={(open) => {
          if (!open) setIsPermissionModalOpen(false);
        }}
      >
        {/* Sửa: Thêm p-0 và gap-0 để custom padding bên trong, max-h để không quá cao */}
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] h-full flex flex-col p-0 gap-0">
          {/* Header: Fixed height */}
          <div className="p-6 pb-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Edit Permissions: {selectedRoleForEdit?.name}
              </DialogTitle>
              <DialogDescription>
                Add or remove permissions. Changes apply on Save.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Body: Flexible height - Phần này sẽ co giãn và scroll */}
          <div className="flex flex-col flex-1 min-h-0 gap-4 px-6 overflow-hidden">
            {/* --- SECTION 1: ADD PERMISSIONS (AVAILABLE) --- */}
            {/* Sửa: Dùng flex-1 để chiếm 50% không gian còn lại */}
            <div className="flex flex-col gap-2 flex-1 min-h-0">
              <div className="flex items-center justify-between shrink-0">
                <Label className="text-xs font-semibold uppercase text-slate-500">
                  Available Permissions
                </Label>
              </div>

              <div className="relative shrink-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search to add..."
                  className="pl-9 h-9"
                  value={editSearchTerm}
                  onChange={(e) => setEditSearchTerm(e.target.value)}
                />
              </div>

              {/* Sửa: ScrollArea chiếm hết phần còn lại của section này */}
              <ScrollArea className="flex-1 border rounded-md p-2 bg-slate-50/50">
                {filteredAvailablePermissions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-3">
                    {" "}
                    {/* pr-3 để tránh scrollbar che content */}
                    {filteredAvailablePermissions.map((perm) => (
                      <button
                        key={perm.id}
                        onClick={() => handleAddTempPermission(perm)}
                        className="flex items-center justify-between bg-white p-2 rounded border shadow-sm hover:border-primary hover:bg-primary/5 transition-all text-left group h-auto"
                      >
                        <div className="flex flex-col min-w-0 flex-1 mr-2">
                          <span className="text-xs font-bold font-mono text-slate-700 group-hover:text-primary truncate">
                            {perm.name}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate">
                            {perm.description}
                          </span>
                        </div>
                        <Plus className="h-4 w-4 text-slate-400 group-hover:text-primary flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[100px]">
                    <span className="text-sm">
                      {editSearchTerm
                        ? "No matching permissions found."
                        : "All permissions assigned."}
                    </span>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Separator visual */}
            <div className="shrink-0 h-[1px] bg-slate-200" />

            {/* --- SECTION 2: ASSIGNED PERMISSIONS (CURRENT) --- */}
            {/* Sửa: Dùng flex-1 để chiếm 50% không gian còn lại */}
            <div className="flex flex-col gap-2 flex-1 min-h-0 mb-2">
              <div className="flex items-center justify-between shrink-0">
                <Label className="text-xs font-semibold uppercase text-slate-500">
                  Assigned Permissions ({tempPermissions.length})
                </Label>
                {selectedRoleForEdit &&
                  tempPermissions.length !==
                    selectedRoleForEdit.permissions.length && (
                    <Badge
                      variant="outline"
                      className="text-amber-600 border-amber-200 bg-amber-50"
                    >
                      Modified
                    </Badge>
                  )}
              </div>

              <ScrollArea className="flex-1 border rounded-md p-2 bg-white">
                <div className="grid grid-cols-1 gap-2 pr-3">
                  {tempPermissions.length > 0 ? (
                    tempPermissions.map((perm) => (
                      <div
                        key={perm.id}
                        className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100 group hover:border-red-200 transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="bg-white p-1.5 rounded text-slate-500 border border-slate-200 shadow-sm shrink-0">
                            <Key className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium font-mono text-slate-800 truncate">
                              {perm.name}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate">
                              {perm.description}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0 ml-2"
                          onClick={() => handleRemoveTempPermission(perm.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-slate-400">
                      <Shield className="h-8 w-8 mb-2 opacity-20" />
                      <span className="text-sm">
                        Role has no permissions assigned.
                      </span>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Footer: Fixed height */}
          <div className="p-6 pt-4 border-t mt-auto bg-white rounded-b-lg">
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsPermissionModalOpen(false)}
              >
                Discard Changes
              </Button>
              <Button onClick={handleSaveChanges} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionManagementPage;
