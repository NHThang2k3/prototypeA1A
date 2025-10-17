import { useState, createContext, useContext, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Truck,
  Bell,
  User,
  KanbanSquare,
  Network,
  QrCode,
  FileOutput,
  Boxes,
  Package,
  ScrollText,
  ListPlus,
  Upload,
  ChevronDown,
  ChevronLeft,
  Zap,
  ShieldCheck,
  CalendarCheck,
  Wrench,
  FileText,
  BarChart,
  BellRing,
  Settings,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  title: string;
  key: string;
  icon: LucideIcon;
  path?: string;
  children?: NavItem[];
};

// --- UPDATED: Cập nhật lại các đường dẫn 'path' ---
const sidebarNavItems: NavItem[] = [
  {
    title: "Productivity",
    icon: Zap,
    key: "productivity",
    children: [
      {
        title: "Kanban Board & Planning",
        icon: KanbanSquare,
        key: "productivity-kanban",
        children: [
          {
            title: "Dashboard Hàng Nhập",
            path: "/dashboard",
            icon: LayoutDashboard,
            key: "dashboard",
          },
          {
            title: "Quản lý Tồn Kho",
            path: "/inventory",
            icon: Truck,
            key: "inventory",
          },
          {
            title: "Bảng Kanban",
            path: "/kanban",
            icon: KanbanSquare,
            key: "kanban",
          },
        ],
      },
      {
        title: "Receipt",
        icon: ScrollText,
        key: "productivity-receipt",
        children: [
          {
            title: "Upfile Packing List",
            path: "/import-packing-list",
            icon: Upload,
            key: "import-packing-list",
          },
          {
            title: "QL Packing List/InQR",
            path: "/packing-list",
            icon: ListPlus,
            key: "packing-list",
          },
          {
            title: "Chi tiết lô hàng",
            path: "/shipments/7c3b9a1d",
            icon: Truck,
            key: "shipment-detail",
          },
          {
            title: "Báo cáo xuất kho",
            path: "/reports/issues",
            icon: ScrollText,
            key: "reports-issues",
          },
        ],
      },
      {
        title: "Inventory Tracking",
        icon: Boxes,
        key: "productivity-inventory",
        children: [
          // Tất cả các mục này đều trỏ đến trang quét chung
          {
            title: "Quét Xuất Vải", // Đổi tên cho phù hợp
            path: "/qr-scan",
            icon: FileOutput,
            key: "issue-fabric",
          },
          {
            title: "Quét Xuất Phụ Liệu", // Đổi tên cho phù hợp
            path: "/qr-scan",
            icon: Boxes,
            key: "issue-accessory",
          },
          {
            title: "Quét Xuất Đóng Gói", // Đổi tên cho phù hợp
            path: "/qr-scan",
            icon: Package,
            key: "issue-packaging",
          },
        ],
      },
      {
        title: "Delivery transaction",
        icon: Network,
        key: "productivity-delivery",
        children: [
          {
            title: "Quản lý vị trí",
            path: "/locations",
            icon: Network,
            key: "locations",
          },
          {
            title: "Quét Mã QR Chung", // Đổi tên cho rõ ràng
            path: "/qr-scan",
            icon: QrCode,
            key: "qr-scan",
          },
        ],
      },
    ],
  },
  {
    title: "Quality",
    icon: ShieldCheck,
    key: "quality",
    children: [
      {
        title: "QC Management (Reuse)",
        path: "#",
        icon: FileText,
        key: "qc-management",
      },
      {
        title: "Record Supplier KPI (Reuse)",
        path: "#",
        icon: BarChart,
        key: "supplier-kpi",
      },
      {
        title: "Material Issue Notification (Reuse)",
        path: "#",
        icon: BellRing,
        key: "material-issue",
      },
      { title: "Action Plan", path: "#", icon: Settings, key: "action-plan" },
    ],
  },
  {
    title: "Availability (Other Phase)",
    icon: CalendarCheck,
    key: "availability",
    path: "#",
  },
  {
    title: "Ability (Other Phase)",
    icon: Wrench,
    key: "ability",
    path: "#",
  },
];

type SidebarContextType = {
  isCollapsed: boolean;
  openKeys: string[];
  toggleMenu: (key: string) => void;
  isLinkActive: (path?: string, children?: NavItem[]) => boolean;
};
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
};

const MenuItem = ({ item }: { item: NavItem }) => {
  const { isCollapsed, openKeys, toggleMenu, isLinkActive } = useSidebar();
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openKeys.includes(item.key);
  const isActive = isLinkActive(item.path, item.children);

  const commonClasses =
    "flex items-center w-full text-sm p-2.5 rounded-md transition-colors duration-200";
  const activeClasses = "bg-gray-700 font-semibold text-white";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => toggleMenu(item.key)}
          className={`${commonClasses} ${
            isActive ? "text-white" : inactiveClasses
          }`}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          <span
            className={`ml-3 flex-1 text-left whitespace-nowrap ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            {item.title}
          </span>
          {!isCollapsed && (
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
        {!isCollapsed && isOpen && (
          <div className="pl-6 space-y-1 border-l border-gray-600 ml-3.5">
            {item.children?.map((child) => (
              <MenuItem key={child.key} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // UPDATED: Logic để xử lý active state cho các link cùng trỏ về /qr-scan
  // Chỉ active link chính "Quét Mã QR Chung" khi ở trang /qr-scan
  // Các link phụ (Quét Xuất Vải, etc.) sẽ không tự active để tránh nhầm lẫn.
  const isActuallyActive =
    item.key === "qr-scan" && location.pathname === "/qr-scan";

  return (
    <NavLink
      to={item.path || "#"}
      className={`${commonClasses} ${
        isActuallyActive ? activeClasses : inactiveClasses
      }`}
    >
      <item.icon className="w-5 h-5 flex-shrink-0" />
      <span className={`ml-3 whitespace-nowrap ${isCollapsed ? "hidden" : ""}`}>
        {item.title}
      </span>
    </NavLink>
  );
};

const Sidebar = ({ isForMobile = false }: { isForMobile?: boolean }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const effectiveIsCollapsed = isForMobile ? false : isCollapsed;
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const location = useLocation();

  // Mở menu cha của item đang active khi tải trang
  useEffect(() => {
    const findParentKeys = (items: NavItem[], path: string): string[] => {
      for (const item of items) {
        if (item.children) {
          const childPaths = item.children.map((c) => c.path).filter(Boolean);
          if (
            childPaths.includes(path) ||
            item.children.some(
              (c) => c.children && findParentKeys([c], path).length > 0
            )
          ) {
            const parentKeys = findParentKeys(item.children, path);
            return [item.key, ...parentKeys];
          }
        }
      }
      return [];
    };

    const activeParentKeys = findParentKeys(sidebarNavItems, location.pathname);
    setOpenKeys(activeParentKeys);
  }, [location.pathname]);

  const toggleMenu = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isLinkActive = (path?: string, children?: NavItem[]): boolean => {
    if (path && location.pathname === path) {
      return true;
    }
    if (children) {
      return children.some((child) => isLinkActive(child.path, child.children));
    }
    return false;
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed: effectiveIsCollapsed,
        openKeys,
        toggleMenu,
        isLinkActive,
      }}
    >
      <aside
        className={`bg-gray-800 text-white h-full flex flex-col transition-all duration-300 ${
          isForMobile ? "w-80" : effectiveIsCollapsed ? "w-20" : "w-80"
        }`}
      >
        <div className="px-4 py-5 flex items-center justify-between border-b border-gray-700">
          <span
            className={`text-2xl font-bold whitespace-nowrap ${
              effectiveIsCollapsed ? "hidden" : ""
            }`}
          >
            Warehouse
          </span>
          {effectiveIsCollapsed && <MoreHorizontal className="w-8 h-8" />}
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-hide">
          {sidebarNavItems.map((item) => (
            <MenuItem key={item.key} item={item} />
          ))}
        </nav>

        {!isForMobile && (
          <div className="p-2 border-t border-gray-700">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center w-full p-2.5 rounded-md text-gray-300 hover:bg-gray-700"
            >
              <ChevronLeft
                className={`w-6 h-6 transition-transform duration-300 ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
              <span
                className={`ml-3 font-medium ${isCollapsed ? "hidden" : ""}`}
              >
                Thu gọn
              </span>
            </button>
          </div>
        )}
      </aside>
    </SidebarContext.Provider>
  );
};

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
    <button onClick={onMenuClick} className="lg:hidden text-gray-600">
      <Menu className="w-6 h-6" />
    </button>
    <div className="hidden lg:block">{/* Placeholder */}</div>
    <div className="flex items-center space-x-4">
      <button className="text-gray-500 hover:text-gray-700">
        <Bell className="w-6 h-6" />
      </button>
      <div className="flex items-center space-x-2">
        <User className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 p-1" />
        <span className="text-sm font-medium text-gray-700">Admin</span>
      </div>
    </div>
  </header>
);

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div
          className={`relative z-50 h-full transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar isForMobile={true} />
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 left-[20.5rem] text-white p-1 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
