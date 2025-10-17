// Path: src/layouts/MainLayout.tsx

import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
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
} from "lucide-react";

const Sidebar = () => {
  // Style chung cho NavLink
  const linkClasses = "flex items-center px-4 py-2.5 rounded-lg";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700";
  const activeClasses = "bg-gray-700 font-semibold text-white";

  return (
    <div className="bg-gray-800 text-white w-64 space-y-2 p-4 flex-shrink-0">
      <div className="text-2xl font-bold mb-6">Kho Hàng Pro</div>
      <nav>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard Hàng Nhập
        </NavLink>

        <NavLink
          to="/packing-list"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <ListPlus className="w-5 h-5 mr-3" />
          QL Packing List / In QR
        </NavLink>

        <NavLink
          to="/inventory" // <--- THAY ĐỔI LINK
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <Truck className="w-5 h-5 mr-3" />
          Quản lý Tồn kho
        </NavLink>

        <NavLink
          to="/kanban"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <KanbanSquare className="w-5 h-5 mr-3" />
          Bảng Kanban
        </NavLink>

        <NavLink
          to="/shipments/7c3b9a1d"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <Truck className="w-5 h-5 mr-3" />
          Chi tiết lô hàng
        </NavLink>

        <NavLink
          to="/locations"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <Network className="w-5 h-5 mr-3" />
          Quản lý Vị trí
        </NavLink>

        <NavLink
          to="/qr-scan"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <QrCode className="w-5 h-5 mr-3" />
          Quét Mã QR
        </NavLink>

        <NavLink
          to="/issue/fabric"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <FileOutput className="w-5 h-5 mr-3" />
          Tạo Phiếu Xuất Vải
        </NavLink>

        <NavLink
          to="/issue/accessory" // <--- Route mới
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <Boxes className="w-5 h-5 mr-3" />
          Tạo Phiếu Xuất Phụ liệu
        </NavLink>

        <NavLink
          to="/issue/packaging"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <Package className="w-5 h-5 mr-3" />
          Tạo Phiếu Xuất Đóng Gói
        </NavLink>

        <NavLink
          to="/reports/issues" // <-- Route mới
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <ScrollText className="w-5 h-5 mr-3" />
          Báo cáo Xuất Kho
        </NavLink>

        <NavLink
          to="/import-packing-list" // <-- Route mới
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <Upload className="w-5 h-5 mr-3" />
          Upfile Packing List
        </NavLink>
      </nav>
    </div>
  );
};

// Component Header đơn giản
const Header = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
    {/* Nút Menu cho mobile */}
    <button onClick={onMenuClick} className="lg:hidden text-gray-600">
      <Menu className="w-6 h-6" />
    </button>
    <div className="hidden lg:block">
      {/* Placeholder, có thể là thanh search hoặc title */}
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

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar cho Desktop */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Sidebar cho Mobile (Overlay) */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 flex z-40">
          <div
            className="fixed inset-0 bg-black opacity-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <Sidebar />
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Đây là nơi các trang con sẽ được render */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
