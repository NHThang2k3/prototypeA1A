import React, { useState } from "react";
import {
  Shield,
  Plus,
  Eye,
  Settings,
  X,
  CheckCircle,
  Lock,
} from "lucide-react";

// Assuming these exist in your project based on instructions
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CustomTable } from "@/components/ui/custom-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

type PermissionManagementPageProps = Record<string, never>;

// --- Dummy Data ---

const INITIAL_PERMISSIONS: Permission[] = [
  { id: "p1", name: "user:read", description: "View user details" },
  { id: "p2", name: "user:write", description: "Create or edit users" },
  { id: "p3", name: "user:delete", description: "Delete users" },
  { id: "p4", name: "role:read", description: "View roles" },
  { id: "p5", name: "role:write", description: "Manage roles" },
  { id: "p6", name: "system:config", description: "Access system settings" },
];

const INITIAL_ROLES: Role[] = [
  {
    id: "r1",
    name: "Admin",
    description: "Full system access",
    permissions: [...INITIAL_PERMISSIONS],
  },
  {
    id: "r2",
    name: "Editor",
    description: "Can manage content and users",
    permissions: [
      INITIAL_PERMISSIONS[0],
      INITIAL_PERMISSIONS[1],
      INITIAL_PERMISSIONS[3],
    ],
  },
  {
    id: "r3",
    name: "Viewer",
    description: "Read-only access",
    permissions: [INITIAL_PERMISSIONS[0], INITIAL_PERMISSIONS[3]],
  },
];

const INITIAL_USERS: User[] = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice@example.com",
    roleId: "r1",
    status: "Active",
    avatar: "AJ",
  },
  {
    id: "u2",
    name: "Bob Smith",
    email: "bob@example.com",
    roleId: "r2",
    status: "Active",
    avatar: "BS",
  },
  {
    id: "u3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    roleId: "r3",
    status: "Inactive",
    avatar: "CB",
  },
  {
    id: "u4",
    name: "Diana Prince",
    email: "diana@example.com",
    roleId: "r2",
    status: "Active",
    avatar: "DP",
  },
  {
    id: "u5",
    name: "Evan Wright",
    email: "evan@example.com",
    roleId: "r3",
    status: "Active",
    avatar: "EW",
  },
];

// --- Main Component ---

const PermissionManagementPage: React.FC<
  PermissionManagementPageProps
> = () => {
  // State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);

  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleManagerOpen, setIsRoleManagerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form States (Create User)
  const [newUser, setNewUser] = useState({ name: "", email: "", roleId: "" });

  // Role Management State
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<Role | null>(
    null
  );
  const [newPermissionName, setNewPermissionName] = useState("");

  // --- Helpers & Handlers ---

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.roleId) return;
    const user: User = {
      id: `u${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      roleId: newUser.roleId,
      status: "Active",
      avatar: newUser.name.substring(0, 2).toUpperCase(),
    };
    setUsers([...users, user]);
    setIsUserModalOpen(false);
    setNewUser({ name: "", email: "", roleId: "" });
  };

  const handleDeletePermission = (roleId: string, permId: string) => {
    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            permissions: role.permissions.filter((p) => p.id !== permId),
          };
        }
        return role;
      })
    );
    // Also update selected role view if active
    if (selectedRoleForEdit && selectedRoleForEdit.id === roleId) {
      setSelectedRoleForEdit((prev) =>
        prev
          ? {
              ...prev,
              permissions: prev.permissions.filter((p) => p.id !== permId),
            }
          : null
      );
    }
  };

  const handleAddPermission = (roleId: string) => {
    if (!newPermissionName.trim()) return;

    // Simulate creating a new permission or adding an existing string
    const newPerm: Permission = {
      id: `p${Date.now()}`,
      name: newPermissionName,
      description: "Custom permission",
    };

    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          // Prevent duplicates by name
          if (role.permissions.some((p) => p.name === newPermissionName))
            return role;
          return { ...role, permissions: [...role.permissions, newPerm] };
        }
        return role;
      })
    );

    if (selectedRoleForEdit && selectedRoleForEdit.id === roleId) {
      setSelectedRoleForEdit((prev) => {
        if (!prev) return null;
        if (prev.permissions.some((p) => p.name === newPermissionName))
          return prev;
        return { ...prev, permissions: [...prev.permissions, newPerm] };
      });
    }
    setNewPermissionName("");
  };

  // --- Chart Configuration ---

  // --- Table Data Preparation ---
  // Since CustomTable is strict { header, accessorKey }, we insert React Nodes directly into the data object
  // for columns that require rich rendering (like Badges or Buttons).

  // --- Table Configuration ---
  const tableColumns = [
    {
      header: "User",
      accessorKey: "userInfo",
      // Sửa dòng này: Thay 'any' bằng '{ row: { original: User } }'
      cell: ({ row }: { row: { original: User } }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Role",
      accessorKey: "roleId",
      // Sửa dòng này
      cell: ({ row }: { row: { original: User } }) => {
        const user = row.original;
        const userRole = roles.find((r) => r.id === user.roleId);
        return (
          <Badge variant="outline" className="flex w-fit items-center gap-1">
            <Shield className="h-3 w-3" />
            {userRole?.name || "Unknown"}
          </Badge>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      // Sửa dòng này
      cell: ({ row }: { row: { original: User } }) => {
        const user = row.original;
        return (
          <Badge variant={user.status === "Active" ? "default" : "secondary"}>
            {user.status}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      // Sửa dòng này
      cell: ({ row }: { row: { original: User } }) => {
        const user = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedUser(user)}
          >
            <Eye className="h-4 w-4 mr-1" /> Details
          </Button>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Permission Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage users, roles, and fine-grained permissions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsRoleManagerOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Manage Roles
          </Button>
          <Button onClick={() => setIsUserModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </div>
      </div>

      {/* Stats & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>
              Overview of all registered users and their assigned roles.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <CustomTable columns={tableColumns} data={users} />
          </CardContent>
        </Card>
      </div>

      {/* --- MODAL: Create User --- */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system and assign an initial role.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="col-span-3"
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="col-span-3"
                placeholder="john@example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                onValueChange={(val) => setNewUser({ ...newUser, roleId: val })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL: User Details --- */}
      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 text-lg">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {selectedUser.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-slate-500">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      variant={
                        selectedUser.status === "Active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Assigned Role & Permissions
                </h4>
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800">
                      {roles.find((r) => r.id === selectedUser.roleId)?.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    {
                      roles.find((r) => r.id === selectedUser.roleId)
                        ?.description
                    }
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {roles
                      .find((r) => r.id === selectedUser.roleId)
                      ?.permissions.map((perm) => (
                        <Badge
                          key={perm.id}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {perm.name}
                        </Badge>
                      ))}
                    {roles.find((r) => r.id === selectedUser.roleId)
                      ?.permissions.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">
                        No specific permissions assigned.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- MODAL: Role & Permission Manager --- */}
      <Dialog open={isRoleManagerOpen} onOpenChange={setIsRoleManagerOpen}>
        <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Role & Permission Management</DialogTitle>
            <DialogDescription>
              Configure roles and assign permissions to control user access.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-1 gap-6 pt-4 min-h-0">
            {/* Left Col: Role List */}
            <div className="w-1/3 border-r pr-4 flex flex-col gap-2">
              <h4 className="text-sm font-medium text-slate-500 mb-2">Roles</h4>
              <ScrollArea className="flex-1">
                <div className="flex flex-col gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRoleForEdit(role)}
                      className={`text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
                        selectedRoleForEdit?.id === role.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="font-medium">{role.name}</span>
                      {selectedRoleForEdit?.id === role.id && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                    </button>
                  ))}
                  <Button
                    variant="outline"
                    className="mt-2 border-dashed w-full text-xs"
                    size="sm"
                  >
                    <Plus className="h-3 w-3 mr-1" /> New Role
                  </Button>
                </div>
              </ScrollArea>
            </div>

            {/* Right Col: Permissions */}
            <div className="w-2/3 pl-2 flex flex-col">
              {selectedRoleForEdit ? (
                <>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      {selectedRoleForEdit.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedRoleForEdit.description}
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-semibold uppercase text-slate-500">
                        Active Permissions
                      </Label>
                      <Badge variant="outline">
                        {selectedRoleForEdit.permissions.length}
                      </Badge>
                    </div>

                    <ScrollArea className="flex-1 border rounded-md p-3 bg-slate-50/50 mb-4">
                      <div className="space-y-2">
                        {selectedRoleForEdit.permissions.map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-center justify-between bg-white p-2 rounded border shadow-sm text-sm"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium font-mono text-xs">
                                {perm.name}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {perm.description}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                handleDeletePermission(
                                  selectedRoleForEdit.id,
                                  perm.id
                                )
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {selectedRoleForEdit.permissions.length === 0 && (
                          <div className="text-center py-8 text-slate-400 text-sm">
                            No permissions assigned.
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    <div className="mt-auto">
                      <Label className="text-xs mb-1.5 block">
                        Add Permission
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g. system:write"
                          value={newPermissionName}
                          onChange={(e) => setNewPermissionName(e.target.value)}
                          className="h-8 text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            handleAddPermission(selectedRoleForEdit.id)
                          }
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                  <Lock className="h-10 w-10 opacity-20" />
                  <p className="text-sm">Select a role to manage permissions</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionManagementPage;
