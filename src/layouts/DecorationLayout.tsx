import { useState, createContext, useContext, useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
  ChevronLeft,
  Zap,
  ShieldCheck,
  CalendarCheck,
  Wrench,
  MoreHorizontal,
  ArrowLeft,
  Globe,
  CalendarDays,
  BookMarked,
  CalendarRange,
  ClipboardList,
  FileStack,
  Boxes,
  LogIn,
  LogOut,
  BarChart3,
  FileOutput,
  Sun,
  Printer,
  DraftingCompass, // Icon for Embroidery
  TrendingUp,
  Gauge,
  ClipboardCheck,
  TimerOff,
  MapPin,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  title: string;
  key: string;
  icon: LucideIcon;
  path?: string;
  children?: NavItem[];
};

// --- Dữ liệu Sidebar cho module Decoration ---
const sidebarNavItems: NavItem[] = [
  {
    title: "Productivity",
    icon: Zap,
    key: "productivity",
    children: [
      {
        title: "Plan Management",
        icon: CalendarDays,
        key: "productivity-plan",
        children: [
          {
            title: "Master Plan",
            path: "/decoration/productivity/master-plan",
            icon: BookMarked,
            key: "master-plan",
          },
          {
            title: "Weekly & Daily Plan",
            path: "/decoration/productivity/weekly-daily-plan",
            icon: CalendarRange,
            key: "weekly-daily-plan",
          },
          {
            title: "Work plan for each process",
            path: "/decoration/productivity/work-plan",
            icon: ClipboardList,
            key: "work-plan",
          },
        ],
      },
      {
        title: "Bonding OPL & Plan (Reuse)",
        icon: FileStack,
        key: "productivity-bonding-opl",
        path: "/decoration/productivity/bonding-opl",
      },
      {
        title: "Buffer Management",
        icon: Boxes,
        key: "productivity-buffer",
        children: [
          {
            title: "Scan In (Barcode)",
            path: "/decoration/productivity/buffer-scan-in",
            icon: LogIn,
            key: "buffer-scan-in",
          },
          {
            title: "Scan Out (Barcode)",
            path: "/decoration/productivity/buffer-scan-out",
            icon: LogOut,
            key: "buffer-scan-out",
          },
        ],
      },
      {
        title: "Performance Daily (Reuse)",
        icon: BarChart3,
        key: "productivity-performance",
        children: [
          {
            title: "Record output",
            path: "/decoration/productivity/record-output",
            icon: FileOutput,
            key: "record-output",
          },
          {
            title: "Daily stats Heat",
            path: "/decoration/productivity/stats-heat",
            icon: Sun,
            key: "stats-heat",
          },
          {
            title: "Daily stats EMB",
            path: "/decoration/productivity/stats-emb",
            icon: DraftingCompass,
            key: "stats-emb",
          },
          {
            title: "Daily stats Pad Print",
            path: "/decoration/productivity/stats-pad-print",
            icon: Printer,
            key: "stats-pad-print",
          },
        ],
      },
      {
        title: "Bonding Output",
        icon: TrendingUp,
        key: "productivity-bonding-output",
        path: "/decoration/productivity/bonding-output",
      },
      {
        title: "Dashboard (Decoration)",
        icon: Gauge,
        key: "productivity-decoration-dashboard",
        path: "/decoration/productivity/decoration-dashboard",
      },
      {
        title: "Bonding Dashboard",
        icon: Gauge,
        key: "productivity-bonding-dashboard",
        path: "/decoration/productivity/bonding-dashboard",
      },
      {
        title: "Damaged goods repair",
        icon: BarChart3,
        key: "productivity-damaged-goods-repair",
        children: [
          {
            title: "Display data list",
            path: "/decoration/productivity/display-data-list",
            icon: FileOutput,
            key: "display-data-list",
          },
          {
            title: "Create data entry",
            path: "/decoration/productivity/create-data-entry",
            icon: Sun,
            key: "create-data-entry",
          },
          {
            title: "Approve data",
            path: "/decoration/productivity/approve-data",
            icon: DraftingCompass,
            key: "approve-data",
          },
          {
            title: "Record result information",
            path: "/decoration/productivity/record-result-information",
            icon: Printer,
            key: "record-result-information",
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
        icon: ClipboardCheck,
        key: "quality-qc",
        children: [
          {
            title: "EMB QC Inline",
            path: "/decoration/quality/qc-inline",
            icon: ClipboardCheck,
            key: "qc-inline",
          },
          {
            title: "EMB QC Endline",
            path: "/decoration/quality/qc-endline",
            icon: ClipboardCheck,
            key: "qc-endline",
          },
        ],
      },
      {
        title: "Action Plan",
        icon: ClipboardList,
        key: "quality-action-plan",
        path: "/decoration/quality/action-plan",
      },
    ],
  },
  {
    title: "Availability",
    icon: CalendarCheck,
    key: "availability",
    children: [
      {
        title: "Machine Downtime (Reuse)",
        icon: TimerOff,
        key: "availability-downtime",
        path: "/decoration/availability/machine-downtime",
      },
      {
        title: "Machine Location",
        icon: MapPin,
        key: "availability-location",
        path: "/decoration/availability/machine-location",
      },
    ],
  },
  { title: "Ability (Other Phase)", icon: Wrench, key: "ability", path: "#" },
];

// --- TOÀN BỘ LOGIC BÊN DƯỚI ĐƯỢỢC GIỮ NGUYÊN ---

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
  const activeClasses = "bg-blue-700 font-semibold text-white";
  const inactiveClasses = "text-white hover:bg-blue-700";

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
          <div className="pl-6 space-y-1 border-l border-blue-400 ml-3.5">
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

const getAllDescendantKeys = (
  items: NavItem[],
  targetKey: string
): string[] => {
  const keys: string[] = [];
  const findAndCollect = (nodes: NavItem[]): boolean => {
    for (const node of nodes) {
      if (node.key === targetKey) {
        if (node.children) collectKeys(node.children);
        return true;
      }
      if (node.children && findAndCollect(node.children)) return true;
    }
    return false;
  };
  const collectKeys = (nodes: NavItem[]) => {
    for (const node of nodes) {
      keys.push(node.key);
      if (node.children) collectKeys(node.children);
    }
  };
  findAndCollect(items);
  return keys;
};

const Sidebar = ({ isForMobile = false }: { isForMobile?: boolean }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const effectiveIsCollapsed = isForMobile ? false : isCollapsed;
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    const findParentKeys = (items: NavItem[], path: string): string[] => {
      for (const item of items) {
        if (item.children) {
          const childMatch = item.children.some(
            (c) =>
              c.path === path ||
              (c.children && findParentKeys([c], path).length > 0)
          );
          if (childMatch) {
            const nestedKeys = findParentKeys(item.children, path);
            return [item.key, ...nestedKeys];
          }
        }
      }
      return [];
    };

    const activeParentKeys = findParentKeys(sidebarNavItems, location.pathname);

    setOpenKeys((prevOpenKeys) => {
      const newKeys = new Set([...prevOpenKeys, ...activeParentKeys]);
      return Array.from(newKeys);
    });
  }, [location.pathname]);

  const toggleMenu = (key: string) => {
    setOpenKeys((prev) => {
      const isOpen = prev.includes(key);
      if (isOpen) {
        const descendantKeys = getAllDescendantKeys(sidebarNavItems, key);
        const keysToClose = new Set([key, ...descendantKeys]);
        return prev.filter((k) => !keysToClose.has(k));
      } else {
        return [...prev, key];
      }
    });
  };

  const isLinkActive = (path?: string, children?: NavItem[]): boolean => {
    if (path && location.pathname.startsWith(path)) {
      if (path.split("/").length === location.pathname.split("/").length) {
        return location.pathname === path;
      }
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
        className={`bg-blue-600 text-white h-full flex flex-col transition-all duration-300 ${
          isForMobile ? "w-80" : effectiveIsCollapsed ? "w-20" : "w-80"
        }`}
      >
        <div className="px-4 py-5 flex items-center justify-between border-b border-blue-500">
          <span
            className={`text-2xl font-bold whitespace-nowrap ${
              effectiveIsCollapsed ? "hidden" : ""
            }`}
          >
            Decoration
          </span>
          {effectiveIsCollapsed && <MoreHorizontal className="w-8 h-8" />}
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-hide">
          {sidebarNavItems.map((item) => (
            <MenuItem key={item.key} item={item} />
          ))}
        </nav>

        {!isForMobile && (
          <div className="p-2 border-t border-blue-500">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center w-full p-2.5 rounded-md text-white hover:bg-blue-700"
            >
              <ChevronLeft
                className={`w-6 h-6 transition-transform duration-300 ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
              <span
                className={`ml-3 font-medium ${isCollapsed ? "hidden" : ""}`}
              >
                Collapse
              </span>
            </button>
          </div>
        )}
      </aside>
    </SidebarContext.Provider>
  );
};

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [selectedLang, setSelectedLang] = useState<"en" | "vi">("en");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
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
          <span className="font-medium hidden sm:block">Select Module</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium uppercase">
              {selectedLang}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <button
                onClick={() => {
                  setSelectedLang("en");
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  selectedLang === "en"
                    ? "bg-gray-100 text-gray-900 font-semibold"
                    : "text-gray-700"
                } hover:bg-gray-100`}
              >
                English
              </button>
              <button
                onClick={() => {
                  setSelectedLang("vi");
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  selectedLang === "vi"
                    ? "bg-gray-100 text-gray-900 font-semibold"
                    : "text-gray-700"
                } hover:bg-gray-100`}
              >
                Vietnamese
              </button>
            </div>
          )}
        </div>

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
};

const DecorationLayout = () => {
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
            className="absolute top-4 left-[20.5rem] text-white p-1 rounded-full bg-blue-800/50 hover:bg-blue-700/70 transition-colors"
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

export default DecorationLayout;
