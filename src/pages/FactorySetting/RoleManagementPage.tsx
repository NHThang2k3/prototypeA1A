import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit, X, ChevronDown, Search } from "lucide-react";

// --- TYPES & INTERFACES ---

interface Option {
  value: string;
  label: string;
}

interface Action {
  id: string;
  label: string;
}

interface PermissionNode {
  id: string;
  label: string;
  type?: "job" | "action";
  children?: PermissionNode[];
  actions?: Action[];
}

interface RoleData {
  id?: number;
  name: string;
  departments: string[];
  type: string;
  description: string;
  permissions: string[];
}

// 1. CẬP NHẬT: Thêm prop 'size' vào Interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

interface CheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  onRemove?: (e: React.MouseEvent) => void;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// --- UI Components ---

// 2. CẬP NHẬT: Component Button xử lý size chuẩn
const Button = ({
  children,
  variant = "primary",
  size = "default", // Mặc định là default
  className = "",
  onClick,
  ...props
}: ButtonProps) => {
  // Bỏ px-4 py-2 h-10 khỏi baseStyle vì sẽ được xử lý bởi size
  const baseStyle =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50";

  const variants: Record<string, string> = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
    ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-500",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
  };

  // Định nghĩa các size khác nhau
  const sizes: Record<string, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-8 w-8 p-0", // Quan trọng: p-0 giúp icon không bị padding đè mất
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.default
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }: InputProps) => (
  <input
    className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${className}`}
    {...props}
  />
);

const Checkbox = ({
  id,
  checked,
  onCheckedChange,
  className = "",
  disabled,
}: CheckboxProps) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    disabled={disabled}
    onChange={(e) => onCheckedChange(e.target.checked)}
    className={`h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 disabled:opacity-50 cursor-pointer ${className}`}
  />
);

const Badge = ({ children, className = "", onRemove }: BadgeProps) => (
  <span
    className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors border-slate-200 bg-slate-50 text-slate-700 ${className}`}
  >
    {children}
    {onRemove && (
      <button
        onClick={onRemove}
        className="ml-1 rounded-full hover:bg-slate-200 p-0.5 text-slate-400 hover:text-slate-700"
      >
        <X className="h-3 w-3" />
      </button>
    )}
  </span>
);

// --- COMPONENT: MULTI-SELECT ---

// --- COMPONENT: MULTI-SELECT (UPDATED - COMBINED SEARCH) ---

const MultiSelect = ({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  disabled = false,
  className = "",
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lọc options dựa trên input
  const filteredOptions = options.filter((opt) => {
    const matchesSearch = opt.label
      .toLowerCase()
      .includes(inputValue.toLowerCase());
    const isSelected = value.includes(opt.value);
    return matchesSearch && !isSelected;
  });

  const selectOption = (optionValue: string) => {
    onChange([...value, optionValue]);
    setInputValue(""); // Reset ô tìm kiếm sau khi chọn
    // Giữ focus vào input để chọn tiếp
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const removeValue = (e: React.MouseEvent | null, val: string) => {
    e?.stopPropagation();
    if (!disabled) {
      onChange(value.filter((v) => v !== val));
    }
  };

  // Xử lý xóa bằng phím Backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // const lastValue = value[value.length - 1];
      onChange(value.slice(0, -1));
    }
    if (e.key === "Enter" && inputValue !== "" && filteredOptions.length > 0) {
      e.preventDefault(); // Ngăn submit form
      selectOption(filteredOptions[0].value);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Main Container - Giờ đây bao gồm cả Input */}
      <div
        className={`min-h-10 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm 
        focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 
        flex flex-wrap gap-1.5 items-center transition-all ${
          disabled
            ? "bg-slate-100 cursor-not-allowed opacity-80"
            : "cursor-text"
        }`}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {/* Render các mục đã chọn (Badges) */}
        {value.map((val) => {
          const label = options.find((o) => o.value === val)?.label || val;
          return (
            <Badge
              key={val}
              onRemove={
                disabled
                  ? undefined
                  : (e: React.MouseEvent) => removeValue(e, val)
              }
            >
              {label}
            </Badge>
          );
        })}

        {/* Input tìm kiếm trực tiếp (Thay thế placeholder tĩnh) */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent outline-none border-none focus:ring-0 p-0 min-w-[80px] h-7 text-sm placeholder:text-slate-400 disabled:cursor-not-allowed"
        />

        {/* Icon mũi tên ở góc phải */}
        <div className="absolute right-2 top-2.5 sm:top-3">
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
          {/* Không cần thanh search riêng ở đây nữa */}

          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-2 text-center text-sm text-slate-500">
                {inputValue ? "No results found." : "No more options."}
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className="flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-slate-100 text-slate-700 transition-colors"
                  onMouseDown={(e) => {
                    // Dùng onMouseDown thay vì onClick để tránh mất focus input trước khi click chạy
                    e.preventDefault();
                    selectOption(opt.value);
                  }}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- DATA CONSTANTS ---

const DEPARTMENTS_LIST: Option[] = [
  { value: "warehouse", label: "Warehouse" },
  { value: "cutting", label: "Cutting" },
  { value: "sewing", label: "Sewing Line" },
  { value: "Finished Goods WH", label: "Finished Goods WH" },
];

const ALL_PERMISSIONS_STRUCTURE: PermissionNode[] = [
  {
    id: "packing_mgmt",
    label: "Packing List Management",
    children: [
      {
        id: "packing_list",
        label: "Packing List",
        type: "job",
        actions: [
          { id: "create", label: "Create" },
          { id: "view", label: "View" },
          { id: "edit", label: "Edit" },
          { id: "delete", label: "Delete" },
        ],
      },
      { id: "qr_code", label: "Print QR Code", type: "action" },
      { id: "reports", label: "Packing Reports", type: "action" },
    ],
  },
  {
    id: "user_mgmt",
    label: "User Management",
    children: [
      {
        id: "users",
        label: "Users List",
        type: "job",
        actions: [
          { id: "view", label: "View" },
          { id: "edit", label: "Edit" },
          { id: "create", label: "Create" },
          { id: "delete", label: "Delete" },
        ],
      },
      {
        id: "roles",
        label: "Roles",
        type: "job",
        actions: [
          { id: "view", label: "View" },
          { id: "edit", label: "Edit" },
        ],
      },
    ],
  },
];

// --- FORM CONTENT COMPONENT ---

interface RoleFormContentProps {
  formData: RoleData;
  setFormData: React.Dispatch<React.SetStateAction<RoleData>>;
  isEditMode: boolean;
}

const RoleFormContent = ({
  formData,
  setFormData,
  isEditMode,
}: RoleFormContentProps) => {
  const getChildIds = (node: PermissionNode, parentId: string) => {
    let ids: string[] = [];
    if (node.children) {
      node.children.forEach((child) => {
        const childFullId = `${node.id}:${child.id}`;
        ids.push(childFullId);
        ids = [...ids, ...getChildIds(child, childFullId)];
      });
    } else if (node.actions) {
      node.actions.forEach((action) => {
        const actionFullId = `${parentId}:${action.id}`;
        ids.push(actionFullId);
      });
    }
    return ids;
  };

  const toggleModule = (module: PermissionNode, isChecked: boolean) => {
    const allIdsInModule = getChildIds(module, module.id);
    setFormData((prev) => {
      let newPermissions = [...prev.permissions];
      if (!isChecked) {
        newPermissions = newPermissions.filter(
          (id) => !allIdsInModule.includes(id)
        );
      } else {
        const uniqueIds = new Set([...newPermissions, ...allIdsInModule]);
        newPermissions = Array.from(uniqueIds);
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const togglePerm = (fullId: string, node: Partial<PermissionNode>) => {
    const isChecked = formData.permissions.includes(fullId);
    let idsToToggle = [fullId];
    const safeNode = node as PermissionNode;

    if (safeNode.actions || safeNode.children) {
      idsToToggle = [...idsToToggle, ...getChildIds(safeNode, fullId)];
    }

    setFormData((prev) => {
      let newPermissions = [...prev.permissions];
      if (isChecked) {
        newPermissions = newPermissions.filter(
          (id) => !idsToToggle.includes(id)
        );
      } else {
        const uniqueIds = new Set([...newPermissions, ...idsToToggle]);
        newPermissions = Array.from(uniqueIds);
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const permissionModuleOptions = ALL_PERMISSIONS_STRUCTURE.map((p) => ({
    value: p.id,
    label: p.label,
  }));

  const [visibleModules, setVisibleModules] = useState<string[]>([]);

  useEffect(() => {
    const activeModules = ALL_PERMISSIONS_STRUCTURE.filter((m) =>
      formData.permissions.some((p) => p.startsWith(m.id))
    ).map((m) => m.id);

    if (activeModules.length > 0) {
      setVisibleModules((prev) =>
        Array.from(new Set([...prev, ...activeModules]))
      );
    } else if (!isEditMode && visibleModules.length === 0) {
      setVisibleModules(["packing_mgmt"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.permissions, isEditMode]);

  return (
    <div className="space-y-6 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900">
            Role Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="e.g. Manager Warehouse"
            disabled={isEditMode}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900">
            Department Access <span className="text-red-500">*</span>
          </label>
          <MultiSelect
            options={DEPARTMENTS_LIST}
            value={formData.departments}
            onChange={(val: string[]) =>
              setFormData({ ...formData, departments: val })
            }
            placeholder="Select departments..."
            disabled={isEditMode}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900">
            Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none appearance-none ${
                isEditMode ? "bg-slate-100 cursor-not-allowed opacity-80" : ""
              }`}
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              disabled={isEditMode}
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="Manager">Manager</option>
              <option value="Sub-Manager">Sub-Manager</option>
              <option value="Officer">Officer</option>
              <option value="Staff">Staff</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900">
            Description
          </label>
          <Input
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description"
          />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-end">
          <h3 className="text-lg font-bold text-slate-900">Permission</h3>
        </div>

        <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm min-h-[400px]">
          <div className="mb-8 max-w-md">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
              Add Permission Modules
            </label>
            <MultiSelect
              options={permissionModuleOptions}
              value={visibleModules}
              onChange={(val: string[]) => setVisibleModules(val)}
              placeholder="Search & add modules..."
            />
          </div>

          <div className="space-y-8">
            {ALL_PERMISSIONS_STRUCTURE.filter((m) =>
              visibleModules.includes(m.id)
            ).map((module) => {
              const allModuleIds = getChildIds(module, module.id);
              const isModuleChecked =
                allModuleIds.length > 0 &&
                allModuleIds.every((id) => formData.permissions.includes(id));

              return (
                <div
                  key={module.id}
                  className="animate-in fade-in duration-300"
                >
                  <div className="border-b border-slate-100 pb-2 mb-4 flex items-center space-x-3">
                    <Checkbox
                      id={`module_${module.id}`}
                      checked={isModuleChecked}
                      onCheckedChange={(checked: boolean) =>
                        toggleModule(module, checked)
                      }
                      className="h-5 w-5 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                    />
                    <label
                      htmlFor={`module_${module.id}`}
                      className="text-lg font-bold text-slate-800 cursor-pointer select-none"
                    >
                      {module.label}
                    </label>
                  </div>

                  <div className="pl-6 space-y-6">
                    {module.children?.map((child) => {
                      const childId = `${module.id}:${child.id}`;
                      return (
                        <div key={child.id} className="group">
                          <div className="flex items-center space-x-3 mb-3">
                            <Checkbox
                              id={childId}
                              checked={formData.permissions.includes(childId)}
                              onCheckedChange={() => togglePerm(childId, child)}
                              className="h-5 w-5 rounded text-blue-600 focus:ring-blue-600 border-slate-300"
                            />
                            <label
                              htmlFor={childId}
                              className="text-base font-semibold text-slate-900 cursor-pointer select-none"
                            >
                              {child.label}
                            </label>
                          </div>

                          {child.type === "job" && child.actions && (
                            <div className="pl-8 flex flex-col space-y-3 border-l-2 border-slate-100 ml-2.5">
                              {child.actions.map((action) => {
                                const actionId = `${childId}:${action.id}`;
                                return (
                                  <div
                                    key={action.id}
                                    className="flex items-center space-x-3"
                                  >
                                    <Checkbox
                                      id={actionId}
                                      checked={formData.permissions.includes(
                                        actionId
                                      )}
                                      onCheckedChange={() =>
                                        togglePerm(actionId, {})
                                      }
                                      className="h-4 w-4 rounded border-slate-300 text-blue-600"
                                    />
                                    <label
                                      htmlFor={actionId}
                                      className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer select-none"
                                    >
                                      {action.label}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {visibleModules.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
                <Search className="h-8 w-8 mb-2 opacity-50" />
                <p>Select a permission module above to configure.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const RoleManagementPage = () => {
  const [roles, setRoles] = useState<RoleData[]>([
    {
      id: 1,
      name: "Manager Warehouse",
      departments: ["warehouse"],
      type: "Warehouse",
      description: "Quản lý kho tổng",
      permissions: [
        "packing_mgmt:packing_list",
        "packing_mgmt:packing_list:create",
        "packing_mgmt:packing_list:view",
        "packing_mgmt:packing_list:approve",
      ],
    },
    {
      id: 2,
      name: "Staff Packing",
      departments: ["Finished Goods WH"],
      type: "Staff",
      description: "Nhân viên đóng gói",
      permissions: ["packing_mgmt:qr_code"],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);

  const initialFormState: RoleData = {
    name: "",
    departments: [],
    type: "",
    description: "",
    permissions: [],
  };
  const [formData, setFormData] = useState<RoleData>(initialFormState);

  const handleCreate = () => {
    setFormData(initialFormState);
    setIsEditMode(false);
    setEditingRoleId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role: RoleData) => {
    setFormData({
      name: role.name,
      departments: role.departments,
      type: role.type,
      description: role.description,
      permissions: role.permissions,
    });
    setEditingRoleId(role.id!);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return alert("Please enter Role Name");
    if (formData.departments.length === 0)
      return alert("Please select at least one department");
    if (!formData.type) return alert("Please select Type");

    if (isEditMode && editingRoleId) {
      setRoles(
        roles.map((r) => (r.id === editingRoleId ? { ...r, ...formData } : r))
      );
    } else {
      const newRole = {
        id: roles.length + 1,
        ...formData,
      };
      setRoles([...roles, newRole]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Roles & Permissions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage employee roles and access control.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Create New Role
        </Button>
      </div>

      {/* TABLE */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Role Name</th>
              <th className="px-6 py-4">Department Access</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {role.name}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {role.departments.map((d) => {
                      const label =
                        DEPARTMENTS_LIST.find((dep) => dep.value === d)
                          ?.label || d;
                      return <Badge key={d}>{label}</Badge>;
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{role.type}</td>
                <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                  {role.description}
                </td>
                <td className="px-6 py-4 ">
                  <div className="flex justify-end gap-2">
                    {/* 3. CẬP NHẬT: Dùng size="icon" */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-red-50 hover:text-red-600 text-red-500"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Bạn có chắc chắn muốn xóa role "${role.name}"?`
                          )
                        ) {
                          setRoles(roles.filter((r) => r.id !== role.id));
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 " />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {roles.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No roles found. Click "Create New Role" to add one.
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[950px] max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {isEditMode ? "Update Role" : "Create New Role"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-2 bg-slate-50/30">
              <RoleFormContent
                formData={formData}
                setFormData={setFormData}
                isEditMode={isEditMode}
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 rounded-b-lg">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                {isEditMode ? "Update Changes" : "Save Role"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagementPage;
