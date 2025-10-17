// Path: src/layouts/AccessoryWarehouseLayout.tsx
import { useState, createContext, useContext, useEffect } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Truck,
  Bell,
  User,
  QrCode,
  Boxes,
  ScrollText,
  ChevronDown,
  ChevronLeft,
  MoreHorizontal,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  title: string;
  key: string;
  icon: LucideIcon;
  path?: string;
  children?: NavItem[];
};

// --- Menu Sidebar cho Kho Phụ Liệu ---
const sidebarNavItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/accessory-warehouse/dashboard",
    icon: LayoutDashboard,
    key: "dashboard",
  },
  {
    title: "Quản lý Tồn Kho",
    path: "/accessory-warehouse/inventory",
    icon: Truck,
    key: "inventory",
  },
  {
    title: "Xuất Kho Phụ Liệu",
    path: "/accessory-warehouse/issue",
    icon: Boxes,
    key: "issue-accessory",
  },
  {
    title: "Báo cáo Xuất Kho",
    path: "/accessory-warehouse/reports/issues",
    icon: ScrollText,
    key: "reports-issues",
  },
  {
    title: "Quét Mã QR",
    path: "/accessory-warehouse/qr-scan",
    icon: QrCode,
    key: "qr-scan",
  },
];

// --- Context và các Component con (giữ nguyên logic) ---
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
  const location = useLocation();
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

  const isActuallyActive = location.pathname === item.path;
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

  useEffect(() => {
    setOpenKeys([]);
  }, [location.pathname]); // Logic mở menu cha không cần thiết cho sidebar phẳng

  const toggleMenu = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };
  const isLinkActive = (path?: string, children?: NavItem[]): boolean => {
    if (path && location.pathname.startsWith(path)) return true;
    if (children)
      return children.some((child) => isLinkActive(child.path, child.children));
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
            Kho Phụ Liệu
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
    <div className="flex items-center gap-4">
      <button onClick={onMenuClick} className="lg:hidden text-gray-600">
        <Menu className="w-6 h-6" />
      </button>
      <Link
        to="/"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium hidden sm:block">Chọn Module</span>
      </Link>
    </div>
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

const AccessoryWarehouseLayout = () => {
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

export default AccessoryWarehouseLayout;
